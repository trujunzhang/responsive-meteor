module.exports = {
    servers: {
        one: {
            //host: '139.59.11.152',
            // host: '128.199.185.13',
            host: '139.59.15.125',
            username: 'deploy',
            pem: '/Users/djzhang/.ssh/id_rsa'
            //pem: '/home/deploy/.ssh/id_rsa'
            //password: 'deploy'
            // or leave blank for authenticate from ssh-agent
        }
    },

    meteor: {
        name: 'politicl-meteor',
        path: '.',
        volumes: { // lets you add docker volumes (optional)
            "/var/politicl/images-cloud": "/usr/local/share/politicl"
        },
        servers: {
            one: {}
        },
        buildOptions: {
            serverOnly: true,
            debug: false
        },
        env: {
            ROOT_URL: 'http://politicl.com',
            MONGO_URL: 'mongodb://localhost/meteor'
        },

        dockerImage: "politicl/meteor:all",
        deployCheckWaitTime: 60
    },
    mongo: { // (optional)
        oplog: true,
        port: 27017,
        servers: {
            one: {},
        },
    },
};
