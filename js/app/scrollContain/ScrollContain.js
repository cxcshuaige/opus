define(function(require,exports,module){
	var $ = require('$');
	var __bind = function(fn,me){
		return function(){
			return fn.apply(me,arguments);
		}
	}

//多例
	ScrollContain.instances = [];
	ScrollContain.get = function(i,opt){
		var instance = ScrollContain.instances[i];
		if(!instance) instance = ScrollContain.instances[i] = new ScrollContain(opt);
		return instance;
	}
/*
* direction:ScrollContain的方向选项
*/
	function ScrollContain(opt){
		this.p = $.extend({
			direction : 'auto',  //滚动条方向
			contain : '',		 //固定容器
			scrollContain : ''	 //超出宽内容容器
		},opt || {});
		this.horixInit = 0;
		this.win = $(window.document);
		this._readyScroll();
	}

/*
* 准备滚动条包括横向、纵向
*/
	ScrollContain.prototype._readyScroll = function(){
		var horizontalScroll = '<div class="scroll">';
			horizontalScroll +=		'<span class="J_scrollContain scrollWidth"></span>';
			horizontalScroll +=		'<a href="javascript:{}" class="J_scrollBtn scrollBtn"></a>';
			horizontalScroll +='</div>';

		if(this.p.direction === 'auto' || this.p.direction === 'x'){
			this.p.contain.append(horizontalScroll);
			this.containWidth = this.p.contain.width();  //固定容器
			this.scrollContainWidth = this.p.scrollContain.width(); //超出框容器
			this.horiScale = this.scrollContainWidth/this.containWidth;  //比例
			this.horiScrollContain = this.p.contain.find('.J_scrollContain'); //滚动框
			this.horiScrollContainWidth = this.horiScrollContain.width();
			this.horiBtn = this.p.contain.find('.J_scrollBtn');
			this._horiScrollWork();
		}else{
			//纵向滚动条扩展
		}
	}
/*
* 计算滚动按钮的大小
* scrollContainWidth ：滚动区域的宽度
* scale ：超出框与固定宽的比例
*/
	ScrollContain.prototype._calcScrollSize = function(scrollContainWidth,scale){
		var size;
		size = ~~(scrollContainWidth/scale);
		return size;
	}
/*
* 横向滚动条工作
*/
	ScrollContain.prototype._horiScrollWork = function(){
		this.horiBtn.width(this._calcScrollSize(this.horiScrollContainWidth,this.horiScale));
		this.horiBtnWidth = this.horiBtn.width();
		this.win.mousedown(__bind(this._horiBtnMousemove,this));
		this.win.mouseup(__bind(this._horiBtnMouseUp,this));
	}
/*
* 横向滚动按钮事件注册
*/
	ScrollContain.prototype._horiBtnMousemove = function(we){
		var _t = this;
		var btnOffsetLeft = this.horiBtn.offset().left,
			btnOffsetTop = this.horiBtn.offset().top;
			
		//保证鼠标在滚动按钮区域
		if((we.pageX > btnOffsetLeft && we.pageX < (btnOffsetLeft+this.horiBtn.width())) && (we.pageY >btnOffsetTop && we.pageY < (btnOffsetTop+this.horiBtn.height()))){
			var horiFixx = we.pageX;
			this.win.mousemove(__bind(this._btnMouseMove,{_t:this,horiFixx:horiFixx}))

		}
		we.preventDefault();
		return true;
		
	}
/*
* 鼠标滚动事件注册
*/
	ScrollContain.prototype._btnMouseMove = function(e){
		var _t = this._t;
		if(_t.p.direction === 'auto' || _t.p.direction === 'x'){
			_t.horix = _t.horixInit + e.pageX - this.horiFixx;
			//容错
			if(_t.horix > (_t.horiScrollContainWidth - _t.horiBtnWidth)){
				_t.horix = _t.horiScrollContainWidth - _t.horiBtnWidth;
			}
			if(_t.horix < 0) _t.horix = 0;

			_t._calcScrollBtnPos('x',_t.horix);
		}else{
			//纵向滚动条扩展
		}

		e.preventDefault();
		return true;
	}
/*
* 横向滚动按钮事件销毁
*/
	ScrollContain.prototype._horiBtnMouseUp = function(we){
		this.win.unbind('mousemove');
		this.horixInit = this.horix;  //记录上一次的位移距离
		we.preventDefault(); //取消事件的默认动作。
		return true;
	}

/*
* 计算并设置超出框的位移
*/
	ScrollContain.prototype._calcContainPos = function(direction,px){
		if(direction === 'x'){
			var left = px * this.horiScale;
			this.p.scrollContain.css({
				left:-left
			});
		}
	}

/*
* 设置滚动按钮的位移
*/
	ScrollContain.prototype._calcScrollBtnPos = function(direction,px){
		if(direction === 'x'){
			this.horiBtn.css({
				left:px
			});

			this._calcContainPos('x',px);
		}
	}

	module.exports = ScrollContain;
});