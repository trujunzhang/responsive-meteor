import Telescope from 'meteor/nova:lib';

// common

Telescope.registerComponent("App",                              require('./common/App.jsx'));
Telescope.registerComponent("AppDelay",                         require('./common/AppDelay.jsx'));
Telescope.registerComponent("Header",                           require('./common/Header.jsx'));
Telescope.registerComponent("HeaderContent",                    require('./common/HeaderContent.jsx'));
Telescope.registerComponent("HeaderContentSearchBar",           require('./common/HeaderContentSearchBar.jsx'));
Telescope.registerComponent("HeaderNavigation",                 require('./common/HeaderNavigation.jsx'));
Telescope.registerComponent("HeaderPopoverMenu",                require('./common/HeaderPopoverMenu.jsx'));
Telescope.registerComponent("Layout",                           require('./common/Layout.jsx'));
Telescope.registerComponent("AppPopup",                         require('./common/AppPopup.jsx'));
Telescope.registerComponent("Logo",                             require('./common/Logo.jsx'));
Telescope.registerComponent("Flash",                            require('./common/Flash.jsx'));
Telescope.registerComponent('HeadTags',                         require('./common/HeadTags.jsx'));
Telescope.registerComponent("FlashMessages",                    require('./common/FlashMessages.jsx'));
Telescope.registerComponent("Newsletter",                       require('./common/Newsletter.jsx'));
Telescope.registerComponent("NewsletterButton",                 require('./common/NewsletterButton.jsx'));
Telescope.registerComponent("Icon",                             require('./common/Icon.jsx'));
Telescope.registerComponent("AppLoading",                       require('./common/AppLoading.jsx'));
Telescope.registerComponent("Error404",                         require('./common/Error404.jsx'));
Telescope.registerComponent("Loading",                          require('./common/Loading.jsx'));
Telescope.registerComponent("Upvote",                           require('./common/Upvote.jsx'));
Telescope.registerComponent("Downvote",                         require('./common/Downvote.jsx'));
Telescope.registerComponent("ArticleUpvote",                    require('./common/ArticleUpvote.jsx'));
Telescope.registerComponent("ArticleDownvote",                  require('./common/ArticleDownvote.jsx'));
Telescope.registerComponent("RelatedPostUpvote",                require('./common/RelatedPostUpvote.jsx'));
Telescope.registerComponent("RelatedPostDownvote",              require('./common/RelatedPostDownvote.jsx'));


Telescope.registerComponent("AppSideBar",           require('./common/AppSideBar.jsx'));
Telescope.registerComponent("SettingsEditForm",     require('./common/SettingsEditForm.jsx'));

// posts

Telescope.registerComponent("PostsHome",            require('./posts/PostsHome.jsx'));
Telescope.registerComponent("FileIndividualFile",   require('./posts/IndividualFile.jsx'));
Telescope.registerComponent("PostsSingle",          require('./posts/PostsSingle.jsx'));
Telescope.registerComponent("PostsNewButton",       require('./posts/PostsNewButton.jsx'));
Telescope.registerComponent("PostsLoadMore",        require('./posts/PostsLoadMore.jsx'));
Telescope.registerComponent("PostsNoMore",          require('./posts/PostsNoMore.jsx'));
Telescope.registerComponent("PostsNoResults",       require('./posts/PostsNoResults.jsx'));
Telescope.registerComponent("PostsItem",            require('./posts/PostsItem.jsx'));
Telescope.registerComponent("PostsDeletedItem",     require('./posts/PostsDeletedItem.jsx'));
Telescope.registerComponent("PostsItemActions",     require('./posts/PostsItemActions.jsx'));
Telescope.registerComponent("PostsItemEditActions", require('./posts/PostsItemEditActions.jsx'));
Telescope.registerComponent("PostsLoading",         require('./posts/PostsLoading.jsx'));
Telescope.registerComponent("PostsList",            require('./posts/PostsList.jsx'));
Telescope.registerComponent("PostsCategories",      require('./posts/PostsCategories.jsx'));
Telescope.registerComponent("PostsTopics",          require('./posts/PostsTopics.jsx'));
Telescope.registerComponent("PostsCommenters",      require('./posts/PostsCommenters.jsx'));
Telescope.registerComponent("PostsPage",            require('./posts/PostsPage.jsx'));
Telescope.registerComponent("PostsAdminApproving",  require('./posts/PostsAdminApproving.jsx'));
Telescope.registerComponent("PostsStats",           require('./posts/PostsStats.jsx'));
Telescope.registerComponent("PostsThumbnail",       require('./posts/PostsThumbnail.jsx'));
Telescope.registerComponent("PostsEditForm",        require('./posts/PostsEditForm.jsx'));
Telescope.registerComponent("PostsCommentsThread",  require('./posts/PostsCommentsThread.jsx'));

