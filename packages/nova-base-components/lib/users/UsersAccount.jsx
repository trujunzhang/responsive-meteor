import Telescope from 'meteor/nova:lib';
import React from 'react';
import Users from 'meteor/nova:users';

const UsersAccount = (props, context) => {
    const {currentUser} = context;
    const terms = props.params.slug ? {"telescope.slug": props.params.slug} : currentUser ? {_id: currentUser._id} : undefined;

    if(!currentUser){
        return (<Telescope.components.UserLoginPopup comp={{object:{showCloseIcon:false,title:'',subtitle:''}}}/>);
    }

    return (
      <div className="constraintWidth_user_account container_3aBgK user-edit-margin-bottom">

          <Telescope.components.CanDo action="users.edit.own" displayNoPermissionMessage={true}>
              {/*Important: Using <*PostDocumentContainer*> here.*/}
              <Telescope.components.PostDocumentContainer
                collection={Users}
                publication="users.profile"
                selector={terms}
                terms={terms}
                documentPropName="user"
                component={Telescope.components.UsersEdit}
              />
          </Telescope.components.CanDo>
      </div>
    )
};

UsersAccount.contextTypes = {
    currentUser: React.PropTypes.object
}

UsersAccount.displayName = "UsersAccount";

module.exports = UsersAccount;
