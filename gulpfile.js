var gulp = require('gulp');
var run = require('gulp-run-command').default;

// Convert SASS to LESS
gulp.task('conv1', run("sass2less bower_components/bootstrap/scss/_variables.scss 'bower_components/bootstrap/less/_variables.less'"));
gulp.task('conv2', ['conv1'], run("sass2less bower_components/bootstrap/scss/_grid.scss 'bower_components/bootstrap/less/_grid.less'"));
gulp.task('conv3', ['conv2'], run("sass2less bower_components/bootstrap/scss/mixins/_grid-framework.scss 'bower_components/bootstrap/less/mixins/_grid-framework.less'"));
gulp.task('convertSASStoLESS', ['conv3'], run("sass2less bower_components/bootstrap/scss/mixins/_grid.scss 'bower_components/bootstrap/less/mixins/_grid.less'"));

// gulp.task('conv1', async () => {
//     await run("sass2less bower_components/bootstrap/scss/_variables.scss 'assets/styles/pages/bootstrap/_variables.less'");
// });

// gulp.task('conv2', async () => {
//     await run("sass2less bower_components/bootstrap/scss/_grid.scss 'assets/styles/pages/bootstrap/_grid.less'");
// });

// gulp.task('conv3', async () => {
//     await run("sass2less bower_components/bootstrap/scss/mixins/_grid-framework.scss 'assets/styles/pages/bootstrap/mixins/_grid-framework.less'");
// });

// gulp.task('convertSASStoLESS', async () => {
//     await run("sass2less bower_components/bootstrap/scss/mixins/_grid.scss 'assets/styles/pages/bootstrap/mixins/_grid.less'");
// });

// gulp.task('default', gulp.series('conv1', 'conv2', 'conv3', 'convertSASStoLESS'));
