import Telescope from 'meteor/nova:lib';
import React from 'react';
import {mount} from 'react-mounter';
import {Messages} from 'meteor/nova:core';
import {IndexRoute, Route, useRouterHistory, browserHistory, createMemoryHistory} from 'react-router';
import {ReactRouterSSR} from 'meteor/reactrouter:react-router-ssr';
import {ListContainer, DocumentContainer} from "meteor/utilities:react-list-container";
//import useNamedRoutes from 'use-named-routes';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import Events from "meteor/nova:events";
import Helmet from 'react-helmet';
import Cookie from 'react-cookie';
import ReactDOM from 'react-dom';

Telescope.routes.indexRoute = {name: "posts.list", component: Telescope.components.PostsHome};

Meteor.startup(() => {

    Telescope.routes.add([
        {name: "app.about",                      path: "about",                                              component: Telescope.components.AppAbout},
        {name: "app.contact",                    path: "contact",                                            component: Telescope.components.AppContact},
        {name: "app.careers",                    path: "careers",                                            component: Telescope.components.AppCareers},
        {name: "app.privacy",                    path: "privacy",                                            component: Telescope.components.AppPrivacy},
        {name: "app.terms.of.service",           path: "terms",                                              component: Telescope.components.AppTermsOfService},
        {name: "users.activity.feed",            path: "activity_feed",                                      component: Telescope.components.ActivityFeed},
    ]);

    Telescope.userRoutes.add([
        {name: "users.index",                    path: ":slug",                                              component: Telescope.components.UsersSingle},
        {name: "users.upvotes",                  path: ":slug/upvotes",                                      component: Telescope.components.UsersSingle},
        {name: "users.downvotes",                path: ":slug/downvotes",                                    component: Telescope.components.UsersSingle},
        {name: "users.posts",                    path: ":slug/posts",                                        component: Telescope.components.UsersSingle},
        {name: "users.collections",              path: ":slug/collections",                                  component: Telescope.components.UsersSingle},
        {name: "users.invites",                  path: ":slug/invites",                                      component: Telescope.components.UsersInvites},
        {name: "users.folders",                  path: ":slug/collections/:cid/:collectionslug",             component: Telescope.components.UsersFolder},
        {name: "users.edit",                     path: "my/edit",                                            component: Telescope.components.UsersAccount},
    ]);

    //{name: "users.account",                  path: "account",                                            component: Telescope.components.UsersAccount},
    //{name: "users.passwordless.verify",      path: "users/callback/email",                               component: Telescope.components.UsersPasswordlessVerify},

    Telescope.dashRoutes.add([
    ]);


    const AppRoutes = [
        {
            path: '/',
            component: Telescope.components.App,
            indexRoute: Telescope.routes.indexRoute,
            childRoutes: Telescope.routes.routes
        },
        {
            path: '/users',
            component: Telescope.components.App,
            childRoutes: Telescope.userRoutes.routes
        },
        {
            path: '/management',
            component: Telescope.components.AppAdmin,
            childRoutes: Telescope.dashRoutes.routes
        }
    ];

    let history;

    const clientOptions = {
        renderHook: ReactDOM.render,
        props: {
            onUpdate: () => {
                Events.analyticsRequest();
                Messages.clearSeen();
            }
        }
    };

    const serverOptions = {
        htmlHook: (html) => {
            const head = Helmet.rewind();

            return html.replace('<head>', '<head>' + head.title + head.meta + head.link + head.script);
        },
        preRender: (req, res) => {
            Cookie.plugToRequest(req, res);
        },
    };

    ReactRouterSSR.Run(AppRoutes, clientOptions, serverOptions);

    // note: we did like this at first
    // if (Meteor.isClient) {
    //   history = useNamedRoutes(useRouterHistory(createBrowserHistory))({ routes: AppRoutes });
    // }
    // if (Meteor.isServer) {
    //   history = useNamedRoutes(useRouterHistory(createMemoryHistory))({ routes: AppRoutes });
    // }
    // ReactRouterSSR.Run(AppRoutes, {historyHook: () => history}, {historyHook: () => history});

});