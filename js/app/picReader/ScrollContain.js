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
			containWrap : '',		 //固定容器
			btn:{
                left:'',
                right:''
            },
			data:'',  //数据源 
			isBtn:true,
			callback:''
		},opt || {});
		this.index = 0;
		this.horixInit = 0;
		this.win = $(window.document);
		this.scrollContain = this.p.containWrap.find('.J_bigContain');
		this.contain = this.p.containWrap.find('.J_contain');
		if(this.p.data) this._readyDom();
		this._readyScroll();
	}

/*
 * 通过数据源准备dom
*/
	ScrollContain.prototype._readyDom = function(){
		this.scrollContain.empty();
		var len = this.p.data.length;
		_t = this;
		for(var i = 0; i<len; i++){
			this.scrollContain.append('<li index="'+i+'"><div><img src="'+this.p.data[i].timg+'"/></div></li>');
		}
		this.cellLi = this.scrollContain.find('li');
		this.cellW = this.scrollContain.find('li').eq(0).width(),
			
		this.scrollContain.width(len*this.cellW);
		this.scrollContain.on('click','li',function(){
			_t._cellClick($(this));
		})

		if(this.p.btn.left) this.p.btn.left.click(__bind(this._leftClick,this));
		if(this.p.btn.right) this.p.btn.right.click(__bind(this._rightClick,this));
	}

/*
* 左边按钮点击
*/
	ScrollContain.prototype._leftClick = function(e){
		this.index--;
		if(this.index < 0) this.index = this.p.data.length - 1;
		var dom = this.cellLi.eq(this.index);
		this._cellClick(dom);
	}

/*
* 右边按钮点击
*/
	ScrollContain.prototype._rightClick = function(e){
		this.index++;
		if(this.index >= this.p.data.length) this.index = 0;
		var dom = this.cellLi.eq(this.index);
		this._cellClick(dom);
	}

/*
* 准备滚动条包括横向、纵向
*/
	ScrollContain.prototype._readyScroll = function(){
		var horizontalScroll = '<div class="c_scroll">';
			horizontalScroll +=		'<span class="J_scrollContain c_scrollWidth"></span>';
			horizontalScroll +=		'<a href="javascript:{}" class="J_scrollBtn c_scrollBtn"><s></s></a>';
			horizontalScroll +='</div>';

		if(this.p.direction === 'auto' || this.p.direction === 'x'){
			this.p.containWrap.append(horizontalScroll);
			this.containWidth = this.contain.width();  //固定容器
			this.scrollContainWidth = this.scrollContain.width(); //超出框容器
			this.horiScale = this.scrollContainWidth/this.containWidth > 1 ? this.scrollContainWidth/this.containWidth : 1;  //比例
			this.horiScrollContain = this.p.containWrap.find('.J_scrollContain'); //滚动框
			this.horiScrollContainWidth = this.horiScrollContain.width();
			this.horiBtn = this.p.containWrap.find('.J_scrollBtn');
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
		var _t = this._t,max;
		if(_t.p.direction === 'auto' || _t.p.direction === 'x'){
			_t.horix = _t.horixInit + e.pageX - this.horiFixx;
			max = _t.horiScrollContainWidth - _t.horiBtnWidth
			//容错
			if(_t.horix > max){
				_t.horix = max;
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
* 单元单机事件注册
*/
	ScrollContain.prototype._cellClick = function(o){
		if(o.hasClass('cur')) return;
		this._comCellClick(o);
		if(this.p.callback) this.p.callback(this);
	}

/*
* 单元单机事件注册
*/
	ScrollContain.prototype._comCellClick = function(o){
		this.cellLi.removeClass('cur');
		o.addClass('cur');
		this.index = o.attr('index');
		var px = this.cellW * this.index/this.horiScale,
			max = this.horiScrollContainWidth - this.horiBtnWidth;
		px > max ? px = max : null;
		px < 0 ? px = 0 : null;
		this._calcScrollBtnPos('x',px,true);
		this.horixInit = px;
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
	ScrollContain.prototype._calcContainPos = function(direction,px,effect){
		var _t = this;
		if(direction === 'x'){
			var left = px * this.horiScale,
				max = this.scrollContainWidth - this.horiScrollContainWidth > 0 ? this.scrollContainWidth - this.horiScrollContainWidth : this.horiScrollContainWidth - this.scrollContainWidth
			if(left >= max) left = max;
			if(effect){
				this.scrollContain.animate({
					left:-left
				},500);  //聚焦完成回调
			}else{
				this.scrollContain.css({
					left:-left
				});
			}
			
		}
	}

/*
* 设置滚动按钮的位移
*/
	ScrollContain.prototype._calcScrollBtnPos = function(direction,px,effect){
		if(direction === 'x'){
			if(effect){
				this.horiBtn.animate({
					left:px
				},500);
			}else{
				this.horiBtn.css({
					left:px
				});
			}
			this._calcContainPos('x',px,effect);
		}
	}


/*对外方法
* 单元单机事件注册
*/
	ScrollContain.prototype.cellInvoke = function(i){
		var dom = this.cellLi.eq(i);
		this._comCellClick(dom);
	}
	module.exports = ScrollContain;
});