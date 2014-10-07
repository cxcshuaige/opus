/*
* 拖拽功能类
* 
*/
define(function(require, exports, module) {
	var $ = require('$');
	$.fn.InpFindData = function(options) {
		var self = this;
		var defaults = {
			parent: null,	//父节点框
			inp : null,		//单选框
			datas: null
		};
		var opts = $.extend(defaults, options);
		var ph = opts.parent.height()+10;
		this.css({'top':ph});

		opts.inp.keyup($.proxy(_keyup,this));
		opts.inp.focus(function(){
			var v = $(this).val();
			if(!v) freshData(opts.datas);
			opts.parent.css('z-index',1000);
		});
		opts.inp.blur(function(){
			setTimeout(function(){
				self.hide();
				opts.parent.css('z-index','auto');
			},300);
			return false;
		});

		function freshData(datas){
			var html = '';
			for(var i = 0;i<datas.length;i++){
				html += '<li dataId='+datas[i]._id+'>'+datas[i].name+'</li>';
			}
			self.html(html);
			self.show();
			eventBind();
		}

		function _keyup(e){
			var v = opts.inp.val();
			var keyCode = e.keyCode;
			fliterData(v,opts.datas);
			if(keyCode == 13) self.hide();
		}

		function fliterData(v,datas){
	        var temp = [];
	        for(var i = 0; i < datas.length;i++){
	            if(datas[i]['name'].indexOf(v) != -1){
	                temp.push(datas[i]);
	            }
	        }
	        freshData(temp);
		}

		function eventBind(){
			self.find('li').each(function(i,o){
				$(o).click(function(e){
					console.log($(this).text())
					opts.inp.val($(this).text())
					opts.parent.attr('dataId',$(this).attr('dataId'))
					opts.parent.attr('dataName',$(this).text());
					e.stopPropagation();
					e.preventDefault();
					return false;
				})
			})
		}
	};
})