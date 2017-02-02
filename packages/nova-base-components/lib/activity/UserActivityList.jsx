import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {Meteor} from 'meteor/meteor';
import {FormattedMessage, FormattedRelative} from 'react-intl';
import Users from 'meteor/nova:users';
import Messages from 'meteor/nova:messages';
import {withRouter} from 'react-router'

const UserActivityList = ({results, currentUser, hasMore, ready, count, totalCount, loadMore}) => {

    const loadMoreMessage = "Load more activities";

    if (!!results.length) {
        return (
          <div className="constraintWidth_ZyYbM container_3aBgK">
              <div className="paddedBox_2UY-S box_c4OJj container_63-fs">
                  <Telescope.components.PostsListTitle title="Latest Activity"/>
                  <div className="content_DcBqe">
                      <span>
                          <ul className="list_22hjI">
                              {results.map((message, index) =>
                                <Telescope.components.UserActivityListItem
                                  key={message._id}
                                  message={message}
                                  index={index}/>
                              ) }
                          </ul>
                      </span>
                  </div>
                  {hasMore ?
                    (ready ?
                        <Telescope.components.PostsLoadMore loadMore={loadMore}/>
                        :
                        <Telescope.components.PostsLoading message={loadMoreMessage}/>
                    )
                    : null}
              </div>
          </div>
        )
    } else {
        return (
          <div className="constraintWidth_ZyYbM container_3aBgK">
              <div className="paddedBox_2UY-S box_c4OJj container_63-fs">
                  <Telescope.components.PostsListTitle title="Latest Activity"/>
              </div>
              <div className="content_DcBqe">
                  <div className="posts-no-results">
                      <div className="posts-no-results-left">No activities</div>
                  </div>
              </div>
          </div>
        )
    }
};

UserActivityList.contextTypes = {
    actions: React.PropTypes.object,
    events: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    messages: React.PropTypes.object
};

module.exports = UserActivityList;
export default UserActivityList;
