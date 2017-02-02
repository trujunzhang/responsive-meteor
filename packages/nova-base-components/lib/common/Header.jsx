import Telescope from 'meteor/nova:lib';
import React from 'react';
import {ListContainer, DocumentContainer} from "meteor/utilities:react-list-container";

const Header = ({currentUser}) => {

    return (
      <div className="header_2k8Jf medium-header">
          <div className="metabar constraintWidth_ZyYbM">

              <Telescope.components.HeaderContent currentUser={currentUser}/>

              <ListContainer
                collection={Categories}
                resultsPropName="categories"
                limit={0}
                cacheSubscription={true}
                component={Telescope.components.HeaderNavigation}
                loading={<div ></div>}
              />

          </div>
      </div>
    )
};

Header.displayName = "Header";

module.exports = Header;
