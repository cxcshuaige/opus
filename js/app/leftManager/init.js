define(function(require,exports,module){
	var $ = require('$'),
		data = require('./data');
	function init(domObj){
		for(var i=0;i<data.length;i++){
			domObj.navL.append('<li>'+data[i].title+'</li>');
		}
	}
	exports.init = init;
});