Telescope.registerComponent("PostsListTitle",       require('./posts/PostsListTitle.jsx'));

Telescope.registerComponent("PostsDaily",           require('./posts/PostsDaily.jsx'));
Telescope.registerComponent("PostsDay",             require('./posts/PostsDay.jsx'));
Telescope.registerComponent("PostsPopularThisWeek", require('./posts/PostsPopularThisWeek.jsx'));

Telescope.registerComponent("MoreTagsPopoverMenu",  require('./posts/MoreTagsPopoverMenu.jsx'));
Telescope.registerComponent("SubmitFlagPopover",    require('./posts/SubmitFlagPopover.jsx'));

Telescope.registerComponent("PostsRelatedList",     require('./posts/PostsRelatedList.jsx'));
Telescope.registerComponent("PostsRelatedItem",     require('./posts/PostsRelatedItem.jsx'));

// posts single

Telescope.registerComponent("PostsSingleHeader",    require('./single/PostsSingleHeader.jsx'));
Telescope.registerComponent("PostDetail",           require('./single/PostDetail.jsx'));


// activity
Telescope.registerComponent("MessagesListPopover",  require('./activity/MessagesListPopover.jsx'));
Telescope.registerComponent("MessagesCompactList",  require('./activity/MessagesCompactList.jsx'));
Telescope.registerComponent("ActivityFeed",         require('./activity/ActivityFeed.jsx'));
Telescope.registerComponent("UserActivityList",     require('./activity/UserActivityList.jsx'));
Telescope.registerComponent("UserActivityListItem", require('./activity/UserActivityListItem.jsx'));

// comments

Telescope.registerComponent("CommentsItem",         require('./comments/CommentsItem.jsx'));
Telescope.registerComponent("CommentsItemAction",   require('./comments/CommentsItemAction.jsx'));
Telescope.registerComponent("CommentsList",         require('./comments/CommentsList.jsx'));
Telescope.registerComponent("CommentsNode",         require('./comments/CommentsNode.jsx'));
Telescope.registerComponent("CommentsNew",          require('./comments/CommentsNew.jsx'));
Telescope.registerComponent("CommentsEdit",         require('./comments/CommentsEdit.jsx'));
Telescope.registerComponent("CommentsLoadMore",     require('./comments/CommentsLoadMore.jsx'));
Telescope.registerComponent("CommentsEmpty",        require('./comments/CommentsEmpty.jsx'));

Telescope.registerComponent("CommentsNodeList",     require('./comments/CommentsNodeList.jsx'));

Telescope.registerComponent("CommentUpvote",        require('./comments/CommentUpvote.jsx'));
Telescope.registerComponent("CommentDownvote",      require('./comments/CommentDownvote.jsx'));


// permissions

Telescope.registerComponent("CanDo",                require('./permissions/CanDo.jsx'));

// users

Telescope.registerComponent("UsersSingle",                  require('./users/UsersSingle.jsx'));
Telescope.registerComponent("UsersAccount",                 require('./users/UsersAccount.jsx'));
Telescope.registerComponent("UsersEdit",                    require('./users/UsersEdit.jsx'));
Telescope.registerComponent("UsersProfile",                 require('./users/UsersProfile.jsx'));
Telescope.registerComponent("UsersProfileCheck",            require('./users/UsersProfileCheck.jsx'));
Telescope.registerComponent("UsersAvatar",                  require('./users/UsersAvatar.jsx'));
Telescope.registerComponent("UsersName",                    require('./users/UsersName.jsx'));
Telescope.registerComponent("UsersMenu",                    require('./users/UsersMenu.jsx'));
Telescope.registerComponent("UsersAccountForm",             require('./users/UsersAccountForm.jsx'));
Telescope.registerComponent("UsersFolder",                  require('./users/UsersFolder.jsx'));
Telescope.registerComponent("UsersFolderProfile",           require('./users/UsersFolderProfile.jsx'));
Telescope.registerComponent("UsersRecentCommentList",       require('./users/UsersRecentCommentList.jsx'));
Telescope.registerComponent("UsersRecentCommentItem",       require('./users/UsersRecentCommentItem.jsx'));
Telescope.registerComponent("UsersEditForm",                require('./users/UsersEditForm.jsx'));
Telescope.registerComponent("UsersBlurryImageAvatar",       require('./users/UsersBlurryImageAvatar.jsx'));
Telescope.registerComponent("UsersInvites",                 require('./users/UsersInvites.jsx'));
Telescope.registerComponent("UsersPopoverDeleteConfirm",    require('./users/UsersPopoverDeleteConfirm.jsx'));

