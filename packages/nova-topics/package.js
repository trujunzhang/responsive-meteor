Package.describe({
  name: "nova:topics",
  summary: "Telescope topics package",
  version: "0.27.5-nova",
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'nova:lib@0.27.5-nova',
    'nova:settings@0.27.5-nova',
    'nova:users@0.27.5-nova'
  ]);

  api.mainModule("lib/server.js", "server");
  api.mainModule("lib/client.js", "client");

});
