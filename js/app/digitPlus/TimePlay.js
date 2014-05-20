define(function(require,exports,module){
	var $ = require('$');
	/* 默认CSS
	.scrollFrame{position:relative;float:left;display:inline;margin-left:2px;line-height:18px;width:18px;height:18px;overflow:hidden;border:1px solid #ccc;text-align:center;color:#b00;}
	.scrollFrame b{display:block;height:18px;}
	.scrollFrame span{display:block;width:18px;position:absolute;left:0px;top:0px;}
	*/

	/*
	* time : 2012.1.31 
	* author : whyboy
	* 参数说明
	* scrollFrame : 装载的dom结构 #scrollFrame
	* digitNum : 预估几位数 可多估算几位
	* constNumStr : 数值 类型转化为字符串传入
	* addRegion : 数值增加区间 整数 如 100则 区间在1-100 不填默认为100
	* addRate : 数值增加频率 默认3000毫秒 
	*/
	function TimePlay(scrollFrame,digitNum,constNumStr,addRegion,addRate){
		this.constNumStr = constNumStr;
		this.addRegion = addRegion || 100;
		this.addRate = addRate || 3000;
		for (var i=0;i<digitNum;i++){
			scrollFrame.append('<div class="scrollFrame"><span><b>0</b><b>1</b><b>2</b><b>3</b><b>4</b><b>5</b><b>6</b><b>7</b><b>8</b><b>9</b></span></div>');
		}
		this.scrollContent = scrollFrame.find('span');
		this.loopNum(this.constNumStr);
		this.intervalLoop();
	}
	TimePlay.comHeight = 18;	//对应CSS 的高度
	TimePlay.prototype = {
		invoke : function(scrollDom,n){
			scrollDom.animate({'top':TimePlay.comHeight*-n},{queue:false,duration:'normal'});
		},
		loopNum : function(constNumStr){
			this.constNumStr = constNumStr;
			var arry = this.constNumStr.split('');
			var _t = this;
			for (var i=0;i<arry.length;i++){
				this.invoke(this.scrollContent.eq(this.scrollContent.size()-i-1),arry[arry.length-i-1]);	
			}
		},
		intervalLoop : function(){
			var _t = this;
			setInterval(function(){
				var constNum = Math.floor(Math.random()*_t.addRegion);
				_t.constNumStr = _t.constNumStr*1+constNum+'';
				_t.loopNum(_t.constNumStr);		
			},_t.addRate);
		}
	};
	module.exports = TimePlay;
});