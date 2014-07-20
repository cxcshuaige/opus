define(function(require,exports,module){
	var $ = require('$');
	// 平年月
	Calendar.MonthMaxNum = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	
	function Calendar(params){
		this.p = $.extend({
			dom : '',         //聚焦dom
			format : '',      //设置输出格式  
			maxYear : 2030,   //设置最大到多少年
			minYear : 2000    //设置最小到多少年
		})
		this.date = new Date();
		this.thisYear = this.date.getFullYear();     
		this.thisMonth = this.date.getMonth();     
		this._init();
	}

	Calendar.prototype._init = function(){
		var maxMonth = this._getMonthNum(this.thisYear,this.thisMonth);
		console.log(maxMonth)
	}

	//得到月的总天数
	Calendar.prototype._getMonthNum = function(year,month){
		if(this._isLeapYear(year) && month == 1) return Calendar.MonthMaxNum[month]+1; // 闰年月
		else return Calendar.MonthMaxNum[month];
	}

	//判断是否是闰年
	Calendar.prototype._isLeapYear = function(year) {
    	if (0==year%4&&((year%100!=0)||(year%400==0))) return true;
    	else return false;
  	}

  	//求某天的星期几
	Calendar.prototype._getDOW = function(day,month,year) {
    	var dt=new Date(year,month-1,day).getDay()/7; return dt;
  	}

  	//上个月遗留的天数   //还要确定上个月的总天数 总天数-遗留的天数+1 <= 总天数

  	//下歌月遗留的天数  <

	module.exports = Calendar;
});
