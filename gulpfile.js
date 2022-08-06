// Подключаем модули gulp
const gulp = require('gulp');
const concat = require('gulp-concat');
const rigger = require('gulp-rigger');
const sass = require('gulp-sass'); sass.compiler = require('node-sass');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();
const babel = require('gulp-babel');

//!===========================================================================

//Массивы адресов файлов                                                                                                       
const htmlFiles =['./#source/html/index.html'];                    
const scssFiles = ['./#source/scss/style.scss'];                            
const jsFiles = [
    './#source/js/lib.js',
    './#source/js/initial-data.js',
    './#source/js/show-bookmarks.js',
    './#source/js/add-link.js',
    './#source/js/edit-bookmark.js',
    './#source/js/folders.js',
    './#source/js/drag-and-drop.js',
    './#source/js/draft.js',
    './#source/js/main.js'
];           

//!===========================================================================

// Функция для таска html
function html() {
    //Передача адресов файлов
    return gulp.src(htmlFiles)
    //Риггер файлов
    .pipe(rigger())
    //Выходная папка
    .pipe(gulp.dest('./'))
    //Обновление страницы браузера
    .pipe(browserSync.stream());
}

// Функция для таска styles
function styles() {
    //Передача адресов файлов
    return gulp.src(scssFiles)
    //Компиляция в CSS
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    //Автопрефиксер
    .pipe(autoprefixer({cascade: false}))
    //Выходная папка для стилей
    .pipe(gulp.dest('./build/css'))
    //Обновление страницы браузера
    .pipe(browserSync.stream());
}

// Функция для таска scripts
function scripts() {
    //Передача адресов файлов
    return gulp.src(jsFiles)
    //Babel
    // .pipe(babel({
    //     presets: ["@babel/preset-env"]
    // }))
    //Конкатинация файлов
    .pipe(concat('main.js'))
    //Минификация кода JS
    // .pipe(uglify())
    //Выходная папка для скриптов
    .pipe(gulp.dest('./build/js'))
    //Обновление страницы браузера
    .pipe(browserSync.stream());
}

// Функция удаления файлов
function clean() {
    return del(['./*.html', './build/*.css', './build/*.js']);
}

// Функция watch - сделить за изменением кода в файлах
function watch() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    //Cделить за изменением кода в HTML файлах
    gulp.watch('./#source/html/**/*.html', html)
    //Cделить за изменением кода в SCSS файлах
    gulp.watch('./#source/scss/**/*.scss', styles)
    //Cделить за изменением кода в JS файлах
    gulp.watch('./#source/js/**/*.js', scripts);
}

//!===========================================================================

//Таски вызывающие функции html, styles и scripts
gulp.task('html', html);
gulp.task('styles', styles);
gulp.task('scripts', scripts);
//Таск удаления файлов
gulp.task('del', clean);
//Таск запускающий все функции кроме watch
gulp.task('build', gulp.series(clean, gulp.parallel(html, styles, scripts)));
//Таск отслеживающий изменения кода в файлах
gulp.task('watch', watch);
//Таск последовательно запускающий таски build и watch
gulp.task('dev', gulp.series('build', 'watch'));