define(function(require){
	var $ = require('$');
	var data = require('./data');
	var dialog = require('./PhotoDialog');
	var kidding = function(){
		$('.warp').before('<div class="kid">IE6? Are you kidding me? change your browser like chrome or firefox for getting perfect experience please!</div>')
	}
	$(function($){
		var canvas = $('#canvas'),
			flag = false,
			len = data.length,
			imgItem = 5;

		for(var i=0;i<len;i++){
			canvas.append('<div data-index="'+i+'" class="pic" style="top:'+data[i].top+'px;left:'+data[i].left+'px;width:'+data[i].width+'px;height:'+data[i].height+'px;z-index:'+data[i].zindex+';background-position:'+data[i].bgpx+'px '+data[i].bgpy+'px;"></div>');
		}
		
		var clickfun = function (e,data,len){
			if(e==1){
				if(imgItem > 0)
					imgItem--;
					dialog.get().imgChage(imgItem,data[imgItem]);
			}else{
				if(imgItem < (len - 1))
					imgItem++;
					dialog.get().imgChage(imgItem,data[imgItem]);
			}
		}

		$('.pic').each(function(i){
			$(this).hover(function(){
				$(this).addClass('hover');
			},function(){
				$(this).removeClass('hover');
			});
		});

		canvas.delegate("div", "click", function(){
			if(flag) return;
			var t = $(this),n=$(this).attr('data-index');
			imgItem = n;
			flag = true;
	 		dialog.get({
				alertId : 'alert',	
				margin : 10,  //动画后边框margin
				callBack : function(e){
					clickfun(e,data,len);
				}
			}).showAlert({
					targetDom : $(this),
					dataObj : data[n],
					item : n,
					dataLen : len - 1
				},function(){
					flag = false;
				});
	 	});

	 	if($.browser.msie){
	 		if($.browser.msie.version == 6){
	 			kidding('IE6');
	 			$('#DrawModel').click(function(e){
					e.stopPropagation();
					dialog.get().hideAlert();
				});
	 		}
	 		if($.browser.msie.version == 7){
	 			kidding('IE7');
	 		}
	 		if($.browser.msie.version == 8){
	 			kidding('IE8');
	 		}
	 	}
	});
	
});