import React, {PropTypes, Component} from 'react';
import {Alert} from 'react-bootstrap';

class Flash extends Component {

    constructor() {
        super();
        this.dismissFlash = this.dismissFlash.bind(this);
        this.fadingDone = this.fadingDone.bind(this);
        this.state = this.initialState = {
            _isMounted: false,
            isDismissing: false,
            isShowing: false
        }
    }

    componentWillUnmount() {
        const elm = this.refs.button;
        elm.removeEventListener('animationend', this.fadingDone);
        this.setState({_isMounted: false});
    }

    componentDidMount() {
        let self = this;
        this.setState({_isMounted: true});

        this.context.messages.delayEvent(function () {
            self.setState({isShowing: true});
        }, 100);

        this.context.messages.markAsSeen(this.props.message._id);

        const elm = this.refs.button;
        elm.addEventListener('animationend', this.fadingDone);

        this._notificationTimer = new this.context.messages.Timer(function () {
            self._hideNotification();
        }, 5 * 1000);
    }

    fadingDone() {
        //this.context.messages.clear(this.props.message._id);
    }

    dismissFlash(e) {
        e.preventDefault();
        this._hideNotification();
    }

    _hideNotification() {
        if (this._notificationTimer) {
            this._notificationTimer.clear();
        }

        if (this.state._isMounted) {
            this.setState({isDismissing: true});
        }

        let self = this;

        this.context.messages.delayEvent(function () {
            self.context.messages.clear(self.props.message._id);
        }, 1000);
    }

    _handleMouseEnter(e) {
        e.preventDefault();
        this._notificationTimer.pause();
    }

    _handleMouseLeave(e) {
        e.preventDefault();
        this._notificationTimer.resume();
    }

    render() {
        let type = this.props.message.type;
        type = type === "error" ? "danger" : type; // if type is "error", use "danger" instead
        const className = (!this.state.isShowing ) || this.state.isDismissing ? "td-more-articles-box" : "td-more-articles-box td-front-end-display-block";
        const bottom = 48 + 100 * this.props.index;

        return (
          <div className={ className }
               ref='button'
               style={{bottom: bottom}}
               onClick={ this.dismissFlash }
               onMouseEnter={ this._handleMouseEnter.bind(this) }
               onMouseLeave={ this._handleMouseLeave.bind(this) }>
              <Alert className="flash-message" bsStyle={type} onDismiss={this.dismissFlash}>
                  {this.props.message.content}
              </Alert>
          </div>
        )
    }
}

Flash.propTypes = {
    message: React.PropTypes.object.isRequired
};

Flash.contextTypes = {
    messages: React.PropTypes.object.isRequired
};

module.exports = Flash;