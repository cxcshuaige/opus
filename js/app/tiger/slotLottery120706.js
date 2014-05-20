define(function(require){
	var $ = require('$');
	var SlotMachineLottery = require('./SlotMachineLottery');
	$(function($){
		var obj = {
			LotteryDraw : $('#LotteryDraw'),
			sceneNum : 10,
			moveSpeed : 2000,
			callback : myAward
		};
		var lottery = new SlotMachineLottery(obj);
		var setLottery = {
			z1  : {classNa : 'ap1',setSceneNum : 1},
			z2  : {classNa : 'ap2',setSceneNum : 2},
			z3  : {classNa : 'ap3',setSceneNum : 3},
			z4  : {classNa : 'ap4',setSceneNum : 4},
			z5  : {classNa : 'ap5',setSceneNum : 5},
			z6  : {classNa : 'ap6',setSceneNum : 6},
			z7  : {classNa : 'ap7',setSceneNum : 7},
			z8  : {classNa : 'ap8',setSceneNum : 8},
			z9  : {classNa : 'ap9',setSceneNum : 9},
			z10 : {classNa : 'ap10',setSceneNum : 10}
		};
		lottery.sceneInit(setLottery);
	});
	function myAward(winDto){
		var str='';
		switch (winDto){
		case 1 :
			str+='中奖了';
			alert(str);
			break;
		case 2 :
			str+='中奖了';
			alert(str);
			break;
		case 3 :
			str+='中奖了';
			alert(str);
			break;
		case 4 :
			str+='中奖了';
			alert(str);
			break;
		case 5 :
			str+='中奖了';
			alert(str);
			break;
		case 6 :
			str+='中奖了';
			alert(str);
			break;
		case 7 :
			str+='中奖了';
			alert(str);
			break;
		case 8 :
			str+='中奖了';
			alert(str);
			break;
		case 9 :
			str+='中奖了';
			alert(str);
			break;
		case 10 :
			str+='中奖了';
			alert(str);
			break;
		default :
			str+='你妹的没中奖啊';
			alert(str);
			break;
		}
	}
});

