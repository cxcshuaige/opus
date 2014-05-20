define(function(require){
	var $ = require('$');
	var LotteryDraw = require('./LotteryDraw');
	jQuery(function($){
		var lot = new LotteryDraw({
			J_aP:$(".J_aP"),  
			J_lB:$(".J_lB"),
			callback:getAwards
		});
		var params=[
			{classNa:"ap",getAward:1,content:"夏威夷果两包"},
			{classNa:"ap",getAward:2,content:"来杭州给你煎两个蛋"},
			{classNa:"ap",getAward:3,content:"蒙牛优酸乳酸奶一杯"},
			{classNa:"ap",getAward:4,content:"请你看电影一场"},
			{classNa:"ap",getAward:5,content:"冰红茶一瓶"},
			{classNa:"ap",getAward:6,content:"请你吃鸡公煲"},
			{classNa:"ap",getAward:7,content:"请你吃烤鱼"},
			{classNa:"ap",getAward:8,content:"请你K歌，地点温州"},
			{classNa:"ap",getAward:9,content:"请你吃宵夜一顿，地点温州"},
			{classNa:"ap",getAward:10,content:"乐事薯片一包"},
			{classNa:"ap",getAward:11,content:"乌龙名茶一瓶"},
			{classNa:"ap",getAward:12,content:"宠物狗粮一袋"},
			{classNa:"ap",getAward:13,content:"请你吃肯德基，地点温州"},
			{classNa:"ap",getAward:14,content:"请你吃牛排，地点温州"},
			{classNa:"ap",getAward:15,content:"请你喝咖啡，地点温州"},
			{classNa:"ap",getAward:16,content:"给你冲30块话费"},
			{classNa:"ap",getAward:17,content:"给你打一拳，大力的"},
			{classNa:"ap",getAward:18,content:"一起西湖一日游，单反照相写真"}
		];
		lot.sceneInit(params);
	});
	/*
	 *item:场景的索引
	*/
	function getAwards(obj){
		var award = Number(obj.getAward);
		var content = obj.content;
		switch(award){
			case 1:
				alert(content);
				break;
			case 2:
				alert(content);
				break;
			case 3:
				alert(content);
				break;
			case 4:
				alert(content);
				break;
			case 5:
				alert(content);
				break;
			case 6:
				alert(content);
				break;
			case 7:
				alert(content);
				break;
			case 8:
				alert(content);
				break;
			case 9:
				alert(content);
				break;
			case 10:
				alert(content);
				break;
			case 11:
				alert(content);
				break;
			case 12:
				alert(content);
				break;
			case 13:
				alert(content);
				break;
			case 14:
				alert(content);
				break;
			case 15:
				alert(content);
				break;
			case 16:
				alert(content);
				break;
			case 17:
				alert(content);
				break;
			case 18:
				alert(content);
				break;
			default:
				console.log("你妹的没中奖");
				break;
		}
	}
});