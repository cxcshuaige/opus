define(function(require,exports,module){
	var $ = require('$');
	var provinceAndCityData = require('./ProvinceAndCityJson');
	function ProvinceCitySystem(parentDom){
		this.provinceAndCityData = provinceAndCityData;
		this.province = parentDom.find('#Province');
		this.cityDiv = parentDom.find('.J_city');
		this.areaDiv = parentDom.find('.J_area');
		this.errTipDom = parentDom.find('.J_tips');
		this.checkArray = [false,false,false];
		this._holdProvince();
	}
	ProvinceCitySystem.prototype = {
		_holdProvince : function(){
			var _t = this,pData = this.provinceAndCityData.province;
			for(var i = 0; i < pData.length; i++){
				this.province.append('<option value="'+pData[i].name+'" item="'+i+'">'+pData[i].name+'</option>');
			}
			this.province.change(function(){
				var cityItem = jQuery(this).find("option:selected").attr('item');
				_t._creatDom();
				_t._excuteCity(cityItem);
				if(jQuery(this).val() != '请选择') _t.checkArray[0] = true;
				else _t.checkArray[0] = false;
			});
		},

		_creatDom : function(){
			var cityHtml = '<select id="City" class="selectInp">'+
								'<option>请选择</option>'+
							'</select>';
			this.cityDiv.html(cityHtml);
			var areaHtml = '<select id="Area" class="selectInp">'+
								'<option>请选择</option>'+
							'</select>';
			this.areaDiv.html(areaHtml);
		},

		_excuteCity : function(cityItem){
			var _t = this;
			var city = jQuery('#City');
			this._cityRefresh(city,cityItem);
			city.change(function(){
				var areaItem = jQuery(this).find("option:selected").attr('item');
				_t._excuteArea(cityItem,areaItem);
				if(jQuery(this).val() != '请选择') _t.checkArray[1] = true;
				else _t.checkArray[1] = false;
			});
		},

		_cityRefresh : function(city,cityItem){
			var pData = this.provinceAndCityData.province[cityItem].city;
			for(var i = 0; i < pData.length; i++){
				city.append('<option value="'+pData[i].name+'" item="'+i+'">'+pData[i].name+'</option>');
			}
		},

		_excuteArea : function(cityItem,areaItem){
			var _t = this;
			var areaHtml = '<select id="Area" class="selectInp">'+
								'<option>请选择</option>'+
							'</select>';
			this.areaDiv.html(areaHtml);
			var area = jQuery('#Area');
			this._areaRefresh(area,cityItem,areaItem);
			area.change(function(){
				if(jQuery(this).val() != '请选择'){
					_t.checkArray[2] = true;
					_t.errTipDom.removeClass('errTip').addClass('rightTip').text('');
				}else{
					_t.checkArray[2] = false;
				}
			});
		},

		_areaRefresh : function(area,cityItem,areaItem){
			var pData = this.provinceAndCityData.province[cityItem].city[areaItem].area;
			for(var i = 0; i < pData.length; i++){
				area.append('<option value="'+pData[i].name+'" item="'+i+'">'+pData[i].name+'</option>');
			}
		},

		/*--- 对外方法 ---*/
		selectAll : function(){
			var flag = true;
			for(var i=0; i<this.checkArray.length; i++){
				if(this.checkArray[i] == false){
					flag = false;
					this.errTipDom.addClass('errTip').text('请选择正确的省市区!');
				}
			}
			return flag;
		}
	};
	module.exports = ProvinceCitySystem;
});