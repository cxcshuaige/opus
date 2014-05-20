define(function(require,exports,module){
	var $ = require('$');
	function SlotMachineSence(lotteryObj,sceneNum,J_aP,J_lcont){
		this.s = lotteryObj;
		this.sceneNum = sceneNum;
		this.J_aP = J_aP;
		this.J_lcont = J_lcont;
	}
	SlotMachineSence.prototype = {
		creatSence : function(){
			var _gameFlag = true;
			for (var i = 0 ;i<this.sceneNum;i++){
				this.J_aP.append('<li class="J_apSon ap"></li>');
			}
			var _ap = this.J_aP.find('.J_apSon');
			this.sceneHeight = _ap.eq(0).height();
			for (var i in this.s){
				if (this.sceneNum < this.s[i].setSceneNum) {
					_gameFlag = false;   
					break;
				}
				_ap.eq(this.s[i].setSceneNum - 1).addClass(this.s[i].classNa).attr('award',i);
			}
		//由设置的样式决定
			this.sceneTop = parseInt(this.J_lcont.css('top').replace(/px/i,'')) || this.sceneHeight/2;
			this.sceneTop < 0 ? this.sceneTop = this.sceneTop * -1 : null;
			this.J_lcont.css('top',-this.sceneTop);
			this.space = this.sceneHeight*this.sceneNum+this.sceneTop;
			this.J_lcont.append(this.J_lcont.html());
			if (_gameFlag) return true;
		},
		animationAction : function(type,speed,dom,awIndex){
			var _t = this;
			var move = function(speed){
				dom.css('top',-_t.sceneTop+'px');
				dom.animate({top:-_t.space}, {queue: false, duration:speed,easing:'linear',complete:function(){
					_t._animationType(type,speed,dom,awIndex);
				}});
			}
			move(speed);
		},
		_animationType : function(type,speed,dom,awIndex){
			switch (type){
			case 'up':
				speed -= 400;
				speed >= 1000 ? this.animationAction('up',speed,dom,awIndex) : this.animationAction('down',speed,dom,awIndex);
				break;
			case 'down' : 
				speed += speed/2;
				speed <= 3000 ? this.animationAction('down',speed,dom,awIndex) : this.animationEnd(speed,dom,awIndex);
				break;
			}
		},
		animationEnd : function(speed,dom,awIndex){
			var _t = this,_space;
			if(awIndex == 0){_space = this.sceneHeight*this.sceneNum+this.sceneTop;speed = speed*1.3;}
			else{_space = this.sceneHeight*awIndex+this.sceneTop}
			awIndex == 1 ?  speed = speed/2 
			: awIndex == 2 ? speed = speed/2.5 : null;
			dom.css('top',-this.sceneTop+'px');
			dom.animate({top:-_space}, {queue: false, duration:speed,easing:'linear',complete:function(){
				$(_t.s).trigger('endAnimate');
			}});
		}
	};
	module.exports = SlotMachineSence;
});