Package.describe({
    name: "public",
    summary: "Nova public resource package",
    version: "0.27.5-nova",
    git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function (api) {

    api.versionsFrom(['METEOR@1.0']);

    api.use([
        'nova:core@0.27.5-nova',
    ]);

    api.addAssets([
        'images/loader@2x-eedc15ac0cc66f017bf00a8befd9c708.png',
        'images/upvote-burst-white.png',
        'images/downvote-burst-white.png',
        'images/favicon.png',
        'images/loading.png',
        'images/mob-app.jpg',
        'images/headline-background.png',
        'images/politicl-logo.png',
        'images/politicl-logo-white.png',
        'images/comments.png',
        'images/dailyo.jpg',
        'images/deccan-chronicle.jpg',
        'images/dna.jpg',
        'images/firstpost.jpg',
        'images/forbes.jpg',
        'images/frontline.jpg',
        'images/hindustan-times.jpg',
        'images/india-today.jpg',
        'images/livemint.jpg',
        'images/ndtv.jpg',
        'images/news18.jpg',
        'images/outlook.jpg',
        'images/rediff-com.jpg',
        'images/reuters.jpg',
        'images/scroll-in.jpg',
        'images/the-conversation.jpg',
        'images/the-economic-times.jpg',
        'images/the-economist.jpg',
        'images/the-financial-express.jpg',
        'images/the-hindu-businessline.jpg',
        'images/the-hindu.jpg',
        'images/the-huffington-post-india.jpg',
        'images/the-indian-economist.jpg',
        'images/the-indian-express.jpg',
        'images/the-pioneer.jpg',
        'images/the-times-of-india.jpg',
        'images/the-tribune.jpg',
        'images/the-viewspaper.jpg',
        'images/the-wire.jpg',
        'images/thenewindianexpress.jpg',
        'images/thetelegraph.jpg'
    ], ['client']);

});
