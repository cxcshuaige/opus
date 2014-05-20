define(function(require,exports,module){
	var $ = require('$');
	function LotteryDraw(obj){
		this.p = $.extend({
			J_lS : $('.J_lS'),  //指针
			J_aP : $('.J_aP'),	//容器
			J_lB : $('.J_lB'),	//按钮
			sceneNum : 6,
			moveSpeed : 1000
		},obj || {});
	}
	LotteryDraw.gameFlag = true;
	LotteryDraw.prototype = {
		sceneInit : function(setLottery){
			this.s = $.extend({
				first  : {classNa : 'ap1',surplus : 1,setSceneNum : Math.floor(Math.random()*10+1)},
				second : {classNa : 'ap2',surplus : 2,setSceneNum : Math.floor(Math.random()*10+1)}
			},setLottery || {});
			for (var i = 0 ;i<this.p.sceneNum;i++){
				this.p.J_aP.append('<li class="ap"></li>');
			}
			for (var i in this.s){
				if (this.p.sceneNum < this.s[i].setSceneNum) {
					LotteryDraw.gameFlag = false;   //失败原因，有奖占位设置下标，大于总占位数
					break;
				}
				this.p.J_aP.find('.ap').eq(this.s[i].setSceneNum - 1).addClass(this.s[i].classNa).attr('award',i);
			}
			(!LotteryDraw.gameFlag) ? alert('游戏启动失败 ----game start error') : this.gameStart();
		},
		gameStart : function(){
			this.pressBtn(this.p.J_lB,this);
		},
		pressBtn : function(_jt,_t){
			var _srcGif = function(){
				_jt.html('<img src="img/sz0.gif"/>');
			};
			_jt.click(function(){
				if (_t.timeoutBtChange || _t.timeoutMove) return;
				_srcGif();
				var sceneIndex = _t.getPbb() || 3;
				_t.goToAward(sceneIndex);
			});
		},
		getPbb : function(){	//概率算法
			return Math.floor(Math.random()*6+1);
		},
		goToAward : function(sceneIndex){
			var _s = this.p.J_aP.find('.ap').eq(sceneIndex - 1), _z = this.p.J_lS, _t = this;
			var _l = _s.offset().left - _z.offset().left;
			var move = function(){
				_t.timeoutMove = setTimeout(function(){
					_z.animate({left: '+'+_l}, _t.p.moveSpeed,function(){
						// clearTimeout(_t.timeoutBtChange);
						// _t.timeoutBtChange = null;
						// clearTimeout(_t.timeoutMove);
						// _t.timeoutMove = null;
						_t.getAward(_s);
					});
				},500);
			}
			this.timeoutBtChange = setTimeout(function(){
				_t.p.J_lB.html('<img src="img/sz'+sceneIndex+'.png"/>');
					move();
			},2000);
		},
		getAward : function(_s){
			switch (_s.attr('award')){
				case 'first' :
					alert("我中了一等奖");
					break;
				case 'second' :
					alert("我中了二等奖");
					break;
				default :
					alert("你妹的没中奖");
					break;
			}
		}
	}
	module.exports = LotteryDraw;
});