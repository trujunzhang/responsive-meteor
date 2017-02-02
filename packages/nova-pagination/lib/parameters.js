import Telescope from 'meteor/nova:lib';
import escapeStringRegexp from 'escape-string-regexp';

function addAdminPaginationQueryParameter(parameters, terms) {
    //if (!!terms.paged) {
    //    const limit = options.limit;
    //    options.skip = limit * (terms.paged - 1);
    //}

    if (!!terms.paged) {
        const limit = parameters.options.limit;
        const skip = limit * terms.paged;
        parameters.options.skip = skip;
    }
    return parameters;
}
//Telescope.callbacks.add("posts.parameters", addAdminPaginationQueryParameter);

