const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const cssMinify = require('gulp-clean-css');
const uglify = require('gulp-uglify');

function minifyJS() {
  return gulp.src('src/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/'));
}

function minifyCSS() {
  return gulp.src('src/*.css')
    .pipe(cssMinify())
    .pipe(gulp.dest('dist/'));
}

function copyHTML() {
  return gulp.src('src/*.html')
    .pipe(gulp.dest('dist'));
}

function sync() {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });
}

function watch() {
  gulp.watch("src/*.css", minifyCSS).on('change', browserSync.reload);
  gulp.watch("src/*.js", minifyJS).on('change', browserSync.reload);
  gulp.watch("src/index.html", copyHTML).on('change', browserSync.reload);
}

exports.default = gulp.series(
  gulp.parallel(
    copyHTML,
    minifyCSS,
    minifyJS,
  ),
  gulp.parallel(
    sync,
    watch
  )
);