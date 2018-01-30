var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    sass = require('gulp-sass');


gulp.task('html', function () {
    return gulp.src('index.html')
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());
})

gulp.task('scripts', function () {
    return gulp.src('./src/js/app.js')
        .pipe(browserify())
        .pipe(gulp.dest('./dist'));
});

gulp.task('styles', function () {
    return gulp.src('./src/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist'));
})