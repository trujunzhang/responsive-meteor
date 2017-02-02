import {Meteor} from 'meteor/meteor';

import Telescope from 'meteor/nova:lib';
import Mimages from './collection.js';
import MeteorFiles from './meteor_files.js';

let bound = Meteor.bindEnvironment(callback => callback());

Mimages.createThumbnails = function (collection, fileRef, cb) {
    // Since "fs" is part of node, you can simply do:  var fs = Meteor.require('fs');

    if (Meteor.isClient) {
        return cb()
    }

    var fs = require('fs-extra');
    let gm = require('gm').subClass({imageMagick: true});

    check(fileRef, Object);
    let isLast = false;

    let finish = error => bound(function () {
        if (error) {
            console.error("[mimage.help.createThumbnails] [finish]", error);
        } else {
            if (isLast) {
                cb && cb(fileRef);
            }
        }
        return true;
    });

    fs.exists(fileRef.path, exists => bound(function () {
          if (!exists) {
              throw Meteor.log.error(`File ${fileRef.path} not found in [createThumbnails] Method`);
          }

          let image = gm(fileRef.path);

          let sizes = Mimages.config.resizeTemp;
          if (fileRef.type === "cover") {
              sizes = Mimages.config.coverTemp;
          }

          return image.size((error, features) => bound(function () {
                if (error) {
                    throw new Meteor.Error("[mimage.help.createThumbnails] [_.each sizes]", error);
                }
                let i = 0;

                collection.collection.update(fileRef._id, {
                    $set: {
                        'meta.width': features.width,
                        'meta.height': features.height
                    }
                }, Mimages.helpers.NOOP);

                return _.each(sizes, function (size, name) {
                    let path = `${collection.storagePath(fileRef)}/${name}-${fileRef._id}.${fileRef.extension}`;

                    let copyPaste = function () {
                        fs.copy(fileRef.path, path, error => bound(function () {
                              if (error) {
                                  console.error("[mimage.help.createThumbnails] [_.each sizes] [fs.copy]", error);
                              } else {
                                  let upd =
                                    {$set: {}};
                                  upd['$set'][`versions.${name}`] = {
                                      path,
                                      size: fileRef.size,
                                      type: fileRef.type,
                                      extension: fileRef.extension,
                                      meta: {
                                          width: features.width,
                                          height: features.height
                                      }
                                  };
                                  collection.collection.update(fileRef._id, upd, function (error) {
                                      ++i;
                                      if (i === Object.keys(sizes).length) {
                                          isLast = true;
                                      }
                                      return finish(error);
                                  });
                              }
                          })
                        );
                    };

                    if (!!~['jpg', 'jpeg', 'png'].indexOf(fileRef.extension.toLowerCase())) {
                        let img = gm(fileRef.path).define('filter:support=2').define('jpeg:fancy-upsampling=false').define('jpeg:fancy-upsampling=off').define('png:compression-filter=5').define('png:compression-level=9').define('png:compression-strategy=1').define('png:exclude-chunk=all').noProfile().strip().dither(false).filter('Triangle');
                        let updateAndSave = error => bound(function () {
                            if (error) {
                                console.error("[mimage.help.createThumbnails] [_.each sizes] [img.resize]", error);
                            } else {
                                fs.stat(path, (err, stat) => bound(function () {
                                      gm(path).size((error, imgInfo) => bound(function () {
                                            if (error) {
                                                console.error("[mimage.help.createThumbnails] [_.each sizes] [img.resize] [fs.stat] [gm(path).size]", error);
                                            } else {
                                                let upd = {$set: {}};
                                                upd['$set'][`versions.${name}`] = {
                                                    path,
                                                    size: stat.size,
                                                    type: fileRef.type,
                                                    extension: fileRef.extension,
                                                    meta: {
                                                        width: imgInfo.width,
                                                        height: imgInfo.height
                                                    }
                                                };
                                                collection.collection.update(fileRef._id, upd, function (error) {
                                                    ++i;
                                                    if (i === Object.keys(sizes).length) {
                                                        isLast = true;
                                                    }
                                                    return finish(error);
                                                });
                                            }
                                        })
                                      );
                                  })
                                );
                            }
                        });

                        if (!!size.strip) {
                            /**
                             * http://stackoverflow.com
                             * Referer: http://stackoverflow.com/questions/21591536/resize-and-crop-image-and-keeping-aspect-ratio-nodejs-gm
                             * Author: {mikefrey}
                             *
                             * The '^' argument on the resize function will tell GraphicsMagick to use the height and width as a minimum instead of the default behavior, maximum.
                             * The resulting resized image will have either the width or height be your designated dimension,
                             * while the non-conforming dimension is larger than the specified size.
                             *
                             * Then gravity function tells GraphicsMagick how the following crop function should behave,
                             * which will crop the image to the final size.
                             */

                            img.resize(size.width, size.height, '^')
                              .gravity('Center')
                              .crop(size.width, size.height)
                              .write(path, updateAndSave);
                        }
                        else if (!size.square) {
                            if (features.width > size.width) {
                                img.resize(size.width).interlace('Line').write(path, updateAndSave);
                            } else {
                                copyPaste();
                            }
                        } else {
                            let x = 0;
                            let y = 0;
                            let widthRatio = features.width / size.width;
                            let heightRatio = features.height / size.width;

                            let widthNew = size.width;
                            let heightNew = size.width;

                            if (heightRatio < widthRatio) {
                                widthNew = (size.width * features.width) / features.height;
                                x = (widthNew - size.width) / 2;
                            }

                            if (heightRatio > widthRatio) {
                                heightNew = (size.width * features.height) / features.width;
                                y = (heightNew - size.width) / 2;
                            }

                            img.resize(widthNew, heightNew).crop(size.width, size.width, x, y).interlace('Line').write(path, updateAndSave);
                        }
                    } else {
                        copyPaste();
                    }
                });
            })
          );
      })
    );
    return true;
};

Mimages.getMeteorFile = function () {
    return MeteorFiles;
};

Mimages.getUrlByType = (imageId, type) => {
    let ext = '.' + 'jpg';
    let root = __meteor_runtime_config__.ROOT_URL.replace(/\/+$/, '');
    //if (process.env.NODE_ENV === "production") {
    root = "http://139.59.15.125";
    //}
    //thumbnailUrl = MeteorFiles.link(_.clone(image), type);
    const thumbnailUrl = root + ('/Uploads' + '/' + 'Images' + '/' + imageId + '/' + type + '/' + imageId + ext);
    return thumbnailUrl;
};

Mimages.getUserCoverUrl = (user) => {
    let coverId = user.telescope.coverId;
    if (!!coverId) {
        let url = Mimages.getUrlByType(coverId, 'cover');
        return url;
    }

    return '';
};

Mimages.helpers({
    NOOP() {
    },
    createThumbnails: function () {
        return Mimages.createThumbnails(this);
    },
    getMeteorFile: function () {
        return Mimages.getMeteorFile(this);
    },
    getUserCoverUrl: function () {
        return Mimages.getUserCoverUrl(this);
    },
    getUrlByType: function () {
        return Mimages.getUrlByType(this);
    }
});
