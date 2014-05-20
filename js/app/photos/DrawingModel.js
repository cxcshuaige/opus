define(function(require,exports,module){
	var $ = require('$');
	function DrawingModel(){
		this.modelDiv = $('<div class="draw-model" id="DrawModel"></div>');
		this.loadDiv = $('<div class="loadGif"></div>');
		this.bodyAll = $('body');
		this._create();
	}
	DrawingModel.prototype = {
		_create : function(){
			this.bodyAll.append(this.modelDiv);
			this.modelDiv.append(this.loadDiv);
		},
		
		_startPos : function(){
			var tarOffset = this.targetDom.offset(),
				tarH = Number(this.targetDom.height()),
				top;
			this.top = top = tarOffset.top + tarH/2 - 1;
			this.modelDiv.css({left:0,top:top});
			this._animateShow();
		},
		_animateShow : function(){
			var _t = this,
				_height = $(document).height();
			this.modelDiv.show(0,function(){
				_t.modelDiv.animate({
					opacity: 0.8,
					width: '100%'
				},200).animate({
					height:_height,
					top:0
				},200,function(){
					$(_t).trigger('imshowing');
				});
			})
		},

		loadedGif : function(){
			var _winheight = $(window).height(),
				_winwidth = this.wWidth,
				_winwScroll = $(window).scrollTop(),
				left = (_winwidth - this.loadDiv.width())/2,
				top = (_winheight - this.loadDiv.height())/2+_winwScroll-50;
			this.loadDiv.css({
				top:top,
				left:left,
				display:'block'
			});
			
		},

		loadedGifhide : function(){
			this.loadDiv.css('display','none');
		},

		fresh : function(targetDom){
			this.targetDom = targetDom;
			this.wWidth = $(window).width();
			this._startPos();
		},

		animateClose : function(callback){
			var _t = this,
				left = this.wWidth - 2;
			this.modelDiv.animate({
				height:'1px',
				top:this.top
			},300).animate({
				width: '1px',
				left:left,
				opacity: 0
			},200,function(){
				_t.modelDiv.hide()
				if(callback) callback();
			});
		}
	};
	module.exports = DrawingModel;
});