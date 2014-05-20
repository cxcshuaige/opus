/*
* time : 2012.2.27 
* author : whyboy
* 参数说明
* navOne : 一级菜单dom集合
* navOneCon : 一级菜单内容
* navTwo : 二级菜单dom集合
* navTwoCon : 二级菜单内容
* navOneClass : 一级菜单 hover css
* navOneConClass ： 一级菜单内容 hover css
* navTwoClass ： 二级菜单 hover css
* navTwoConClass ：二级菜单内容 hover css
*/
define(function(require,exports,module){
	var $ = require('$');
	function TreeNavHover(TreeNavObj){
		this.params = $.extend({
			navOne : null,
			navOneCon : null,
			navTwo : null,
			navTwoCon : null,
			navOneClass : '',
			navOneConClass : '',
			navTwoClass : '',
			navTwoConClass : ''
		},TreeNavObj || {});
		this.invokeHover();
		this.jrFlag = false;
	}
	TreeNavHover.prototype = {
		invokeHover : function(){
			var fSetTimeHover,setTimeHover,setTimeO;
			var _t = this;
			this.params.navOne.each(function(index){
				$(this).hover(function(){
					fSetTimeHover = _t.oneNavInvoke(_t,$(this),index);
				},function(){
					clearTimeout(fSetTimeHover);
				});
			});
			this.params.navTwo.each(function(i){
				$(this).hover(function(){
					clearTimeout(setTimeO);
					setTimeHover = _t.twoNavInvoke(_t,$(this));
				},function(){
					clearTimeout(setTimeHover);
					setTimeO = _t.twoNavMouseout(_t);
				});
			});
		},
		oneNavInvoke : function(t,q,index){
			return setTimeout(function(){
				t.params.navOne.children().removeClass(t.params.navOneClass);
				t.params.navOneCon.removeClass(t.params.navOneConClass);
				q.children().last().addClass(t.params.navOneClass);
				t.params.navOneCon.eq(index).addClass(t.params.navOneConClass);
			},100); 
		},
		twoNavInvoke : function(t,q){
			return setTimeout(function(){
				t.params.navTwo.removeClass(t.params.navTwoClass);
				q.addClass(t.params.navTwoClass);
				t.params.navTwoCon.removeClass(t.params.navTwoConClass);
				q.children().last().addClass(t.params.navTwoConClass);
				var h = t.scrollH(q,q.children().last());
				if (h != 0){
					q.children().last().css('top',h);
				}
			},100); 
		},
		twoNavMouseout : function(t){
			return setTimeout(function(){
				t.params.navTwo.removeClass(t.params.navTwoClass);
				t.params.navTwoCon.removeClass(t.params.navTwoConClass);
			},100); 
		},
		scrollH : function(li,dom){
			var h=0;
			var ch = $(window).height();
			var lih = li.height();
			var lit = li.offset().top;
			var ht = dom.height();
			//alert(lit+','+lih+','+ch);
			if ((lit + ht) > ch){
				h = 5 + lit + ht - ch;
			}
			if ((lih+lit+20)> ch){
				h = ht - lih -20;
			}
			return -h;
		}
	};
	module.exports = TreeNavHover;
});