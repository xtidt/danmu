var requirejs = {
    baseUrl: './assets/js',
    paths: {
        'jquery': './jquery-1.11.1.min',
        'jquery.easing':'./jquery.easing.min',
        'jquery.danmu':'./jquery.danmu'
    },
    shim: {
        'jquery': {
            deps: [],
            exports: '$'
        },
        'jquery.easing': {
            deps: ['jquery'],
            exports: '$'
        },
        'jquery.danmu': {
            deps: ['jquery'],
            exports: '$'
        }
    },
    waitSeconds: 0
};
