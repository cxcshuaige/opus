define(function(require,exports,module){
	var $ = require('$');
	var GoToAwardSpeed = require('./GoToAwardSpeed');
	function LotteryDraw(params){
		this.p=$.extend({
			J_aP:$(".J_aP"),   //装载场景的画布
			J_lB:$(".J_lB"),   //控制器按钮
			callback:function(obj){} //动画轮播完以后的回调 场景obj对象 索引
		},params||{});
	}
	LotteryDraw.gameStart=false; //游戏已经启动标示符
	LotteryDraw.prototype={
		/*-----布置场景
		 *-参数说明params：
		 *-classNa:场景样式class
		 *-setSceneNum:场景
		 */
		sceneInit:function(sceneAry){
			this.sceneAry = sceneAry;
			this.sceneLenth = this.sceneAry.length;  //一共有多少个场景
			for(var i=0;i<this.sceneLenth;i++){
				this.p.J_aP.append('<li class="J_ap '+this.sceneAry[i].classNa+'" award="'+this.sceneAry[i].getAward+'">'+this.sceneAry[i].content+'</li>');
			}
			this.apAll = this.p.J_aP.find(".J_ap");  //场景DOM集合
			this.pressBtn(this.p.J_lB,this);
		},
		pressBtn:function(btn,_t){
			btn.click(function(){
				_t.gameStart(btn,_t);
			});
		},
		gameStart:function(btn,_t){
			var btnChange=function(){
				btn.css("background-color","#b00");
			};
			if(LotteryDraw.gameStart){
				return;
			}
			LotteryDraw.gameStart=true;
			btnChange();
			var rate=_t.getPbb()||3;
			_t.goToAward(rate);
		},
		//中奖概率控制中心
		getPbb:function(){
			return Math.floor(Math.random()*18+1);
		},
		goToAward:function(rate){
			var _t = this;
			new GoToAwardSpeed({
				sceneLenth : this.sceneLenth,
				apAll : this.apAll,
				callback:function(item){
					_t.truelyGetAward(item,rate);
				}
			});
		},
		//作弊调控
		truelyGetAward:function(item,rate){
			var item = item;
			var _t = this;
			this.iSpeed = setInterval(function(){
				item == _t.sceneLenth?(function(){
					_t.apAll.eq(item-1).removeClass("goToAward");
					item=0;
				})():null;
				if(item <= _t.sceneLenth){
					item>0?_t.apAll.eq(item-1).removeClass("goToAward"):null;
					_t.apAll.eq(item).addClass("goToAward");
				}
				item++;
				if(_t.sceneAry[item - 1].getAward == rate){
					clearInterval(_t.iSpeed);
					_t.p.callback(_t.sceneAry[item - 1]);
					return;
				}
				
			},400);
		}
	};
	module.exports = LotteryDraw;
});