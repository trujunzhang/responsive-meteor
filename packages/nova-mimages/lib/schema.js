import Mimages from './collection.js';

Mimages.config = {};

Mimages.config.resizeTemp = {
    preview: {
        width: 400,
    },
    thumbnail80: {
        width: 80,
        height: 80,
        square: true,
        strip: false
    },
    thumbnail160: {
        width: 160,
        height: 160,
        square: true,
        strip: false
    },
    thumbnail240: {
        width: 240,
        height: 240,
        square: true,
        strip: false
    },
    thumbnail400: {
        width: 400,
        height: 400,
        square: true,
        strip: false
    }
};

Mimages.config.coverTemp = {
    cover: {
        width: 1070,
        height: 260,
        square: false,
        strip: true
    }
};