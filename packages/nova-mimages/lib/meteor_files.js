import {FilesCollection} from 'meteor/ostrio:files';

let MeteorFiles = new FilesCollection({
    debug: true,
    storagePath: '/usr/local/share/politicl',
    downloadRoute: '/Uploads',
    collectionName: 'Images',
    allowClientCode: false, // Disallow remove files from Client
    chunkSize: 1024 * 2048,
    throttle: 1024 * 512,
    permissions: 0755,
    cacheControl: 'public, max-age=31536000',
    onBeforeUpload: function (file) {
        // Allow upload files under 10MB, and only in png/jpg/jpeg formats
        if (file.size > 1024 * 1024 * 10) {
            return 'Please upload image, with size equal or less than 10MB';
        } else if (!(/png|jpg|jpeg/i.test(file.extension))) {
            return 'Please upload image, with supported format(like png,jpg,jpeg)';
        } else {
            return true;
        }
    },
});

export default MeteorFiles;