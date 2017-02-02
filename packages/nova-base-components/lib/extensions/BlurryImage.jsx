import React, {PropTypes, Component} from 'react';

class BlurryImage extends Component {

    constructor(props) {
        super(props);
        this.state = ({initialized: false});
    }

    componentDidMount() {
        if (this.state.initialized) {
            return;
        }

        const isAvatar = !!this.props.isAvatar ? this.props.isAvatar : false;
        const parent = $("#panel-blurry-" + this.props.imageId);
        const selector = $("#blurry-" + this.props.imageId);
        const largeSelector = $("#large-blurry-" + this.props.imageId);
        const imageSet = this.props.imageSet;
        this.blurryLoad(parent, selector, largeSelector, imageSet, isAvatar);

        this.initialized();
    }

    initialized() {
        this.setState({initialized: true});
    }

    blurryLoad(parent, selector, largeSelector, imageSet) {

        let parentContainer = parent,
          imageContainer = selector,
          largeImageContainer = largeSelector;

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
        imgLarge.src = imageContainer.attr('data-large');
        imgLarge.onload = function () {
            imgLarge.classList.add('loaded');
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
          <div style={{width: imageWidth, height: imageHeight}}>
              <div className={containerClass } id={"panel-blurry-" + imageId}>
                  <img
                    id={"blurry-" + imageId}
                    width={imageWidth}
                    height={imageHeight}
                    src={imageSet.small}
                    data-large={imageSet.large}
                    className={imageClass }
                    alt={imageTitle}
                    title={imageTitle}/>
              </div>
          </div>
        )
    }

    //renderxxx() {
    //    const imageId = this.props.imageId;
    //    const containerClass = this.props.containerClass;
    //    const imageClass = this.props.imageClass;
    //    const imageSet = this.props.imageSet;
    //    const imageWidth = this.props.imageWidth;
    //    const imageHeight = this.props.imageHeight;
    //    const imageTitle = this.props.imageTitle;
    //    return (
    //      <div style={{width: imageWidth, height: imageHeight}}>
    //          <div className={containerClass} id={"panel-blurry-" + imageId}>
    //              <img
    //                id={"blurry-" + imageId}
    //                width={imageWidth}
    //                height={imageHeight}
    //                src={imageSet.small}
    //                className={imageClass}
    //                alt={imageTitle}
    //                title={imageTitle}/>
    //          </div>
    //      </div>
    //    )
    //}
}

BlurryImage.displayName = "BlurryImage";

module.exports = BlurryImage;
export default BlurryImage;