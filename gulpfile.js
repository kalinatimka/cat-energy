var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var server = require('browser-sync').create();
var minify = require('gulp-csso');
var rename = require('gulp-rename');
var run = require('run-sequence');
var del = require("del");

// --- Creating folder tree ---
gulp.task("createtree", function () {
    return gulp.src('*.*', {read: false})
        .pipe(gulp.dest('./src/fonts'))
        .pipe(gulp.dest('./src/img'))
        .pipe(gulp.dest('./src/js'))
        .pipe(gulp.dest('./src/sass'));
});


// --- Minify Files ---
gulp.task("fonts", function () {
    gulp.src("src/fonts/*.*")
        .pipe(gulp.dest("build/fonts"));
});
gulp.task("images", function () {
    gulp.src("src/img/*.*")
        .pipe(gulp.dest("build/img"));
});
gulp.task("js", function () {
    gulp.src("src/js/*.*")
        .pipe(gulp.dest("build/js"));
});
gulp.task("style", function () {
    gulp.src("src/sass/style.scss")
        .pipe(plumber())
        .pipe(sass())
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(gulp.dest("build/css"))
        .pipe(minify())
        .pipe(rename("style.min.css"))
        .pipe(gulp.dest("build/css"))
        .pipe(server.stream());
});
gulp.task("markup", function () {
    gulp.src("src/*.html")
        .pipe(gulp.dest("build"));
});
gulp.task("copy", function () {
    return gulp.src([
        "!src/{fonts,fonts/**/*}",
        "!src/{img,img/**/*}",
        "!src/{js,js/**/*}",
        "!src/{sass,sass/**/*}",
        "src/**"
    ], {
        base: "src"
    })
    .pipe(gulp.dest("build"));
});
// --- END Minify Files ---


gulp.task("clean", function () {
    return del("build");
});

gulp.task("build", function (done) {
    run("clean", "copy", "fonts", "images", "js", "style", "markup", done);
});


gulp.task("serve", function () {
    server.init({
        server: "build/",
        notify: false,
        open: true,
        cors: true,
        ui: false
    });

    gulp.watch("src/sass/**/*.{scss, sass}", ["style"]);
    gulp.watch("src/fonts/*.*", ["fonts"]).on("change", server.reload);
    gulp.watch("src/img/*.*", ["images"]).on("change", server.reload);
    gulp.watch("src/js/*.*", ["js"]).on("change", server.reload);
    gulp.watch("src/*.html", ["markup"]).on("change", server.reload);
});
