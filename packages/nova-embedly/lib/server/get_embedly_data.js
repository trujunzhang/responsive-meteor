import Telescope from 'meteor/nova:lib';
import Posts from "meteor/nova:posts";
import Users from 'meteor/nova:users';

let adjustLargeImage = function (image) {
    const width = image.width;
    const height = image.height;
    const url = image.url;
    const split = url.split('&');

    for (let i = 0; i < split.length; i++) {
        let pair = split[i].split('=');
        if (decodeURIComponent(pair[0]) == "width") {
            split[i] = "width=" + width;
        } else if (decodeURIComponent(pair[0]) == "height") {
            split[i] = "height=" + height;
        }
    }
    return split.join('&');
}

let getEmbedlyData = function (url) {
    let data = {};
    let extractBase = 'http://api.embed.ly/1/extract';
    let embedlyKey = Telescope.settings.get('embedlyKey');
    let thumbnailWidth = Telescope.settings.get('thumbnailWidth', 100);
    let thumbnailHeight = Telescope.settings.get('thumbnailHeight', 100);

    if (!embedlyKey) {
        // fail silently to still let the post be submitted as usual
        console.log("Couldn't find an Embedly API key! Please add it to your Telescope settings or remove the Embedly module."); // eslint-disable-line
        return null;
    }

    try {

        let result = Meteor.http.get(extractBase, {
            params: {
                key: embedlyKey,
                url: url,
                image_width: thumbnailWidth,
                image_height: thumbnailHeight,
                image_method: 'crop'
            }
        });

        //console.log(result); // eslint-disable-line

        if (!!result.data.images && !!result.data.images.length) // there may not always be an image
            result.data.thumbnailUrl = result.data.images[0].url;

        if (result.data.authors && result.data.authors.length > 0) {
            result.data.sourceName = result.data.authors[0].name;
            result.data.sourceUrl = result.data.authors[0].url;
        }

        if (result.data.provider_display) {
            result.data.sourceFrom = result.data.provider_display;
        } else {
            result.data.sourceFrom = getDomain(result.data.sourceUrl);
        }

        if (result.data.content) {
            let matchs = new String(result.data.content).match(/src\=[',"]([^\s]*)[',"]>\s/);
            if (!!matchs && matchs.length >= 2) {
                result.data.articleImage = matchs[1];
            }
        }

        if (!!result.data.images && result.data.images.length > 0) {
            const largeImage = result.data.images[0];
            result.data.articleImage = adjustLargeImage(largeImage);
        }

        let embedlyData = _.pick(result.data, 'title', 'media', 'description', 'thumbnailUrl', 'sourceName', 'sourceUrl', 'sourceFrom', 'articleImage');

        return embedlyData;

    } catch (error) {
        console.log(error); // eslint-disable-line
        // the first 13 characters of the Embedly errors are "failed [400] ", so remove them and parse the rest
        let errorObject = JSON.parse(error.message.substring(13));
        //throw new Meteor.Error(errorObject.error_code, errorObject.error_message);
    }
    return null;
}

getDomain = function (url, subdomain) {
    subdomain = subdomain || false;

    url = url.replace(/(https?:\/\/)?(www.)?/i, '');

    if (!subdomain) {
        url = url.split('.');

        url = url.slice(url.length - 2).join('.');
    }

    if (url.indexOf('/') !== -1) {
        return url.split('/')[0];
    }

    return url;
}

// For security reason, we make the media property non-modifiable by the client and
// we use a separate server-side API call to set it (and the thumbnail object if it hasn't already been set)

// Async letiant that directly modifies the post object with update()
function addMediaAfterSubmit(post) {
    let set = {};
    if (post.url) {
        let data = getEmbedlyData(post.url);
        if (!!data) {
            // only add a thumbnailUrl if there isn't one already
            if (!post.thumbnailUrl && !!data.thumbnailUrl) {
                set.thumbnailUrl = data.thumbnailUrl;
            }
            if (!!data.articleImage) {
                set.articleImage = data.articleImage;
            }
            // add media if necessary
            if (!!data.media.html) {
                set.media = data.media;
            }
            // add source name & url &  if they exist
            if (!!data.sourceName && !!data.sourceUrl) {
                set.sourceName = data.sourceName;
                set.sourceUrl = data.sourceUrl;
            }
            if (!!data.sourceFrom) {
                set.sourceFrom = data.sourceFrom.replace("www.", "");
            }
        }
        // make sure set object is not empty (Embedly call could have failed)
        if (!_.isEmpty(set)) {
            Posts.update(post._id, {$set: set});
        }
    }
}
// Important: remove it.
//Telescope.callbacks.add("posts.new.async", addMediaAfterSubmit);

function updateMediaOnEdit(modifier, post) {
    let newUrl = modifier.$set.url;
    if (newUrl && newUrl !== post.url) {
        let data = getEmbedlyData(newUrl);
        if (!!data) {
            if (!!data.media.html) {
                modifier.$set.media = data.media;
            }

            // add source name & url if they exist
            if (!!data.sourceName && !!data.sourceUrl) {
                modifier.$set.sourceName = data.sourceName;
                modifier.$set.sourceUrl = data.sourceUrl;
            }
        }
    }
    return modifier;
}
Telescope.callbacks.add("posts.edit.sync", updateMediaOnEdit);

let regenerateThumbnail = function (post) {
    delete post.thumbnailUrl;
    delete post.media;
    delete post.sourceName;
    delete post.sourceUrl;
    addMediaAfterSubmit(post);
};

Meteor.methods({
    testGetEmbedlyData: function (url) {
        check(url, String);
        console.log(getEmbedlyData(url)); // eslint-disable-line
    },
    getEmbedlyData: function (url) {
        check(url, String);
        return getEmbedlyData(url);
    },
    embedlyKeyExists: function () {
        return !!Telescope.settings.get('embedlyKey');
    },
    generateThumbnail: function (post) {
        check(post, Posts.simpleSchema());
        if (Users.canEdit(Meteor.user(), post)) {
            regenerateThumbnail(post);
        }
    },
    generateThumbnails: function (limit = 20, mode = "generate") {
        // mode = "generate" : generate thumbnails only for all posts that don't have one
        // mode = "all" : regenerate thumbnais for all posts

        if (Users.isAdmin(Meteor.user())) {

            //console.log("// Generating thumbnails…") // eslint-disable-line

            const selector = {url: {$exists: true}};
            if (mode === "generate") {
                selector.thumbnailUrl = {$exists: false};
            }

            const posts = Posts.find(selector, {limit: limit, sort: {postedAt: -1}});

            posts.forEach((post, index) => {
                Meteor.setTimeout(function () {
                    console.log(`// ${index}. fetching thumbnail for “${post.title}” (_id: ${post._id})`); // eslint-disable-line
                    try {
                        regenerateThumbnail(post);
                    } catch (error) {
                        console.log(error); // eslint-disable-line
                    }
                }, index * 1000);
            });
        }
    }
});
