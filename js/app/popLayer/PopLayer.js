define(function(require,exports,module){
	var $ = require('$');
	var __bind = function(fn,me){
		return function(){
			return fn.apply(me,arguments);
		}
	}

//多例
	PopLayer.instances = [];
	PopLayer.get = function(i,eventType){
		var eventType = eventType || 'hover';
		var instance = PopLayer.instances[i];
		if(!instance) instance = PopLayer.instances[i] = new PopLayer(eventType);
		return instance;
	}
/*
* eventType:触发poplayer的事件类型
*/
	function PopLayer(eventType){
		var html = '<div class="c_popLayer">'
					+ '<span class="J_close c_popClose"></span>'
					+ '<span class="J_point c_popPoint"></span>'
					+ '<div class="J_content c_popCont"></div>'
				+ '</div>';
		this.popLayerDom = $(html);  //pop窗体
		$('body').append(this.popLayerDom);
		this.popLayerCont = this.popLayerDom.find('.J_content');
		this.popLayerPoint = this.popLayerDom.find('.J_point');
		this.popLayerClose = this.popLayerDom.find('.J_close');
		this._isIeModel();
		var _t = this;
		this.popLayerClose.click(function(){
			_t.popLayerDom.hide(50);
		});
		if(eventType == 'hover'){
			_t._popLayerHoverBind();
		}
	}
	
	PopLayer.prototype = {
		_popLayerHoverBind : function(){
			var _t = this;
			this.popLayerDom.hover(function(){
				if(_t.timeout) clearTimeout(_t.timeout);
			},__bind(this._mouseout,this));
		},

		_mouseout : function(e){
			var _t = this;
			setTimeout(function(){
				_t.popLayerHide();
			},100);
		},

        _calcLayerPosition : function(params){
            var targetPos,popLayerPos,
                popLayerWidth = this.popLayerDom.width(),
                popLayerHeight = this.popLayerDom.height(),
                popLayerPointWidth = this.popLayerPoint.width(),
                popLayerPointHeight = this.popLayerPoint.height(),
                w = $(window).height(),
                ww = $(window).width();
            targetPos = {
                width:params.targetDom.width(),
                height: params.targetDom.height(),
                offset:params.targetDom.offset()
            };
            switch(params.direct){
                case 'top':
                    popLayerPos = {
                        popLayerLeft: parseInt(targetPos.offset.left + targetPos.width/2 - popLayerWidth/2) + params.layerX,
                        popLayerTop: parseInt(targetPos.offset.top) - popLayerPointHeight - params.layerY,
                        popPointLeft:popLayerPointWidth,
                        popPointTop:popLayerHeight - 1
                    };
                    break;
                case 'bottom':
                    popLayerPos = {
                        popLayerLeft: parseInt(targetPos.offset.left + targetPos.width/2 - popLayerWidth/2) + params.layerX,
                        popLayerTop: parseInt(targetPos.offset.top + targetPos.height) + popLayerPointHeight + params.layerY,
                        popPointLeft:-popLayerPointWidth,
                        popPointTop:targetPos.height/2 - popLayerPointHeight/2
                    };
                    break;
                case 'right':
                    popLayerTop = parseInt(targetPos.offset.top + targetPos.height/2 - popLayerHeight/2) + params.layerY;
                    popLayerLeft = targetPos.offset.left + targetPos.width + popLayerPointWidth + params.layerX
                    if(popLayerTop <= 0){ //如果弹窗超出了顶部
                        popLayerTop = 10;
                    }
                    if((popLayerTop+popLayerHeight) > w){ //如果弹窗超出了底部
                        popLayerTop = targetPos.offset.top - popLayerHeight - params.layerY;
                    }
                    if((targetPos.offset.left + targetPos.width+popLayerWidth) > ww){ //如果弹窗超出了右边
                        popLayerLeft = targetPos.offset.left - popLayerWidth - params.layerX
                    }

                    popPointTop = targetPos.offset.top - popLayerTop + targetPos.height/2 - popLayerPointHeight/2;
                    popLayerPos = {
                        popLayerLeft: popLayerLeft,
                        popLayerTop: popLayerTop,
                        popPointLeft:-(popLayerPointWidth-params.pointX),
						popPointTop:popPointTop
					};
					break;
				default:
					break;
			}
			return popLayerPos;
		},
		_refreshPosition : function(){
			var popLayerPos = this._calcLayerPosition(this.p);
			this.popLayerDom.css({
				left:popLayerPos.popLayerLeft,
				top:popLayerPos.popLayerTop
			})
			this.popLayerPoint.css({
				left:popLayerPos.popPointLeft,
				top:popLayerPos.popPointTop
			})
		},
		_isIeModel : function(){	//IE 兼容 select 
			if (navigator.userAgent.indexOf("MSIE 6.0")>0 || navigator.userAgent.indexOf("MSIE 7.0")>0){  
				var _ifrm = $('<iframe class="c_modelLayerIf"></iframe>');
				this.popLayerDom.append(_ifrm);
				_ifrm.load(function(){
					$(this).contents().find('body').css('background-color','#000');
				});
			}
		},

		//对外方法
		showPop : function(params,htmlCreat,callback){
			var html='';
			this.p = $.extend({
				targetDom : window.document,    //目标dom
				closeBtn : true,				//是否有关闭按钮
				direct : 'right',				//弹窗位置  支持 上top 右right
				layerX : 0,						//弹窗偏移量x轴
				layerY : 0,						//弹窗偏移量y轴
				pointX : 4,						//箭头偏移量x轴
				pointY : 2,						//箭头偏移量y轴
				hideTime : 100
			},params || {});
			if(this.p.closeBtn) this.popLayerClose.show();  //关闭按钮开启
			if(htmlCreat) html = htmlCreat();  
			this.popLayerCont.html(html);    //创建dom结构内容
			var inImg = this.popLayerCont.find('img');
			var _t = this;
			if(inImg.size()>0){
				inImg.load(function(){
					_t.popLayerDom.show();
					_t._refreshPosition();
					if(callback) callback(_t.popLayerCont);
				});
			}else{
				this.popLayerDom.show();
				this._refreshPosition();
				if(callback) callback(this.popLayerCont);
			}
		},
		popLayerHide : function(){
			var _t = this;
			this.timeout = setTimeout(function(){
				_t.popLayerDom.css('display','none');
			},this.p.hideTime);
		}
	}
	module.exports = PopLayer;
});