class AppManagement {

    getAdmin(location, currentUser) {
        // Dashboard UI(for admin)
        let {admin} = location.query;
        let isAdminUser = false;
        if (!!currentUser) {
            isAdminUser = currentUser.isAdmin
        }
        if (!isAdminUser) { // For security, if the current user is not admin.
            admin = false;
        }
        return admin;
    }

    pushAdminSidebar(router, type) {
        let newQuery = (type === "") ? {} : {type: type};

        router.push({pathname: "/management", query: newQuery});

        $('html, body').animate({scrollTop: 0}, 2);
    }

    pushCommentQuery(router, query) {
        let newQuery = _.clone(router.location.query);
        newQuery['status'] = query['status'];
        newQuery['postId'] = query['postId'];

        router.push({pathname: "/management", query: newQuery});

        $('html, body').animate({scrollTop: 0}, 2);
    }

    pushCommentFilterStatus(router, type, status) {
        let newQuery = _.clone(router.location.query);
        newQuery.type = type;
        newQuery.status = status;
        if (status === "") {
            delete newQuery.status;
        }

        router.push({pathname: "/management", query: newQuery});

        $('html, body').animate({scrollTop: 0}, 2);
    }

    pushAdminFilterStatus(router, type, status) {
        const newQuery = {type: type};
        newQuery.status = status;
        if (status === "") {
            delete newQuery.status;
        }

        router.push({pathname: "/management", query: newQuery});

        $('html, body').animate({scrollTop: 0}, 2);
    }

    pushUserStatus(router, type, status) {
        const newQuery = {type: type};
        newQuery.login = status;
        if (status === "") {
            delete newQuery.login;
        }

        router.push({pathname: "/management", query: newQuery});

        $('html, body').animate({scrollTop: 0}, 2);
    }

    appendQuery(router, type, object) {
        //http://localhost:3000/management/?type=post&posts=all

        const newQuery = _.clone(router.location.query);

        switch (type) {
            case "topic":
                newQuery.topic = object.slug;
                newQuery.topicId = object._id;
                break;
            case "category":
                newQuery.cat = object.slug;
                if (object.slug === "") {
                    delete newQuery.cat;
                }
                break;
            case "domain":
                newQuery.from = object;
                break;
            case "curator":
                newQuery.author = object;
                break;
            case "query":
                newQuery.query = object;
                if (object === "") {
                    delete newQuery.query;
                }
                break;
            case "post_status":
                newQuery.status = object;
                if (object === "") {
                    delete newQuery.status;
                }
                break;
            case "paged":
                newQuery.paged = object;
                if (object === "1" || object === 1) {
                    delete newQuery.paged;
                }
                break;
            case "date":
                newQuery.date = object;
                if (object === "0") {
                    delete newQuery.date;
                }
                break;
        }

        router.push({pathname: "/management", query: newQuery});

        $('html, body').animate({scrollTop: 0}, 2);
    }

}

export default AppManagement;
