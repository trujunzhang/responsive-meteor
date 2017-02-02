Package.describe({
    name: 'nova:users',
    summary: 'Telescope permissions.',
    version: '0.27.5-nova',
    git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function (api) {

    api.versionsFrom(['METEOR@1.0']);

    api.use([
        'nova:core@0.27.5-nova',
        'nova:email@0.27.5-nova'
    ]);

    api.use(['accounts-facebook'], ['client', 'server']);
    api.use(['accounts-twitter'], ['client', 'server']);

    //add dependency for overriding core
    api.use('oauth-encryption', 'server', {weak: true});
    api.use('oauth');
    api.use('twitter', ['client', 'server']);

    api.mainModule("lib/server.js", "server");
    api.mainModule("lib/client.js", "client");

});
