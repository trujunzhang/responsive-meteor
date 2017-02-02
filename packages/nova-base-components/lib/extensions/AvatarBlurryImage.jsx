import React, {PropTypes, Component} from 'react';

class AvatarBlurryImage extends Component {

    constructor(props) {
        super(props);
        this.state = ({initialized: false});
    }

    componentDidMount() {
        if (this.state.initialized) {
            return;
        }

        const isAvatar = !!this.props.isAvatar ? this.props.isAvatar : false;
        this.blurryLoad($("#blurry-" + this.props.imageId), isAvatar);

        this.initialized();
    }

    initialized() {
        this.setState({initialized: true});
    }

    blurryLoad(selector, isAvatar) {

        let parentContainer = selector.parent(),
          imageContainer = selector;

        parentContainer.addClass(isAvatar ? 'blurry-load-container-avatar' : 'blurry-load-container');
        imageContainer.addClass('img-blur');

        // 1: load small image and show it
        let img = new window.Image();
        img.src = imageContainer.attr('src');
        img.onload = function () {
            imageContainer.addClass(isAvatar ? 'avatar-loaded' : 'loaded');
        };

        //2: load large image
        let imgLarge = new window.Image();
        imgLarge.src = selector.attr('data-large');
        imgLarge.onload = function () {
            imgLarge.classList.add(isAvatar ? 'avatar-loaded' : 'loaded');
        };
        parentContainer.append(imgLarge)
    }

    render() {
        const imageId = this.props.imageId;
        const containerClass = this.props.containerClass;
        const imageClass = this.props.imageClass;
        const imageSet = this.props.imageSet;
        const imageWidth = this.props.imageWidth;
        const imageHeight = this.props.imageHeight;
        const imageTitle = this.props.imageTitle;
        return (
          <div className={containerClass}>
              <img
                id={"blurry-" + imageId}
                width={imageWidth}
                height={imageHeight}
                src={imageSet.small}
                data-large={imageSet.large}
                className={imageClass}
                alt={imageTitle}
                title={imageTitle}/>
          </div>
        )
    }
}

AvatarBlurryImage.displayName = "AvatarBlurryImage";

module.exports = AvatarBlurryImage;
export default AvatarBlurryImage;