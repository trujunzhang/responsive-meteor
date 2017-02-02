import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import Posts from "meteor/nova:posts";

class PostsThumbnail extends Component {

    constructor(props) {
        super(props);
        this.state = ({initialized: false});
    }

    componentDidMount() {
        if (this.state.initialized) {
            return;
        }

        //if (typeof twttr === 'undefined') {
        //    const twittertimeline = ReactDOM.findDOMNode(this.refs.twittertimeline);
        //    const twitterscript = document.createElement('script');
        //    twitterscript.src = '//platform.twitter.com/widgets.js';
        //    twitterscript.async = true;
        //    twitterscript.id = 'twitter-wjs';
        //    twittertimeline.parentNode.appendChild(twitterscript);
        //} else {
        //    twttr.widgets.load();
        //}

        const {post} = this.props;
        this.blurryLoad($("#blurry-" + post._id));

        this.initialized();
    }

    initialized() {
        this.setState({initialized: true});
    }

    handleImageLoaded() {
        const {post} = this.props;
        $("#blurry-" + post._id).addClass('loaded');
    }

    handleImageErrored() {
        const {post} = this.props;
        $("#blurry-" + post._id).addClass('loaded');
    }

    blurryLoad(selector) {

        let parentContainer = selector.parent(),
          imageContainer = selector;

        parentContainer.addClass('blurry-load-container');
        imageContainer.addClass('img-blur');

        // 1: load small image and show it
        let img = new window.Image();
        img.src = imageContainer.attr('src');
        img.onload = function () {
            imageContainer.addClass('loaded');
        };

        //2: load large image
        let imgLarge = new window.Image();
        imgLarge.src = selector.attr('data-large');
        imgLarge.onload = function () {
            imgLarge.classList.add('loaded');
        };
        parentContainer.append(imgLarge)
    }

    render() {
        const {post} = this.props;
        const callback = this.props.callback;
        const thumbnailClass = this.props.thumbnailClass;
        const imageSet = Posts.getThumbnailSet(post);

        //const imageId = this.props.imageId;
        //const containerClass = this.props.containerClass;
        //const imageClass = this.props.imageClass;
        //const imageSet = this.props.imageSet;
        //const imageWidth = this.props.imageWidth;
        //const imageHeight = this.props.imageHeight;

        return (
          <div className="post-thumbnail thumbnail_JX64A thumbnail post-left-thumbnail">
              <div className={"container_22rD3" + " " + thumbnailClass} onClick={callback}>
                  <Telescope.components.BlurryImage
                    imageId={post._id}
                    containerClass={"container__Ql6q lazyLoadContainer_3KgZD"}
                    imageClass={thumbnailClass}
                    imageSet={imageSet}
                    imageWidth={100}
                    imageHeight={100}
                    imageTitle={post.title}
                  />
              </div>
          </div>
        )
    }
}

PostsThumbnail.displayName = "PostsThumbnail";

module.exports = PostsThumbnail;
export default PostsThumbnail;