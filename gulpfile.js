var gulp   = require('gulp'),
    jshint = require('gulp-jshint'),
    mocha  = require('gulp-mocha');

gulp.task('lint', function() {
  return gulp.src(['*.js', 'lib/**.js', 'test/**.js'])
             .pipe(jshint('.jshintrc'))
             .pipe(jshint.reporter('default'));
});

gulp.task('test', function () {
  return gulp.src('test/spec/*.js')
             .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('integrationTest', function () {
  return gulp.src('test/integration/*.js')
             .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('watch', function () {
  gulp.watch(['*.js', 'lib/**.js', 'test/**.js'], ['lint', 'test']);
});

gulp.task('default', ['lint', 'test', 'watch']);