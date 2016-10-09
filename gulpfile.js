const gulp = require('gulp');

const eslint = require('gulp-eslint');

gulp.task('lint', () => {
    // ESLint ignores files with "node_modules" paths.
    // So, it's best to have gulp ignore the directory as well.
    // Also, Be sure to return the stream from the task;
    // Otherwise, the task may end before the stream has finished.
  return gulp.src(['enum-class.js', 'test.js'])
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError());
});

const babel = require('gulp-babel');
const rename = require('gulp-rename');

gulp.task('transpile', () =>
  gulp.src(['enum-class.es6', 'test.es6'])
      .pipe(babel({presets: ['es2015']}))
      .pipe(rename(path => { path.extname = '.js'; return path; }))
      .pipe(gulp.dest('build/'))
);

const ava = require('gulp-ava');

gulp.task('test', ['transpile'], () =>
    gulp.src('build/test.js')
        .pipe(ava({verbose: true}))
);

const closureCompiler = require('gulp-closure-compiler');

/* eslint-disable camelcase */
gulp.task('compile', function() {
  return gulp.src(['enum-class.es6'])
    .pipe(closureCompiler({
      fileName: 'enum-class.min.js',
      compilerFlags: {
        warning_level: 'VERBOSE',
        language_in: 'ES6',
        language_out: 'ES5'
      }
    }))
    .pipe(gulp.dest('build'));
});

const del = require('del');

gulp.task('clean', () => {
  return del(['build', 'enum-class.min.js']);
});

gulp.task('default', ['lint', 'test', 'compile'], function() { });
