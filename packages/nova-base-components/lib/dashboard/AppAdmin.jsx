import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {IntlProvider, intlShape} from 'react-intl';
import {AppComposer} from "meteor/nova:core";

class AppAdmin extends Component {

    getLocale() {
        return Telescope.settings.get("locale", "en");
    }

    getChildContext() {

        const messages = Telescope.strings[this.getLocale()] || {};
        const intlProvider = new IntlProvider({locale: this.getLocale()}, messages);

        const {intl} = intlProvider.getChildContext();

        return {
            currentUser: this.props.currentUser,
            actions: this.props.actions,
            events: this.props.events,
            messages: this.props.messages,
            intl: intl
        };
    }

    render() {
        return (
          <Telescope.components.CanDo
            action="admin.manager.all"
            displayNoPermissionMessage={true}
          >
              {this.renderChild()}
          </Telescope.components.CanDo>
        )
    }

    renderChild() {
        return (
          <IntlProvider locale={this.getLocale()} messages={Telescope.strings[this.getLocale()]}>
              {
                  this.props.ready ?
                  <Telescope.components.AppAdminLayout
                      currentUser={this.props.currentUser}>
                      {this.props.children}
                  </Telescope.components.AppAdminLayout>
                    : <Telescope.components.AppLoading />
              }
          </IntlProvider>
        )
    }

}

AppAdmin.propTypes = {
    ready: React.PropTypes.bool,
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    events: React.PropTypes.object,
    messages: React.PropTypes.object,
};

AppAdmin.childContextTypes = {
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    events: React.PropTypes.object,
    messages: React.PropTypes.object,
    intl: intlShape
};

module.exports = AppComposer(AppAdmin);
export default AppComposer(AppAdmin);
