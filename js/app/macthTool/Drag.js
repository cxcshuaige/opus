/*
* 拖拽功能类
* 
*/
define(function(require, exports, module) {
	var $ = require('$');
	function Drag(){
		this.win = $(window.document);
		this.win.keydown($.proxy(this._keyDown,this));
		this.win.keyup($.proxy(this._keyUp,this));
	}

	Drag.prototype.addDrag = function(wrap,dom){
		var wh = wrap.height(),
			ww = wrap.width();
		this.maxw = ww - dom.width(),
		this.maxh = wh - dom.height();
		dom.initLeft = 0; 		//上一次距离左边值
		dom.initTop = 0;		//上一次距离上边值
		dom.mousedown($.proxy(this._mousemove,{t:this,dom:dom}));		
		dom.mouseup($.proxy(this._mouseUp, {t:this,dom:dom}));
		this.win.mouseup($.proxy(this._mouseUp, {t:this,dom:dom}));
	}

	Drag.prototype._mousemove = function(e){
		this.t.focusDom = this.dom;
		this.t.win.mousemove($.proxy(this.t._truemousemove, {
			t : this.t,
			dom: this.dom,
			left: e.pageX,
			top: e.pageY
		}));
	}

	Drag.prototype._truemousemove = function(e){
		var lt = this.dom.initLeft + e.pageX - this.left;
		var tp = this.dom.initTop + e.pageY - this.top;
		if (lt <= 0) lt = this.dom.nowposl = 0; //阻止顶到
		else if (lt >= this.t.maxw) lt = this.dom.nowposl = this.t.maxw;
		else this.dom.nowposl = lt;
		if (tp <= 0) tp = this.dom.nowpost = 0;
		else if (tp >= this.t.maxh) tp = this.dom.nowpost = this.t.maxh;
		else this.dom.nowpost = tp;

		this.t._calcThisPos(this.dom, lt, tp);
		window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty(); /*ie*/
		e.stopPropagation();
		e.preventDefault();
		return false;
	}

	Drag.prototype._calcThisPos = function(dom, l, t) {
		dom.css({
			'left': l,
			'top': t
		});
		dom.attr('dataLeft',l);
		dom.attr('dataTop',t);
	}

	Drag.prototype._mouseUp = function(e){
		this.dom.initTop = this.dom.nowpost || 0;
		this.dom.initLeft = this.dom.nowposl || 0;
		this.t.win.unbind('mousemove');
		return true;
	}

	Drag.prototype._keyUp = function(e){
		var keyCode = e.keyCode;
		if(!this.focusDom) return;
		var pos = this.focusDom.position(),
			l = pos.left,
			t = pos.top;
		switch(keyCode){
			case 37:
				l = l - 1;
				break;
			case 38:
				t = t - 1;
				break;
			case 39:
				l = l + 1;
				break;
			case 40:
				t = t + 1;
				break;
		}
		this._calcThisPos(this.focusDom,l,t);
		this.focusDom.initTop = this.focusDom.nowpost || 0;
		this.focusDom.initLeft = this.focusDom.nowposl || 0;
		return false;
	};

	Drag.prototype._keyDown = function(e){
		var keyCode = e.keyCode;
		if(keyCode == 37 || keyCode == 38 || keyCode == 39 || keyCode == 40){
			e.stopPropagation();
			e.preventDefault();
			return false;
		}
	}

	module.exports = Drag;

})