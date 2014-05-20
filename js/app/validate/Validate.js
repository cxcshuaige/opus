define(function(require,exports,module){
	var $ = require('$');
	function Validate(valDom){
		this.valDom = valDom;
		this.checkArray = [];
		this._initValitate();
	}
	/*--- 正则及错误信息输出表 ---*/
	Validate.Regular = {
		notSpace : {
			regular : "^[\\s|\\S]",
			str : "不能为空!"
		},
		personName : {
			regular : "^[\\s\\S]{2,15}$",
			str : "只能输入2-15个字!"
		},
		selfIntro : {
			regular : "^[\\s\\S]{10,70}$",
			str : "只能输入10-70个字!"
		},
		createIntro : {
			regular : "^[\\s\\S]{20,70}$",
			str : "只能输入20-70个字!"
		},
		userName : {
			regular : "^([A-Za-z0-9_]){5,20}$",
			str : "您的填写有误，会员名只能由5-20个英文、数字及下划线字符组成!"
		},
		email : {
			regular : "^\\w+[\\w-.]*\\w*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$",
			str : "请输入正确的email!"
		},
		mobile : {
			regular : "^1[3|4|5|8][0-9]\\d{8}$",
			str : "请输入正确的手机号码!"
		},
		qqNumber : {
			regular : "^[0-9]*$",
			str : "请输入正确的QQ号码!"
		}
	}
	/*
	author : 希杍
	infro : 表单验证控件
	dec : 对照表结构 Validate.Regular 输出相应正则及错误信息
	param:valDom:控件父节点集合
	fun ： checkAll 
		对外方法 ：检查所有表单是否通过验证

	特殊功能说明：
		表单中定义err属性后，已自定义err为高优先级
		表单中自定义的regular属性为能在正则及错误信息出去表找到，则已自定义为主
		表单中定义了fliter = y 后，则会启动过滤表单内容的 < > & 等特殊字符
		表单中定义了ety = '不能为空' 后，则会启动为空判断的功能

	HTML Code
	<label class="J_validate">
		<span class="k_f14 k_fl zp">手机号码 <i class="k_cd00">*</i>：</span>
		<input id="Mobile" type="text" class="J_input" ety="手机号码不能为空!" regular="notSpace" err="手机号码有误" fliter="y"/>
		<span class="J_tips tip">用于作品审核结果、入围、获奖通知</span>
	</label>

	JS Code
		var validateDom = $('.J_validate');
		var validate = new Validate(validateDom);
		$('#ff').click(function(){
			var check = validate.checkAll();
			alert(check)  //boolean类型输出
		});
	*/
	Validate.prototype = {
		_initValitate : function(){
			var _t = this;
			this.valDom.each(function(i){
				var valInput = $(this).find('.J_input'),
					valRegular = Validate.Regular[valInput.attr('regular')] ? Validate.Regular[valInput.attr('regular')].regular : valInput.attr('regular') || null;
				_t._checkArrayPush(valInput,valRegular,i);
				_t._inputBlur(valInput,valRegular,i);
			});
		},

		_inputBlur : function(valInput,valRegular,i){
			if (!valRegular) return;
			var _t = this;
			valInput.blur(function(e){
				var str = _t._trimStr(valInput.val());
					_t._inputEmpty(valInput,str,valRegular,i);
			});
		},

		_inputEmpty : function(valInput,str,valRegular,i){
			var ety = valInput.attr('ety');
			if(ety){
				if(str.length < 1){
					this._emptyErrTipStyle(i,ety);
					this.checkArray[i].flag = false;
				}
				else this._regular(valInput,str,valRegular,i);
			}else{
				this._regular(valInput,str,valRegular,i);
			}
		},

		_regular : function(valInput,str,valRegular,i){
			var reg = new RegExp(valRegular, "i");
			if(!reg.test(str)){
				this._errTipStyle(i);
				this.checkArray[i].flag = false;
			}else{
				this._rightTipStyle(i);
				this.checkArray[i].flag = true;
			}
		},

		_regularInit : function(valInput,str,valRegular,i){
			var reg = new RegExp(valRegular, "i");
			if(!reg.test(str)){
				this.checkArray[i].flag = false;
			}else{
				this.checkArray[i].flag = true;
			}
		},

		_checkArrayPush : function(valInput,valRegular,i){
			var errTip = valInput.attr('err') ? valInput.attr('err') : Validate.Regular[valInput.attr('regular')] ? Validate.Regular[valInput.attr('regular')].str : '',
				fliter = valInput.attr('fliter') || 'n',
				str = this._trimStr(valInput.val());
			if(valRegular){
				this.checkArray[i] = {
					flag : false,
					errTip : errTip,
					fliter : fliter
				}
				this._regularInit(valInput,str,valRegular,i);
			}else{
				this.checkArray[i] = {
					flag : true,
					errTip : errTip,
					fliter : fliter
				}
			}
		},

		_errTipStyle : function(i){
			var tipsDom = this.valDom.eq(i).find('.J_tips');
			tipsDom.addClass('errTip').text(this.checkArray[i].errTip);
		},

		_emptyErrTipStyle : function(i,ety){
			var tipsDom = this.valDom.eq(i).find('.J_tips');
			tipsDom.addClass('errTip').text(ety);
		},

		_rightTipStyle : function(i){
			var tipsDom = this.valDom.eq(i).find('.J_tips');
			tipsDom.removeClass('errTip').addClass('rightTip').text('');
		},

			//去空格
		_trimStr : function(str){   
		    if ((typeof(str) != "string") || !str){  
		        return "";   
		    }  
		    return str.replace(/(^\s*)|(\s*$)/g,"");   
		},
			//防止特殊字符输入
		_htmlspecialchars : function(str){  
			var s = '';
			if(str.length == 0) return '';
			for(var i=0; i<str.length; i++){
				switch (str.substr(i,1)){
					case '<': s += '&lt;'; break;
					case '>': s += '&gt;'; break;
					case '&': s += '&amp;'; break;
					case ' ':
						if(str.substr(i + 1, 1) == ' '){
							s += '&nbsp;';
							i++;
						}else s += ' ';
						break;
					case '\"': s += '&quot;'; break;
					case '\n': s += '<br>'; break;
					default: s += str.substr(i,1); break;
				}
			}
			return s;
		},
		/*--- 对外方法 ---*/
		checkAll : function(){
			var flag = true;
			for(var i=0; i<this.checkArray.length; i++){
				if(this.checkArray[i].flag == false){
					flag = false;
					this._errTipStyle(i);
					this._positionErr(i);
					return flag;
				}else{
					if(this.checkArray[i].fliter == 'y'){
						this._fliterHtml(i);
					}
					this._rightTipStyle(i);
				}
			}
			return flag;
		},

		_fliterHtml : function(i){
			var valInput = this.valDom.eq(i).find('.J_input'),
				str = this._htmlspecialchars(valInput.val());
			valInput.val(str);		
		},
		//定位到错误位置
		_positionErr : function(i){
			var valInput = this.valDom.eq(i).find('.J_input'),
				siteTop = (valInput.offset().top - 100) > 0 ? valInput.offset().top - 100 : valInput.offset().top;
				valInput.focus();
			$('html, body').animate({scrollTop:siteTop},100);
		}
	};
	module.exports = Validate;
});