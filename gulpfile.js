var babel = require("gulp-babel");
var connect = require("gulp-connect");
var del = require("del");
var gulp = require("gulp");
var rename = require("gulp-rename");
var sourcemaps = require("gulp-sourcemaps");
var terser = require("gulp-terser");

gulp.task("build:scripts", () =>
  gulp
    .src("./src/scripts/*.js")
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: [
          [
            "@babel/preset-env",
            {
              targets: "> 0.25%, not dead"
            }
          ]
        ],
        plugins: ["@babel/plugin-proposal-class-properties"]
      })
    )
    .pipe(
      terser({
        keep_fnames: false,
        mangle: {
          toplevel: true
        }
      })
    )
    .pipe(rename(path => (path.basename += ".min")))
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("./dist/scripts"))
);

gulp.task("clean:all", () => del("dist/*"));

gulp.task("copy:markup", () =>
  gulp.src(["./src/index.html", "./src/foo.json"]).pipe(gulp.dest("./dist"))
);

gulp.task("copy:vendor-scripts", () =>
  gulp
    .src("./node_modules/material-design-lite/material.min.js*")
    .pipe(gulp.dest("./dist/scripts"))
);

gulp.task("copy:vendor-styles", () =>
  gulp
    .src("./node_modules/material-design-lite/material.min.css*")
    .pipe(gulp.dest("./dist/styles"))
);

gulp.task("serve:host", () =>
  connect.server({
    livereload: true,
    port: 8000,
    root: "./dist"
  })
);

gulp.task("serve:reload", () => gulp.src("./dist").pipe(connect.reload()));

gulp.task("serve:watch", () =>
  gulp.watch("./src/**/*", gulp.series(["build", "serve:reload"]))
);

gulp.task(
  "build",
  gulp.series([
    "clean:all",
    gulp.parallel([
      "build:scripts",
      "copy:markup",
      "copy:vendor-scripts",
      "copy:vendor-styles"
    ])
  ])
);

gulp.task(
  "serve",
  gulp.series(["build", gulp.parallel(["serve:host", "serve:watch"])])
);

gulp.task("default", gulp.parallel(["build"]));
