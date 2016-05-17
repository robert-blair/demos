const path = require("path");
const fs = require("fs");

const gulp = require("gulp");
const rename = require("gulp-rename");
const sourcemaps = require("gulp-sourcemaps");

const ts = require("gulp-typescript");

const rucksack = require("gulp-rucksack");
const gulp_postcss = require("gulp-postcss");
const cssnano = require("gulp-cssnano");



gulp.task("transpile CSS", function() {
    const processors =
        [
            require("postcss-import"),
            require("postcss-cssnext")({ browsers: "last 2 versions"}),
            require("lost"),
            require("postcss-color-pantone")
        ];

    return gulp.src(path.resolve("./stuff/styles/src/*.css"))
        .pipe(sourcemaps.init())
        .pipe(gulp_postcss(processors))
        .pipe(rucksack({ fallbacks : true }))
        .pipe(cssnano())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.resolve("./stuff/styles")));
});

gulp.task("w:css", function(){
    gulp.watch(path.resolve("./stuff/styles/src/**/.*.css"), ["transpile CSS"]);
});

gulp.task("clientside typescript", function (){
    const tsProject = ts.createProject(path.resolve("./tsconfig.json"), { module: "system" });
    return gulp.src([path.resolve("./stuff/javascript/ts/*.ts"), path.resolve("./typings/browser.d.ts")])
        .pipe(ts(tsProject))
        .js
        .pipe(gulp.dest(path.resolve("./stuff/javascript")))
});

gulp.task("w:ts", function(){
    gulp.watch("./stuff/javascript/ts/*.ts", ["clientside typescript"]);
    // gulp.watch("database/**/*.ts", ["databaseTS"]);
    // gulp.watch("server/**/*.ts", ["serverTS"]);
});

gulp.task("default", ["w:ts", "w:CSS"]);