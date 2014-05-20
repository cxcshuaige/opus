define(function(require,exports,module){
	var $ = require('$');
	function GoToAwardSpeed(params){
		this.p = $.extend({
			sceneLenth : '',
			apAll : '',
			callback:function(item){alert(0)}
		},params || {});
		this.item=0;
		this.mySpeed(480);
	}
	GoToAwardSpeed.prototype={
		/*-常速前进
		 *-参数说明
		 *-nSpeed:常规速度传入
		 *-type:走加速方法还是走减速方法辨识符
		*/
		mySpeed:function(nSpeed,type){
			var len=this.p.sceneLenth,
				apAll=this.p.apAll,
				_t=this;
			(type!="slow")?this.timeUpSpeed(nSpeed):this.timeSlowSpeed(nSpeed);
			this.iSpeed=setInterval(function(){
				_t.item==len?(function(){
					apAll.eq(_t.item-1).removeClass("goToAward");
					_t.item=0;
				})():null;
				if(_t.item<=len){
					_t.item>0?apAll.eq(_t.item-1).removeClass("goToAward"):null;
					apAll.eq(_t.item).addClass("goToAward");
				}
				_t.item++;
			},nSpeed);
		},
		//加速
		timeUpSpeed:function(speed){
			var _t = this;
			this.timeout1=setTimeout(function(){
				var nSpeed=speed<=80?50:speed-80;  //时间递减加速
				if(nSpeed==50){ 
					clearTimeout(this.timeout1);
					_t.timeSlowSpeed(nSpeed);  //到了50临界点进去减速运动
					return;
				}
				clearInterval(_t.iSpeed);
				_t.mySpeed(nSpeed);
			},1000);
		},
		//减速
		timeSlowSpeed:function(speed){
			var _t = this;
			this.timeout2=setTimeout(function(){
				var doubleUp=function(e){   //加倍减速
					e+=4;
					return e*e;
				};
				var nSpeed=speed>300?400:speed+80+doubleUp(3); //时间递增减速
				if(nSpeed==400){ //到了600 临界点停止运动
					clearTimeout(_t.timeout2);
					clearInterval(_t.iSpeed);
					_t.p.callback(_t.item);
					return;
				}
				clearInterval(_t.iSpeed);
				_t.mySpeed(nSpeed,"slow");
			},(Math.random()*3+1)*1000);
		}
	};
	module.exports = GoToAwardSpeed;
});