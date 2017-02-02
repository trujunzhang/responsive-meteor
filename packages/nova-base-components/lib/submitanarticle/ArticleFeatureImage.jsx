import React, {PropTypes, Component} from 'react';
import {ModalTrigger} from "meteor/nova:core";
import Telescope from 'meteor/nova:lib';
import Posts from "meteor/nova:posts";
import Mimages from "meteor/nova:mimages";

class ArticleFeatureImage extends Component {

    constructor(props) {
        super(props);

        this.state = this.initialState = {
            // For feature images
            //thumbnailValue: 'http://theviewspaper.net/wp-content/uploads/News-1.jp',
            thumbnailValue: this.props.thumbnailValue,
            imageId: this.props.imageId,
            preview: this.props.preview,
            // Upload type
            uploadType: this.props.uploadType,
            // Uploading
            uploading: false,
            // Message
            message: null,
        };
    }

    clearImage(e) {
        e.preventDefault();
        this.setState({thumbnailValue: '', preview: '', value: ''});
        this.props.onFeatureImageChange("", "");
    }

    onFeatureImageChange(e) {
        let input = e.target.value;
        this.setState({thumbnailValue: input, preview: input});
        //this.uploadImageFromUrl(input, function (savedFile) {
        //    this.uploadImageToServer(savedFile);
        //});
    }

    uploadImageFromUrl(thumbnailUrl, cb) {
        let self = this;
        self.setState({uploading: true});

        //this.context.actions.call('posts.download.image', thumbnailUrl, (error, result) => {
        //    let x = 0;
        //});

    }

    uploadImageToServer(file) {
        const {uploadType, uploading}= this.state;
        if (!!uploading) {
            return;
        }
        this.setState({uploading: true});

        const fileMeta = {
            file: file,
            streams: 'dynamic',
            chunkSize: 'dynamic',
        };
        if (!!uploadType) {
            fileMeta['type'] = uploadType;
        }
        const uploadInstance = Mimages.getMeteorFile().insert(fileMeta, false);
        uploadInstance.on('start', function () {
        });

        let self = this;
        uploadInstance.on('end', function (error, fileObj) {
            self.setState({uploading: false});
            if (error) {
                // failure
                self.context.message.showMessage(this, "Upload image failure", 'error');
            } else {
                let name = fileObj.name;
                let original = Mimages.getMeteorFile().link(fileObj, 'original');
                let fileId = fileObj._id;
                // success
                self.setState({thumbnailValue: "", imageId: fileId, preview: original});
                self.props.onFeatureImageChange("", fileId);
            }
        });

        uploadInstance.start();
    }

    renderCoverImage() {
        const {preview, uploadType} = this.state;
        const previewClass = uploadType == "cover" ? "preview_ZPH_g" : "thumbnail_ZPH_g";
        if (!!preview && preview != "") {
            return (
              <div className="group_1nlHj text_3Wjo0 default_tBeAo base_3CbW2">
                  <div className={previewClass}>
                      <div className="headerPreview_3dNpr">
                          <img src={preview}/>
                      </div>
                  </div>
              </div>
            )
        }

        return null;
    }

    renderThumbnailImage() {
        const {preview, uploadType} = this.state;
        const previewClass = uploadType == "cover" ? "preview_ZPH_g" : "thumbnail_ZPH_g";
        if (!!preview && preview != "") {
            return (
              <div className="group_1nlHj text_3Wjo0 default_tBeAo base_3CbW2">
                  <div className={previewClass}>
                      <div className="headerPreview_3dNpr">
                          <img src={preview}/>
                      </div>
                      <span className="typeIcon_1y1HV" title="Image">
                            <svg width="20" height="20" viewBox="0 0 20 20">
                                <g fill="none">
                                    <rect fill="#5693E7" x="2" y="2" width="16" height="16" rx="8"/>
                                    <path d="M2,10 L2,10 L2,10 C2,14.4092877 5.581722,18 10,18 L10,18 C14.4092877,18 18,14.418278 18,10 L18,10 C18,5.59071231 14.418278,2 10,2 L10,2 C5.59071231,2 2,5.581722 2,10 L2,10 Z M0,10 L0,10 C0,4.47990754 4.48338507,0 10,0 C15.5200925,0 20,4.48338507 20,10 C20,15.5200925 15.5166149,20 10,20 C4.47990754,20 0,15.5166149 0,10 L0,10 Z" fill="#FFF"/>
                                    <path d="M7 2C7.55225 2 8 1.55225 8 1 8 .44775 7.55225 0 7 0 6.44775 0 6 .44775 6 1 6 1.55225 6.44775 2 7 2zM0 6L2.24560547 2.06494141 8.16113281 6z" transform="translate(6 6)" fill="#FFF"/>
                                </g>
                            </svg>
                      </span>
                      <span className="overlayMenu_3olU8 text_3Wjo0 inverse_1CN6F base_3CbW2">
                          <a href={preview} target="_blank">View original</a>
                      </span>
                      <a className="removeMedia_HxWjv" onClick={this.clearImage.bind(this)}>
                          <span className="fa fa-close" id="feature-image-remove-icon"/>
                      </a>
                  </div>
              </div>
            )
        }

        return null;
    }

    renderLoading() {
        if (this.state.uploading) {
            return (
              <div className="loader_BpwHc">
                  <div className="loader_54XfI animationRotate loaderIndicator_1syiu">
                  </div>
              </div>
            )
        }

        return null;
    }

    renderMessage() {
        if (!!this.state.message) {
            return (
              <div className="errorMessage_2lxEG">{this.state.message.message}</div>
            )
        }
        return null;
    }

    onFileInputChange(e) {
        if (e.currentTarget.files && e.currentTarget.files[0]) {
            let file = e.currentTarget.files[0];
            if (file) {
                this.uploadImageToServer(file);
            }
        }
    }

    renderUploadFile() {
        return (
          <label className="toggler_1158R text_3Wjo0 default_tBeAo base_3CbW2">
              {/*{"or "}*/}
              <a>
                  <input id="fileInput" type="file" onChange={this.onFileInputChange.bind(this)}/>
                  Upload an image</a>
              .
          </label>
        )
    }

    renderOnlineImageUriInput() {
        return (
          <input
            type="text"
            id="url_thumbnail_uuid"
            placeholder="https://"
            value={this.state.thumbnailValue}
            onChange={this.onFeatureImageChange.bind(this)}/>
        )
    }

    render() {
        const {preview, uploadType} = this.state;
        return (
          <div className="group_1nlHj text_3Wjo0 default_tBeAo base_3CbW2">
              <div className="mediaUpload_1A2VG">
                  {/*{this.renderOnlineImageUriInput()}*/}
                  {this.renderUploadFile()}
                  {this.renderLoading()}
              </div>
              {this.renderMessage()}
              {uploadType == "cover" ? this.renderCoverImage() : this.renderThumbnailImage()}
          </div>
        )
    }
}

ArticleFeatureImage.contextTypes = {
    messages: React.PropTypes.object,
    actions: React.PropTypes.object,
    events: React.PropTypes.object,
};

ArticleFeatureImage.displayName = "ArticleFeatureImage";

module.exports = ArticleFeatureImage;
export default ArticleFeatureImage;
