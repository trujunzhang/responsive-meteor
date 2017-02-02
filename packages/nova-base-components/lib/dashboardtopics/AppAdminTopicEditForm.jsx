import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {DocumentContainer} from "meteor/utilities:react-list-container";
import Posts from "meteor/nova:posts";
import {ModalTrigger} from "meteor/nova:core";
import {FormattedMessage, intlShape} from 'react-intl';
import Users from "meteor/nova:users";
import Comments from "meteor/nova:comments";
import {withRouter} from 'react-router';


class AppAdminTopicEditForm extends Component {

    constructor(props) {
        super(props);
        this.state = this.initialState = {};
    }

    render() {
        return (
          <div id="col-left">
              <div className="col-wrap">

                  <div className="form-wrap">
                      <h2>Add New Tag</h2>
                      <form id="addtag" method="post" action="edit-tags.php" className="validate">
                          <div className="form-field form-required term-name-wrap">
                              <label >Name</label>
                              <input name="tag-name" id="tag-name" type="text" value="" size="40"/>
                              <p>The name is how it appears on your site.</p>
                          </div>
                          <div className="form-field term-slug-wrap">
                              <label >Slug</label>
                              <input name="slug" id="tag-slug" type="text" value="" size="40"/>
                              <p>The “slug” is the URL-friendly version of the name. It is usually all lowercase and contains only letters, numbers, and hyphens.</p>
                          </div>
                          <p className="submit">
                              <input type="submit" name="submit" id="submit" className="button button-primary" value="Add New Tag"/>
                          </p>
                      </form>
                  </div>

              </div>
          </div>
        )

    }
}

AppAdminTopicEditForm.contextTypes = {
    messages: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    events: React.PropTypes.object,
    intl: intlShape
};

AppAdminTopicEditForm.displayName = "AppAdminTopicEditForm";

module.exports = withRouter(AppAdminTopicEditForm);
export default withRouter(AppAdminTopicEditForm);
