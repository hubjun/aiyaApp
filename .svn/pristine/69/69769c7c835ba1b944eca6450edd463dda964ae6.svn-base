var gulp = require('gulp'),
    gulpif = require('gulp-if'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    // sprity = require('sprity'),
    rename = require('gulp-rename');

var dev = true;

//scss编译
gulp.task('sass', function() {
  //app
  gulp.src('scss/aiyaku.scss')
    .pipe(gulpif(dev, sourcemaps.init()))
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulpif(dev, sourcemaps.write()))
    .pipe(gulp.dest('www/css/'));
  //ionic
  gulp.src('www/lib/ionic/scss/ionic.scss')
    .pipe(gulpif(dev, sourcemaps.init()))
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulpif(dev, sourcemaps.write()))
    .pipe(gulp.dest('www/lib/ionic/css/'))
});

//icon sprite
// gulp.task('sprites', function () {
//     sprity.src({
//       src: 'www/img/myaiyaku/icons/**/*.{png,jpg}',
//       style: 'www/img/myaiyaku/icons/sprite.css',
//       processor: 'css'
//     })
//     .pipe(gulpif('*.png', gulp.dest('www/img/myaiyaku/icons/'), gulp.dest('www/css/')))
// });

//合并和混淆
gulp.task('concat', function() {
  var aiyakuControllerBase = 'www/js/controllers/',
      aiyakuServiceBase = 'www/js/services/';

  gulp.src([
      aiyakuControllerBase + 'main.js',
      aiyakuControllerBase + '*.js'
    ])
    .pipe(concat('controllers.js'))
    .pipe(gulpif(!dev, uglify()))
    .pipe(gulp.dest('www/js'));

  gulp.src([
      aiyakuServiceBase + 'main.js',
      aiyakuServiceBase + '*.js'
    ])
    .pipe(concat('services.js'))
    .pipe(gulpif(!dev, uglify()))
    // .pipe(rename('services.min.js'))
    .pipe(gulp.dest('www/js'));

});

//实时监听
gulp.task('watch', function() {
  //监听scss文件变动
  gulp.watch(['scss/**/*.scss', 'www/lib/ionic/scss/**/*.scss'], ['sass']);
  //监听js文件变动
  gulp.watch(['www/js/controllers/*.js', 'www/js/services/*.js'], ['concat']);
});

gulp.task('default', ['sass', 'concat', 'watch']);
