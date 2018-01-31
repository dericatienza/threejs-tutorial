'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    clean = require('gulp-clean'),
    browserify = require('gulp-browserify'),
    sass = require('gulp-sass'),
    inject = require('gulp-inject'),
    connect = require('gulp-connect'),
    open = require('gulp-open');

var paths = {
    dist: 'dist',
    src: 'src'
};

gulp.task('clean', function () {
    return gulp.src(paths.dist, {
            read: false,
            allowEmpty: true
        })
        .pipe(clean());
});

gulp.task('html', function () {
    return gulp.src(paths.src + '/index.html')
        .pipe(gulp.dest(paths.dist));
});

gulp.task('scripts', function () {
    return gulp.src(paths.src + '/scripts/app.js')
        .pipe(browserify())
        .pipe(gulp.dest(paths.dist));
});

gulp.task('styles', function () {
    return gulp.src(paths.src + '/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('app.css'))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('inject', function () {
    var sources = gulp.src(['dist/**/*.js', 'dist/**/*.css'], {
        read: false
    });

    return gulp.src('dist/index.html')
        .pipe(inject(sources, {
            relative: true
        }))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('server', function (done) {
    connect.server({
        root: paths.dist,
        port: 8080,
        livereload: true
    });

    done();
});

gulp.task('reload', function (done) {
    connect.reload();

    done();
})

gulp.task('watch', function (done) {
    gulp.watch(paths.src + '/**/*.scss', gulp.series('styles', 'reload'));
    gulp.watch(paths.src + '/**/*.js', gulp.series('scripts', 'reload'));
    gulp.watch(paths.src + '/index.html', gulp.series('html', 'inject', 'reload'));

    done();
});

gulp.task('open', function () {
    return gulp.src('dist/index.html')
        .pipe(open({
            uri: 'http://localhost:8080/'
        }));
});

gulp.task('build',
    gulp.series(
        'clean',
        gulp.parallel('scripts', 'styles', 'html'),
        'inject'));

gulp.task('serve', gulp.series('build', 'server', 'watch', 'open'));