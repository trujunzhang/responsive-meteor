import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';

class UsersBlurryImageAvatar extends Component {

    render() {
        const {avatarObj,size} = this.props;

        if (avatarObj.haveAvatar) {
            return (
              <Telescope.components.AvatarBlurryImage
                imageId={avatarObj.avatarId}
                containerClass={"avatar"}
                imageClass={"avatar-image avatar-image--icon"}
                imageSet={{small: avatarObj.url, large: avatarObj.url}}
                imageWidth={size}
                imageHeight={size}
                imageTitle={avatarObj.title}
                isAvatar={true}
              />
            )
        }

        return (
          <img width={size} height={size} src={avatarObj.url}/>
        )
    }

}

UsersBlurryImageAvatar.displayName = "UsersBlurryImageAvatar";

module.exports = UsersBlurryImageAvatar;
export default UsersBlurryImageAvatar;