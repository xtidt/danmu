require(['jquery', 'jquery.easing', 'jquery.danmu'], function($){
    //初始化全局配置
    var $container = $('#danmu');
    var Timer = null, danmuss = null;

    //页面初始化
    init();
    function init(){
        //初始化弹幕
        danmuss = $("#danmu").danmu({
            left: 0,//区域的起始位置x坐标
            top: 0,//区域的起始位置y坐标
            height: "100%",//区域的高度
            width: "100%",//区域的宽度
            zindex :100, //div的css样式zindex
            speed: 30000,//弹幕速度，飞过区域的毫秒数
//        sumtime:100 , //弹幕运行总时间
            opacity: 1,//弹幕默认透明度
            danmuss:{}, //danmuss对象，运行时的弹幕内容
            default_font_color:"#FFFFFF", //弹幕默认字体颜色
            font_size_small: 16,//小号弹幕的字体大小,注意此属性值只能是整数
            font_size_big: 24,//大号弹幕的字体大小
            top_botton_danmu_time: 6000//顶端底端弹幕持续时间
        });

        query();//查询
        BindEvent();
    }

    function timedCount() {
        $("#time").text($('#danmu').data("nowtime"));
        Timer = setTimeout(timedCount, 50);
    }
    //全局暴露 timedCount();
    window.timedCount = timedCount;

    //事件监听
    function BindEvent(){
        $('button[data-action="start"]').on('click',function(){
            if(getime() == 0){
                starter();
            }else{
                resumer();
            }

            timedCount();
        });

        $('button[data-action="pause"]').on('click',function(){
            pauser();
        });

        $('button[data-action="set"]').on('click',function(){
            settime();
        });

        $('button[data-action="send"]').on('click',function(){
            send();
        });

        $('#ishide').on('click', function(){
            if( $(this).attr('checked') =="checked" ){
                $(this).removeAttr('checked');
            }else{
                $(this).attr('checked', 'true');
            }

            changehide();
        });

        $('#op').on('change',function(){
            op();
            var value = $(this).val()/100;
            $('.flying').css({'opacity':value});
        })
    }

    //初始化评价数据
    function query() {
        var items = _data;
        for (var i = 0; i < items.length; i++) {
            var danmu_ls = items[i];
            $container.danmu("add_danmu", danmu_ls);
        }
    }

    function starter() {
        $container.danmu('danmu_start');
    }

    function pauser() {
        $container.danmu('danmu_pause');
        clearTimeout(Timer);
    }

    function resumer() {
        $container.danmu('danmu_resume');
    }

    function stoper() {
        $container.danmu('danmu_stop');
    }

    function getime() {
        return ($container.data("nowtime"));
    }

    function getpaused() {
        return ($container.data("paused"));
    }

    function add() {
        var newd = {
            "text": "new2",
            "color": "green",
            "size": "1",
            "position": "0",
            "time": 60
        };

        $container.danmu("add_danmu", newd);
    }

    //发送评论
    function send() {
        var text = document.getElementById('text').value;
        var color = document.getElementById('color').value;
        var position = document.getElementById('position').value;
        var time = $container.data("nowtime") + 5;
        var size = document.getElementById('text_size').value;
        var duration = parseInt(document.getElementById('duration').value);
        var new_obj = { "text":text,"color":color,"size":size,"position":position,"time":time,"duration":duration ,"isnew":""};
        $container.danmu("add_danmu", new_obj);
        document.getElementById('text').value = '';
    }

    function op() {
        var op = document.getElementById('op').value;
        op = op / 100;
        $container.data("opacity", op);
    }

    function changehide() {
        var op = document.getElementById('op').value;
        op = op / 100;
        if (document.getElementById("ishide").checked) {
            jQuery('#danmu').data("opacity", op);
            jQuery(".flying").css({
                "opacity": op
            });
        } else {
            jQuery('#danmu').data("opacity", 0);
            jQuery(".flying").css({
                "opacity": 0
            });
        }
    }

    function settime() {
        var t = document.getElementById("set_time").value;
        t = parseInt(t)
        if( typeof t != 'number' ||  !t){ document.getElementById("set_time").value = ''; return false}
        $container.data("nowtime", t);
    }
});