/*
* author : whyboy
* time : 2012.03.03
* name : 图片相册
*/
define(function(require, exports, module) {
	var $ = require('$');
	var model = require('./DrawingModel'),
		m = new model();
	function AlertDialog(options){
		this.p = $.extend({
			alertId : 'alert',	//弹窗ID
			callBack : function(e){}//按钮单机回调函数 一个按钮情况下返回值都为2，两个按钮情况下 确定返回值为 1，关闭返回值为2
		},options || {});
		this.started = false;
		this.ainimating = false;
		this._bindAlert();
	}
	AlertDialog.instence;
	AlertDialog.MARGIN = 10; //动画后边框margin
	AlertDialog.HEIGHT = 55; //内容增高
	AlertDialog.get = function(options){
		var instence = AlertDialog.instence;
		if (!instence){
			AlertDialog.instence = instence = new AlertDialog(options);
		}
		return instence;
	}
	AlertDialog.prototype = {
		_creatAlert : function(){
			var _t = this;
			var html = '<div id="'+this.p.alertId+'" class="c_alertLayer">';
			html +='<div class="c_alertCons">'
			html +='<div class="c_alertContent" id="'+this.p.alertId+'_cont"></div>';
			html +='<div class="c_alertContent2" id="'+this.p.alertId+'_cont2"></div>';
			html +='</div>';
			html +='<span class="c_alertClose" id="'+this.p.alertId+'_c">x</span>';
			html += '</div>';
			html +='<span class="c_btnLeft" id="'+this.p.alertId+'_btnL">左</span>';
			html +='<span class="c_btnRight" id="'+this.p.alertId+'_btnR">右</span>';
			$('body').append(html);
			this._model = $('#'+this.p.alertId);
			this.closeSpan = $('#'+this.p.alertId+'_c');
			this.btnl = $('#'+this.p.alertId+'_btnL');
			this.btnr = $('#'+this.p.alertId+'_btnR');
			this.content = $('#'+this.p.alertId+'_cont');
			this.content2 = $('#'+this.p.alertId+'_cont2');
			this.closeSpan.click(function(){
				_t.hideAlert();
			});
		},
		_bindAlert : function(){
			var _t = this;
			$(m).bind('imgload',function(e,t){
				var img = $(t);
				_t.content.html(img);
				_t.content2.html('<p class="content2-1">'+_t.param.dataObj.name+'：</p><p class="content2-2">'+_t.param.dataObj.des+'</p>');
				if(img.width() > 700){
					img.css({
						width : '700px',
						height:'auto'
					});
				}
				if(img.height() > 500){
					img.css({
						width : 'auto',
						height:'500px'
					});
				}
				_t._modelAni(img.width(),img.height());
			});
			$(m).bind('imshowing',function(e){
				m.loadedGif();
			    var img = new Image();
			    img.src = _t.param.dataObj.url;
			    if(img.complete) {
			        $(m).trigger('imgload',[img]);
			        return;
			    }
			    img.onload = function () {
			        $(m).trigger('imgload',[this]);
			        img = img.onload = img.onerror = null;
			    };
			    img.onerror = function () {
					alert('图片加载失败');
		        };
			})
		},
		_modelAni : function(w,h){
			var _winheight = $(window).height(),
				_winwidth = $(window).width(),
				_winwScroll = $(window).scrollTop(),
				_tar = this._getTargetDomValue(),
				_t = this;
				this._model.css({
					width : _tar.tarw,
					height : _tar.tarh,
					top : _tar.tart,
					left : _tar.tarl,
					opacity: 0
				});
				m.loadedGifhide();
				this._model.animate({
					opacity: 1,
					left : (_winwidth - _tar.tarw)/2,
					top : (_winheight - _tar.tarh)/2+_winwScroll-50
				},400).animate({
					width : w,
					height : h,
					left : (_winwidth - w)/2,
					top : (_winheight - h)/2+_winwScroll-50
				},300,function(){
					_t._model.css({
						height: h + AlertDialog.MARGIN * 2,
						width : w + AlertDialog.MARGIN * 2
					}).animate({
				 		height:'+='+AlertDialog.HEIGHT
					},500);
					_t.content.css({
						margin : AlertDialog.MARGIN
					});
					_t.ainimating = false;
					_t._posBtn();
				});
				// .animate({
				// 	height:'+=30px'
				// },600);
		},
		_getTargetDomValue : function(){
			return {
				tarw : this.param.targetDom.width(),
				tarh : this.param.targetDom.height(),
				tart : this.param.targetDom.offset().top,
				tarl : this.param.targetDom.offset().left
			}
		},
		_posBtn : function(){
			var _winheight = $(window).height(),
				_selfHeight = this.btnl.height(),
				_selfWidth = this.btnl.width(),
				_winwScroll = $(window).scrollTop(),
				gap = _selfWidth+100,
				top = (_winheight/2 - _selfHeight/2)+_winwScroll-50,
				_t = this,
				item;
			this.closeSpan.show();
			this.btnl.css({
				left : gap,
				top : top,
				display: 'block'
			})
			if(this.param.item == 0){
				this.btnl.addClass('notwork').hide();
			}
			this.btnl.click(function(){
				if(_t.btnl.hasClass('notwork')) return;
				_t.p.callBack(1);
			});

			this.btnr.css({
				right : gap,
				top : top,
				display: 'block'
			})
			if(this.param.item == this.param.dataLen){
				this.btnr.addClass('notwork').hide();
			}
			this.btnr.click(function(){
				if(_t.btnr.hasClass('notwork')) return;
				_t.p.callBack(2);
			})
		},
	/*-- 对外方法 --*/
		showAlert : function(param,endcall){
			//console.log('started:'+this.started)
			if(this.started) return;
			this.started = true;
			this.ainimating = true;
			this.endcall = endcall;
			this.param = param;
			// this.targetDom = param.targetDom;  目标dom
			// this.dataObj = param.dataObj;	当前目标的object
			// this.dataLen = param.len;		总数
			// this.item = param.item;			当前索引
			this._creatAlert();
			m.fresh(this.param.targetDom);
		},
		hideAlert : function(){
			if(this.ainimating) return;
			var _winheight = $(window).height(),
				_t = this;
			this._model.animate({
				opacity: 0,
				top : '+=50'
			},500,function(){
				_t._model.remove();
				_t.btnl.remove();
				_t.btnr.remove();
				m.animateClose(function(){
					_t.started = false;
					_t.endcall();
				});
			});
			// this._model.remove();
			// m.animateClose();
		},
		imgChage : function(item,data){
			this.changeImg = new Image();
		    this.changeImg.src = data.url;
		    this.param.dataObj = data;
		    var _t = this;
		    if(this.changeImg.complete) {
		    	this._resize(this.changeImg,item)
		        return;
		    }
		    this.changeImg.onload = function () {
		        _t._resize(this,item);
		    };
		    this.changeImg.onerror = function () {
				alert('图片加载失败');
	        };
		},
		_resize : function(t,item){
			var img = $(t);
			_t = this;
			this.content.html(img);
			_t.content2.html('<p class="content2-1">'+_t.param.dataObj.name+'：</p><p class="content2-2">'+_t.param.dataObj.des+'</p>');
			var rez = function(w,h){
				var _winheight = $(window).height(),
				_winwidth = $(window).width(),
				_winwScroll = $(window).scrollTop();
				_t._model.css({
					height :'auto',
					width : w + AlertDialog.MARGIN * 2,
					left : (_winwidth - w)/2,
					top : (_winheight - h)/2+_winwScroll-50
				});
				_t._reposBtn(item);
			}

			if(img.width() > 700){
				img.css({
					width : '700px',
					height:'auto'
				});
			}
			if(img.height() > 500){
				img.css({
					width : 'auto',
					height:'500px'
				});
			}
			rez(img.width(),img.height());
		},
		_reposBtn : function(item){
			this.btnl.css({
				display: 'block'
			})
			if(item == 0){
				this.btnl.addClass('notwork').hide();
			}else{
				this.btnl.removeClass('notwork');
			}

			this.btnr.css({
				display: 'block'
			})
			if(item == this.param.dataLen){
				this.btnr.addClass('notwork').hide();
			}else{
				this.btnr.removeClass('notwork');
			}
		}
	};
	module.exports = AlertDialog;
})