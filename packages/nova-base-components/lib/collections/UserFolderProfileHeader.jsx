import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import Users from 'meteor/nova:users';
import {withRouter} from 'react-router'

const keyCodes = {
    ENTER: 13,
    ESCAPE: 27,
    UP: 38,
    DOWN: 40
};

class UserFolderProfileHeader extends Component {

    constructor(props) {
        super(props);

        this.state = this.initialState = {
            isEditingFolderName: false,
            isEditingFolderDescription: false,
            folderNameValue: '',
            folderDescriptionValue: ''
        };
    }

    onDeleteFolderClick(event) {
        const {folder, callBack} = this.props;

        const deleteFolderConfirm = "Are you sure you want to delete this collection? There is no way back. This is a path without return! Be brave?";
        if (window.confirm(deleteFolderConfirm)) {
            this.context.actions.call('folders.remove', folder._id, (error, result) => {
                if (!error) {
                    callBack();
                }
            });
        }
    }

    onKeyDownForFolderNameInput(e) {
        const self = this;
        const key = e.which || e.keyCode;
        if (key === keyCodes.ENTER) {
            const editedFolder = {
                _id: this.props.folder._id,
                newName: this.state.folderNameValue
            };
            this.context.actions.call('folders.editFolderName', editedFolder, (error, result) => {
                if (!error) {
                    self.setState({isEditingFolderName: false});
                }
            });
        }
    }

    onKeyDownForFolderDescriptionInput(e) {
        const self = this;
        const key = e.which || e.keyCode;
        if (key == keyCodes.ENTER) {
            const {folder} = this.props;
            const editedFolder = {
                _id: folder._id,
                newDesctiption: this.state.folderDescriptionValue
            };
            this.context.actions.call('folders.editFolderDescription', editedFolder, (error, result) => {
                if (!error) {
                    self.setState({isEditingFolderDescription: false});
                }
            });
        }
    }

    onUserNameClick() {
        const {user, router} = this.props;
        this.context.messages.pushRouter(router, Users.getLinkObject("profile", user));
    }

    renderFolderName() {
        const {folder} = this.props;

        if (this.state.isEditingFolderName) {
            return (<input
              type="text"
              maxLength="80"
              name="name"
              value={this.state.folderNameValue}
              onChange={(e) => this.setState({folderNameValue: e.target.value})}
              onKeyDown={this.onKeyDownForFolderNameInput.bind(this)}/>)
        }

        const editButton = (folder.visible == "Lock") ? null :
          (
            <span className="editable-text--button" onClick={() => this.setState({isEditingFolderName: true, folderNameValue: folder.name})}>
              <svg width="19" height="19" viewBox="0 0 19 19">
                  <g fill="#B5B5B5">
                      <path
                        d="M15.6111111,8.40952381 L15.6111111,15.0761905 C15.6111111,15.7800481 15.037191,16.3539683 14.3333333,16.3539683 L3.66666667,16.3539683 C2.9625373,16.3539683 2.38888889,15.7802208 2.38888889,15.0761905 L2.38888889,4.40952381 C2.38888889,3.70522174 2.9623646,3.13174603 3.66666667,3.13174603 L10.3333333,3.13174603 C10.854809,3.13174603 11.2777778,2.7087773 11.2777778,2.18730159 C11.2777778,1.66545755 10.8548853,1.24285714 10.3333333,1.24285714 L3.66666667,1.24285714 C1.9176354,1.24285714 0.5,2.66049255 0.5,4.40952381 L0.5,15.0761905 C0.5,16.8252217 1.9176354,18.2428571 3.66666667,18.2428571 L14.3333333,18.2428571 C16.0820608,18.2428571 17.5,16.8250811 17.5,15.0761905 L17.5,8.40952381 C17.5,7.88767977 17.0771075,7.46507937 16.5555556,7.46507937 C16.0336354,7.46507937 15.6111111,7.88760366 15.6111111,8.40952381 L15.6111111,8.40952381 Z M16.6111111,8.40952381 C16.6111111,8.43988841 16.5859202,8.46507937 16.5555556,8.46507937 C16.5249774,8.46507937 16.5,8.44011923 16.5,8.40952381 L16.5,15.0761905 C16.5,16.2727706 15.5298018,17.2428571 14.3333333,17.2428571 L3.66666667,17.2428571 C2.46992015,17.2428571 1.5,16.272937 1.5,15.0761905 L1.5,4.40952381 C1.5,3.2127773 2.46992015,2.24285714 3.66666667,2.24285714 L10.3333333,2.24285714 C10.3027552,2.24285714 10.2777778,2.21789701 10.2777778,2.18730159 C10.2777778,2.15649255 10.3025243,2.13174603 10.3333333,2.13174603 L3.66666667,2.13174603 C2.41007985,2.13174603 1.38888889,3.15293699 1.38888889,4.40952381 L1.38888889,15.0761905 C1.38888889,16.332467 2.41021392,17.3539683 3.66666667,17.3539683 L14.3333333,17.3539683 C15.5894757,17.3539683 16.6111111,16.3323329 16.6111111,15.0761905 L16.6111111,8.40952381 L16.6111111,8.40952381 Z"/>
                      <path d="M16.70122,0 C16.3097077,0 15.9188703,0.149175518 15.6205109,0.447189053 L9.22854018,6.8393175 L9.22854018,9 L11.3892835,9 L17.7812542,2.60787156 C18.3776355,2.01116948 18.3776355,1.04389112 17.7812542,0.447189053 C17.4828947,0.149175518 17.0920574,0 16.70122,0 Z"/>
                  </g>
              </svg>
          </span>
          );

        return (
          <span>
              {folder.name}
              <Telescope.components.CanDo action="folders.edit.own" document={folder}>
              {editButton}
              </Telescope.components.CanDo>
            </span>
        )
    }

