Package.describe({
  name: "nova:pagination",
  summary: "Telescope pagination package",
  version: "0.27.5-nova",
  git: "https://github.com/TelescopeJS/telescope-pages.git"
});

Package.onUse(function (api) {

  api.versionsFrom("METEOR@1.0");

  api.use(['nova:core@0.27.5-nova']);

  api.addFiles([
    'lib/parameters.js',
  ], ['client', 'server']);

});
