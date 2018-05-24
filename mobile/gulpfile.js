var gulp = require('gulp'),
    less = require('gulp-less'),
    clean = require('gulp-clean'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    path = require('path');

gulp.task('clean', function() {
  return gulp.src('dist/*', {read: false})
    .pipe(clean());
});

gulp.task('less', function () {
  return gulp.src('./src/**/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(minifycss())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('js', function () {
  return gulp.src('./src/**/*.js')
    .pipe(rename({ suffix: '.min' }))
    // .pipe(uglify())
    .pipe(gulp.dest('./dist'));
});

gulp.task('html', function () {
  return gulp.src('./src/**/*.html')
    .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['clean'], function() {
    gulp.start('less', 'js','html');
});

gulp.task('watch', function(){
    gulp.watch('./src/**/*.html', ['html']);
    gulp.watch('./src/**/*.less', ['less']);
    gulp.watch('./src/**/*.js', ['js']);
})