    renderFolderDescription() {
        const {folder} = this.props;
        const editedDescription = folder.description ? folder.description : "";
        const {isEditingFolderDescription} = this.state;

        if (isEditingFolderDescription) {
            return (
              <input
                type="text"
                maxLength="255"
                name="title"
                value={this.state.folderDescriptionValue}
                onChange={(e) => this.setState({folderDescriptionValue: e.target.value})}
                onKeyDown={this.onKeyDownForFolderDescriptionInput.bind(this)}/>
            )
        }

        const editButton = (
          <span className="editable-text--button" onClick={() => this.setState({isEditingFolderDescription: true, folderDescriptionValue: editedDescription})}>
                  <svg width="19" height="19" viewBox="0 0 19 19">
                      <g fill="#B5B5B5">
                          <path
                            d="M15.6111111,8.40952381 L15.6111111,15.0761905 C15.6111111,15.7800481 15.037191,16.3539683 14.3333333,16.3539683 L3.66666667,16.3539683 C2.9625373,16.3539683 2.38888889,15.7802208 2.38888889,15.0761905 L2.38888889,4.40952381 C2.38888889,3.70522174 2.9623646,3.13174603 3.66666667,3.13174603 L10.3333333,3.13174603 C10.854809,3.13174603 11.2777778,2.7087773 11.2777778,2.18730159 C11.2777778,1.66545755 10.8548853,1.24285714 10.3333333,1.24285714 L3.66666667,1.24285714 C1.9176354,1.24285714 0.5,2.66049255 0.5,4.40952381 L0.5,15.0761905 C0.5,16.8252217 1.9176354,18.2428571 3.66666667,18.2428571 L14.3333333,18.2428571 C16.0820608,18.2428571 17.5,16.8250811 17.5,15.0761905 L17.5,8.40952381 C17.5,7.88767977 17.0771075,7.46507937 16.5555556,7.46507937 C16.0336354,7.46507937 15.6111111,7.88760366 15.6111111,8.40952381 L15.6111111,8.40952381 Z M16.6111111,8.40952381 C16.6111111,8.43988841 16.5859202,8.46507937 16.5555556,8.46507937 C16.5249774,8.46507937 16.5,8.44011923 16.5,8.40952381 L16.5,15.0761905 C16.5,16.2727706 15.5298018,17.2428571 14.3333333,17.2428571 L3.66666667,17.2428571 C2.46992015,17.2428571 1.5,16.272937 1.5,15.0761905 L1.5,4.40952381 C1.5,3.2127773 2.46992015,2.24285714 3.66666667,2.24285714 L10.3333333,2.24285714 C10.3027552,2.24285714 10.2777778,2.21789701 10.2777778,2.18730159 C10.2777778,2.15649255 10.3025243,2.13174603 10.3333333,2.13174603 L3.66666667,2.13174603 C2.41007985,2.13174603 1.38888889,3.15293699 1.38888889,4.40952381 L1.38888889,15.0761905 C1.38888889,16.332467 2.41021392,17.3539683 3.66666667,17.3539683 L14.3333333,17.3539683 C15.5894757,17.3539683 16.6111111,16.3323329 16.6111111,15.0761905 L16.6111111,8.40952381 L16.6111111,8.40952381 Z"/>
                          <path d="M16.70122,0 C16.3097077,0 15.9188703,0.149175518 15.6205109,0.447189053 L9.22854018,6.8393175 L9.22854018,9 L11.3892835,9 L17.7812542,2.60787156 C18.3776355,2.01116948 18.3776355,1.04389112 17.7812542,0.447189053 C17.4828947,0.149175518 17.0920574,0 16.70122,0 Z"/>
                      </g>
                  </svg>
              </span>
        );

        return (
          <span>
              {folder.description ? folder.description : "Describe the collection briefly"}
              <Telescope.components.CanDo action="folders.edit.own" document={folder}>
              {editButton}
              </Telescope.components.CanDo>
          </span>
        )
    }

