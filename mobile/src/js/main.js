/**
 * 初始化弹幕
 * */
ykdanmu = new Danmu('.subdanmuMask', {
    range: 2 / 3,
    mode: DanmuMode.Center,
    speed: 15,
    rowHeight: 46
});

var imgUrl = 'https://sheerdevelopment.com/assets/panda-825565640a258e43530d1ec803102cfc19da8daf4d966ef620ac6fc7569611fd.png';

function add(env ='local') {
    const timestamp = new Date().getTime();

    const data = {
        id: timestamp,
        content: timestamp,
        headimgurl: imgUrl,
        type: ''
    };

    console.log(data);

    ykdanmu.add(data, {
        immediate: env == 'local' ? true : false,
        speed: 10
    });
}


function officialadd(env ='local') {
    const timestamp = new Date().getTime();

    const data = {
        id: timestamp,
        content: timestamp,
        headimgurl: imgUrl,
        type: 'official' //official
    };

    console.log(data);

    ykdanmu.add(data, {
        immediate: 'local' ? true : false,
        speed: 10
    });
}

function publishAdd(){
    add('');
}

