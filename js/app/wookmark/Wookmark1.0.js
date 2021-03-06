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
		offset: 2,   //每个单元的水平间隔距离
		resizeDelay: 50
	}

	function Wookmark(options){
		this.dto = $.extend(defaultOptions,options || {});
	//bind method
		this.layout = __bind(this.layout, this);
	}

	// 主布局方法(对外)
	//param handler jq dom集合处理者
	Wookmark.prototype.layout = function(handler){
		this.handler = handler;
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
			tempHeight = 0;
		for(var i = 0; i < len;i++){
			if(i===0) {
				itemAry[i].css('top',offsetTop);
				continue;
			}
			tempHeight = offsetTop + itemAry[i-1].outerHeight(true);
		    offsetTop = tempHeight + this.dto.offset;
			itemAry[i].css('top',offsetTop);
			if(i === len-1) this.columns[index].columnHeight = offsetTop + itemAry[i].outerHeight(true) + this.dto.offset;
		}

	}

	//全容器瀑布布局
	Wookmark.prototype._layoutFull = function(columnWidth,columns,containerWidth){
		var activeItems = this._getActiveItems(),
			heights = [],   //存储columns每项列的高度
			activeLength = activeItems.size(),
			longestHeight = 0;
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
			longestHeight = this._commonLayer(heights,columnWidth,containerWidth,item);
		}

		this.itemIndex = activeLength;
		this.dto.container.css('height',longestHeight);

	}

	//对已经有索引的列项进行追加布局 （ajax走这个方法）
	Wookmark.prototype._layoutColumns = function(columnWidth,containerWidth){
		var activeItems = this._getActiveItems(),
			heights = [],
			activeLength = activeItems.size(),
			longestHeight = 0;
		for(var i = 0; i < this.columns.length; i++){
			heights.push(this.columns[i].columnHeight);
		}

		for(var i = this.itemIndex; i < activeLength; i++){
			var item = activeItems.eq(i);
			longestHeight = this._commonLayer(heights,columnWidth,containerWidth,item);
		}

		this.itemIndex = activeLength;
		this.dto.container.css('height',longestHeight);
		//console.log(shotestIndex)
	}

	//通用的整体布局器
	Wookmark.prototype._commonLayer = function(heights,columnWidth,containerWidth,item){
		var shortest = heights[0],   //从列高存储数据的第一个开始
			shortestIndex = 0, //从列索引值0开始
			leftOffset = 0,
			cssItem = {};
		//找到高度最短的那一列(谁最短数据就追加到谁的后面)
		for(var j = 0; j < heights.length; j++){
			if(heights[j] < shortest){
				shortest = heights[j];
				shortestIndex = j;
			}
		}
		//两端对齐
		switch(shortestIndex){
			case 0:
				leftOffset = 0;   
				break;
			// case (heights.length-1) :  //最靠右
			// 	leftOffset = shortestIndex * columnWidth + (containerWidth - shortestIndex * columnWidth) - (columnWidth - this.dto.offset);
			// 	break;
			default:
				leftOffset = shortestIndex * columnWidth;
				break;
		}

		cssItem = {
			top : shortest,
			left : leftOffset 
		}

		item.css(cssItem).attr('data-index',shortestIndex);
		item.fadeIn('normal');
		//更新当前列的高
		heights[shortestIndex] = shortest + item.outerHeight(true) + this.dto.offset;
		//构造缓存数据 this.columns
		this.columns[shortestIndex].columnHeight = heights[shortestIndex];
		this.columns[shortestIndex].itemAry.push(item);   //缓存索引列里的dom

		return heights[shortestIndex];
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