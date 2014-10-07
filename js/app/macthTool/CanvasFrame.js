//canvasFrame
define(function(require,exports,module){
	var $ = require('$');
	var drag = require('./Drag');
	var SetAttr = require('./SetAttr');
	require('./InpFindData');
	function CanvasFrame(dom){
		this.drag = new drag();
		this.setAttr = new SetAttr($.proxy(this._setWinLow,this));
		this.saveCache = [];
		this.dom = dom;
		this._init();
	}

	CanvasFrame.prototype._init = function(){
		this._domCreat();
		this._eventBind();
	}

	CanvasFrame.prototype._domCreat = function(){
		var html = [];
			html.push('<div class="J_tools toolWrap">');
				html.push('<div class="funarea">');
					html.push('<input type="button" value="导入战队" class="J_inpTeamBtn">');
					html.push('<input type="button" value="导入个人" class="J_inpSingleBtn">');
					html.push('<input type="button" value="﹁" class="J_inpRelationship">');
					html.push('<input type="button" value="_|" class="J_inpRelationship">');
					html.push('<input type="button" value="W" class="J_inpW">');
					html.push('<input type="button" value="L" class="J_inpL">');
				html.push('</div>');
				html.push('<div class="temarea">');
					html.push('<input type="button" value="淘汰赛模板">');
					html.push('<input type="button" value="双败赛模板">');
					html.push('<input type="button" class="J_save" value="保存">');
				html.push('</div>');
			html.push('</div>');
			html.push('<div class="J_cavasArea cavasArea"></div>');
		var str = html.join('');
		this.dom.append(str);
		this.cavasArea = this.dom.find('.J_cavasArea');
	}

	CanvasFrame.prototype._eventBind = function(){
		this.dom.find('.J_inpTeamBtn').on('click',$.proxy(this._creatDataInp,{t:this,type:'team'}))
		this.dom.find('.J_inpSingleBtn').on('click',$.proxy(this._creatDataInp,{t:this,type:'single'}))
		this.dom.find('.J_inpW').on('click',$.proxy(this._creatDataWinLow,{t:this,type:'win'}))
		this.dom.find('.J_inpL').on('click',$.proxy(this._creatDataWinLow,{t:this,type:'low'}))
		this.dom.find('.J_save').on('click',$.proxy(this._save,this));
	}

	CanvasFrame.prototype._creatDataInp = function(){
		var data;
		switch(this.type){
			case 'team':
				data = [{"index": "", "_id": "5423b891d2e17d29f65380ac", "name": "t1"}, {"index": "2", "_id": "5423b89ed2e17d29f65380ad", "name": "t2"}, {"index": "t", "_id": "5423b8a5d2e17d29f65380ae", "name": "test"}, {"index": "3", "_id": "5423b8bcd2e17d29f65380af", "name": "t3"}];
				break;
			case 'single':
				data = [{"index": "t", "_id": "5418eb74d2e17d191d626c80", "name": "test"}, {"index": "3", "_id": "541931b4d2e17d1eb9c34214", "name": "p3"}, {"index": "2", "_id": "541a611cd2e17d2fdd5ceb52", "name": "p2"}, {"index": "1", "_id": "541a5600d2e17d2f6895cf6d", "name": "p1"}];
				break;
			default:
				break;
		}

		var getInp = function(){
			var html = [];
				html.push('<div class="J_dataInp dataInp">');
					html.push('<div class="J_control con">');
						html.push('<label>w:<input type="text" class="J_conw" /></label><label>h:<input type="text" class="J_conh"/></label><label><input type="button" class="J_delete" value="删" /></label>');
					html.push('</div>');
					html.push('<ul class="J_inpFindData inpFindData"></ul>');
					html.push('<input type="text" class="J_dataTrueInp"/>');
				html.push('</div>');
			var temp = $(html.join(''));
			return temp;
		}
		var dom = getInp();
		this.t.cavasArea.append(dom);

		this.t.drag.addDrag(this.t.cavasArea,dom);
		dom.find('.J_inpFindData').InpFindData({parent:dom,inp:dom.find('.J_dataTrueInp'),datas:data});
		this.t.setAttr.addSetAttr(dom.find('.J_control'),{
			parent:dom,
			wset:dom.find('.J_conw'),
			hset:dom.find('.J_conh'),
			delete:dom.find('.J_delete'),
			findData:dom.find('.J_inpFindData'),
			type : null
		})
	}
	
//设置输赢索引
	CanvasFrame.prototype._setWinLow = function(){
		this.cavasArea.find('.J_dataInpWin').each(function(i,o){
			var n = 'W'+(i+1)
			$(this).text(n);
			$(this).parent().attr('dataName',n);
		})
		this.cavasArea.find('.J_dataInpLow').each(function(i,o){
			var n = 'L'+(i+1);
			$(this).text(n);
			$(this).parent().attr('dataName',n);
		})
	}

	CanvasFrame.prototype._creatDataWinLow = function(){
		var cls;
		if(this.type == 'win'){
			cls = 'J_dataInpWin';
		}else{
			cls = 'J_dataInpLow';
		}
		var getInp = function(type){
			var html = [];
				html.push('<div class="J_dataInp dataInp">');
					html.push('<div class="J_control con">');
						html.push('<label>w:<input type="text" class="J_conw" /></label><label>h:<input type="text" class="J_conh"/></label><label><input type="button" class="J_delete" value="删" types='+type+' /></label>');
					html.push('</div>');
					html.push('<p class="'+cls+'"></p>');
				html.push('</div>');
			var temp = $(html.join(''));
			return temp;
		}
		var dom = getInp(this.type);
		this.t.cavasArea.append(dom);
		this.t._setWinLow();
		this.t.drag.addDrag(this.t.cavasArea,dom);
		this.t.setAttr.addSetAttr(dom.find('.J_control'),{
			parent:dom,
			wset:dom.find('.J_conw'),
			hset:dom.find('.J_conh'),
			delete:dom.find('.J_delete'),
			findData:dom.find('.J_inpFindData'),
			type : this.type
		});
	}

	CanvasFrame.prototype._save = function(){
		var _t = this;
		this.cavasArea.find('.J_dataInp').each(function(i,o){
			var obj = {
				id : $(this).attr('dataId') || null,
				name : $(this).attr('dataName') || null,
				left : $(this).attr('dataLeft') || null,
				top : $(this).attr('dataTop') || null,
				width : $(this).width(),
				height : $(this).height()
			}

			_t.saveCache[i] = obj;
		})
		console.log(this.saveCache)
	}

	module.exports = CanvasFrame;
})