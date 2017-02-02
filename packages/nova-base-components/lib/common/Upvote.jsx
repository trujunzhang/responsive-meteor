import React, {PropTypes, Component} from 'react';
import Users from 'meteor/nova:users';

class Upvote extends Component {

    constructor(props) {
        super(props);

        this.state = this.initialState = {
            fade: false
        };
        this.fadingDone = this.fadingDone.bind(this)
    }

    componentDidMount() {
        const elm = this.refs.button;
        elm.addEventListener('animationend', this.fadingDone)
    }

    componentWillUnmount() {
        const elm = this.refs.button;
        elm.removeEventListener('animationend', this.fadingDone)
    }

    fadingDone() {
        // will re-render component, removing the animation class
        this.setState({fade: false})
    }

    onUpvoteClick(event) {
        event.preventDefault();

        const {post} = this.props;
        const {currentUser} = this.context;

        if (!currentUser) {
            this.context.messages.showLoginUI();
        } else if (currentUser.hasUpvoted(post)) {
            this.context.actions.call('posts.cancelUpvote', post._id, (error, result) => {
            });
        } else {
            this.setState({fade: true});
            this.context.actions.call('posts.upvote', post._id, (error, result) => {
            });
        }

        event.stopPropagation();
    }

    render() {

        const {post} = this.props;
        const {currentUser} = this.context;
        const {fade} = this.state;

        const hasUpvoted = Users.hasUpvoted(currentUser, post);

        const buttonClass =
          hasUpvoted ?
            "button_2I1re active_2heMV smallSize_1da-r secondaryText_PM80d simpleVariant_1Nl54 button_2n20W" :
            "button_2I1re smallSize_1da-r secondaryText_PM80d simpleVariant_1Nl54 button_2n20W";

        let postVoteClass = "postUpvoteArrow_2xABl" + (hasUpvoted ? " upvoted_172lX" : "");
        //let postVoteClass = "postUpvoteArrow_2xABl" + (hasUpvoted ? " upvoted_172lX animate_asuDN" : "");

        if (fade) {
            postVoteClass = postVoteClass + ' animate_asuDN';
        }

        return (
          <button className={buttonClass} rel="vote-button" onClick={this.onUpvoteClick.bind(this)}>
              <div className="buttonContainer_wTYxi">
                  <div
                    ref='button'
                    className={postVoteClass}>
                  </div>
                  {post.upvotes || 0}
              </div>
          </button>
        )
    }
}

Upvote.propTypes = {
    post: React.PropTypes.object.isRequired, // the current post
};

Upvote.contextTypes = {
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    events: React.PropTypes.object,
    messages: React.PropTypes.object
};

module.exports = Upvote;
export default Upvote;
