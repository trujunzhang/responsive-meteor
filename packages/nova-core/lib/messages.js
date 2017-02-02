import React, {PropTypes, Component} from 'react';
import InnerHTML from  "./innerhtml.js"
import AppManagement from "./management.js"
import FlashCollection from "./flashcollection.js"
import PostsCollection from "./postscollection.js"

// see: http://stackoverflow.com/questions/1909441/jquery-keyup-delay
const delay = (function () {
    let timer = 0;
    return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();

const Messages = {
    postsCollection: new PostsCollection(),

    getPostsCollection(){
        return this.postsCollection.getPostsCollection();
    },

    getAllPopupPosts(){
        return this.postsCollection.getAllPosts();
    },

    pushPost(post, hash){
        this.postsCollection.pushPost(post, hash);
    },

    dismissAllPopoverPosts(){
        if (!!this.layout) {
            this.postsCollection.clearPosts();
        }
    },

    dismissLastPopoverPost(){
        this.postsCollection.popPost();
    },

    flashCollection: new FlashCollection(),

    getFlashCollection(){
        return this.flashCollection.getFlashCollection();
    },

    flash(content, type) {
        this.flashCollection.flash(content, type);
    },

    markAsSeen(messageId) {
        this.flashCollection.markAsSeen(messageId);
    },

    clear(messageId) {
        this.flashCollection.clear(messageId);
    },

    clearSeen() {
        this.flashCollection.clear();
    },

    appManagement: new AppManagement(),
    innerHTML: new InnerHTML(),

    lastAction: {},

    layout: null,

    Timer(callback, delay) {
        let timerId;
        let start;
        let remaining = delay;

        this.pause = function () {
            clearTimeout(timerId);
            remaining -= new Date() - start;
        };

        this.resume = function () {
            start = new Date();
            clearTimeout(timerId);
            timerId = setTimeout(callback, remaining);
        };

        this.clear = function () {
            clearTimeout(timerId);
        };

        this.resume();
    },

    isBrowserBackAction(posts, hash){
        if (!hash) {
            return true;
        }
        const allHash = _.pluck(posts, 'hash');
        return allHash.indexOf(hash) !== -1;
    },

    listenBrowserBackAction(app_router, location, action){
        switch (action) {
            case "POP":
                const popupPosts = this.getAllPopupPosts();
                const postsLength = popupPosts ? popupPosts.length : 0;
                if (postsLength > 0) {
                    let query = location.query;
                    const postId = query.postId;
                    const isBackAction = this.isBrowserBackAction(popupPosts, query.hash);
                    if (isBackAction) {// back
                        if (postsLength == 1) {// only one article, cleanup the collection.
                            this.dismissAllPopoverPosts();
                        } else {
                            this.dismissLastPopoverPost();
                        }
                        $("#popover-detailed-post").animate({scrollTop: 0}, 80);
                    } else if (!!postId) {// forward
                        // Dashboard UI(for admin)
                        const admin = query.admin ? query.admin : false;
                        this.pushRouterForDetailPage(app_router, {_id: query.postId, slug: query.title}, admin, query.hash);
                    }
                }
                break;
        }
    },

    listenBeforeBrowserBackAction(app_router, location, action){
        switch (action) {
            case "POP":
                const postId = location.query.postId;
                if (!this.isShowPopoverPosts() && !!postId) {
                    this.dismissAllPopoverPosts();
                }
                break;
        }
    },

    isShowPopoverPosts(){
        if (!!this.layout) {
            return this.postsCollection.havePopupPosts();
        }
        return false;
    },

    registerLayout(layout){
        this.layout = layout;
    },

    showLoginUI(title = '', subtitle = '', showCloseIcon = true){

        const object = {showCloseIcon: showCloseIcon, title: title, subtitle: subtitle};
        this.layout.setState({
            popoverMenu: {
                top: 0,
                left: 0,
                width: 0,
                height: 0,
                type: 'LoginUI',
                object: object
            }
        });
    },

    needCheckClickEvent(){
        if (!!this.layout && this.layout.state.popoverMenu) {
            const type = this.layout.state.popoverMenu.type;
            if (type == 'LoginUI' || type == 'UserDeleteConfirm') {
                return false;
            }
        }

        return true;
    },

    showPopoverMenu(type, object, top = 0, left = 0, width = 0, height = 0){
        if (this.layout.popoverMenu) {
            this.dismissPopoverMenu();
        } else {
            this.layout.setState({
                popoverMenu: {
                    top: top,
                    left: left,
                    width: width,
                    height: height,
                    type: type,
                    object: object
                }
            });
        }
    },

    dismissPopoverMenu(){
        if (this.layout.state.popoverMenu) {
            this.layout.setState({popoverMenu: null});
        }
    },

    /**
     * A: Category pages don’t have day wise groups
     *    Remove calendar from Category pages or give category pages day wise gro
     *    On category page. If i use the calendar option it takes me back to the homepage
     *    Either the calendar option should be removed from the category page or day wise groups made on category pages also
     *    you want to add this url :http://scruby.site/?after=2016-09-26&before=2016-09-26&cat=politics?
     * B: filter posts by categories and date?
     * A: Yes,So day wise groups for category and tag pages.
     *
     * Note: So day wise groups for category and tag pages.
     *       Make day wise groups on category pages, remove calendar widget from tag and source pages.
     *       So calendar will only show on “Homepage” and “Category” page
     *       Homepage and category pages will have day wise groups
     *
     * @param router
     * @param obj
     * @param showPopoverPosts
     * @param needDelay
     * @param delay
     */
    pushRouter(router, obj, showPopoverPosts = false, needDelay = false, delay = 1000){
        const query = _.clone(router.location.query);
        router.push(obj);

        if (needDelay) {
            this.refreshHomePage(delay);
        }

        if (showPopoverPosts) {
            $("#popover-detailed-post").animate({scrollTop: 0}, 80);
        } else {
            $('html, body').animate({scrollTop: 0}, 2);
        }
    },

    replaceNewLocationPath(router, obj){
        router.replace(obj);
        $('html, body').animate({scrollTop: 0}, 2);
    },

    pushNewLocationPathWithDelay(router, obj){
        this.pushRouter(router, obj, false, true, 300);
    },

    pushNewLocationPathWithTitle(router, obj, title){
        this.dismissAllPopoverPosts();

        obj.query['title'] = title;
        this.adjustNewQuery(router, obj.query);
        this.pushNewLocationPathWithDelay(router, obj);
    },

    pushRouterForDetailPage(router, post, admin, hash = null){
        let query = {postId: post._id, title: post.slug};
        if (admin) {
            query['admin'] = true;
        }
        if (this.lastAction.type !== "postsingle") {
            if (hash === null) {
                hash = (+new Date).toString(36);
            }
            this.pushPost(post, hash);
            query['hash'] = hash;
        }
        let pathname = router.location.pathname;
        let obj = {pathname: pathname, query: query};

        this.pushRouter(router, obj, (this.lastAction.type !== "postsingle"));
    },

    adjustNewQuery(router, newQuery){
        const query = _.clone(router.location.query);
        if (query.before && query.after) {
            newQuery["before"] = query.before;
            newQuery["after"] = query.after;
        }
    },

    adjustAdminNewQuery(router, newQuery, currentUser){
        let admin = this.appManagement.getAdmin(router.location, currentUser);
        if (!!admin) {
            newQuery["admin"] = true;
        }
        return newQuery;
    },

    delayEvent(callback, ms){
        delay(() => {
            callback();
        }, ms);
    },

    showMessage(component, message, type, clearTimeout) {
        message = message.trim();

        if (message) {
            component.setState({message: {message: message, type: type}});
            //if (clearTimeout) {
            //    Meteor.setTimeout(() => {
            //        this.setState({message: null});
            //    }, clearTimeout);
            //}
        }
    },

    // ============================================================
    // ===============  router push with delay ====================
    // ============================================================
    delayHomePage(router){
        this.pushRouter(router, {pathname: "/"}, false, true, 1000);
    },

    refreshHomePage(delay = 1000){
        const self = this;
        self.layout.setState({needRefreshHomePage: true});
        self.delayEvent(function () {
            self.layout.setState({needRefreshHomePage: false});
        }, delay);
    }

};

export default Messages;
