// 引入 gulp
var gulp = require('gulp'); 

// 引入组件
var gulpGitDiff = require('./');

// 检查脚本
gulp.src('./test/src/*').pipe(gulpGitDiff()).pipe(gulp.dest('./test/dest/'));

//git tag show
//git tag name -m
//compare the date
//git diff name HEAD --numstat

//gulp.task('clear-log4js', function() {
//    gulp.src('./test/src/*.js')
//        .pipe(clearLog())
//        .pipe(gulp.dest('./test/dest'));
//});
//gulp.task('watch', function() {
//    gulp.watch('./test/src/*.*', ['clear-log4js']);
//});
//// 默认任务
//gulp.task('default', ['clear-log4js']);