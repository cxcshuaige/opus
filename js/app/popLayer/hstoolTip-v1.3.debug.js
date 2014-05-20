(function(){

/*-- extend --*/
function __extend(destination, source) {
	for (var property in source) {
	    destination[property] = source[property];
	}
	return destination;
}

function __resize(resize){
	if(document.body.onresize) { // for IE6 IE7  
	    document.body.onresize = resize;  
	}else{   
	    window.onresize = resize;  
	}
}

function __insertAfter(newEl, targetEl){
    var parentEl = targetEl.parentNode;
    if(parentEl.lastChild == targetEl){
        parentEl.appendChild(newEl);
    }else{
        parentEl.insertBefore(newEl,targetEl.nextSibling);
    }
}

function __offsetTop(elements){    
    var top = elements.offsetTop;    
    var parent  = elements.offsetParent;    
    while( parent != null ){    
        top += parent.offsetTop;    
        parent = parent.offsetParent;    
    };    
    return top;    
};

function __offsetLeft(elements){    
    var left = elements.offsetLeft;    
    var parent = elements.offsetParent;    
    while( parent != null ){    
        left += parent.offsetLeft;    
        parent = parent.offsetParent;    
    };    
    return left;    
}; 

/*-- util --*/
function __addEvent(elem, type, fn, b) {
	if (elem.addEventListener) {
	    return elem.addEventListener(type, fn, b != null ? b : false);
	}else if (elem.attachEvent) {
	    return elem.attachEvent("on" + type, fn);
	}else {
	    return elem["on" + type] = fn;
	}
};

function __bind(fn,me){
	return function(){
		return fn.apply(me,arguments);
	}
}

/*
*   
	getJSONP('http://localhost:8888/',function(response){
	　　alert(response.name);
	});
*/
function __getJSONP(url, callback,funName) {
    if (!url) {
        return;
    }
    var a = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'], //定义一个数组以便产生随机函数名
    	r1 = Math.floor(Math.random() * 10),
    	r2 = Math.floor(Math.random() * 10),
    	r3 = Math.floor(Math.random() * 10),
   		name = a[r1] + a[r2] + a[r3],
    	cbname; //作为jsonp函数的属性
    if(funName)  cbname = funName;
    else cbname = '__tooltip' + name;
    if (url.indexOf('?') === -1) {
        url += '?callback=' + cbname;
    } else {
        url += '&callback=' + cbname;
    }
    var script = document.createElement('script');
    //定义被脚本执行的回调函数
    window[cbname] = function (e) {
        try {
            //alert(e.name);
			callback && callback(e);
        } catch (e) {
            //
        }
        finally {
            //最后删除该函数与script元素
            delete __getJSONP[name];
            script.parentNode.removeChild(script);
        }

    }
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
}

/*
 * 根据元素clsssName得到元素集合
 * @param father 父元素，默认为document
 * @tagName 子元素的标签名
 * @className 用空格分开的className字符串
 */
function __getElementsByClassName(father,tagName,className){
	var argsLen = arguments.length,node;
	if (argsLen === 1) return
	else if(argsLen === 2) {
	    node = father || document;
	    className = tagName;
	    tagName = "*";
	}else{
		node = father || document;
    	tagName = tagName || "*";
	}
    var els = node.getElementsByTagName(tagName),
    	result = [],
   		re=new RegExp('\\b'+className+'\\b', 'i');
    for(var i=0,j=els.length;i<j;i++){//缓存length属性
        if(re.test(els[i].className)){
        	result.push(els[i]);
        }
    }
    return result;
}

/*
 * 加载css
 * @url css url
 * @callback 回调
 * @charset 编码格式
 */

function __loadScript(url, callback, charset) {
	var head = document.getElementsByTagName("head")[0] || document.documentElement,
		baseElement = head.getElementsByTagName("base")[0],
		IS_CSS_RE = /\.css(?:\?|$)/i,
		isCSS = IS_CSS_RE.test(url),
		node = document.createElement(isCSS ? "link" : "script");
	if (charset) node.charset = charset;
	__addOnload(node, callback, isCSS)
	if (isCSS) {
		node.rel = "stylesheet"
		node.href = url
	}else {
		node.async = true
		node.src = url
	}
	baseElement ?
		head.insertBefore(node, baseElement) :
		head.appendChild(node);
}

function __addOnload(node, callback) {
	var READY_STATE_RE = /^(?:loaded|complete|undefined)$/;
	node.onload = node.onerror = node.onreadystatechange = function() {
		if (READY_STATE_RE.test(node.readyState)) {
			node.onload = node.onerror = node.onreadystatechange = null;
			// 废弃dom节点
			node = null;
			if(callback) callback();
		}
	}
}

//-----------------------------------------------------------------------------------
/*-- Class PopUpLayer --*/
PopLayer.instance;
PopLayer.get = function(i,eventType){
	var eventType = eventType || 'hover',
		instance = PopLayer.instance;
	if(!instance) instance = PopLayer.instance = new PopLayer(eventType);
	return instance;
}
/*
* eventType:触发poplayer的事件类型
*/
function PopLayer(eventType){
	this.popLayerDom = document.createElement('div');
	this.popLayerDom.className = 'c_popLayer';
	this.popLayerClose = document.createElement('span');
	this.popLayerClose.className = 'c_popClose';
	this.popLayerCont = document.createElement('div');
	this.popLayerCont.className = 'c_popCont';
	this.popLayerDom.appendChild(this.popLayerClose);
	this.popLayerDom.appendChild(this.popLayerCont);
	document.body.appendChild(this.popLayerDom);
	//this._isIeModel();
	var _t = this;
	this.popLayerClose.onclick = function(){
		_t.popLayerDom.style.display = 'none';
	}
	if(eventType == 'hover'){
		_t._popLayerHoverBind();
	}
	__resize(function(){
		_t._refreshPosition();
	})
}

/*
 * 鼠标事件注册
 */
PopLayer.prototype._popLayerHoverBind = function(){
	var _t = this,mouseoutTime;
	var mouseover = function(e){
		clearTimeout(mouseoutTime);  //阻止popLayerDom内部元素导致popLayerDom的mouseout时间触发
		//预留 e.target
		if(this.timeout) clearTimeout(this.timeout);
	}
	var mouseout = function(e){
		mouseoutTime = setTimeout(function(){
			_t.popLayerHide();
		},40);
	}
	this.popLayerDom.onmouseover = __bind(mouseover,this);
	this.popLayerDom.onmouseout = __bind(mouseout,this);
}

/*
 * 计算popuplayer框的位置(核心部分)
 */
PopLayer.prototype._calcLayerPosition = function(params){
	var targetPos,popLayerPos,
		popLayerWidth = this.popLayerDom.offsetWidth,
		popLayerHeight = this.popLayerDom.offsetHeight,
		popLayerScrollTop = this._getScroll().scrollTop,
		w = this._getWinSize().width,
		h = this._getWinSize().height;
	targetPos = {
		width:params.targetDom.offsetWidth,
		height: params.targetDom.offsetHeight,
		offset:{
			top : __offsetTop(params.targetDom),
			left : __offsetLeft(params.targetDom)
		}
	};
	popLayerTop = targetPos.offset.top - popLayerHeight - params.layerY;
	if(popLayerTop < popLayerScrollTop){ //如果弹窗超出了顶部
		popLayerTop = targetPos.offset.top + targetPos.height + params.layerY;

	}

	popLayerLeft = targetPos.offset.left + targetPos.width + params.layerX;
	if((popLayerLeft+popLayerWidth) > w){ //如果弹窗超出了底部
		popLayerLeft = targetPos.offset.left - popLayerWidth - params.layerX;
	}
	popLayerPos = {
		popLayerTop: popLayerTop,
		popLayerLeft: popLayerLeft
	};
	return popLayerPos;
}

/*
 * 刷新定位popuplayer
 */
PopLayer.prototype._refreshPosition = function(){
	var popLayerPos = this._calcLayerPosition(this.p);
	this.popLayerDom.style.top = popLayerPos.popLayerTop + 'px';
	this.popLayerDom.style.left = popLayerPos.popLayerLeft + 'px';
}

/*
 * IE6、7 兼容select 层级无法覆盖问题
 */
PopLayer.prototype._isIeModel = function(){	//IE 兼容 select 
	if (navigator.userAgent.indexOf("MSIE 6.0")>0 || navigator.userAgent.indexOf("MSIE 7.0")>0){  
		var _ifrm = document.createElement('iframe');
			_ifrm.className = 'c_modelLayerIf';
		this.popLayerDom.appendChild(_ifrm);
		_ifrm.onload = function(){
			_ifrm.contentWindow.document.getElementsByTagName('body').style.backgroundColor = '#ccc';
		};
	}
}

/*
 * 得到窗口可是区域的宽和高
 */
PopLayer.prototype._getWinSize = function(){
	var h,  w, _ref2, _ref3;
	if ((_ref2 = document.documentElement) != null ? _ref2.clientHeight : 0) {
	    w = document.documentElement.clientWidth;
	    h = document.documentElement.clientHeight + document.body.scrollTop;
	}else if ((_ref3 = document.body) != null ? _ref3.clientHeight : 0) {
	    w = document.body.clientWidth;
	    h = document.body.clientHeight;
	}else if (window.innerHeight) {
	    w = window.innerWidth;
	    h = window.innerHeight;
	}
	return {
		width : w,
		height : h
	}
}

/*
 * 得到上滚动或左滚动的距离
 */
PopLayer.prototype._getScroll = function(ele){
    //获取scrollX
	function scrollX(ele){
		var element=ele || document.body;
		return element.scrollLeft || (document.documentElement && document.documentElement.scrollLeft);
	}
   //获取scrollY
	function scrollY(ele){
		var element=ele || document.body;
		return element.scrollTop || (document.documentElement && document.documentElement.scrollTop);
	}
	return {
		scrollLeft:scrollX(ele),
		scrollTop:scrollY(ele)
	}
}

/*
 * 出现popuplayer(对外方法)
 */
PopLayer.prototype.showPop = function(params,htmlCreat,callback){
	var html;
	this.p = __extend({
		targetDom : window.document,    //目标dom
		closeBtn : true,				//是否有关闭按钮
		direct : 'right',				//弹窗位置  支持 上top 右right
		layerX : 0,						//弹窗偏移量x轴
		layerY : 0						//弹窗偏移量y轴
	},params || {});
	if(this.p.closeBtn) this.popLayerClose.style.display = 'block';  //关闭按钮开启
	if(htmlCreat) html = htmlCreat();  
	this.popLayerCont.innerHTML = html;    //创建dom结构内容
	this.popLayerDom.style.display = 'block';
	this._refreshPosition();
	if(callback) callback(this);
}

/*
 * 隐藏popuplayer(对外方法)
 */
PopLayer.prototype.popLayerHide = function(){
	var _t = this;
	this.timeout = setTimeout(function(){
		_t.popLayerDom.style.display = 'none';
	},40);
}

//以下为业务代码
//---------------------------------------------------------------------

var _ajaxUrl = window._ajaxUrl || '',
	_cssUrl = window._cssUrl || '',
	_timeout = '',
	_dataCache = {};  //缓存数据
var _elmMouseover = function(e){
	var dId = this.params.dId,
		dlang = this.params.dlang,
		dtype = this.params.dtype,
		dname = this.params.dname;
		_t = this;
	_timeout = setTimeout(function(){
		if(_dataCache[dId] || _dataCache[dname]){   //缓存读取
			PopLayer.get().showPop({
			    targetDom : _t.elm,
			    layerY : 3,
			    layerX : 3,
			    closeBtn : false
			},function(){
				if(_dataCache[dId]) return _dataCache[dId];
				if(_dataCache[dname]) return _dataCache[dname];
				return '暂时没有数据...';
			});
		}else{
			var url = _ajaxUrl;
				if(dId) url += '?name='+encodeURI(dname)+'&card_id='+dId;
				else url += '?name='+encodeURI(dname);
			__getJSONP(url,function(data){
				if(dId)	_dataCache[dId] = data.content;
				else _dataCache[dname] = data.content;
				if(data.url) _t.elm.href = data.url;
			    PopLayer.get().showPop({
			    	targetDom : _t.elm,
			    	layerY : 3,
			    	layerX : 3,
			    	closeBtn : false
			    },function(){
			    	if(data && data.content) return data.content;
			    	return '暂时没有数据...';
			    });
			});
		}
	},50)
}

var _elmMouseout = function(e){
	clearTimeout(_timeout);
	PopLayer.get().popLayerHide();
}

/*
 * 替换设置a标签
 */
var _changeElm = function(params){
	var a = document.createElement('a');
		a.innerHTML = params.dname;
		params.dId && a.setAttribute('dbid',params.dId);
		a.className = params.className;
		a.target = '_blank';
		a.href="##";
	return a;
}

/*
 * 针对每一个需要被弹窗的元素 代码主控执行
 */
var _dbExcute = function(elm,hsdb_card){
	var a,
		elm = elm,
		params = {
			className : elm.className, //样式名称
			//拿数据请求相关
			dId : elm.getAttribute('dbid'),   //数据库key
			dname : elm.getAttribute('dname') || elm.innerHTML			   //数据库key
		};
	//非a标签元素要变成a标签，a标签的链接向后端请求链接到数据库。
	if(elm.tagName === 'SPAN'){
		a = _changeElm(params);   //得到了a标签
		__insertAfter(a,elm);
		elm.parentNode.removeChild(elm);
		elm = a;
	}

	for(var i=0;i<hsdb_card.length;i++){
		if(params.dId == hsdb_card[i].card_id || params.dname == hsdb_card[i].name){
			elm.href = hsdb_card[i].url;
			continue;
		}
	}
		
	__addEvent(elm,'mouseover',__bind(_elmMouseover,{elm:elm,params:params}));
	__addEvent(elm,'mouseout',__bind(_elmMouseout,this));
}

//初始化
var dbInit = function(){
	__loadScript(_cssUrl);
	var game_dbAry = __getElementsByClassName(document,'dbTooptip');

	__loadScript(_cardsData,function(){
		hsdb_card = window.hsdb_cards;
		for(var i=0;i < game_dbAry.length;i++){
			_dbExcute(game_dbAry[i],hsdb_card);
		}
	});
}

dbInit();
})();