/*
* 拖拽功能类
* 
*/
define(function(require, exports, module) {
	var $ = require('$');

	function SetAttr(callback){
		this.callback = callback;
	}

	SetAttr.prototype.addSetAttr = function(dom,options){
		var self = dom;
		var defaults = {
			parent:null,
			wset:null,
			hset:null,
			delete:null,
			findData:null
		};

		var opts = $.extend(defaults, options);
		var pw = opts.parent.width();
		var ph = opts.parent.height();
		opts.wset.val(pw);
		opts.hset.val(ph);
		opts.delete.click($.proxy(removeParent,this));
		opts.wset.blur($.proxy(wset,this));
		opts.hset.blur($.proxy(hset,this));
		opts.parent.hover(function(){
			self.stop().fadeIn(100);
		},function(){
			self.stop().fadeOut(100);
		})
		function removeParent(){
			opts.parent.remove();
			this.callback();
		}
		function wset(){
			var v = Number(opts.wset.val());
			opts.parent.css({width:v});
			self.css({'left':(v+10)})
		}
		function hset(){
			var v = Number(opts.hset.val())
			opts.parent.css({height:v});
			if(opts.findData) opts.findData.css({'top':(v+10)});
		}
	}
	module.exports = SetAttr;
})