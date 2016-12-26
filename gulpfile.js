'use strict'

var gulp = require('gulp');
var typescript = require('gulp-typescript');
var del = require('del');
var runSequence = require('run-sequence');
var pathExists = require('path-exists');
var exec = require('child_process').exec;

var current_dir = process.cwd();
var dest = current_dir + '/dest';

gulp.task('copy', function(){
    return gulp.src([
            './src/**/*.js',
            './src/**/*.json',
            './src/serverless.yml',
            '!./src/node_modules/**'//node_modules配下は除外する
        ])
        .pipe(gulp.dest('./dest'));
});

gulp.task('ts', function() {
    //出力オプション
    var typescriptProject = typescript.createProject({
        module: 'commonjs',
        target: 'ES5',
        removeComments: true,
    });

    return gulp.src([
            './src//**/*.ts',
            '!./src/node_modules/**'//node_modules配下は除外する
        ])
        .pipe(typescriptProject())
        .pipe(gulp.dest('./dest'));
});

gulp.task('npm', function(cb){
    pathExists(dest).then(exists => {
        if(exists){
            exec('npm install', {cwd: dest}, function (err, stdout, stderr) {
                console.log(stdout);
                console.log(stderr);
                cb(err);
            })
        }else{
            cb(null);
        }
    });
});

gulp.task('build', ['ts'], function(){
    return runSequence('copy', 'npm');
});

gulp.task('deploy', ['build'], function(cb){
    exec('sls deploy', {cwd: dest}, function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    })    
});

/*
gulp.task('invoke', ['deploy'], function(cb){
    exec('sls invoke -f hello', {cwd: dest}, function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    })    
});

gulp.task('local', ['build'], function(cb){
    exec('sls invoke local -f hello', {cwd: dest}, function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    })    
});
*/

gulp.task('clean', function(cb) {
  del(['./dest'], cb);
});