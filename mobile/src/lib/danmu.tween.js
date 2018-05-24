/**
 * 弹幕显示位置
 * @type {enum}
 */
var DanmuMode = {
    Top: 0,
    Center: 1,
    Bottom: 2,
    Stretch: 3
};

/**
 * 弹幕组件
 * @param {HTMLElement} container 容器
 * @param {Object} options   默认参数
 * @property {Number} range 显示区域范围
 * @property {DanmuMode} mode 显示区域
 * @property {Number} speed 默认飞行速度（s）
 * @property {Number} rowHeight 行高
 * @example
 * var danmu = new Danmu('#danmu', {
 *     range: 1,
 *     mode: DanmuMode.Top,
 *     speed: 8,
 *     rowHeight: 40
 * });
 */
var Danmu = function(container, options) {

    /**
     * 容器
     * @type {HTMLElement}
     */
    this.container = typeof container === 'string' ? document.querySelector(container) : container;

    /**
     * 显示区域范围，0-1
     * @default 2/3
     * @type {Number}
     */
    this.range = Math.max(0, Math.min(options.range || 2 / 3, 1));

    /**
     * 显示区域模式
     * @default DanmuMode.Center
     * @type {DanmuMode}
     */
    this.mode = typeof options.mode === 'undefined' ? DanmuMode.center : options.mode;

    /**
     * 飞行速度（s）
     * @default 5
     * @type {Number}
     */
    this.speed = options.speed || 5;

    /**
     * 一行高度（px），务必需要css保持一致
     * @default 30
     * @type {Number}
     */
    this.rowHeight = options.rowHeight || 30;

    /**
     * 缓存待发弹幕数据
     * @type {Array}
     */
    this.buffer = [];

    // 监听计算
    window.addEventListener("resize", this.restart.bind(this), false);
    this.restart();

};

/**
 * 获取闲置的行，默认从上往下显示弹幕
 * @return {Number} 行数，从0开始
 */
Danmu.prototype._getIdleRow = function() {
    var _self = this;
    for (var i = 0, len = this.rows; i < len; i++) {
        var $entryway = this.container.querySelectorAll('.flying[data-index="' + i + '"]');
        var $last = $entryway[$entryway.length - 1];
        if ($last) {
            // use dataset
            var width = parseInt($last.dataset.width, 10);
            var translateX = $last.getBoundingClientRect().left;
            // 数字为弹幕之间的间距 10
            if (width + translateX + 10 <= _self.width) {
                return i;
            }
        } else {
            return i;
        }
    }
    return false;
};

/**
 * 生成弹幕
 * @param  {Object} item    服务端弹幕数据
 * @param  {Object} options 弹幕参数
 * @property {Number} speed 速度
 * @property {Number} row 行数
 * @property {String} type 官方弹幕
 */
Danmu.prototype._create = function(item, options) {
    // create HTMLElement
    var row = options.row;
    var top = this.mode === DanmuMode.Stretch ? (row >= this.rows / 2 ? this.height - (this.rows - row) * this.rowHeight : row * this.rowHeight) : (this.rowHeight * row + this.top);
    var tempDom = document.createElement('div');
    tempDom.innerHTML = '<div id="danmu_' + (item.id || Math.random()) + '" class="flying' + '" data-index=' + row + ' style="top:' + top + 'px; left:' + this.width + 'px; "><div class="headPic"><img src="' + item.headimgurl + '" /></div><div class="textstr">' + item.content + '</div></div>';

    /**
     * 若需要官方弹幕则呈现不现样子
     */
    if (!!item.type && item.type == 'official') {
        tempDom.innerHTML = tempDom.innerHTML.replace('class="flying"', 'class="flying official"');
    }

    /**
     * 若有身份信息则添加身份标识符
     */
    if (!!item.userid) {
        tempDom.innerHTML = tempDom.innerHTML.replace('<div', 'class="<div data-userid=' + item.userid);
    }

    var $target = tempDom.children[0];
    this.container.appendChild($target);
    tempDom = null;

    // set dataset, offsetWidth triggers repaint.
    var width = $target.dataset.width = $target.offsetWidth;
    $target.tween = TweenLite.to($target, options.speed, {
        x: -this.width * 2,
        force3D: true,
        ease: Linear.easeNone,
        onComplete: function() {
            //dom 删除节点
            $target.remove();
            $target = null;
        }
    });
};

