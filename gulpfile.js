/* global require */
var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var livereload = require('gulp-livereload');
var pkg = require('./package.json');

gulp.task('concat', function() {
  gulp.src('src/scripts/*.js')
  .pipe(concat('script.js'))
  .pipe(gulp.dest('js/'))
  .pipe(livereload());
});

gulp.task('sass', function () {
  gulp.src('src/styles/*.scss')
  .pipe(sass())
  .pipe(concat('style.css'))
  .pipe(gulp.dest('css/'))
  .pipe(livereload());
});

gulp.task('reload', function() {
  gulp.src('**/*.{html}')
  .pipe(livereload());
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('**/*.{php,html}', ['reload']);
  gulp.watch('src/styles/*.scss', ['sass']);
  gulp.watch('src/scripts/*.js', ['concat']);
});

gulp.task('default', ['sass', 'concat'], function() {
  // fired before 'finished' event
});