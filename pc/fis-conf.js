/*
// 取消下面的注释开启simple插件，注意需要先进行插件安装 npm install -g fis-postpackager-simple
fis.config.set('modules.postpackager', 'simple');

// 取消下面的注释设置打包规则
fis.config.set('pack', {
    '/pkg/player.js': [
        'plugin/player/js/player.js',
        'plugin/player/js/resizer.js',
        'plugin/player/js/renderplayer.js',
        'plugin/player/js/delegatePlayer.js',
        'plugin/player/js/slider.js',
        'plugin/player/js/sliderSwitch.js'
    ],
    '/pkg/require-hbs.js': [
        'vendor/handlebars/handlebars.runtime-v3.0.0.js',
        'js/utils/handlebars.helper.js',
        'vendor/require.js'
    ],
    // // 取消下面的注释设置CSS打包规则，CSS打包的同时会进行图片合并
    '/pkg/common.css': [
        'css/common.css',
        'plugin/player/css/player.css',
        'plugin/player/css/main.css'
    ]
});

// 去除多余console等debug信息
fis.config.set('settings.optimizer.uglify-js', {
    compress : {
        drop_console: true
    }
});

fis.config.merge({
    roadmap: {
        path: [
            {
                reg: '**',
                url: '/pptplayer$&'
            }
        ]
    }
});
*/