// users profile
Telescope.registerComponent("UserVotedPostsList",                 require('./usersprofile/UserVotedPostsList.jsx'));
Telescope.registerComponent("UsersUpvote",                        require('./usersprofile/UsersUpvote.jsx'));
Telescope.registerComponent("UsersDownvote",                      require('./usersprofile/UsersDownvote.jsx'));
Telescope.registerComponent("UsersSubmittedPostsList",            require('./usersprofile/UsersSubmittedPostsList.jsx'));
Telescope.registerComponent("UsersCollectionFoldersList",         require('./usersprofile/UsersCollectionFoldersList.jsx'));
Telescope.registerComponent("FoldersList",                        require('./usersprofile/FoldersList.jsx'));
Telescope.registerComponent("FoldersItem",                        require('./usersprofile/FoldersItem.jsx'));

// just for test
Telescope.registerComponent("UsersAccountMenuBase", require('./users/UsersAccountMenuBase.jsx'));

Telescope.registerComponent("UserProfileHeader",    require('./users/UserProfileHeader.jsx'));
Telescope.registerComponent("UsersPopoverMenu",     require('./users/UsersPopoverMenu.jsx'));

// widget for Calendar
Telescope.registerComponent("WidgetCalendar",       require('./widgetscalendar/WidgetCalendar.jsx'));
Telescope.registerComponent("DayNames",             require('./widgetscalendar/DayNames.jsx'));
Telescope.registerComponent("Week",                 require('./widgetscalendar/Week.jsx'));

// widget for Topics
Telescope.registerComponent("WidgetTopics",         require('./widgettopics/WidgetTopics.jsx'));

// sidebar
Telescope.registerComponent("WidgetHeader",         require('./sidebar/WidgetHeader.jsx'));


// collections
Telescope.registerComponent("UserCollectionsPopover",   require('./collections/UserCollectionsPopover.jsx'));
Telescope.registerComponent("CollectionsList",          require('./collections/CollectionsList.jsx'));
Telescope.registerComponent("CollectionsLoading",       require('./collections/CollectionsLoading.jsx'));
Telescope.registerComponent("CollectionsResult",        require('./collections/CollectionsResult.jsx'));

Telescope.registerComponent("FolderPostsList",          require('./collections/FolderPostsList.jsx'));

Telescope.registerComponent("UserFolderProfileHeader",             require('./collections/UserFolderProfileHeader.jsx'));
Telescope.registerComponent("UserFolderProfileHeaderUserAvatar",   require('./collections/UserFolderProfileHeaderUserAvatar.jsx'));
Telescope.registerComponent("UserFolderProfileBackButtonSection",  require('./collections/UserFolderProfileBackButtonSection.jsx'));

// extensions
Telescope.registerComponent("PostDocumentContainer",    require('./extensions/PostDocumentContainer.jsx'));
Telescope.registerComponent("NewsListContainer",        require('./extensions/NewsListContainer.jsx'));
Telescope.registerComponent("RelatedListContainer",     require('./extensions/RelatedListContainer.jsx'));
Telescope.registerComponent("SatisticContainer",        require('./extensions/SatisticContainer.jsx'));
Telescope.registerComponent("AdminListContainer",       require('./extensions/AdminListContainer.jsx'));
Telescope.registerComponent("BlurryImage",              require('./extensions/BlurryImage.jsx'));
Telescope.registerComponent("AvatarBlurryImage",        require('./extensions/AvatarBlurryImage.jsx'));
Telescope.registerComponent("PaginationContainer",      require('./extensions/PaginationContainer.jsx'));
Telescope.registerComponent("MailTo",                   require('./extensions/MailTo.jsx'));



