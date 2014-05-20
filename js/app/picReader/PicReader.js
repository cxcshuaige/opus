define(function(require,exports,module){
	var $ = require('$');
	var __bind = function(fn,me){
		return function(){
			return fn.apply(me,arguments);
		}
	}

	function PicReader(options){
		this.p = $.extend({
			readerContainer : '',
			imgminwidth : 708
		},options || {});
		this.win = $(window.document);
		this.clickFlag = false;
		this.prestrainFlag = false;  //预加载控制杆
	}

//初始化
	PicReader.prototype.init = function(data,callback){
		this.data = data;	//数据源
		this._dataLen = this.data.length;  //总数据数量
		this._callback = callback || '';
		this._imgIndex = 0;		//当前数据索引
		this._dirCur = 'first';   //初始化聚焦在firstdom里
		this._imgCache = {};	//缓存
		this._domReady();
		this.p.readerContainer.click(__bind(this._readerContainerClick,this));
		this.p.readerContainer.hover(__bind(this._winbindmove,this),__bind(this._winunbindmove,this));
	}

//图片直接容易准备
	PicReader.prototype._winbindmove = function(){
		this.p.readerContainer.mousemove(__bind(this._docOver,this));
	}

//图片直接容易准备
	PicReader.prototype._winunbindmove = function(){
		this.p.readerContainer.unbind('mousemove');
	}

//图片直接容易准备
	PicReader.prototype._domReady = function(){
		this._firstDom = $('<div class="c_imgContainer"></div>');
		this._secondDom = $('<div class="c_imgContainer"></div>');
		this._statusDom = this.p.readerContainer.find('.J_status');
		this._infoDom = $('<dl class="c_readerTips"><dt><i class="J_info_i"></i>/'+this._dataLen+'</dt><dd><p class="J_info_t t"></p><p class="J_info_c c"></p></dd></dl>')
		this.p.readerContainer.append(this._firstDom).append(this._secondDom);
		this._imgCreate(this._imgIndex,this._firstDom);
		this._prestrain(this._imgIndex,'right');
	}

//图片预加载推后2张
	PicReader.prototype._prestrain = function(index,direction){
		if(this.prestrainFlag) return
		this.prestrainFlag = true;
		var img1in,
			img2in,
			img1,
			img2,
			_t = this;
		if(direction == 'left'){
			img1in = index - 1;
			img2in = index - 2;
		}else{
			img1in = index + 1;
			img2in = index + 2;
		}
		function imgPrestrain(t,i){
			if(!t.data[i]) return;
			var img = $('<img />'),
				src = t.data[i].img;
			img.attr('src',src);
			img.load(function(){
				if(img[0].width >= t.p.imgminwidth) img[0].width = t.p.imgminwidth;
				t._imgCache[i] = img;
				t.prestrainFlag = false;
			});
			img.error(function(){
				//console.log('失败');
				t._imgCache[i] = '';
				t.prestrainFlag = false;
			});
		}
		if(img1in > this._dataLen) img1in = 1;
		if(img2in > this._dataLen) img2in = 2;
		if(img1in < 0) img1in = this._dataLen - 1;
		if(img2in < 0) img2in = this._dataLen - 2;
		if(!this._imgCache[img1in]){
			if(!_t.data[img1in]) return;
			img1 = $('<img />');
			var src = _t.data[img1in].img;
			img1.attr('src',src);
			img1.load(function(){
				if(img1[0].width >= _t.p.imgminwidth) img1[0].width = _t.p.imgminwidth;
				_t._imgCache[img1in] = img1;
				imgPrestrain(_t,img2in);
			});
			img1.error(function(){
				//console.log('失败');
				_t._imgCache[img1in] = '';
				_t.prestrainFlag = false;
			});
		}else{
			this.prestrainFlag = false;
		}
	}

//容器单击事件
	PicReader.prototype._readerContainerClick = function(e){
		if(this.clickFlag) return;
		this.clickFlag = true;
		var obj = this._controlAreaCalc(),	//得到区域信息
			x = e.pageX,
			y = e.pageY;
		if(x > obj.leftMin && x < obj.leftMid && y > obj.topMin && y < obj.topMax){
			this._excute('left');
		}
		if(x > obj.leftMid && x < obj.leftMax && y > obj.topMin && y < obj.topMax){
			this._excute('right');
		}
	}

//容器鼠标移动事件  用来改变鼠标样式
	PicReader.prototype._docOver = function(e){
		var obj = this._controlAreaCalc(),	//得到区域信息
			x = e.pageX,
			y = e.pageY;
		if(x > obj.leftMin && x < obj.leftMid && y > obj.topMin && y < obj.topMax){
			this.p.readerContainer.removeClass('c_rightCur').addClass('c_leftCur');    //鼠标变左箭头
		}
		if(x > obj.leftMid && x < obj.leftMax && y > obj.topMin && y < obj.topMax){
			this.p.readerContainer.removeClass('c_leftCur').addClass('c_rightCur');	//鼠标变右箭头
		}
	}

//img创建
	PicReader.prototype._imgCreate = function(index,dom){
		var _t = this;
		if(this._imgCache[index]){
			dom.html(this._imgCache[index]);
			this._effectSwich(dom,index);
			this._picStatus().hide();  
			return;
		}

		this._picStatus().show();
		var img = $('<img />'),
			src = this.data[index].img;
		img.attr('src',src);
		if(img.get(0).height){
			this._imgCreateSuc.apply({_t:this,index:index,img:img,dom:dom});
			return;
		}
		img.load(__bind(this._imgCreateSuc,{_t:this,index:index,img:img,dom:dom}));
		img.error(function(){
			//console.log('失败');
			_t.clickFlag = false;
		});
	}

	PicReader.prototype._imgCreateSuc = function(){
		if(this.img[0].width >= this._t.p.imgminwidth) this.img[0].width = this._t.p.imgminwidth;
		this._t._imgCache[this.index] = this.img;
		this.dom.html(this._t._imgCache[this.index]);
		this._t._effectSwich(this.dom,this.index);
		this._t.p.readerContainer.css('height','auto');
		this._t._picStatus().hide();
	}	
//淡入淡出特效切换
	PicReader.prototype._effectSwich = function(dom,index){
		var _t = this;
		if(this._dirCur == 'first'){

			setTimeout(function(){
				_t._secondDom.css('display','none');
				_t._firstDom.css('display','block');
				_t._callback && _t._callback(_t);
				_t.clickFlag = false;
				_t._getPicInfo(dom,index);
			},50);

			// this._secondDom.fadeOut(20,function(){
			// 	_t._firstDom.fadeIn(10,function(){
			// 		_t._callback && _t._callback(_t);
			// 		_t.clickFlag = false;
			// 	});
			// 	_t._getPicInfo(dom,index)
			// });
		}else{

			setTimeout(function(){
				_t._firstDom.css('display','none');
				_t._secondDom.css('display','block');
				_t._callback && _t._callback(_t);
				_t.clickFlag = false;
				_t._getPicInfo(dom,index);
			},50);

			

			// this._firstDom.fadeOut(20,function(){
			// 	_t._secondDom.fadeIn(10,function(){
			// 		_t._callback && _t._callback(_t);
			// 		_t.clickFlag = false;
			// 	});
			// 	_t._getPicInfo(dom,index)
			// });
		}
	}

//切换区域计算
	PicReader.prototype._controlAreaCalc = function(){
		var readerOffset = this.p.readerContainer.offset(),
			readerWidth = this.p.readerContainer.width(),
			readerHeight = this.p.readerContainer.height(),
			topMax = readerOffset.top + readerHeight,
			leftMid = readerOffset.left + readerWidth/2,
			leftMax = readerOffset.left + readerWidth;
		return {
			topMin : readerOffset.top,
			topMax : topMax,
			leftMin : readerOffset.left,
			leftMid : leftMid,
			leftMax : leftMax
		}
	}

/*
*图片切换执行
* direction:方向  left、right
*/
	PicReader.prototype._excute = function(direction){
		switch(direction){
			case 'left':
				this._imgIndex--;
				if(this._imgIndex < 0) this._imgIndex = this._dataLen - 1;
				this._excuteDo();
				this._prestrain(this._imgIndex,'left');  //图片预加载
				break;
			case 'right':
				this._imgIndex++;
				if(this._imgIndex >= this._dataLen) this._imgIndex = 0;
				this._excuteDo();
				this._prestrain(this._imgIndex+1,'right'); //图片预加载
				break;
			default:
				break;
		}
	}

	PicReader.prototype._excuteDo = function(){
		if(this._dirCur == 'first'){
			this._dirCur = 'second';
			this._imgCreate(this._imgIndex,this._secondDom);
		}else{
			this._dirCur = 'first';
			this._imgCreate(this._imgIndex,this._firstDom);
		}
	}
/*
* 图片加载状态控制器
*
*/
	PicReader.prototype._picStatus = function(){
		var _t = this;
		return {
			outTime : '',
			show : function(){
				_t.outTime = setTimeout(function(){
					_t._statusDom.css('display','block');
				},200);
			},
			hide : function(){
				clearTimeout(_t.outTime);
				_t._statusDom.css('display','none');
			}
		}

	}


/*
* 图片信息注入
*
*/
	PicReader.prototype._getPicInfo = function(dom,index){
		var index = parseInt(index),
			img = this._imgCache[index],
			_t = this;
		dom.append(this._infoDom);
			//dom.width(img.width());
			_t._infoDom.find('.J_info_i').text(index+1);
			_t._infoDom.find('.J_info_t').text(_t.data[index].title);
	}

/*
* 对外方法图片聚焦切换
*
*/
	PicReader.prototype.excute = function(i){
		this._imgIndex = i;
		this._excuteDo();
	}

	module.exports = PicReader;
});