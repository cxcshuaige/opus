define(function(require,exports,module){
	var $ = require('$');
	var __bind = function(fn,me){
		return function(){
			return fn.apply(me,arguments);
		}
	}
	function slidePic(params){
		this.p = $.extend({
			slideContainerWrap : '', //总框固定大小的容器 overflow:hidden
			handle:{
				leftClass : 'c_leftBtn', //左边按钮样式
				rightClass : 'c_rightBtn' //右边按钮样式
			},
			callback:''
		},params || {});
		this.effecting = false;
		this._slideContainer = this.p.slideContainerWrap.find('.J_slide');
		this._wrapW = this.p.slideContainerWrap.width();
		this._imgAry = [];
		this._posFix = 0;
		this._init();
	}

	slidePic.prototype.imgload = function(dom,str,fun){
		if(dom.attr('flag') == 1) return;
		var _t = this;
        var imgs = dom.attr('flag','1').find('img');
        imgs.each(function(){
            var self = this;
            var $self = $(self);
            self.loaded = false;
            $self.one("appear", function() {
                if (!this.loaded) {
                    $("<img />")
                        .bind("load", function() {
                            var original = $self.attr(str);
                            $self.hide();
                            $self.attr("src", original);
                            $self.fadeIn();
                            self.loaded = true;
                            $self.removeAttr(str);
                            /* Remove image from array so it is not looped next time. */
                            var temp = $.grep(imgs, function(element) {
                                return !element.loaded;
                            });
                            setTimeout(function(){
                            	_t._imgAry.push(Number($self.width()));
                            	_t.p.slideContainerWrap.css({'height':'auto','background-image':'none'});
                            	_t._step = (_t._imgAry[0]+20)
                            },100)
                            if(fun) fun($self);
                        }).attr("src", $self.attr(str));
                }
            });
        });
        imgs.each(function() {
            $(this).trigger("appear");
        });
    }


//相关dom准备
	slidePic.prototype.destroy = function(){
		if(this._leftBtn) this._leftBtn.remove();
		if(this._rightBtn) this._rightBtn.remove();
	}

//初始化
	slidePic.prototype._init = function(){
		var _t = this;
		this._domReady();
		this._bindEvent();
	}

//相关dom准备
	slidePic.prototype._domReady = function(){
		var _t = this,len,interval;
		this.imgload(this._slideContainer,'src3')
		this._cell = this._slideContainer.find('.J_cell');  //再次获取节点集
		len = this._cell.size();
		//按钮准备
		var btnHtml = '<a href="javascript:{}" class="J_slideLeftBtn '+this.p.handle.leftClass+'">左</a><a href="javascript:{}" class="J_slideRightBtn '+this.p.handle.rightClass+'">右</a>';
		this.p.slideContainerWrap.append(btnHtml);
		this._leftBtn = this.p.slideContainerWrap.find('.J_slideLeftBtn');
		this._rightBtn = this.p.slideContainerWrap.find('.J_slideRightBtn');

		var n = 0;
		interval = setInterval(function(){
			n++;
			if(n == 1){
				_t.p.slideContainerWrap.hover(function(){
					var maxW = _t._slideContainer.width() || 20000;
					_t._rightBtn.show();
					_t._leftBtn.show();
					if(_t._posFix <= 0)	_t._leftBtn.hide();
					if(_t._posFix + _t._wrapW >= maxW) _t._rightBtn.hide();
				},function(){
					_t._leftBtn.hide()
					_t._rightBtn.hide()
				});
			}
			if(_t._imgAry.length == len){
				var _w = 0;
				_t._cell.each(function(i,o){
					if(i == 0)	_w = _w + Number($(o).width());
					else _w = _w + Number($(o).width()) + 20;
				});
				_t._slideContainer.css('width',_w);  //总是设置容器的总宽
				if(_w < _t._wrapW) _t._destroy();
				else _t._leftBtn.hide();
				_t._step = (Number(_t._cell.eq(0).width())+20);

				/*setInterval(function(){
					if(_t._imgAry.length == len){
						var _w = 0;
						_t._cell.each(function(i,o){
							if(i == 0)	_w = _w + Number($(o).width());
							else _w = _w + Number($(o).width()) + 20;
						});
						_t._slideContainer.css('width',_w);  //总是设置容器的总宽
						_t._step = (Number(_t._cell.eq(0).width())+20);
					}
				},100)*/
				if(_t.p.callback) _t.p.callback(_t)
				clearInterval(interval);
			}
			
		},100)
		
	} 

//相关事件注册	
	slidePic.prototype._bindEvent = function(){
		this._leftBtn.click(__bind(this._leftBtnClick,this));
		this._rightBtn.click(__bind(this._rightBtnClick,this));
	}


//左按钮单击
	slidePic.prototype._leftBtnClick = function(){
		if(this.effecting) return;
		this.effecting = true;

		var px = this._posFix - this._step
		if(px <= 0){
			px = 0;
			this._leftBtn.hide();
		}
		this._rightBtn.show();
		this._posFix = px;
		this._effectMove(px);
	}

//右按钮单击
	slidePic.prototype._rightBtnClick = function(){
		if(this.effecting) return;
		this.effecting = true;
		var px = this._posFix + this._step
		var maxW = this._slideContainer.width();
		if(px >= maxW - this._wrapW){
			px = maxW - this._wrapW;
			this._rightBtn.hide();
		}
		this._leftBtn.show();
		this._posFix = px;
		this._effectMove(px);
	}

//移动
	slidePic.prototype._effectMove = function(px){
		var _t = this;
		this._slideContainer.animate({'margin-left':-px},300,function(){
			_t.effecting = false;
		});
	}
	module.exports = slidePic;
});