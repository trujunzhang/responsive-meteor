import React, {PropTypes, Component} from 'react';

class CollectionsResult extends Component {

    render() {
        const {results, ready}=this.props;
        const folders = (results.map((folder, index) => {
            return (
              <li key={folder._id}>
                  <a className="collections-popover--collection popover--scrollable-list--element"
                     onClick={(e)=>{
                            e.preventDefault();
                            this.props.onCollectedItemClick(folder);
                     }
                     }
                >
                      {folder.name}

                      {folder.visible == "Lock" ?
                        <span className="collections-popover--collection--icon v-collect folder-visible fa fa-lock"/>
                        : null
                      }
                  </a>
             </li>
            )
        }));

        const loading = (
          <div className="placeholder_folder">
              <div className="loader_54XfI animationRotate loader_OEQVm">
              </div>
          </div>
        );

        return (
          <ul className="collections-popover--collections popover--scrollable-list">
              {results.length > 0 ? folders : (!ready ? loading : null)}
          </ul>
        )
    }
}

CollectionsResult.contextTypes = {
    actions: React.PropTypes.object,
    events: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    messages: React.PropTypes.object
};

module.exports = CollectionsResult;
export default CollectionsResult;
