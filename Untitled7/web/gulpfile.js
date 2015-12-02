var gulp = require('gulp'),
	sass = require('gulp-sass'),
    jshint = require('gulp-jshint'),
	connect = require('gulp-connect'),
    proxy = require('http-proxy-middleware'),
    minimist = require('minimist');


var defaultOptions = {
    default: { 
        serverUrl: 'http://127.0.0.1:8081',
        connectPort: 8000,
        app: 'app/',
        output: 'app/',
    }
};

var options = minimist(process.argv.slice(2), defaultOptions);

gulp.task('lint', function() {
    gulp.src(options.app + 'scripts/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('sass', function () {
    gulp.src(options.app + 'styles/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(options.output + 'styles'))
        .pipe(connect.reload());        
});

gulp.task('watch', function() {
	gulp.watch([options.app + 'scripts/**/*.js', options.app + 'styles/**/*.css', options.app + 'views/**/*.html', options.app + 'index.html'], ['reload']);
});

gulp.task('reload', function() {
	gulp.src(options.app + '**')
		.pipe(connect.reload());
});

gulp.task('default', ['sass', 'watch', 'connect']);

gulp.task('serve', ['sass', 'watch', 'connect']);

gulp.task('connect', function() {
  connect.server({
    root: ['.'],
    livereload: true,
    port: options.connectPort,
    middleware: function(conn, opt) {
        return [
            proxy('!/app/**', {
                target: options.serverUrl,
                changeOrigin : true,
                ws: true
            })
        ];
    }
  });
});
