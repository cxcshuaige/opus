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
			auto:true,	//是否自动播放
			indicate:true  //是否展示指示灯
		},params || {});
		this.effecting = false;
		this._slideContainer = this.p.slideContainerWrap.find('.J_slide');
		this._cell = this._slideContainer.find('.J_cell');
		this._index = 0;
		this._init();
	}

//初始化
	slidePic.prototype._init = function(){
		this._domReady();
		this._bindEvent();
	}

//相关dom准备
	slidePic.prototype._domReady = function(){
		var first = this._cell.eq(0).clone(),
			second = this._cell.eq(1).clone();

		this._slideContainer.append(first).append(second);
		this._cell = this._slideContainer.find('.J_cell');  //再次获取节点集
		this._cellWidth = first.width();

		var slideContainerWidth = this._cellWidth * this._cell.length;
		this._posFix = -this._cellWidth * (this._cell.length-2);  //当前移动的值

		this._slideContainer.css('width',slideContainerWidth);  //设置容器的总宽
		this._slideContainer.css('left',this._posFix);  //设置容器的位移

		//按钮准备
		var btnHtml = '<span class="J_slideLeftBtn '+this.p.handle.leftClass+'">左</span><span class="J_slideRightBtn '+this.p.handle.rightClass+'">右</span>';
		this.p.slideContainerWrap.append(btnHtml);
		this._leftBtn = this.p.slideContainerWrap.find('.J_slideLeftBtn');
		this._rightBtn = this.p.slideContainerWrap.find('.J_slideRightBtn');

		if(this.p.indicate == true){
			var indicateHtml = '<ul class="c_indicate">';
				for(var i=0; i<this._cell.length-2; i++){
					indicateHtml += '<li>'+i+'</li>';
				}
				indicateHtml += '</ul>';
			this._indicateHtml = $(indicateHtml);
			this.p.slideContainerWrap.append(this._indicateHtml);
			this._indicateCell = this._indicateHtml.find('li');
			this._indicateCell.eq(0).addClass('cur');
		}

	} 

//相关事件注册	
	slidePic.prototype._bindEvent = function(){
		this._leftBtn.click(__bind(this._leftBtnClick,this));
		this._rightBtn.click(__bind(this._rightBtnClick,this));
		if(this.p.auto == true){
			this._autoPlayInterVal();
			this._slideContainer.hover(__bind(this._autoPlayClear,this),__bind(this._autoPlayInterVal,this));
			this._leftBtn.hover(__bind(this._autoPlayClear,this),__bind(this._autoPlayInterVal,this));
			this._rightBtn.hover(__bind(this._autoPlayClear,this),__bind(this._autoPlayInterVal,this));
			this._indicateHtml.hover(__bind(this._autoPlayClear,this),__bind(this._autoPlayInterVal,this));
		
		}
		if(this.p.indicate == true){
			this._indicateCell.each(__bind(this._indicateClick,this));
		}
	}

//清除自动播放
	slidePic.prototype._autoPlayClear = function(){
		clearTimeout(this.interval);
	}

//自动播放
	slidePic.prototype._autoPlayInterVal = function(){
		this.interval = setTimeout(__bind(this._autoPlay,this),2000);
	}

//左按钮单击
	slidePic.prototype._leftBtnClick = function(){
		if(this.effecting) return;
		this._autoPlayClear(); //暂时清除
		this.effecting = true;
		var px = this._posFix + this._cellWidth;
		var index = this._getIndex('right');
		this._posFix = px;
		this._effectMove(px);
		this._indicateMove(index);

	}

//右按钮单击
	slidePic.prototype._rightBtnClick = function(){
		if(this.effecting) return;
		this._autoPlayClear(); //暂时清除
		this.effecting = true;
		var px = this._posFix - this._cellWidth;
		var index = this._getIndex('left');
		this._posFix = px;
		this._effectMove(px);
		this._indicateMove(index);
	}

//自动播放功能
	slidePic.prototype._autoPlay = function(){
		var px = this._posFix - this._cellWidth;
		var index = this._getIndex('left');
		this._posFix = px;
		this._autoPlayClear(); //暂时清除
		this._effectMove(px,'auto');
		this._indicateMove(index);
	}

//移动
	slidePic.prototype._effectMove = function(px,str){
		var str = str || '',
			type = type || '';
		this._slideContainer.animate({left:px},"normal",__bind(this._afterEffectMove,{_t:this,auto:str}))
	}

//指示灯移动
	slidePic.prototype._indicateMove = function(i){
		this._indicateCell.removeClass('cur');
		this._indicateCell.eq(i).addClass('cur');
	}

//指示灯单击
	slidePic.prototype._indicateClick = function(i,o){
		var _t = this;
		$(o).click(function(){
			var px = -(_t._cellWidth * i);
			_t._posFix = px;
			_t._effectMove(px);
			_t._indicateMove(i);
			_t._index = i;
		});
	}

//得到当前所在的索引
	slidePic.prototype._getIndex = function(type){
		var index;
			switch(type){
				case 'left':
					index = this._index += 1;
					if(this._index > (this._cell.length-3)){
						index = this._index = 0;
					}
					break;
				case 'right':
					index = this._index -= 1;
					if(this._index < 0){
						index = this._index = this._cell.length-3;
					}
					break;
				default:
					break;
			}
		return index;
	}

//移动动画后重置相关参数和容器位置
	slidePic.prototype._afterEffectMove = function(){
		if(this._t._posFix <= -this._t._cellWidth * (this._t._cell.length-1)){  //位移到了最后一个单元
			this._t._posFix = -this._t._cellWidth;
		}
		if(this._t._posFix === 0){  //位移到了第一个单元
			this._t._posFix = -this._t._cellWidth * (this._t._cell.length-2); 
		}
		this._t._slideContainer.css('left',this._t._posFix);
		if(this.auto) this._t._autoPlayInterVal();
		this._t.effecting = false;
	}

	module.exports = slidePic;

});