define(function(require,exports,module){
	var $ = require('$');
	// 平年月
	CalendarKernal.MonthMaxNum = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

//日历控件核心部分	
	function CalendarKernal(obj){
		this.p = $.extend({
		  	maxYear : 2030,   //设置最大到多少年
		  	minYear : 2000    //设置最小到多少年
		},obj || {})
	}

	CalendarKernal.prototype.fresh = function(year,month){
		//当月的总天数
		var thisMaxMonth = this.getMonthNum(year,month); 
		//当月第一天是星期几
		var thisHeadWeek = this.getHeadWeek(year,month);     
		//当月最后一天是星期几
		var thisFootWeek = this.getFootWeek(year,month,thisMaxMonth); 
		//上个月的总天数    
		var prevMaxMonth = this.getPrevMaxMonth(year,month);
		return {
			thisMaxMonth : thisMaxMonth,
			thisHeadWeek : thisHeadWeek,
			thisFootWeek : thisFootWeek,
			prevMaxMonth : prevMaxMonth
		}
	}

	//得到月的总天数
	CalendarKernal.prototype.getMonthNum = function(year,month){
		if(this._isLeapYear(year) && month == 1) return CalendarKernal.MonthMaxNum[month]+1; // 闰年月
		else return CalendarKernal.MonthMaxNum[month];
	}

	//上个月的总天数 
	CalendarKernal.prototype.getPrevMaxMonth = function(year,month){
		var month = month - 1;
		var year = year;
		if(month < 0){
			month = 11;
			year = year - 1;
		}
		return this.getMonthNum(year,month)
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

//年月弹窗选择插件
	function CalendarDialogPlugin(){} 
	CalendarDialogPlugin.prototype.init = function(params,callback){
		this.p = $.extend({
			parentDom : '',         //聚焦dom
			thisYear : 2014,
			maxYear : 2030,   //设置最大到多少年
		  	minYear : 2000    //设置最小到多少年
		},params || {})
		this._callback = callback;
		this._creatBasePanel();
		this._creatYearPanel();
		this._creatMonthPanel();
		this._eventrigger();
	}
	//创建弹窗基础结构
	CalendarDialogPlugin.prototype._creatBasePanel = function(){
		this.diaPanel = $('<div class="m-calendarDia"></div>');
		this.diaYearPanel = $('<div class="m-calendarDia-year"></div>');
		this.diaMonthPanel = $('<div class="m-calendarDia-month"></div>');
		this.diaPanel.append(this.diaYearPanel).append(this.diaMonthPanel);
		this.p.parentDom.append(this.diaPanel);
	}
	//填充年份
	CalendarDialogPlugin.prototype._creatYearPanel = function(){
		var html = '<ul>';
		for(var i = this.p.minYear; i <= this.p.maxYear; i++){
			if(i == this.p.thisYear) html += '<li class="u-diaThisYear">'+i+'</li>';
			else html += '<li>'+i+'</li>';
		}
		html += '</ul>'
		this.diaYearPanel.html(html);
	}
	//填充月份
	CalendarDialogPlugin.prototype._creatMonthPanel = function(){
		var html = '<ul>';
		for(var i = 1; i <= 12; i++){
			html += '<li>'+i+'</li>';
		}
		html += '</ul>'
		this.diaMonthPanel.html(html);
	}
	//事件注册
	CalendarDialogPlugin.prototype._eventrigger = function(){
		var _t = this;
		var obj = {
			year : 0,
			month : 0
		}
		this.diaYearPanel.on('click','li',function(e){
			_t.diaYearPanel.fadeOut(0);
			_t.diaMonthPanel.fadeIn(300);
			obj.year = $(this).text();
		})
		this.diaMonthPanel.on('click','li',function(e){
			obj.month = $(this).text() - 1;
			_t.close();
			_t._callback(obj);
		})
	}
	//弹窗出现
	CalendarDialogPlugin.prototype.show = function(){
		this.diaYearPanel.show();
		this.diaMonthPanel.hide();
		this.diaPanel.fadeIn(300);
	}
	//弹窗消失
	CalendarDialogPlugin.prototype.close = function(){
		this.diaPanel.fadeOut(200);
	}
//----
	Calendar.WEEK = ['日','一','二','三','四','五','六'];
	function Calendar(params){
		this.p = $.extend({
			dom : '',         //聚焦dom
			format : '',     //设置输出格式  
			maxYear : 2030,   //设置最大到多少年
		  	minYear : 2000    //设置最小到多少年
		},params || {})
		this.date = new Date();
		this.thisYear = this.date.getFullYear();     
		this.thisMonth = this.date.getMonth();
		this.day = this.date.getDate();
		this.kernal = new CalendarKernal();
		this._init();
	}
	Calendar.prototype._init = function(){
		if(this.thisYear > this.p.maxYear || this.thisYear < this.p.minYear){
			throw new Error("The year must less than "+this.p.maxYear+" and greater than "+this.p.minYear);
			return false;
		}
		this.paramYear = this.thisYear;
		this.paramMonth = this.thisMonth;
		this.kernalObj = this.kernal.fresh(this.thisYear,this.thisMonth);
		this._creatBasePanel();
		this._creatYearTab();
		this._creatWeekTab();
		this._creatMonthTab();
		this.dialogPlugin = new CalendarDialogPlugin();
		this.dialogPlugin.init({
			parentDom : this.calendarYearPanel.yearTab,   
			thisYear : this.thisYear,
			maxYear : this.p.maxYear,   
		  	minYear : this.p.minYear   
		},$.proxy(this.plugin,this));
		this._eventBind();
	}

	Calendar.prototype.plugin = function(obj){
		this.fresh(obj.year,obj.month);
	}

	Calendar.prototype.fresh = function(year,month){
		if(year > this.p.maxYear || year < this.p.minYear){
			throw new Error("The year must less than "+this.p.maxYear+" and greater than "+this.p.minYear);
			return false;
		}
		this.paramYear = year;
		this.paramMonth = month;
		this.kernalObj = this.kernal.fresh(year,month);
		this._freshYearTab(year,month);
		this._freshMonthTab();
	}

	Calendar.prototype._eventBind = function(){
		var _t = this;
		this.calendarYearPanel.find('.J_nextMonth').click($.proxy(this._nextMonthClick,this));
		this.calendarYearPanel.find('.J_prevMonth').click($.proxy(this._prevMonthClick,this));
		this.calendarYearPanel.find('.J_prevYear').click($.proxy(this._prevYearClick,this));
		this.calendarYearPanel.find('.J_nextYear').click($.proxy(this._nextYearClick,this));
		this.calendarYearPanel.yearTab.find('span').click($.proxy(this._yearTabClick,this));
		this.calendarMonthPanel.on('click','li',function(){
			_t._monthClick(this)
		})
	}
	Calendar.prototype._monthClick = function(t){
		var v = this.paramYear+'-'+(this.paramMonth+1)+'-'+$(t).text()
		if(this.p.dom.get(0).tagName == 'INPUT'){
			this.p.dom.val(v)
		}else{
			this.p.dom.text(v)
		}
	}
	Calendar.prototype._yearTabClick = function(){
		this.dialogPlugin.show();
	}
	Calendar.prototype._nextYearClick = function(){
		var year = Number(this.paramYear) + 1;
		var month = 0;
		this.fresh(year,month);
	}
	Calendar.prototype._prevYearClick = function(){
		var year = Number(this.paramYear) - 1;
		var month = 0;
		this.fresh(year,month);
	}
	Calendar.prototype._nextMonthClick = function(){
		var month = Number(this.paramMonth) + 1;
		var year = Number(this.paramYear);
		if(month > 11){
			month = 0;
			year = year + 1;
		}
		this.fresh(year,month);
	}

	Calendar.prototype._prevMonthClick = function(){
		var month = Number(this.paramMonth) - 1;
		var year = Number(this.paramYear);
		if(month < 0){
			month = 11;
			year = year - 1;
		}
		this.fresh(year,month);
	}

	Calendar.prototype._creatBasePanel = function(){
		this.calendarPanel = $('<div class="m-calendar"></div>');
		this.calendarYearPanel = $('<div class="m-calendar-year"></div>');
		this.calendarWeekPanel = $('<div class="m-calendar-week"></div>');
		this.calendarMonthPanel = $('<div class="m-calendar-month"></div>');
		this.calendarPanel.append(this.calendarYearPanel)
		.append(this.calendarWeekPanel)
		.append(this.calendarMonthPanel);
	}


	//检查是否是本月
	Calendar.prototype._checkThisMonth = function(){
		if(this.paramYear == this.thisYear && this.paramMonth == this.thisMonth) return true
		return false;
	}
	//创建周面板
	Calendar.prototype._creatWeekTab = function(){
		var html = '<ul>';
		for(var i = 0,data = Calendar.WEEK,len = data.length; i < len; i++){
			html += '<li>'+data[i]+'</li>';
		}
		html += '</ul>';
		this.calendarWeekPanel.append(html);
	}
	//创建年面板
	Calendar.prototype._formatMonth = function(month){
		if(month < 10)	return '0'+month;
		else return month;
	}
	Calendar.prototype._creatYearTab = function(){
		var html = '<i class="J_prevYear iyear">&lt;&lt;</i><i class="J_prevMonth imonth">&lt;</i><div class="J_yearTab yearTab"><span>';
		html += this.thisYear;
		html += '年'+this._formatMonth(this.thisMonth+1)+'月</span></div><i class="J_nextMonth imonth">&gt;</i><i class="J_nextYear iyear">&gt;&gt;</i>';
		this.calendarYearPanel.append(html);
		this.calendarYearPanel.yearTab = this.calendarYearPanel.find('.J_yearTab');
	}
	Calendar.prototype._freshYearTab = function(year,month){
		this.calendarYearPanel.yearTab.find('span').text(year+'年'+this._formatMonth(month+1)+'月');
	}
	//创建月面板
	Calendar.prototype._commonMonthTab = function(){
		function creatMonthType(n){
			var f = {
				creatType1 : function(){
					var html = '';
					var classN = '';
					for(var j = 0,len = this.kernalObj.thisMaxMonth; j < len; j++){
						if(this.day == (j+1)) classN = ' class="u-now"';
						else classN = ' class="u-notNow"';
						html += '<li'+classN+'>'+(j+1)+'</li>';
					}
					return html;
				},
				creatType2 : function(){
					var html = '';
					for(var j = 0,len = this.kernalObj.thisMaxMonth; j < len; j++){
						html += '<li>'+(j+1)+'</li>';
					}
					return html;
				}
			};
			switch(n){
				case 1:
					return f.creatType1.call(this);
					break;
				case 2:
					return f.creatType2.call(this);
					break;
			}
		}		
		

		var html = '<ul>';
		//上月
		for(var i = this.kernalObj.thisHeadWeek; i > 0; i--){
			html += '<li class="u-ago">'+(this.kernalObj.prevMaxMonth - i + 1)+'</li>';
		}
		//本月
		if(this._checkThisMonth()){
			html += creatMonthType.call(this,1);
		}else{
			html += creatMonthType.call(this,2);
		}
		//下月
		for(var k = 0,len = 6 - this.kernalObj.thisFootWeek; k < len; k++){
			html += '<li class="u-feture">'+(k+1)+'</li>';
		}
		html += '</ul>';
		return html;
	}

	Calendar.prototype._creatMonthTab = function(){
		var html = this._commonMonthTab();
		this.calendarMonthPanel.append(html);
	}

	Calendar.prototype._freshMonthTab = function(){
		var html = this._commonMonthTab();
		this.calendarMonthPanel.html(html);
	}
	//----
	Calendar.prototype.calendarShow = function(){
		if(this.calendarPanel.data('isShow') > 0){
			this.calendarPanel.show();
			return false;
		}
		this.calendarPanel.data('isShow','1');
		$('body').append(this.calendarPanel);
	}

	module.exports = Calendar;
});
