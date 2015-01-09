'use strict';

var gulp = require('gulp')
	, $ = require('gulp-load-plugins')()
	, connect = $.connectMulti
	, devServer = connect()
	, proServer = connect();

gulp.task('connect-dev', devServer.server({
	root: ['build']
	, port: 8080
	, livereload: true
	, middleware: function() {
		return [
			require('../api/index.js')
		];
	}
}));

gulp.task('connect-pro', proServer.server({
	root: ['dist']
	, port: 9090
	, livereload: true
}));

gulp.task('clean', function() {
	return gulp.src(['build'], {read: false})
		.pipe($.rimraf());
});

gulp.task('lint', function() {
	return gulp.src(['index.js', 'src/*.js', 'src/**/*.js'])
		.pipe($.jshint('.jshintrc'))
		.pipe($.jshint.reporter('jshint-stylish'));
});


gulp.task('sass', function() {
	return gulp.src('scss/app.scss')
		.pipe($.sass({
			outputStyle: 'compressed'
		}))
		.pipe(gulp.dest('build/styles/'));
});

/*gulp.task('config', function() {
	gulp.src('src/config/*')
		.pipe(gulp.dest('dist/config/'));
});*/

gulp.task('fonts', function() {
	gulp.src('static/fonts/**/*')
		.pipe(gulp.dest('build/fonts'));
});

/*gulp.task('images', function() {
	gulp.src('src/assets/images/*')
		.pipe(gulp.dest('dist/assets/images'));
});*/

gulp.task('base', [/*'static', 'config', 'images',*/'fonts', 'sass']);

gulp.task('scripts', ['lint'], function() {
	return gulp.src(['src/app.js'])
		.pipe($.browserify({
			transform: ['reactify']
			, extensions: ['.jsx']
		}))
		.on('prebundle', function(bundler) {
			bundler.require('react');
		})
		.pipe(gulp.dest('build/scripts/'))
		.pipe($.size());
});

gulp.task('html', ['base', 'scripts'], function() {
	var assets = $.useref.assets();

	return gulp.src('src/*.html')
		.pipe(assets)
		.pipe(assets.restore())
		.pipe($.useref())
		.pipe(gulp.dest('build'))
		.pipe($.size());
});

gulp.task('compress', ['html'], function() {
	gulp.src(['build/scripts/app.js'])
		.pipe($.uglify())
		.pipe(gulp.dest('build/scripts/'));
});

gulp.task('browserify', ['lint'], function() {
	return gulp.src(['src/app.js'])
		.pipe($.browserify({
			transform: ['reactify']
			, extensions: ['.jsx']
		}))
		.on('prebundle', function(bundler) {
			bundler.require('react');
		})
		.pipe(gulp.dest('build/scripts'))
		.pipe($.size());
});

gulp.task('refresh-js', ['browserify'], function() {
	gulp.src('build/scripts/app.js')
		.pipe(devServer.reload());
});

gulp.task('refresh-sass', ['sass'], function() {
	gulp.src('build/styles/app.css')
		.pipe(devServer.reload());
});

gulp.task('watch', ['connect-dev'], function() {
	gulp.watch(['src/**/*.js'], ['refresh-js']);
	gulp.watch(['scss/**/*.scss'], ['refresh-sass']);
});

gulp.task('development', ['browserify', 'html', 'sass'], function() {
	gulp.start('watch');
});

gulp.task('build', ['compress'], function() {
	gulp.start('connect-pro');
});

gulp.task('production', ['clean'], function() {
	gulp.start('build');
});