    renderDeleteButton() {
        const {folder} = this.props;
        if (folder.visible == "Lock") {
            return (
              <div></div>
            )
        }
        return (
          <a className="collection-detail--header--delete-button" onClick={this.onDeleteFolderClick.bind(this)}>
                <span>
                    <svg width="11px" height="15px" viewBox="0 0 11 15">
                        <g id="Flow" stroke="none" fill="none">
                            <g id="Profile---Edit-Collection" transform="translate(-1161.000000, -353.000000)" fill="#FFFFFF">
                                <g id="Edit-Collection-title-bvar" transform="translate(107.000000, 132.000000)">
                                    <g id="buttons" transform="translate(1011.000000, 126.000000)">
                                        <path
                                          d="M52.4308375,99.8631468 L44.2674305,99.8631468 C43.8871031,99.8631468 43.5885666,100.187584 43.6206013,100.565866 L44.3137787,108.866273 C44.3403607,109.183894 44.6054993,109.427903 44.923802,109.427903 L51.7737845,109.427903 C52.0920871,109.427903 52.3579074,109.183894 52.3844894,108.866273 L53.0776667,100.565866 C53.1090199,100.187584 52.8104833,99.8631468 52.4308375,99.8631468 L52.4308375,99.8631468 Z M43.614467,98.7303437 C43.195289,98.7303437 42.9083395,98.343882 43.0269362,97.9410621 L43.3172936,96.8450649 C43.3840895,96.6228665 43.5544871,96.4776878 43.7875909,96.4320212 C44.0206948,96.3856731 45.8173669,96.2248178 46.2535846,96.1982357 C46.4512458,96.1880119 46.5732505,96.0237486 46.6039221,95.9269628 C46.6352752,95.830177 46.8397523,95.3816906 46.9672097,95.2194721 C47.0258265,95.1458603 47.2841492,95 48.3487932,95 C49.4141189,95 49.6778943,95.1458603 49.7358295,95.2194721 C49.8632869,95.3816906 50.067764,95.830177 50.0991171,95.9269628 C50.1297887,96.0237486 50.2524749,96.1880119 50.4494545,96.1982357 C50.8856723,96.2248178 52.6823443,96.3856731 52.9154482,96.4320212 C53.1492337,96.4776878 53.3196313,96.6228665 53.3864271,96.8450649 L53.676103,97.9410621 C53.7946997,98.343882 53.5077502,98.7303437 53.0885722,98.7303437 L43.614467,98.7303437 L43.614467,98.7303437 Z"
                                          id="trashcan"/>
                                    </g>
                                </g>
                            </g>
                        </g>
                    </svg>
                </span>
              Delete this collection
          </a>
        )
    }

    render() {
        const {user, folder} = this.props;
        const userName = Users.getDisplayName(user);

        return (
          <header className="backgroundImage_1hK9M collection-detail--header">
              <div className="collection-detail--header--heading">
                  <h1>
                      {this.renderFolderName()}
                  </h1>
                  <h2>
                      {this.renderFolderDescription()}
                  </h2>
                  <div className="collection-detail--header--curator">
                      <a onClick={this.onUserNameClick.bind(this)}>
                          {/*Logged user avatar*/}
                          <Telescope.components.UserFolderProfileHeaderUserAvatar user={user}/>
                          by {userName}
                      </a>
                  </div>

                  <Telescope.components.CanDo action="folders.edit.own" document={folder}>
                      {this.renderDeleteButton()}
                  </Telescope.components.CanDo>


              </div>
          </header>
        )
    }
}

UserFolderProfileHeader.propTypes = {
    user: React.PropTypes.object.isRequired
};

UserFolderProfileHeader.contextTypes = {
    actions: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    messages: React.PropTypes.object
};

UserFolderProfileHeader.displayName = "UserFolderProfileHeader";

module.exports = withRouter(UserFolderProfileHeader);
export default withRouter(UserFolderProfileHeader);