Telescope.registerComponent("TwitterTimeline",          require('./widgettwitter/TwitterTimeline.jsx'));
Telescope.registerComponent("WidgetTwitter",            require('./widgettwitter/WidgetTwitter.jsx'));
Telescope.registerComponent("WidgetMobileApps",         require('./widgetapps/WidgetMobileApps.jsx'));
Telescope.registerComponent("WidgetAppFollower",        require('./widgetapps/WidgetAppFollower.jsx'));
Telescope.registerComponent("WidgetAppFooter",          require('./widgetapps/WidgetAppFooter.jsx'));
Telescope.registerComponent("AppAbout",                 require('./widgetapps/AppAbout.jsx'));
Telescope.registerComponent("AppContact",               require('./widgetapps/AppContact.jsx'));
Telescope.registerComponent("AppCareers",               require('./widgetapps/AppCareers.jsx'));
Telescope.registerComponent("AppPrivacy",               require('./widgetapps/AppPrivacy.jsx'));
Telescope.registerComponent("AppTermsOfService",        require('./widgetapps/AppTermsOfService.jsx'));
Telescope.registerComponent("AppFooter",                require('./widgetapps/AppFooter.jsx'));


// Submit An Article
Telescope.registerComponent("SubmitAnArticle",                 require('./submitanarticle/SubmitAnArticle.jsx'));
Telescope.registerComponent("FirstTypeLink",                   require('./submitanarticle/FirstTypeLink.jsx'));
Telescope.registerComponent("SecondInfo",                      require('./submitanarticle/SecondInfo.jsx'));
Telescope.registerComponent("HintInfo",                        require('./submitanarticle/HintInfo.jsx'));
Telescope.registerComponent("ArticleCategories",               require('./submitanarticle/ArticleCategories.jsx'));
Telescope.registerComponent("ArticleFeatureImage",             require('./submitanarticle/ArticleFeatureImage.jsx'));
Telescope.registerComponent("ArticleTopics",                   require('./submitanarticle/ArticleTopics.jsx'));
Telescope.registerComponent("AuthorInfo",                      require('./submitanarticle/AuthorInfo.jsx'));


// User sigin/signup
Telescope.registerComponent("UserLoginMain",                require('./usersign/UserLoginMain.jsx'));
Telescope.registerComponent("UserEmailSignIn",              require('./usersign/UserEmailSignIn.jsx'));
Telescope.registerComponent("UserEmailSignUp",              require('./usersign/UserEmailSignUp.jsx'));
Telescope.registerComponent("UserLoginPopup",               require('./usersign/UserLoginPopup.jsx'));
Telescope.registerComponent("UserResetPassword",            require('./usersign/UserResetPassword.jsx'));
Telescope.registerComponent("UserForgetPassword",           require('./usersign/UserForgetPassword.jsx'));
Telescope.registerComponent("UsersPasswordlessVerify",      require('./usersign/UsersPasswordlessVerify.jsx'));
Telescope.registerComponent("UsersLoginPasswordless",       require('./usersign/UsersLoginPasswordless.jsx'));
Telescope.registerComponent("UsersLoginPasswordlessResult", require('./usersign/UsersLoginPasswordlessResult.jsx'));
Telescope.registerComponent("UserNameForm",                 require('./usersign/UserNameForm.jsx'));


// dashboard
Telescope.registerComponent("AppAdmin",                     require('./dashboard/AppAdmin.jsx'));
Telescope.registerComponent("AppAdminLayout",               require('./dashboard/AppAdminLayout.jsx'));
Telescope.registerComponent("AppAdminHeader",               require('./dashboard/AppAdminHeader.jsx'));
Telescope.registerComponent("AppAdminHeaderUser",           require('./dashboard/AppAdminHeaderUser.jsx'));
Telescope.registerComponent("AppAdminFooter",               require('./dashboard/AppAdminFooter.jsx'));
Telescope.registerComponent("AppAdminSidebar",              require('./dashboard/AppAdminSidebar.jsx'));
Telescope.registerComponent("AppAdminMessage",              require('./dashboard/AppAdminMessage.jsx'));
Telescope.registerComponent("AppSearchTitle",               require('./dashboard/AppSearchTitle.jsx'));

Telescope.registerComponent("AppAdminDashboard",            require('./dashboarddefault/AppAdminDashboard.jsx'));
Telescope.registerComponent("AppAdminGoogleAnalytics",      require('./dashboarddefault/AppAdminGoogleAnalytics.jsx'));


