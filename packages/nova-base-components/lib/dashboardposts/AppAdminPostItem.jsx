import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import Posts from "meteor/nova:posts";
import moment from 'moment';
import Users from 'meteor/nova:users';
import {withRouter} from 'react-router';

class AppAdminPostItem extends Component {
    onTopicsClick(topic) {
        this.context.messages.appManagement.appendQuery(this.props.router, "topic", topic);
    }

    onCategoryClick(category) {
        this.context.messages.appManagement.appendQuery(this.props.router, "category", category);
    }

    onDomainClick(domain) {
        this.context.messages.appManagement.appendQuery(this.props.router, "domain", domain);
    }

    onCuratorClick(curator) {
        this.context.messages.appManagement.appendQuery(this.props.router, "curator", curator);
    }

    checkIt() {
        this.props.checkRow(this.props.post._id, !this.props.checked);
    }


    renderTitle(){
        const {post,router} = this.props,
        status = !!router.location.query.status ?
                 router.location.query.status :
                 "all",
        postStatus = Posts.getPostStatus(post, status);

        if(status === 'trash'){
            return(
                <strong>
                    {post.title}
                </strong>
            )
        }
        return (
            <strong>
                <a onClick={(e)=>{
                        e.preventDefault();
                        Users.openNewWindow("/",
                                            {postId: post._id, title: post.slug, admin: true}
                        );
                    }}
                    className="row-title">{post.title}</a>
                      {postStatus.length == 0 ? null : " — " }
                      {
                          (postStatus.length == 0 ? null :
                              (postStatus.map((status, index) =>
                                  <span
                                      key={index}
                                      className="post-state">
                                      {status + (index < postStatus.length - 1 ? ", " : "")}
                                  </span>
                                )
                              )
                          )
                      }
                  </strong>
        )
    }

    render() {
        const {post} = this.props,
        {topicsArray,categoriesArray,postedAt} = post,
        updatedAt = moment(postedAt).format("YYYY/MM/DD"),
        commentsCount = '';

        let topics = [];
        if (topicsArray && topicsArray.length > 0) {
            topicsArray.map((topic, index) => {
                topics.push(
                    <a key={index}
                       onClick={this.onTopicsClick.bind(this, topic)}>
                        {topic.name + ((index != topicsArray.length - 1) ? "," : '')}
                    </a>
                );
              }
            );
        } else {
            topics.push(<span key={"no-topic"}>No Topics</span>);
        }

        let categories = [];
        if (categoriesArray && categoriesArray.length > 0) {
            categoriesArray.map((category, index) => {
                categories.push(
                    <a
                        key={category._id}
                        onClick={this.onCategoryClick.bind(this, category)}>
                        {category.name + ((index != categoriesArray.length - 1) ? "," : "")}
                    </a>
                );
              }
            )
        } else {
            categories.push(<span key="AllReads">All Reads</span>);
        }
       
        //Curator is the person who submitted the article
        //Let us say “Zhang” made an account of politicl and he submitted an article from “bbc.co.uk” to politicl
        //Zhang = Curator
        //bbc.co.uk = source domain name

        //Change “Author” to “Curator” which is the person who submitted the article, should be the admin in case article comes from scraper
        //Add column “Source Name” which should have the domains the article came from

        return (
          <tr
            className="iedit author-other level-0 type-post status-draft format-standard has-post-thumbnail hentry category-all-reads tag-article-208 tag-cauvery-basin tag-cauvery-dispute tag-cauvery-water-disputes-tribunal tag-dipak-misra tag-houses-of-legislature tag-inter-state-river-water-disputes-act tag-karnataka tag-rules-of-procedure tag-supreme-court tag-tamil-nadu tag-uday-umesh-lalit">
              <th scope="row" className="check-column">
                  <label className="screen-reader-text">{"Select " + post.title}</label>
                  <input
                    id="cb-select"
                    type="checkbox"
                    checked={this.props.checked}
                    onChange={this.checkIt.bind(this)}/>
                  <div className="locked-indicator"></div>
              </th>
              <td className="title column-title has-row-actions column-primary page-title">
                  {this.renderTitle()}
                  <Telescope.components.AppAdminPostItemAction actionEvent={this.props.actionEvent} post={post}/>
              </td>
              <td className="author column-source">
                  <a onClick={this.onDomainClick.bind(this, post.sourceFrom)}>{post.sourceFrom}</a>
              </td>
              <td className="curator column-curator">{/*curator is author*/}
                  <a onClick={this.onCuratorClick.bind(this, post.author)}>{post.author}</a>
              </td>
              <td className="categories column-categories">
                  {categories}
              </td>
              <td className="topics column-topics">
                  {topics}
              </td>
              <td className="comments column-comments">
                  <div className="post-com-count-wrapper">
                      <span >—</span>
                      <span className="screen-reader-text">No comments</span>
                      <span className="post-com-count post-com-count-pending post-com-count-no-pending">
                          <span className="comment-count comment-count-no-pending">{commentsCount}</span>
                          <span className="screen-reader-text">No comments</span>
                      </span>
                  </div>
              </td>
              <td className="date column-date">Last Modified<br/>
                  <abbr title={updatedAt}>{updatedAt}</abbr>
              </td>
          </tr>
        )
    }

}

AppAdminPostItem.contextTypes = {
    messages: React.PropTypes.object
};

AppAdminPostItem.displayName = "AppAdminPostItem";

module.exports = withRouter(AppAdminPostItem);
export default withRouter(AppAdminPostItem);
