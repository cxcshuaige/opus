define(function(require,exports,module){
	var $ = require('$');
	var SlotMachineSence = require('./SlotMachineSence');
	function SlotMachineLottery(obj){
		this.p = jQuery.extend({
			LotteryDraw : $('#LotteryDraw'),	
			sceneNum : 10,
			moveSpeed : 1000,
			callback : function(){}
		},obj || {});
		this.J_aP = this.p.LotteryDraw.find('.J_aP');
		this.J_lcont = this.p.LotteryDraw.find('.J_lcont');
		this.J_lB = this.p.LotteryDraw.find('.J_lB');
		this.lotteryObjArray = [];
	}
	SlotMachineLottery.isStart = false;
	SlotMachineLottery.stopClickAgain = false;
	SlotMachineLottery.prototype = {
		sceneInit : function(lotteryObj){
			//this.loginInit();   
			this.secenObj = {
				secen1 : new SlotMachineSence(lotteryObj,this.p.sceneNum,this.J_aP.eq(0),this.J_lcont.eq(0)),
				secen2 : new SlotMachineSence(lotteryObj,this.p.sceneNum,this.J_aP.eq(1),this.J_lcont.eq(1)),
				secen3 : new SlotMachineSence(lotteryObj,this.p.sceneNum,this.J_aP.eq(2),this.J_lcont.eq(2))
			};
			this.secenObj.secen1.creatSence()
			&& this.secenObj.secen2.creatSence()
			&& this.secenObj.secen3.creatSence() ? this._pressBtn(this,lotteryObj) : alert('游戏启动失败 ----game start error');
		},
		_pressBtn : function(_t,lotteryObj){
			this.lotteryEndBind(lotteryObj); //若多次抽奖要移动到初始化处，不可多次bind
			this.J_lB.click(function(){
				if (SlotMachineLottery.stopClickAgain) return;
				if (SlotMachineLottery.isStart){alert('您已经抽过奖啦！'); return;}
				SlotMachineLottery.isStart = true;
				_t.execute();
			});
		},
		execute : function(){
			for(var i in this.secenObj){
				this.lotteryObjArray.push(i);
			}
		
			this.awardInfo = this.getNums();
			this._pressThen(this);
			SlotMachineLottery.stopClickAgain =  true;
		},
		_pressThen : function(_t){
			this.J_lB.addClass('lbCur');
			var _award;
			var setTimes = function(i){
				setTimeout(function(){
					_t.awardInfo == 0 ? _award = _t.getPbb(i) : _award = _t.superWay(_t.awardInfo);
					_t.secenObj['secen'+i].animationAction('up',Math.random()*(2000-1200)+1200,_t.J_lcont.eq(i-1),_award);
				},Math.random()*(1400-800)+800);
			}
			setTimes(1);
			setTimes(2);
			setTimes(3);
		},
		lotteryEndBind : function(lotteryObj){
			var _t = this;
			jQuery(lotteryObj).bind('endAnimate',function(e){
				if(_t.lotteryObjArray.length > 1){
					_t.lotteryObjArray.pop();
				}else{
					_t.p.callback(_t.awardInfo);
					SlotMachineLottery.stopClickAgain =  false;
				}
			});
		},
		getPbb : function(i){	//概率算法
			if (i == 1)	{return Math.floor(Math.random()*4);}
			else{return Math.floor(Math.random()*(9-5)+5);}
		},
		superWay : function(awardInfo){
			switch (awardInfo){
				case 1 :
					return 9;//一等奖
					break;
				case 2 :
					return 0;//二等奖
					break;
				case 3 :
					return 1;//三等奖
					break;
				case 4 :
					return 2;//四等奖
					break;
				case 5 :
					return 3;//五等奖
					break;
				case 6 :
					return 4;//五等奖
					break;
				case 7 :
					return 5;//五等奖
					break;
				case 8 :
					return 6;//五等奖
					break;
				case 9 :
					return 7;//五等奖
					break;
				case 10 :
					return 8;//五等奖
					break;
				default :
					break;
			}
		},
		getNums : function(){
			var m = Math.floor(Math.random()*1000+1);
			if(m < 10) return Math.floor(Math.random()*10+1);
			else return 0;
		}
	};
	module.exports = SlotMachineLottery;
});