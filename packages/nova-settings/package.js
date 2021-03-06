Package.describe({
    name: "nova:settings",
    summary: "Telescope settings package – only necessary if you're storing settings in a collection",
    version: "0.27.5-nova",
    git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function(api) {

    api.versionsFrom(['METEOR@1.0']);

    api.use([
        'nova:lib@0.27.5-nova',
        'nova:users@0.27.5-nova'
    ]);

    api.addFiles([
        'lib/collection.js',
        'lib/methods.js',
    ], ['server', 'client']);

    api.addFiles([
        'lib/init.js',
        'lib/server/publications.js',
    ], 'server');

});
