Package.describe({
    name: "nova:kadira",
    summary: "Telescope Kadira package",
    version: "0.27.5-nova",
    git: "https://github.com/TelescopeJS/telescope.git"
});

Package.onUse(function (api) {

    api.versionsFrom(['METEOR@1.0']);

    api.use([
        'nova:core@0.27.5-nova',
        'meteorhacks:kadira',
    ], ['client', 'server']);

    api.addFiles([
        'lib/kadira-settings.js'
    ], ['client', 'server']);

    api.addFiles([
        'lib/server/kadira.js'
    ], ['server']);

});
