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

gulp.task('transpile', () =>
    gulp.src('enum-class.js')
        .pipe(babel({
          presets: ['es2015']
        }))
        .pipe(gulp.dest('transpiled'))
);

const ava = require('gulp-ava');

gulp.task('test', ['transpile'], () =>
    gulp.src('test.js')
        .pipe(ava({verbose: true}))
);

const closureCompiler = require('gulp-closure-compiler');

/* eslint-disable camelcase */
gulp.task('compile', function() {
  return gulp.src(['enum-class.js'])
    .pipe(closureCompiler({
      fileName: 'enum-class.min.js',
      compilerFlags: {
        warning_level: 'VERBOSE',
        language_in: 'ES6',
        language_out: 'ES5'
      }
    }))
    .pipe(gulp.dest('.'));
});

const del = require('del');

gulp.task('clean', () => {
  return del(['build', 'enum-class.min.js']);
});

gulp.task('default', ['lint', 'test', 'compile'], function() { });
