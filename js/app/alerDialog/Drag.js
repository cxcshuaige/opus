define(function(require,exports,module){
	var $ = require('$');
	function Drag(area,model){
		this.drArea = area;
		this.model = model;
		this.win = $(window.document);
		this.winH = this.win.height();
		this.winW = $(window).width();
		this.modelH = this.model.height();
		this.modelW = this.model.width();
		this._startDrag();
	}
	Drag.instences = [];
	Drag.get = function(i,area,model){
		var instance = Drag.instences[i];
		if (!instance){
			instance = Drag.instences[i] = new Drag(area,model);
		}
		return instance;
	}
	Drag.prototype = {
		_startDrag : function(){
			var _t = this;
			this.win.mousedown(function(e){
				var mx = _t.model.offset().left,
					my = _t.model.offset().top;
				if((e.pageX > mx && e.pageX < (mx+_t.drArea.width())) && (e.pageY > my && e.pageY < (my+_t.drArea.height()))){
					this.l = e.pageX - mx;
					this.h = e.pageY - my;
					_t._moveDrag();
				}
			});
			this.win.mouseup(function(){
				$(this).unbind('mousemove');
			});
		},
		_moveDrag : function(){
			var _t = this;
			this.win.mousemove(function(e){
				var left = e.pageX - this.l;
				var top = e.pageY - this.h;
				_t._modelPos(left,top);
			});
		},
		_modelPos : function(x,y){
			if(y>0 && y < this.winH - this.modelH && x>0 && x < this.winW - this.modelW){
				this.model.css({left:x,top:y});
			}
		}
	};
	module.exports = Drag;
});