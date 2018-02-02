'use strict';

const gulp = require('gulp');
const gulpConcat = require('gulp-concat');
const gulpUglify = require('gulp-uglify');
const gulpRename = require('gulp-rename');
const gulpSass = require('gulp-sass');
// can use for css and js
const gulpSourcemaps = require('gulp-sourcemaps');
const del = require('del');

// for development
gulp.task('concatScripts', () => {
  // can take a single file or an array of files
  // src creates a readable stream of data in memory
  // explicitly returning the stream will tell minifyScripts when the task is done
  return gulp.src([
    'js/jquery.js',
    'js/sticky/jquery.sticky.js',
    'js/main.js'
  ])
  .pipe(gulpSourcemaps.init())
    // gulp-concat takes the new file name as a string
  .pipe(gulpConcat('app.js'))
  .pipe(gulpSourcemaps.write('./'))
  // pipe readable stream to file destination
  .pipe(gulp.dest('./js'));
});

// for production
// concatScripts is a dependency
gulp.task('minifyScripts', ['concatScripts'], () => {
  return gulp.src('js/app.js')
  .pipe(gulpUglify())
  .pipe(gulpRename('app.min.js'))
  .pipe(gulp.dest('./js'));
});

gulp.task('compileSass', () => {
  return gulp.src('scss/application.scss')
  .pipe(gulpSourcemaps.init())
  .pipe(gulpSass())
  // this path will be relative to the output directory, i.e. ./css
  .pipe(gulpSourcemaps.write('./'))
  .pipe(gulp.dest('./css'));
});

// once I run this, can't figure out how to kill it without killing the whole terminal
gulp.task('watchFiles', () => {
  // globbing pattern
  // look in the sass folder
  // look in its subdirectories
  // look for any file with the .scss extention
  // then provide task(s) you want to run when a file changes
  gulp.watch('scss/**/*.scss', ['compileSass']);
  gulp.watch('js.main.js', ['concatScripts']);
});

gulp.task('clean', () => {
  // need return here? Huston did not include
  return del(['dist', 'css/application.css*', 'js/app*.js*']);
});

// don't need to include concatScripts since it's a dependency of minifyScripts
gulp.task('build', ['minifyScripts', 'compileSass'], () => {
  // base: ./ preserves the current file tree structure
  return gulp.src(['css/application.css', 'js/app.min.js', 'index.html', 'img/**', 'fonts/**'], {base: './'})
  .pipe(gulp.dest('./dist'));
});

// add something like gulp-connect to actually start server?
// (right now, have to run gulp serve in one terminal, then http-server -p 3000 in another)
// https://teamtreehouse.com/community/why-add-the-new-task-serve-wouldnt-it-do-the-same-thing-if-you-just-ran-the-task-watchfiles
gulp.task('serve', ['watchFiles']);

// default task
// opt. array of dependencies
// callback function
gulp.task('default', ['clean'], () => {
  // gulp.start will change to gulp.series in v4
  gulp.start('build');
});