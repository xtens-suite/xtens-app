module.exports = {
    apps : [{
        name        : "xtens2",
        script      : "./app.js",
        instances  : 2,
        exec_mode  : "cluster",
        // max_restart: 10,
        // min_uptime: "20s",
        watch       :  false, //["api", "assets/js/modules", "assets/js/application", "views/templates"],
        // "ignore_watch" : ["node_modules", "bower_components", "assets", "logs", ".tmp/public", "views"],
        // "watch_options": {
        //     "followSymlinks": false
        // },
        env: {
            "NODE_ENV": "development"
        },
        env_production : {
            "NODE_ENV": "production"
        }
    }]
};
