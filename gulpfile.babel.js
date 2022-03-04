import gulp from "gulp";
import cp from "child_process";
import gutil from "gulp-util";
import BrowserSync from "browser-sync";
import webpack from "webpack";
import webpackConfig from "./webpack.conf";
import hugoBin from "hugo-bin";
import autoprefixer from "gulp-autoprefixer";
import cleanCSS from "gulp-clean-css";
// const autoprefixer = require("gulp-autoprefixer");
// const cleanCSS = require("gulp-clean-css");
// const sass = require("gulp-sass")(require("sass"));
import dartSass from "sass";
import gulpSass from "gulp-sass";
const sass = gulpSass(dartSass);

const browserSync = BrowserSync.create();
// const hugoBin = `./bin/hugo.${
//   process.platform === "win32" ? "exe" : process.platform
// }`;
const defaultArgs = ["-d", "../dist", "-s", "site"];

if (process.env.DEBUG) {
  defaultArgs.unshift("--debug");
}

gulp.task("hugo", (cb) => buildSite(cb));
gulp.task("hugo-preview", (cb) =>
  buildSite(cb, ["--buildDrafts", "--buildFuture"])
);
gulp.task("build", ["scss", "js", "hugo"]);
gulp.task("build-preview", ["scss", "js", "hugo-preview"]);

gulp.task("scss", () =>
  gulp
    .src("./src/scss/style.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(cleanCSS({}))
    .pipe(gulp.dest("./dist/css"))
    .pipe(browserSync.stream())
);

gulp.task("js", (cb) => {
  const myConfig = Object.assign({}, webpackConfig);

  webpack(myConfig, (err, stats) => {
    if (err) throw new gutil.PluginError("webpack", err);
    gutil.log(
      "[webpack]",
      stats.toString({
        colors: true,
        progress: true,
      })
    );
    browserSync.reload();
    cb();
  });
});

gulp.task("server", ["hugo", "scss", "js"], () => {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
  });
  gulp.watch("./src/js/**/*.js", ["js"]);
  gulp.watch("./src/scss/**/*.scss", ["scss"]);
  gulp.watch("./site/**/*", ["hugo"]);
});

function buildSite(cb, options, environment = "production") {
  const args = options ? defaultArgs.concat(options) : defaultArgs;

  process.env.NODE_ENV = environment;

  return cp.spawn(hugoBin, args, { stdio: "inherit" }).on("close", (code) => {
    if (code === 0) {
      browserSync.reload();
      cb();
    } else {
      browserSync.notify("Hugo build failed :(");
      cb("Hugo build failed");
    }
  });
}
