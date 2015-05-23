'use strict';

/* Grunt Modules and Commands
 * ==========================================================================
 * STYLE: Grunt modules are listed in alphabetical order.  The commands
 *        for each task are broken up into *common* and *app specific* sections
 *        (where appropriate) but otherwise are also listed alphabetically.
 */

module.exports = function(grunt) {
  // load grunt modules
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
      pkg: grunt.file.readJSON('package.json')

/* Module: Clean
 * ------------------------------------------------------
 * [Docs](https://www.npmjs.org/package/grunt-contrib-clean)
 *
 * Remove all files in the specified folders.
 *
 * ### Commands ###
 *
 *   * `grunt clean` - Run all clean commands (below).
 *   * `grunt clean:build` - Empty the `build/` directory, except for hidden
 *     files.
 */
    , clean: {
        build: ['build/*', '!build/**/.gitkeep']
      }

/* Module: SASS
 * ------------------------------------------------------
 * [Docs](https://npmjs.org/package/grunt-contrib-sass)
 *
 * Compile SASS and SCSS files into CSS.
 *
 * Use SASS [@import](sass_import) to include files into an app level file,
 * which will then be converted to SCSS. This behaviour is different than that
 * of the js, which gets concatenated into an app level file in the build task.
 * However, imports are baked into SASS and can be used to group related styles.
 *
 * [sass_import]: http://sass-lang.com/documentation/file.SASS_REFERENCE.html#import
 *
 * ### Commands ###
 *
 *   * `grunt sass` - Run all SASS commands (below).
 *   * `grunt sass:stylin` - Compile styles.
 *   * `grunt sass:stylin_min` - Compile styles and minify them.
 */
    , sass: {
          stylin: {
              files: [{
                  expand: true
                , cwd: 'app/static/scss'
                , src: ['*.scss']
                , dest: 'app/static/css'
                , ext: '.css'
              }]

            , options: {
                style: 'nested'
              }
          }
        , stylin_min: {
            files: [{
                expand: true // consider all scss files in the directory
              , cwd: 'scss'
              , src: ['*.scss']
              , dest: 'css'
              , ext: '.min.css'
            }],

            options: {
              style: 'compressed'
            }
          }
      }

/* Watch
 * ------------------------------------------------------
 * [Docs](https://npmjs.org/package/grunt-contrib-watch)
 *
 * Run grunt commands when files change.
 *
 * ### Commands ####
 *
 *   * `grunt watch` - Run all watch commands (below) in a single watch session.
 *
 *     The files listed by each command will be monitored.  When one changes,
 *     the specified tasks for that command will be run.  Multiple tasks my be
 *     run by each command, and multiple commands may be triggered by a single
 *     file change.
 *
 *   * `grunt watch:common` - Monitor common files and build them on change.
 *   * `grunt watch:lib` - Monitor library files and build them on change.
 *   * `grunt watch:pages` - Monitor webpages and build them on change.
 */
    , watch: {
          options: {
              interrupt: true     // interupts the current tasks if another file is changed, restarting them
            , atBegin: true       // runs all tasks when the watch server is started
          }

        , styles: {
              files: ['app/static/scss/**']
            , tasks: ['build_styles']
          }

      }

  }); // end grunt config


/* Grunt Tasks
 * ==========================================================================
 * STYLE: Grunt tasks are grouped into sections, each of which is listed
 *        alphabetically.  The tasks themseleves are listed alphabetically
 *        within each section.  However each task may lists commands in a
 *        non-alphabetical order for performance or sequencing reasons.  For
 *        example, if the js files change much more than the webpages, it may
 *        make more sense to run js-related commands before page-related
 *        commands within a task.
 */

/* Task: Build and Friends
 * ------------------------------------------------------
 * Build the source code, or specific parts of it.
 *
 * Build should be used manually or to perform and application wide build.  It
 * will remove everything in `build/` and recreate the directory structure, then
 * add the built source code.
 *
 * More specific commands are used by `grunt watch` to only build parts affected
 * by the changed file.  They expect that `build/`'s directory structure is
 * already there.
 *
 * Run with `grunt build`.
 */
  grunt.registerTask('build', [
      'build_styles'
  ]);

  grunt.registerTask('build_styles', [
      'sass:stylin'
    , 'sass:stylin_min'
  ]);

/* Task: Default
 * ------------------------------------------------------
 * Define the default behavior that grunt should take when its not passed
 * any specific task or command to run.
 *
 * Run with `grunt`.
 */
  grunt.registerTask('default', [
      'build'
    //, 'test'
  ]);

/* Task: Test
 * ------------------------------------------------------
 * Run js and php unit tests.
 *
 * Run with `grunt test`.
 */
  grunt.registerTask('test', [
      'jshint:all'
    , 'test_js'
  ]);

}; // end module.exports functiono
