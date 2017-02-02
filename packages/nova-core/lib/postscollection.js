import React, {PropTypes, Component} from 'react';

class PostsCollection {

    constructor() {
        // Local (client-only) collection
        this.collection = new Meteor.Collection(null);
    }

    pushPost(post, hash) {
        const existPost = this.collection.findOne({hash: hash});
        if (existPost) {
            this.collection.update(existPost._id, {
                $set: {
                    show: true
                }
            })
        } else {
            this.collection.insert(
              {
                  postId: post._id,
                  hash: hash,
                  slug: post.slug,
                  show: true,
                  createdAt: new Date()
              }
            );
        }
    }

    popPost() {
        const last = this.collection.findOne({show: true}, {sort: {createdAt: -1}});
        if (last) {
            this.collection.update(last._id, {
                $set: {
                    show: false
                }
            });
        }
    }

    clearPosts() {
        this.collection.remove({})
    }

    getPostsCollection() {
        return this.collection;
    }

    havePopupPosts() {
        return this.collection.find({show: true}).count() > 0;
    }

    getAllPosts() {
        return this.collection.find({show: true}).fetch();
    }
}

export default PostsCollection;
