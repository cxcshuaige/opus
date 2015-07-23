/* 瀑布流组件
* time：2013.08.11
* author:希杍
*/
define(function(require,exports,module){
	var $ = require('$');
	var __bind = function(fn,me){
		return function(){
			return fn.apply(me,arguments);
		}
	}

	var defaultOptions = {
		autoResize: false, //是否支持窗口重置
		container: $('body'),   //瀑布流所在容器
		itemWidth: 0,       //瀑布单元的宽度
		offset: 2,   //每个单元的列间隔距离
		offseth: 20,   //每个单元的水平间隔距离
		resizeDelay: 50
	}

	function Wookmark(options){
		this.dto = $.extend(defaultOptions,options || {});
	//bind method
		this.layout = __bind(this.layout, this);
		this._resize = __bind(this._resize,this);

		this.timeout = null;
		if(this.dto.autoResize){
			$(window).bind('wookmark-resize',this._resize);
		}
	}

	// 主布局方法(对外)
	//param handler jq dom集合处理者
	Wookmark.prototype.layout = function(handler,itemCallBack){
		this.handler = handler;
		this.itemCallBack = itemCallBack;
		var columnWidth = this._getItemWidth() + this.dto.offset,   //每列的框
			containerWidth = this.dto.container.width(),
			columns = ~~(containerWidth / columnWidth);  //计算一共几列 ~~等同于parseInt

		//刚进来或列项数被改变时
		if(this.columns === undefined || this.columns.length != columns){  //初始化是this.columns为undefined
			this._layoutFull(columnWidth,columns,containerWidth);
		}else{
			this._layoutColumns(columnWidth,containerWidth);
		}
	}

	//更新已有索引列的列高以及列里瀑布单元的布局
	Wookmark.prototype.updateColumn = function(index){
		var itemAry = this.columns[index].itemAry,
			len = itemAry.length,
			offsetTop = 0,
			tempHeight = 0,
			longest = 0;
		for(var i = 0; i < len;i++){
			if(i===0) {
				itemAry[i].css('top',offsetTop);
				continue;
			}
			tempHeight = offsetTop + itemAry[i-1].outerHeight(true);
		    offsetTop = tempHeight + this.dto.offseth;
			itemAry[i].css('top',offsetTop);
			if(i === len-1) this.columns[index].columnHeight = offsetTop + itemAry[i].outerHeight(true) + this.dto.offseth;
		}
		//找到最长的列
		longest = this._getLongestHeight();
		this.dto.container.css('height',longest);
	}

	//瀑布单元过滤器第一版(只对已加载的数据进行过滤，不支持ajax继续加载)
	Wookmark.prototype.fliterItem = function(fliters){
		var activeItems = this._getActiveItems(),
			heights = [],   //存储columns每项列的高度
			activeLength = activeItems.size(),
			containerWidth = this.dto.container.width(),
			longest = 0,
			columnWidth = this._getItemWidth() + this.dto.offset;   //每列的框

		for(var i = 0; i < this.columns.length; i++){
			heights.push(0);
			this.columns[i] = {};  //重置
			this.columns[i].itemAry = [];
		}
		activeItems.css('display','none');
		for(var i = 0; i < activeLength; i++){
			var	item = activeItems.eq(i);
			if(fliters){
				if(!item.hasClass(fliters)){
					//item.fadeOut('fast');
					continue;
				}
			}
			this._commonLayer(heights,columnWidth,containerWidth,item,true);
		}
		longest = this._getLongestHeight();
		this.dto.container.css('height',longest);
	}

	//填补数据全部加载完以后，空缺的瀑布单元用纯色填满
	Wookmark.prototype.fullWook = function(){
		this.fullWookClear();
		var longest = this._getLongestHeight(),
			width = this._getItemWidth(),
			left,top,
			len = this.columns.length,
			columnWidth = width + this.dto.offset,
			containerWidth = this.dto.container.width();
		for(var i = 0;i<this.columns.length;i++){
			if(this.columns[i].columnHeight < longest){
				height = longest - this.columns[i].columnHeight - this.dto.offseth;
				top = this.columns[i].columnHeight;
				left = this._calcLeft(i,columnWidth,containerWidth,len);
				this.dto.container.append('<div class="J_fullWook fullWook" style="position:absolute;height:'+height+'px;width:'+width+'px;top:'+top+'px;left:'+left+'px;"></div>')
			}
		}
	}

	//清除填补
	Wookmark.prototype.fullWookClear = function(){
		this.dto.container.find('.J_fullWook').remove();
	}

	//清除已瀑布的索引（初始化瀑布流）
	Wookmark.prototype.clearLayout = function(){
		this.itemIndex = 0;
	}

	//窗口重置
	Wookmark.prototype._resize = function(e,handler,itemCallBack){
		var self = this;
		clearTimeout(this.timeout);
		this.timeout= setTimeout(function(){
			self.layout(handler,itemCallBack)
		},300);
	}

	//全容器瀑布布局
	Wookmark.prototype._layoutFull = function(columnWidth,columns,containerWidth){
		var activeItems = this._getActiveItems(),
			heights = [],   //存储columns每项列的高度
			activeLength = activeItems.size(),
			longest = 0;
		this.columns = [];

		//初始化每列存储数据（包括列总高，列里的item项）
		var whileItem = 0;
		while(heights.length < columns){ 
			heights.push(0);
			this.columns.push({});
			this.columns[whileItem].itemAry = [];
			whileItem++;
		}

		for(var i = 0; i < activeLength; i++){
			var	item = activeItems.eq(i);
			this._commonLayer(heights,columnWidth,containerWidth,item);
		}

		longest = this._getLongestHeight();
		this.itemIndex = activeLength;
		this.dto.container.css('height',longest);

	}

	//对已经有索引的列项进行追加布局 （ajax走这个方法）
	Wookmark.prototype._layoutColumns = function(columnWidth,containerWidth){
		var activeItems = this._getActiveItems(),
			heights = [],
			activeLength = activeItems.size(),
			longest = 0;
		for(var i = 0; i < this.columns.length; i++){
			heights.push(this.columns[i].columnHeight);
		}

		for(var i = this.itemIndex; i < activeLength; i++){
			var item = activeItems.eq(i);
			this._commonLayer(heights,columnWidth,containerWidth,item);
		}
		longest = this._getLongestHeight();
		this.itemIndex = activeLength;
		this.dto.container.css('height',longest);
		//console.log(shotestIndex)
	}

	//通用的整体布局器
	Wookmark.prototype._commonLayer = function(heights,columnWidth,containerWidth,item,isfliter){
		var shortest = heights[0],   //从列高存储数据的第一个开始
			shortestIndex = 0, //从列索引值0开始
			left = 0,
			cssItem = {},
			len = this.columns.length;
		//找到高度最短的那一列(谁最短数据就追加到谁的后面)
		for(var j = 0; j < len; j++){
			if(heights[j] < shortest){
				shortest = heights[j];
				shortestIndex = j;
			}
		}
		if(this.itemCallBack && !isfliter) this.itemCallBack(item);  //每个瀑布单元操作的方法，由外部传入
		//两端对齐
		left = this._calcLeft(shortestIndex,columnWidth,containerWidth,len);

		cssItem = {
			top : shortest,
			left : left 
		}

		if(isfliter){
			item.fadeIn('fast');
			item.animate(cssItem,'fast',function(){
				item.attr('data-index',shortestIndex);
			})
		}else{
			item.css(cssItem).attr('data-index',shortestIndex);
			item.fadeIn('normal');
		}
		
		
		//更新当前列的高
		heights[shortestIndex] = shortest + item.outerHeight(true) + this.dto.offseth;
		//构造缓存数据 this.columns
		this.columns[shortestIndex].columnHeight = heights[shortestIndex];
		this.columns[shortestIndex].itemAry.push(item);   //缓存索引列里的dom
	}


	//两端对齐的left距离算法
	Wookmark.prototype._calcLeft = function(shortestIndex,columnWidth,containerWidth,len){
		var leftOffset;
		switch(shortestIndex){
			case 0:
				leftOffset = 0;   
				break;
			case (len-1) :  //最靠右
				leftOffset = shortestIndex * columnWidth + (containerWidth - shortestIndex * columnWidth) - (columnWidth - this.dto.offset);
				break;
			default:  //平均多余的间距
				leftOffset = shortestIndex * (columnWidth - this.dto.offset) + Math.ceil(shortestIndex * Math.ceil((containerWidth - (columnWidth - this.dto.offset) * len)/(len - 1)));
				break;
		}
		return leftOffset;
	}

	//得到最长的高
	Wookmark.prototype._getLongestHeight = function(){
		var longest = this.columns[0].columnHeight;
		for(var i = 0;i<this.columns.length;i++){
			if(this.columns[i].columnHeight > longest){
				longest = this.columns[i].columnHeight;
			}
		}
		return longest;
	}

	//得到列宽,也是每个瀑布单元宽
	Wookmark.prototype._getItemWidth = function(){
		var itemWidth = this.dto.itemWidth;
		//	containerWidth = this.dto.container.width();
		if(this.dto.itemWidth === undefined || this.dto.itemWidth === 0){
			itemWidth = this.handler.eq(0).outerWidth(true);  //总宽 + margin间距
		}
		return itemWidth;
	}

	//得到可用的瀑布单元
	Wookmark.prototype._getActiveItems = function(){
		return this.handler;
	}
	module.exports = Wookmark;
});