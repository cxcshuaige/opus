define(function(require,exports,module){
	var $ = require('$');
	// 平年月
	CalendarKernal.MonthMaxNum = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

//日历控件核心部分	
	function CalendarKernal(){
		this.p = $.extend({
			maxYear : 2030,   //设置最大到多少年
			minYear : 2000    //设置最小到多少年
		})
		this.date = new Date();
		this.thisYear = this.date.getFullYear();     
		this.thisMonth = this.date.getMonth();     
		this._init();
	}

	CalendarKernal.prototype._init = function(){
		this.thisMaxMonth = this.getMonthNum(this.thisYear,this.thisMonth); //当月的总天数
		this.thisHeadWeek = this.getHeadWeek(this.thisYear,this.thisMonth);     //当月第一天是星期几
		this.thisFootWeek = this.getFootWeek(this.thisYear,this.thisMonth,this.thisMaxMonth);     //当月最后一天是星期几
		this.prevMaxMonth = this.getMonthNum(this.thisYear,this.thisMonth); //上个月的总天数
	}

	//得到月的总天数
	CalendarKernal.prototype.getMonthNum = function(year,month){
		if(this._isLeapYear(year) && month == 1) return CalendarKernal.MonthMaxNum[month]+1; // 闰年月
		else return CalendarKernal.MonthMaxNum[month];
	}

	//判断是否是闰年
	CalendarKernal.prototype._isLeapYear = function(year) {
    	if (0==year%4&&((year%100!=0)||(year%400==0))) return true;
    	else return false;
  	}

  	//得到某年某月的第一天是星期几
  	CalendarKernal.prototype.getHeadWeek = function(year,month){
  		var day = new Date(year,month,1).getDay();
  		return day;
  	}

  	//得到某年某月的最后一天是星期几
  	CalendarKernal.prototype.getFootWeek = function(year,month,day){
  		var day = new Date(year,month,day).getDay();
  		return day;
  	}

  	//求某天的星期几
	CalendarKernal.prototype._getDOW = function(year,month,day) {
    	var dt=new Date(year,month-1,day).getDay()/7; return dt;
  	}

  	//上个月遗留的天数   //还要确定上个月的总天数 总天数-遗留的天数+1 <= 总天数

  	//下歌月遗留的天数  <
//----
  	function Calendar(){
  		this.p = $.extend({
			dom : '',         //聚焦dom
			format : '',      //设置输出格式  
			maxYear : 2030,   //设置最大到多少年
			minYear : 2000    //设置最小到多少年
		})
  		this.kernal = new CalendarKernal();
  		this.init();
  	}

  	Calendar.prototype.init = function(){
  		this._creatMonth();
  	}

  	Calendar.prototype._creatMonth = function(){
  		console.log(this.kernal.thisFootWeek)
  		for(var i = 0,len = this.kernal.thisHeadWeek; i < len; i++){

  		}
  		for(var j = 0,len = this.kernal.thisMaxMonth; j < len; j++){
  			console.log(j+1);
  		}
  		for(var k = 0,len = this.kernal.thisFootWeek; k < len; k++){

  		}
  	}

	module.exports = Calendar;
});
