define(function(require, exports, module) {
    var $ = require('$')
    var random = require('./util').random
    var handleText= require('./handle-text')
    
    function Hello(){
        this.render()
        this.bindAction()
    }
    
    Hello.prototype.render = function(){
        this.el = $('<div style="position:fixed;' 
            + 'left:' + random(0,70) + '%;'
            + 'top:' + random(10,80)+ '%;">'
            + handleText(this.randomText())
            + '</div>').appendTo('body')
    }
    Hello.prototype.randomText = function(){
        var str = ['蕙蕙是可爱萌妹纸','我很想你诶，蕙','心蕙快到我碗里来','快点来扇我巴掌'];
        var i = random(0,3);
        return str[i];
    }
    Hello.prototype.bindAction = function(){
        var el = this.el
        setTimeout(function(){ el.fadeOut() }, random(500,5000))
    }
    
    module.exports = Hello
})