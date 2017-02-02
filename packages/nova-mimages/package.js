Package.describe({
    name: "nova:mimages",
    summary: "Telescope tags package",
    version: "0.27.5-nova",
    git: "https://github.com/TelescopeJS/telescope-tags.git"
});

Package.onUse(function (api) {

    api.versionsFrom("METEOR@1.0");

    api.use([
        'nova:core@0.27.5-nova',
        'nova:users@0.27.5-nova',

        // third-party packages
        'ostrio:files@1.7.5',
        // https://github.com/AkashaProject/meteor-fs-extra
        //'akasha:fs-extra@0.26.3'
    ]);

    api.mainModule("lib/server.js", "server");
    api.mainModule("lib/client.js", "client");

    Npm.depends({
        'fs-extra': '0.30.0',
        'request': '2.75.0',
        'throttle': '1.0.3',
        'file-type': '3.8.0'
    });
});