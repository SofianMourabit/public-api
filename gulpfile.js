'use strict';

const gulp = require('gulp'),
sass = require('gulp-sass'),
sourcemaps = require('gulp-sourcemaps'),
babel = require("gulp-babel"),
concat = require("gulp-concat"),
autoprefixer = require('gulp-autoprefixer'),
jshint = require('gulp-jshint'),
notify = require('gulp-notify'),
server = require('gulp-server-livereload'),
del = require('del'),
svgSprite = require('gulp-svg-sprite');

// Styles
gulp.task('styles', function() {
  return gulp.src('src/scss/application.scss')
  .pipe(sourcemaps.init())
  .pipe(sass())
  .pipe(autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false
  }))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('dist/css'))
  .pipe(notify({ message: 'Styles task complete' }));
});

// Scripts
gulp.task('scripts', function() {
  return gulp.src('src/js/*.js')
  .pipe(sourcemaps.init())
  .pipe(babel())
  .pipe(concat("app.js"))
  .pipe(sourcemaps.write("."))
  .pipe(jshint('.jshintrc'))
  .pipe(jshint.reporter('default'))
  .pipe(gulp.dest('dist/js'))
  .pipe(notify({ message: 'Scripts task complete' }));
});

// SVG icons CONFIG
let config = {
  mode: {
    symbol: { // symbol mode to build the SVG
      dest: 'dist/img/sprite', // destination foldeer
      sprite: 'sprite.svg', //sprite name
      example: true // Build sample page
    }
  },
  svg: {
    xmlDeclaration: false, // strip out the XML attribute
    doctypeDeclaration: false // don't include the !DOCTYPE declaration
  }
};

// Images
gulp.task('sprite-page', function() {
  return gulp.src('src/images/**/*.svg')
  .pipe(svgSprite(config))
  .pipe(gulp.dest('./'))
  .pipe(notify({ message: 'Sprite page complete' }));
});

gulp.task('sprite-shortcut', function() {
  return gulp.src('sprite/sprite.svg')
  .pipe(gulp.dest('./'));
});

gulp.task('images', function() {
  return gulp.src('src/images/*')
  .pipe(gulp.dest('dist/img'))
  .pipe(notify({ message: 'Images task complete' }));
});

// Clean
gulp.task('clean', function() {
  return del(['dist/css', 'dist/js/*.js','!dist/js/vendor', 'dist/img','dist/sprite']);
});

// Default task
gulp.task('default', ['clean'], function() {
  gulp.start('server');
});


// Watch
gulp.task('watch', function () {
  // Watch .scss files
  gulp.watch('src/scss/**/*.scss', ['styles']);

  // Watch .js files
  gulp.watch('src/js/**/*.js', ['scripts']);

  // Watch image files
  gulp.watch('src/images/*', ['images']);

  // Watch SVG files
  gulp.watch('src/images/icons/*', ['sprite-page']);

});

//server
gulp.task('server',['styles','scripts','images','sprite-page','watch'], function() {
  gulp.src('./dist')
  .pipe(server({
    defaultFile: 'index.html',
    port: 3000,
    livereload: {
      enable: true,
      filter: function (filename, cb) {
        cb(!/\.(sa|le)ss$|node_modules/.test(filename));
      }
    },
    open: true
  }));
});
