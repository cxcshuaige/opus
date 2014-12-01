/*
 * tab切换组件
 * @author:xizi
 * @params:
	 * @handlers 		聚焦控制者
	 * @targetsDom 		聚焦控制者所控制的单位区域
	 * @focusClass 		聚焦控制者聚焦时所添加的样式名
	 * @type 			聚焦表现形式 click--单机  hover--移动
 * @callback: 回调函数，自带参数 function(t){console.log(t)} 查看参数信息
 */
define(function(require,exports,module){
	var $ = require('$');
	var __bind = function(fn,me){
		return function(){
			return fn.apply(me,arguments);
		}
	}
	
	function SwitchOver(params,callback){
		this.p = $.extend({
			handlers : '',
			targetsDom : '',
			focusClass : 'cur',
			type : 'click',
			focusIndex:0
		},params || {});
		this.callback = callback || '';
		this._init();
	}

	//初始化
	SwitchOver.prototype._init = function(){
		this._eachFocus.apply({_t:this,i:this.p.focusIndex,o:this.p.handlers.eq(this.p.focusIndex)});  //初始化第一个聚焦
		this.p.handlers.each(__bind(this._eachHandler,this));
	}

	//循环每一个聚焦控制者
	SwitchOver.prototype._eachHandler = function(i,o){
		var o = jQuery(o);
		if(this.p.type === 'hover')	o.hover(__bind(this._eachOn,{_t:this,i:i,o:o}),__bind(this._eachOut,this));
		else o.click(__bind(this._eachFocus,{_t:this,i:i,o:o}));
	}

	//聚焦事件
	SwitchOver.prototype._eachFocus = function(){
		var _p = this._t.p;
		if(this.o.hasClass(_p.focusClass)) return;
		_p.handlers.removeClass(_p.focusClass);
		this.o.addClass(_p.focusClass);
		_p.targetsDom.css('display','none');
		_p.targetsDom.eq(this.i).fadeIn(400);
		if(typeof this._t.callback === 'function') this._t.callback(this);
	}

	//hover事件
	SwitchOver.prototype._eachOn = function(){
		var _eachOn = function(){
			this._t._eachFocus.apply({_t:this._t,i:this.i,o:this.o});
		}
		this._t.outTime = setTimeout(__bind(_eachOn,this),200);
	}

	SwitchOver.prototype._eachOut = function(){
		clearTimeout(this.outTime);
	}

	module.exports = SwitchOver;
});