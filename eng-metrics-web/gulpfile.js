// const gulp = require("gulp");
// const gap = require("gulp-append-prepend");

// async function license() {
//   // this is to add Creative Tim licenses in the production mode for the minified js
//   gulp
//     .src("build/static/js/*chunk.js", { base: "./" })
//     .pipe(
//       gap.prependText(`/*!
// Union Street Media - Engineering Metrics DashboardUnion Street Media - Engineering Metrics Dashboard
// -->`)
//     )
//     .pipe(gulp.dest("./", { overwrite: true }));

//   // this is to add Creative Tim licenses in the production mode for the minified css
//   gulp
//     .src("build/static/css/*chunk.css", { base: "./" })
//     .pipe(
//       gap.prependText(`/*!
// Union Street Media - Engineering Metrics Dashboard
// */`)
//     )
//     .pipe(gulp.dest("./", { overwrite: true }));
//   return;
// }

// gulp.task("licenses", license);
// gulp.task("default", license);