Telescope.registerComponent("AppAdminPosts",                require('./dashboardposts/AppAdminPosts.jsx'));
Telescope.registerComponent("AppAdminPostsList",            require('./dashboardposts/AppAdminPostsList.jsx'));
Telescope.registerComponent("AppAdminCategoriesSelector",   require('./dashboardposts/AppAdminCategoriesSelector.jsx'));
Telescope.registerComponent("AppAdminEditCategories",       require('./dashboardposts/AppAdminEditCategories.jsx'));
Telescope.registerComponent("AppAdminPostItem",             require('./dashboardposts/AppAdminPostItem.jsx'));
Telescope.registerComponent("AppAdminPostsTopAction",       require('./dashboardposts/AppAdminPostsTopAction.jsx'));
Telescope.registerComponent("AppAdminPostItemAction",       require('./dashboardposts/AppAdminPostItemAction.jsx'));
Telescope.registerComponent("AppAdminPostsAction",          require('./dashboardposts/AppAdminPostsAction.jsx'));
Telescope.registerComponent("AppAdminPostsEditAll",         require('./dashboardposts/AppAdminPostsEditAll.jsx'));
Telescope.registerComponent("AppAdminPostsEditSingle",      require('./dashboardposts/AppAdminPostsEditSingle.jsx'));
Telescope.registerComponent("AppAdminPostDateTime",         require('./dashboardposts/AppAdminPostDateTime.jsx'));

Telescope.registerComponent("AppAdminFlags",                require('./dashboardflags/AppAdminFlags.jsx'));
Telescope.registerComponent("AppAdminFlagsList",            require('./dashboardflags/AppAdminFlagsList.jsx'));
Telescope.registerComponent("AppAdminFlagItem",             require('./dashboardflags/AppAdminFlagItem.jsx'));
Telescope.registerComponent("AppAdminFlagsTopAction",       require('./dashboardflags/AppAdminFlagsTopAction.jsx'));
Telescope.registerComponent("AppAdminFlagItemAction",       require('./dashboardflags/AppAdminFlagItemAction.jsx'));
Telescope.registerComponent("AppAdminFlagsAction",          require('./dashboardflags/AppAdminFlagsAction.jsx'));
Telescope.registerComponent("AppAdminFlagsEditAll",         require('./dashboardflags/AppAdminFlagsEditAll.jsx'));
Telescope.registerComponent("AppAdminFlagsEditSingle",      require('./dashboardflags/AppAdminFlagsEditSingle.jsx'));


Telescope.registerComponent("AppAdminComments",                require('./dashboardcomments/AppAdminComments.jsx'));
Telescope.registerComponent("AppAdminCommentsList",            require('./dashboardcomments/AppAdminCommentsList.jsx'));
Telescope.registerComponent("AppAdminCommentsListTitle",       require('./dashboardcomments/AppAdminCommentsListTitle.jsx'));
Telescope.registerComponent("AppAdminCommentItem",             require('./dashboardcomments/AppAdminCommentItem.jsx'));
Telescope.registerComponent("AppAdminResponseCounts",          require('./dashboardcomments/AppAdminResponseCounts.jsx'));
Telescope.registerComponent("AppAdminCommentsTopAction",       require('./dashboardcomments/AppAdminCommentsTopAction.jsx'));
Telescope.registerComponent("AppAdminCommentItemAction",       require('./dashboardcomments/AppAdminCommentItemAction.jsx'));
Telescope.registerComponent("AppAdminCommentsAction",          require('./dashboardcomments/AppAdminCommentsAction.jsx'));
Telescope.registerComponent("AppAdminCommentsEditSingle",      require('./dashboardcomments/AppAdminCommentsEditSingle.jsx'));


Telescope.registerComponent("AppAdminCaches",                require('./dashboardcaches/AppAdminCaches.jsx'));
Telescope.registerComponent("AppAdminCachesList",            require('./dashboardcaches/AppAdminCachesList.jsx'));
Telescope.registerComponent("AppAdminCacheItem",             require('./dashboardcaches/AppAdminCacheItem.jsx'));
Telescope.registerComponent("AppAdminCachesTopAction",       require('./dashboardcaches/AppAdminCachesTopAction.jsx'));
Telescope.registerComponent("AppAdminCacheItemAction",       require('./dashboardcaches/AppAdminCacheItemAction.jsx'));
Telescope.registerComponent("AppAdminCachesAction",          require('./dashboardcaches/AppAdminCachesAction.jsx'));
Telescope.registerComponent("AppAdminCacheDateTime",         require('./dashboardcaches/AppAdminCacheDateTime.jsx'));


