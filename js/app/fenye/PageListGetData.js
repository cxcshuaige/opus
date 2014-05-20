define(function(require,exports,module){
	var $ = require('$');
	/*
	*author  : 希子
	*explain : 内容创建公共类，所有数据展示创建由该类完成，所有方法对外开放
	*/
	function PageListGetData(){}
	PageListGetData.instance;
	PageListGetData.get = function(){
		var instance = PageListGetData.instance;
		if (!instance) PageListGetData.instance = instance = new PageListGetData();
		return instance;
	}

	PageListGetData.prototype = {
		listSetListPage : function(pageItem,i){
			var	isClick,
				myClass;
			if(pageItem == i){
				isClick = 'true';
				myClass ='J_listPage cur';
			}else{
				isClick = 'false';
				myClass='J_listPage';
			}
			var content ='<li><a href="javascript:{}" class="'+myClass+'" listPageItem="'+i+'" isClick="'+isClick+'">'+i+'</a></li>';
			return content;
		},
		listSetPoint : function(){
			var content = '<li class="c_line">......</li>';
			return content;
		},
		listSetPrev : function(pageItem){
			var content = '<li class="c_prev"><a href="javascript:{}" class="J_listPage" listPageItem="'+(parseInt(pageItem)-1)+'">上一页</li>';
			return content;
		},
		listSetNext : function(pageItem){
			var content = '<li class="c_next"><a href="javascript:{}" class="J_listPage" listPageItem="'+(parseInt(pageItem)+1)+'">下一页</li>';
			return content;
		},
		creatTitile : function(dataArray){
			var content = '';
			if (dataArray.length < 1) return content;
			content+='<thead><tr>';
			for (var i=0;i<dataArray.length;i++){
				content += '<th>'+ dataArray[i] +'</th>';
			}
			content+='</tr></thead>'
			return content;
		},
		pageCutUnit : function(data,creatRowObj){
			var content='';
			if (creatRowObj.isCustom == true){
				return creatRowObj.creatRowFn(data);
			}else{
				content = '<li>'+ data+'</li>'
				return content;
			}
		}
	};

	module.exports = PageListGetData;
});