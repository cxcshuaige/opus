define(function(require,exports,module){
	/* 
	* 倒计时的实现
	* futureDate : 未来时间
	* domObj : dom Id集合
	*/
	function fnTimeCountDown(futureDate,domObj,callback){
		this.futureDate = futureDate;
		this.domObj = domObj;
		this.callback = callback;
		this.flag = true;
		this.init();
	}

	fnTimeCountDown.prototype.init = function(){
		var dv = this._dv();

		if(this.domObj.msec) this.domObj.msec.innerHTML = dv.msec;
		if(this.domObj.sec) this.domObj.sec.innerHTML = dv.sec;
		if(this.domObj.mini) this.domObj.mini.innerHTML = dv.mini;
		if(this.domObj.hour) this.domObj.hour.innerHTML = dv.hour;
		if(this.domObj.day) this.domObj.day.innerHTML = dv.day;
		if(this.domObj.month) this.domObj.month.innerHTML = dv.month;
		if(this.domObj.year) this.domObj.year.innerHTML = dv.year;

		var _t = this;
		if(this.flag){
			setTimeout(function(){
				_t.init();
			}, 100);
		}
	}

	fnTimeCountDown.prototype._tofix = function(val){
		var ary = String(val).split('');
		return ary[0];
	}

	fnTimeCountDown.prototype._zero = function(n){
		var n = parseInt(n, 10);
		if(n > 0){
			if(n <= 9){
				n = "0" + n;	
			}
			return String(n);
		}else return "00";	
	}

	fnTimeCountDown.prototype._dv = function(){
		var d = this.futureDate || Date.UTC(2050, 0, 1); //如果未定义时间，则我们设定倒计时日期是2050年1月1日
		var future = new Date(d), now = new Date();
		//现在将来秒差值
		var dur = Math.round(future.getTime() - now.getTime()), pms = {
			msec: "00",
			sec: "00",
			mini: "00",
			hour: "00",
			day: "00",
			month: "00",
			year: "0"
		};
		if(dur > 0){
			pms.msec = this._tofix(1000 - this._zero(dur % 1000));
			pms.sec = this._zero(dur / 1000 % 60);
			pms.mini = Math.floor((dur / 1000 / 60)) > 0? this._zero(Math.floor((dur / 1000 / 60)) % 60) : "00";
			pms.hour = Math.floor((dur / 1000 / 3600)) > 0? this._zero(Math.floor((dur / 1000 / 3600)) % 24) : "00";
			pms.day = Math.floor((dur / 1000 / 86400)) > 0? this._zero(Math.floor((dur / 1000 / 86400)) % 30) : "00";
			//月份，以实际平均每月秒数计算
			pms.month = Math.floor((dur / 1000 / 2629744)) > 0? this._zero(Math.floor((dur / 1000 / 2629744)) % 12) : "00";
			//年份，按按回归年365天5时48分46秒算
			pms.year = Math.floor((dur / 1000 / 31556926)) > 0? Math.floor((dur / 1000 / 31556926)) : "0";
		}else{
			this.flag = false;
			this.callback();
		}
		return pms;
	}

	module.exports = fnTimeCountDown;
});



/*

var fnTimeCountDown = function(d, o){
	var flag = true;
	var f = {
		tofix : function(val){
			var ary = String(val).split('');
			return ary[0];
		},

		zero: function(n){
			var n = parseInt(n, 10);
			if(n > 0){
				if(n <= 9){
					n = "0" + n;	
				}
				return String(n);
			}else{
				return "00";	
			}
		},
		dv: function(){
			d = d || Date.UTC(2050, 0, 1); //如果未定义时间，则我们设定倒计时日期是2050年1月1日
			var future = new Date(d), now = new Date();
			//现在将来秒差值
			var dur = Math.round(future.getTime() - now.getTime()), pms = {
				msec: "00",
				sec: "00",
				mini: "00",
				hour: "00",
				day: "00",
				month: "00",
				year: "0"
			};
			if(dur > 0){
				pms.msec = f.tofix(1000 - f.zero(dur % 1000));
				pms.sec = f.zero(dur / 1000 % 60);
				pms.mini = Math.floor((dur / 1000 / 60)) > 0? f.zero(Math.floor((dur / 1000 / 60)) % 60) : "00";
				pms.hour = Math.floor((dur / 1000 / 3600)) > 0? f.zero(Math.floor((dur / 1000 / 3600)) % 24) : "00";
				pms.day = Math.floor((dur / 1000 / 86400)) > 0? f.zero(Math.floor((dur / 1000 / 86400)) % 30) : "00";
				//月份，以实际平均每月秒数计算
				pms.month = Math.floor((dur / 1000 / 2629744)) > 0? f.zero(Math.floor((dur / 1000 / 2629744)) % 12) : "00";
				//年份，按按回归年365天5时48分46秒算
				pms.year = Math.floor((dur / 1000 / 31556926)) > 0? Math.floor((dur / 1000 / 31556926)) : "0";
			}else{
				callback();
				flag = false;
			}
			return pms;
		},
		ui: function(){
			var dv = f.dv();
			if(o.msec){
				o.msec.innerHTML = dv.msec;
			}
			if(o.sec){
				o.sec.innerHTML = dv.sec;
			}
			if(o.mini){
				o.mini.innerHTML = dv.mini;
			}
			if(o.hour){
				o.hour.innerHTML = dv.hour;
			}
			if(o.day){
				o.day.innerHTML = dv.day;
			}
			if(o.month){
				o.month.innerHTML = dv.month;
			}
			if(o.year){
				o.year.innerHTML = dv.year;
			}
			if(flag) setTimeout(f.ui, 100);
		}
	};	
	f.ui();
};

*/