Telescope.registerComponent("AppAdminHistory",                require('./dashboardhistory/AppAdminHistory.jsx'));
Telescope.registerComponent("AppAdminHistoryList",            require('./dashboardhistory/AppAdminHistoryList.jsx'));
Telescope.registerComponent("AppAdminHistoryItem",            require('./dashboardhistory/AppAdminHistoryItem.jsx'));
Telescope.registerComponent("AppAdminHistoryTopAction",       require('./dashboardhistory/AppAdminHistoryTopAction.jsx'));
Telescope.registerComponent("AppAdminHistoryItemAction",      require('./dashboardhistory/AppAdminHistoryItemAction.jsx'));
Telescope.registerComponent("AppAdminHistoryAction",          require('./dashboardhistory/AppAdminHistoryAction.jsx'));
Telescope.registerComponent("AppAdminHistoryDateTime",        require('./dashboardhistory/AppAdminHistoryDateTime.jsx'));

Telescope.registerComponent("AppAdminScrapyd",                require('./dashboardscrapyd/AppAdminScrapyd.jsx'));
Telescope.registerComponent("AppAdminScrapydList",            require('./dashboardscrapyd/AppAdminScrapydList.jsx'));
Telescope.registerComponent("AppAdminScrapydTopAction",       require('./dashboardscrapyd/AppAdminScrapydTopAction.jsx'));


Telescope.registerComponent("AppAdminCategories",           require('./dashboardcategories/AppAdminCategories.jsx'));
Telescope.registerComponent("AppAdminCategoriesList",       require('./dashboardcategories/AppAdminCategoriesList.jsx'));
Telescope.registerComponent("AppAdminCategoryEditForm",     require('./dashboardcategories/AppAdminCategoryEditForm.jsx'));
Telescope.registerComponent("AppAdminCategoryItem",         require('./dashboardcategories/AppAdminCategoryItem.jsx'));
Telescope.registerComponent("AppAdminCategoryItemAction",   require('./dashboardcategories/AppAdminCategoryItemAction.jsx'));
Telescope.registerComponent("AppAdminCategoriesEditSingle", require('./dashboardcategories/AppAdminCategoriesEditSingle.jsx'));


Telescope.registerComponent("AppAdminTopics",               require('./dashboardtopics/AppAdminTopics.jsx'));
Telescope.registerComponent("AppAdminTopicsList",           require('./dashboardtopics/AppAdminTopicsList.jsx'));
Telescope.registerComponent("AppAdminTopicEditForm",        require('./dashboardtopics/AppAdminTopicEditForm.jsx'));
Telescope.registerComponent("AppAdminTopicItem",            require('./dashboardtopics/AppAdminTopicItem.jsx'));
Telescope.registerComponent("AppAdminTopicsTopAction",      require('./dashboardtopics/AppAdminTopicsTopAction.jsx'));
Telescope.registerComponent("AppAdminTopicsAction",         require('./dashboardtopics/AppAdminTopicsAction.jsx'));
Telescope.registerComponent("AppAdminTopicItemAction",      require('./dashboardtopics/AppAdminTopicItemAction.jsx'));
Telescope.registerComponent("AppAdminTopicsEditSingle",     require('./dashboardtopics/AppAdminTopicsEditSingle.jsx'));


Telescope.registerComponent("AppAdminUsers",                require('./dashboardusers/AppAdminUsers.jsx'));
Telescope.registerComponent("AppAdminUsersList",            require('./dashboardusers/AppAdminUsersList.jsx'));
Telescope.registerComponent("AppAdminUserItem",             require('./dashboardusers/AppAdminUserItem.jsx'));
Telescope.registerComponent("AppAdminUsersTopAction",       require('./dashboardusers/AppAdminUsersTopAction.jsx'));
Telescope.registerComponent("AppAdminUsersAction",          require('./dashboardusers/AppAdminUsersAction.jsx'));
Telescope.registerComponent("AppAdminUserItemAction",       require('./dashboardusers/AppAdminUserItemAction.jsx'));


Telescope.registerComponent("AppAdminComments",                require('./dashboardcomments/AppAdminComments.jsx'));
Telescope.registerComponent("AppAdminCommentsList",            require('./dashboardcomments/AppAdminCommentsList.jsx'));
Telescope.registerComponent("AppAdminCommentItem",             require('./dashboardcomments/AppAdminCommentItem.jsx'));
Telescope.registerComponent("AppAdminCommentsTopAction",       require('./dashboardcomments/AppAdminCommentsTopAction.jsx'));

// popover posts
Telescope.registerComponent("PopoverPosts",                 require('./popoverposts/PopoverPosts.jsx'));
Telescope.registerComponent("PopoverPostsLayout",           require('./popoverposts/PopoverPostsLayout.jsx'));

Telescope.registerComponent("NoPermissionPanel",            require('./permissions/NoPermissionPanel.jsx'));
