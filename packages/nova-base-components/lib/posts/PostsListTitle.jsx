import React, {PropTypes, Component} from 'react';

class PostsListTitle extends Component {

    render() {
        const {dismissBanner, showClose, title} = this.props;

        let closeBlock =
          (<span className="close_postlist" onClick={dismissBanner}>
                  <svg width="12" height="12" viewBox="0 0 12 12">
                      <path d="M6 4.586l4.24-4.24c.395-.395 1.026-.392 1.416-.002.393.393.39 1.024 0 1.415L7.413 6l4.24 4.24c.395.395.392 1.026.002 1.416-.393.393-1.024.39-1.415 0L6 7.413l-4.24 4.24c-.395.395-1.026.392-1.416.002-.393-.393-.39-1.024 0-1.415L4.587 6 .347 1.76C-.05 1.364-.048.733.342.343c.393-.393 1.024-.39 1.415 0L6 4.587z"/>
                  </svg>
              </span>
          );

        return (
          <div className="header_3GFef">
              <span className="header_title">
                  <span
                    className="title_38djq featured_2W7jd default_tBeAo base_3CbW2">{title}</span>
              </span>
              {!!showClose ? closeBlock : null}
          </div>
        )
    }
}

module.exports = PostsListTitle;
export default PostsListTitle;