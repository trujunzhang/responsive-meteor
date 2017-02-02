import React, {PropTypes, Component} from 'react';
import {ModalTrigger} from "meteor/nova:core";
import {withRouter} from 'react-router';

import Posts from "meteor/nova:posts";
import Users from 'meteor/nova:users';

class AuthorInfo extends Component {

    constructor(props) {
        super(props);
    }

    onSubmitClick() {

    }

    render() {
        const user = this.context.currentUser;
        const authorUserName = Users.getDisplayName(user);

        return (
          <div >
              <div>
                  <label className="field_1LaJb">
                      <span className="label_2ZD44 text_3Wjo0 subtle_1BWOT base_3CbW2">Makers</span>
                      <div className="group_1nlHj text_3Wjo0 default_tBeAo base_3CbW2">
                          <div className="makers_14u5i">
                              <input type="text"
                                     name="maker"
                                     value={authorUserName}
                                     placeholder="Add the Product Hunt/Twitter username of one of the makers"
                                     disabled="true"/>
                          </div>
                      </div>
                      <hr className="ruler_1ti8u"/>
                  </label>
                  <div className="field_1LaJb">
                      <span className="label_2ZD44 text_3Wjo0 subtle_1BWOT base_3CbW2"/>
                      <div className="group_1nlHj text_3Wjo0 default_tBeAo base_3CbW2">
                          <p className="text_3Wjo0 default_tBeAo base_3CbW2">Click 'Submit' to post the article, or click 'previous' to edit.</p>
                      </div>
                      <hr className="ruler_1ti8u"/>
                  </div>
              </div>
              <div className="spread_2KX-j buttonGroup_2NmU8 spread_3SBD9">
                  <button
                    onClick={() => this.props.previousClick()}
                    className="button_2I1re mediumSize_10tzU secondaryBoldText_1PBCf secondaryText_PM80d simpleVariant_1Nl54">
                      <div className="buttonContainer_wTYxi">Previous</div>
                  </button>
                  <div className="buttonWithNotice_3bRZb">
                      <button
                        onClick={this.onSubmitClick.bind(this)}
                        className="button_2I1re mediumSize_10tzU secondaryBoldText_1PBCf secondaryText_PM80d orangeSolidColor_B-2gO solidVariant_2wWrf"
                        type="submit">
                          <div className="buttonContainer_wTYxi">Submit</div>
                      </button>
                  </div>
              </div>
          </div>
        )
    }
}

AuthorInfo.contextTypes = {
    actions: React.PropTypes.object,
    events: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    messages: React.PropTypes.object
};

module.exports = withRouter(AuthorInfo);
export default withRouter(AuthorInfo);
