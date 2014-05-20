/*
* author : whyboy
* time : 2012.03.03
* name : 弹窗组件
*/
define(function(require, exports, module) {
	var $ = require('$');
	var ModelLayer = require('./ModelLayer');
	var Drag = require('./Drag');
	function AlertDialog(index,options){
		this.p = $.extend({
			alertId : 'alert',	//弹窗ID
			title : '系统提示',
			content : '这是一个例子',
			width : 300,	//弹窗宽度
			height: 0,	//弹窗高度
			isBtn : true,	//是否有按钮
			btnClass : ['关闭|guanbi'],  //设置按钮属性[按钮value|按钮class,..]最多支持2个按钮
			callBack : function(e){},//按钮单机回调函数 一个按钮情况下返回值都为2，两个按钮情况下 确定返回值为 1，关闭返回值为2
			model : true //是否显示背景遮罩 需要 ModelLayer 类支持
		},options || {});
		this.index = index;
		this._myBtns = [];
		this._creatAlert();
	}
	AlertDialog.instences = [];
	AlertDialog.get = function(index,options){
		var instence = AlertDialog.instences[index];
		if (!instence){
			AlertDialog.instences[index] = instence = new AlertDialog(index,options);
		}
		return instence;
	}
	AlertDialog.prototype = {
		_creatAlert : function(){
			var _t = this;
			var _code = this._creatBtn();
			var html = '<div id="'+this.p.alertId+this.index+'" class="c_alertLayer k_ovh" style="display:none;">';
			html +='<div class="c_alertCons">'
			html +='<div id="'+this.p.alertId+this.index+'_t" class="c_alertTit">'+this.p.title+'</div>';
			html +='<span id="'+this.p.alertId+this.index+'_c" class="k_spes c_alertClose">X</span>';
			html +='<div class="c_alertContent" id="'+this.p.alertId+this.index+'_cont"></div>';
			html +=_code;
			html +='</div><div class="c_bg"></div>'
			html += '</div>'
			$('body').append(html);
			this._model = $('#'+this.p.alertId+this.index);
			this.hTit = $('#'+this.p.alertId+this.index+'_t'); //为后续拖拽做准备,暂无时间制作
			this.closeSpan = $('#'+this.p.alertId+this.index+'_c');
			this.content = $('#'+this.p.alertId+this.index+'_cont');
			this.content.html(this.p.content);
			this.closeSpan.click(function(){
				_t.hideAlert();
			});
			if (_code == '') return false;
			if(this._myBtns.length ==1){
				this.closeBtn = $('#'+this._myBtns[0]) || '';
			}else if(this._myBtns.length ==2){
				this.yesBtn = $('#'+this._myBtns[0]) || '';
				this.closeBtn = $('#'+this._myBtns[1]) || '';
			}
			this._closeClick(this);
		},
		_creatBtn : function(){
			var htm = '';
			if (!this.p.isBtn){
				return htm;
			}
			htm = '<div class="alertBtnDiv">'
			for (var i=0; i<this.p.btnClass.length; i++){
				var v = this.p.btnClass[i].split('|');
				htm += '<input id="'+this.p.alertId+this.index+'_'+v[1]+'" type="button" value="'+v[0]+'" class="alertBtn '+v[1]+'"/>'
				this._myBtns.push(this.p.alertId+this.index+'_'+v[1]);
				
			}
			htm += '</div>';
			if(this._myBtns.length > 2){
				return '最多只能创建2个按钮!';
			}
			return htm;
		},
		_closeClick : function(t){
			if (this.closeBtn && this.closeBtn != ''){
				this.closeBtn.click(function(){
					t.hideAlert();
					t.p.callBack(2);
				});
			}
			if(this.yesBtn && this.yesBtn !=''){
				this.yesBtn.click(function(){
					t.hideAlert();
					t.p.callBack(1);
				});
			}
		},
	/*-- 对外方法 --*/
	/*--- showAlert可传入html内容覆盖初始化内容 ---*/
		showAlert : function(html){
			if (html) this.content.html(html);
			var _winheight = $(window).height(),
				_winwidth = $(window).width(),
				_winwScroll = $(window).scrollTop(),
				_t = this,
				_height = 0;
			if (this.p.model) ModelLayer.get().showModel();
			if(_t.p.height > 0) _height = _t.p.height;
			else _height = _t._model.height();
			_t._model.css({
				width : _t.p.width,
				height : _height,
				top : (_winheight - _height)/2+_winwScroll-50,
				left : (_winwidth - _t.p.width)/2
			}).show();
			Drag.get(this.index,this.hTit,this._model);
		},
		hideAlert : function(){
			ModelLayer.get().hideModel();
			this._model.hide();
		}
	};
	module.exports = AlertDialog;
})