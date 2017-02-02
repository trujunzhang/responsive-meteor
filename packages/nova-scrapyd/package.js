Package.describe({
    name: "nova:scrapyd",
    summary: "Telescope Scrapyd module package",
    version: "0.27.5-nova",
    git: 'https://github.com/TelescopeJS/telescope-embedly.git'
});

Package.onUse(function (api) {

    api.versionsFrom("METEOR@1.0");

    api.use([
        'nova:core@0.27.5-nova',
        'nova:users@0.27.5-nova',
    ]);

    api.addFiles([
        'lib/methods.js',
    ], ['client', 'server']);

    api.addFiles([
        'lib/server/get_scrapyd_data.js'
    ], ['server']);

});