/**
 * 设置/移除监听出弹幕的定时器
 */
Danmu.prototype._listen = (function() {
    var ticker, handler;
    return function() {
        var len = this.buffer.length;
        if (len === 1) {
            handler = this._pick.bind(this);
            ticker = new com.greensock.Ticker(100);
            ticker.addEventListener('tick', handler);
        } else if (len === 0 && ticker && handler) {
            ticker.removeEventListener('tick', handler);
            ticker.sleep();
            ticker = null;
        }
    };
})();

/**
 * 尝试从缓冲池获取数据显示弹幕
 */
Danmu.prototype._pick = function() {
    if (!this.buffer.length) {
        return;
    }
    var row = this._getIdleRow();
    if (row !== false) {
        var args = this.buffer.shift();
        args[1].row = row;
        this._create(args[0], args[1]);
        this._listen();
    }
};

/**
 * 清空当前弹幕
 */
Danmu.prototype._empty = function() {
    Array.prototype.slice.call(this.container.querySelectorAll('.flying')).forEach(function(elem) {
        elem.tween.kill();
    });
    this.container.innerHTML = '';
};


/**
 * 丢弃缓存数据
 */
Danmu.prototype.discard = function() {
    this.buffer.splice(0, this.buffer.length);
    this._listen();
};

/**
 * 重新计算并开始
 * @param  {Boolean} discard 是否丢弃缓存数据
 */
Danmu.prototype.restart = function(discard) {
    var newWidth = this.container.offsetWidth;
    var newHeight = this.container.offsetHeight;
    // 差异化处理
    // 可旋转设备：键盘会弹起，此时宽度不会变化
    // PC：宽高变化
    var orientationDevice = typeof window.orientation === 'number';
    if ((!orientationDevice && newWidth === this.width && newHeight === this.height)) {
        return;
    }
    // 清空
    this._empty();
    if (discard) {
        this.discard();
    }
    // 重新计算
    this.width = newWidth;
    this.height = newHeight;
    this.rows = Math.floor(this.height * this.range / this.rowHeight);
    // 偶数
    if (this.mode === DanmuMode.Stretch) {
        this.rows = this.rows - this.rows % 2;
    }
    this.top = this.mode === DanmuMode.Top ? 0 : this.mode === DanmuMode.Center ? (this.height - this.rowHeight * this.rows) / 2 : this.mode === DanmuMode.Bottom ? (this.height - this.rowHeight * this.rows) : 0;
    // 重新渲染弹幕
    this._pick();
};

/**
 * 生成弹幕
 * @param  {Object} item    服务端弹幕数据
 * @param  {Object} options 弹幕参数
 * @property {Number} speed 速度
 * @property {Boolean} immediate 立即发送
 * @example
 * danmu.add({
 *     content: 'content',
 *     headimgurl: 'http://wx.qlogo.cn/mmopen/ajNVdqHZLLCgmYhEbll8Xc0nTNPy5P92u5ylsHw9WbLqsgg0MqZ2M0frXMIaVqSYibpSYhvvdPTbY9bMdTSqdhQ/0'
 * }, {
 *     immediate: true, // 立即发送
 *     speed: 10
 * })
 */
Danmu.prototype.add = function(item, options) {
    // 通过id判断当前弹幕是否已存在
    if (document.getElementById('danmu_' + item.id)) {
        return;
    }
    var options = options || {};
    options.speed = options.speed || this.speed;
    // 立即发送，默认显示中间行
    if (options.immediate) {
        options.row = this.row || Math.floor((this.rows / 2));
        this._create(item, options);
        return;
    }
    // 获取空闲行号
    var row = this._getIdleRow();
    if (row !== false) {
        options.row = row;
        this._create(item, options);
        return;
    }
    // 如果没有行合适的话，则添加缓存池
    this.buffer.push([item, options]);
    this._listen();
};

/**
 * 开启弹幕
 */
Danmu.prototype.show = function() {
    TweenLite.to(this.container, 1, {
        opacity: 1
    });
};

/**
 * 关闭弹幕
 */
Danmu.prototype.hide = function() {
    var self = this;
    TweenLite.to(this.container, 1, {
        opacity: 0,
        onComplete: function() {
            self._empty();
        }
    });
    this.discard();
};
