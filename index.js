var through = require('through2');
var os = require('os');
var path = require('path');
var gutil = require('gulp-util');
var Buffer = require('buffer').Buffer;
var File = gutil.File,PLUGIN_NAME = "gulp-clear-log4js";
module.exports = function (options) {
    var clearLog = function(fileName,contentStr,options){
        var reg = null;
        if(fileIsType(fileName,"js")) {
            reg = /[\s\S;^]log\.((info)|(trace)|(debug)|(warn)|(error)|(fatal))\([\s\S]*?(;)/gm;
            return contentStr.replace(reg, function (s, t) {
                if (s.indexOf(";") == 0) {
                    return ";/*" + s.substring(1) + "*/";
                } else {
                    return "/*" + s + "*/";
                }
            });
        }else if(fileIsType(fileName,"html")){
            reg = /<script[^>]*?(log4javascript(-debug|).js)[^>]*?>(.|\n)*?(?=<\/script\s*>)<\/script\s*>/igm;
            return contentStr.replace(reg,"<!--$&-->");
        }
        return contentStr;
    };
    var fileIsType = function(fileName,type){
        var regStr = "(?!\\\.)("+type+")(?=$)";
        var reg = new RegExp(regStr,"i");
        return reg.test(fileName);
    };
    return through.obj(function (file, enc, cb) {
        // 如果文件为空，不做任何操作，转入下一个操作，即下一个 .pipe()
        if (file.isNull()) {
            this.push(file);
            return cb();
        }

        // 插件不支持对 Stream 直接操作，跑出异常
        if (file.isStream()) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return cb();
        }

        // 将文件内容转成字符串，并调用 preprocess 组件进行预处理
        // 然后将处理后的字符串，再转成Buffer形式
        var content = clearLog(file.relative,file.contents.toString(), options || {});
        //console.log(content);
        file.contents = new Buffer(content);
        // 下面这两句基本是标配啦，可以参考下 through4 的API
        this.push(file);
        cb();
    });
};