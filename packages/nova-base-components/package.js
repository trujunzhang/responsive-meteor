Package.describe({
    name: "nova:base-components",
    summary: "Telescope components package",
    version: "0.27.5-nova",
    git: "https://github.com/TelescopeJS/telescope.git"
});

Package.onUse(function (api) {

    api.versionsFrom(['METEOR@1.0']);

    api.use([
        // Nova packages
        'nova:core@0.27.5-nova',
        'nova:posts@0.27.5-nova',
        'nova:users@0.27.5-nova',
        'nova:comments@0.27.5-nova',
        'nova:folders@0.27.5-nova',
        'nova:flags@0.27.5-nova',
        'nova:topics@0.27.5-nova',
        'nova:messages@0.27.5-nova',
        'nova:mimages@0.27.5-nova',
        'nova:politicl-caches@0.27.5-nova',
        'nova:politicl-history@0.27.5-nova',

        // third-party packages
        'fortawesome:fontawesome@4.6.3',
        'tmeasday:check-npm-versions@0.3.1',
        'std:accounts-ui@1.2.6',
        'utilities:react-list-container@0.1.10',
        'meteorhacks:subs-manager@1.6.4',
    ]);

    api.mainModule("lib/server.js", "server");
    api.mainModule("lib/client.js", "client");

});
