define(function(require,exports,module){
	var $ = require('$');
	var PageListGetData = require('./PageListGetData');
	/*
	*author  : 希子
	*explain : 分页组件业务逻辑类
	*/
	function PageListCut(params){
		this.p = jQuery.extend({
			pageCut : [],   //数组数据源 
			pageNum : 5,	//单页显示多少条
			targetRoom : window.document,  //数组数据源 展示dom
			targetListPageRoom : window.document,  //分页页数展示dom
			listLimit : 10,	//分页页数长度
			creatRowObj : {  //自定义数组数据源结构  最后必须 return 结构
				isCustom : false,	//是否自定义结构
				customType : { //如果自定义参数 isCustom为false,则无效
					customTypeDom : 'table', //默认集成tabel类型结构,每一行的tr由用户在类外部控制传入结构,由creatRowFn函数执行
					customTypeTabelTitile : []  //tabel标题数组,仅用于tabel结构 例如：['标题1','标题2','标题3']
				},   
				creatRowFn : function(data){}	//如果自定义参数 isCustom为false,函数无效,默认data参数为数组数据源的索引项,再次强调该函数必须return用户自定的结构
				/*例如
				var creatRowFn = function(data){
					var content = '<tr><td>'+ data+'</td></tr>';
					return content;
				}
				*/
			},
			callBack : function(){}   //分类列表完全创建完后，要执行的函数，如可监听列表内容的事件等等
		},params || {});
		this.pageCutLength = this.p.pageCut.length;
		this.modNum = parseInt(this.pageCutLength / this.p.pageNum);  //一共有多少页
		(this.pageCutLength - this.modNum*this.p.pageNum) > 0 ? this.modNum++ : null;
	//	this.pageItem = 1; 当前是在第几页
		this._listCutShow(1);
	}
	PageListCut.prototype = {
		_listCutShow : function(pageItem){
			var num,pageItem = pageItem;
			if (this.p.pageNum*pageItem > this.pageCutLength){  //如果当前是最后一页
				num = this.p.pageNum - (this.modNum*this.p.pageNum - this.pageCutLength);
				pageItem = this.modNum;
			}else{
				num = this.p.pageNum;
			}
			this._creatRow(pageItem,num);
			this._creatList(pageItem,this.modNum);
			this.p.callBack();
		},
		_creatRow : function(pageItem,num){
			var content = '';
			if (this.p.creatRowObj.isCustom == true && this.p.creatRowObj.customType.customTypeDom == 'table'){
				content+=PageListGetData.get().creatTitile(this.p.creatRowObj.customType.customTypeTabelTitile)
			}
			for(var i=0;i<num;i++){
				var j = (pageItem-1)*this.p.pageNum+i;
				content +=PageListGetData.get().pageCutUnit(this.p.pageCut[j],this.p.creatRowObj);
			}
			this.p.targetRoom.html(content);
		},
		/*
		pageItem : 当前所在的页数
		modNum : 总页数
		*/
		_creatList : function(pageItem,modNum){
			var content = '',
				_it,
				modItem = pageItem%10,   //取模
				_cut = parseInt(this.p.listLimit/2);
			if (modNum>this.p.listLimit){
				if(modItem>=_cut && pageItem < modNum-(this.p.listLimit-4) || pageItem%10<_cut && pageItem>=10 && pageItem <= modNum-(this.p.listLimit-4)){
					content +=PageListGetData.get().listSetPrev(pageItem);
					for (var i = 1; i<=2;i++){
						content +=PageListGetData.get().listSetListPage(pageItem,i);
					}
					content +=PageListGetData.get().listSetPoint();
					pageItem==_cut ? _it = 1 :  _it = 2
					for (var i=pageItem-_it;i<=parseInt(pageItem)+(this.p.listLimit-7);i++){
						content +=PageListGetData.get().listSetListPage(pageItem,i);
					}
					content +=PageListGetData.get().listSetPoint();
					for(var i = modNum-1;i<=modNum;i++){
						content +=PageListGetData.get().listSetListPage(pageItem,i);
					}
					content +=PageListGetData.get().listSetNext(pageItem);
				}else if(pageItem>=7 && pageItem>=modNum-(this.p.listLimit-2)){ //----
					content +=PageListGetData.get().listSetPrev(pageItem);
					for (var i = 1; i<=2;i++){
						content +=PageListGetData.get().listSetListPage(pageItem,i);
					}
					content +=PageListGetData.get().listSetPoint();
					for(var i = modNum-(this.p.listLimit-3);i<=modNum;i++){
						content +=PageListGetData.get().listSetListPage(pageItem,i);
					}
					if (pageItem != modNum) content +=PageListGetData.get().listSetNext(pageItem);
				}else{ //---
					if (pageItem != 1) content +=PageListGetData.get().listSetPrev(pageItem);
					for (var i = 1; i<=this.p.listLimit-2;i++){
						content +=PageListGetData.get().listSetListPage(pageItem,i);
					}
					content +=PageListGetData.get().listSetPoint();
					for(var i = modNum-1;i<=modNum;i++){
						content +=PageListGetData.get().listSetListPage(pageItem,i);
					}
					content +=PageListGetData.get().listSetNext(pageItem);
				}
			}else{
				for (var i = 1; i<=modNum;i++){
					content +=PageListGetData.get().listSetListPage(pageItem,i);
				}
			}
			this.p.targetListPageRoom.html(content);
			this._listCutClick(this.p.targetListPageRoom.find('.J_listPage'));
		},
		_listCutClick : function(J_listPage){
			var _t = this;
			J_listPage.each(function(){
				jQuery(this).click(function(){
					if (jQuery(this).attr('isClick') == 'true') return;
					_t._listCutShow(jQuery(this).attr('listPageItem'));
				});
			});
		}
	};

	module.exports = PageListCut;
});