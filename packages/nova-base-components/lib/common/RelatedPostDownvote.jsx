import React, {PropTypes, Component} from 'react';
import Users from 'meteor/nova:users';

class RelatedPostDownvote extends Component {

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

    onRelatedPostDownvoteClick(event) {
        event.preventDefault();
        const {post} = this.props;
        const {currentUser} = this.context;

        if (!currentUser) {
            this.context.messages.showLoginUI();
        } else if (currentUser.hasDownvoted(post)) {
            this.context.actions.call('posts.cancelDownvote', post._id, (error, result) => {
                this.context.events.track("post downvote cancelled", {'_id': post._id});
            });
        } else {
            this.setState({fade: true});
            this.context.actions.call('posts.downvote', post._id, (error, result) => {
                this.context.events.track("post downvoted", {'_id': post._id});
            });
        }

        event.stopPropagation();
    }

    render() {

        const {post} = this.props;
        const user = this.context.currentUser;
        const {fade} = this.state;

        const hasDownvoted = Users.hasDownvoted(user, post);
        const buttonClass =
            hasDownvoted ?
            "button_2I1re active_2heMV smallSize_1da-r secondaryText_PM80d simpleVariant_1Nl54 button_2n20W" :
            "button_2I1re smallSize_1da-r secondaryText_PM80d simpleVariant_1Nl54 button_2n20W";

        let postVoteClass = "postDownvoteArrow_2xABl" + (hasDownvoted ? " upvoted_172lX" : "");
        if (fade) {
            postVoteClass = postVoteClass + ' animate_asuDN';
        }

        return (
          <a className={buttonClass} onClick={this.onRelatedPostDownvoteClick.bind(this)}>
              <div
                  ref='button'
                  className={postVoteClass}></div>
              {post.downvotes || 0}
          </a>
        )
    }
}

RelatedPostDownvote.propTypes = {
    post: React.PropTypes.object.isRequired, // the current post
};

RelatedPostDownvote.contextTypes = {
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    events: React.PropTypes.object,
    messages: React.PropTypes.object
};

module.exports = RelatedPostDownvote;
export default RelatedPostDownvote;
