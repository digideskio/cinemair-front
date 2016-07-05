var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var webserver = require('gulp-webserver');



var paths = {
    sass: ['./scss/**/*.scss']
};

gulp.task('sass', function(done) {
    gulp.src('./scss/ionic.app.scss')
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(gulp.dest('./www/css/'))
        .pipe(minifyCss({
              keepSpecialComments: 0
        }))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest('./www/css/'))
        .on('end', done);
});


gulp.task('watch', function() {
    gulp.watch(paths.sass, ['sass']);
});

gulp.task('webserver', function() {
    gulp.src('www')
        .pipe(webserver({
            fallback: 'index.html',
            host: "0.0.0.0",
            port: 8100,
            livereload: {
                enable: true, // need this set to true to enable livereload
                filter: function(fileName) {
                    if (fileName.match(/.map$/)) { // exclude all source maps from livereload
                        return false;
                    } else {
                        return true;
                    }
                }
            }
        }));
});

gulp.task('default', ['sass', 'watch', 'webserver']);


/*
gulp.task('install', ['git-check'], function() {
    return bower.commands.install()
        .on('log', function(data) {
            gutil.log('bower', gutil.colors.cyan(data.id), data.message);
        });
});

gulp.task('git-check', function(done) {
    if (!sh.which('git')) {
        console.log(
            '  ' + gutil.colors.red('Git is not installed.'),
            '\n  Git, the version control system, is required to download Ionic.',
            '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
            '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
        );
        process.exit(1);
    }
    done();
});
*/
