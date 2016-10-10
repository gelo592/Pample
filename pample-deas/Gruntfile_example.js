'use strict';

/* Grunt Intro
 * ==========================================================================
 * Grunt.js is a node module that provides a javascript based task runner.
 * Use it to do things like automatically write SCSS to CSS, lint javascript
 * source files, and concatenate files for the production environment.
 *
 * **Contents**
 *
 *  1. Grunt Intro
 *  2. Grunt Modules and Commands
 *  3. Grunt Tasks
 *  4. [TODOs](https://github.com/jtfairbank/Milkshake/issues?labels=Grunt&page=1&state=open)
 *
 *
 * Setup
 * ------------------------------------------------------
 *
 *  1. Install Node.js and the Node Package Manager (npm): http://nodejs.org/download/
 *  2. Install Grunt: http://gruntjs.com/getting-started
 *        * Note that the project is already configured, so look at the "Working
 *          with an existing Grunt project" section after installing grunt.
 *  3. Use the Strawberry sample application as an example to configure Grunt
 *     for your own app.  These configuration points are labeled as `APP
 *     SPECIFIC`.
 *
 *
 * Terminology
 * ------------------------------------------------------
 *
 *   * *module* - A grunt plugin we are using in the project.  Modules do
 *     something in general, for example run tests or concatenate files.  Each
 *     module has is configured below.
 *
 *   * *command* - Tells a grunt module to do something.  Commands are useful
 *     for getting a module to do something specific, such as concatenate
 *     all js source code into an app level file.  Commands are specified
 *     in the module configuration and can have command-specific settings (ie
 *     which files are included).
 *
 *   * *task* - Chain commands (and other tasks).  Tasks are used to execute a
 *     sequence of commands.  Each task should focus on doing one thing well,
 *     and related tasks can be sequenced in a containing task.  Tasks are set
 *     up at the end of the document.
 *
 *
 * Using Grunt
 * ------------------------------------------------------
 *
 * Grunt commands can be run with:
 *
 *     `grunt [module]:[command]`
 *
 * You can run all of the commands for a module with:
 *
 *     `grunt [module]`
 *
 * Grunt tasks are used to run a sequence of commands.  You can run them with:
 *
 *     `grunt [task]`
 *
 * See individual modules and tasks (below) for the specific commands to run
 * them.
 */

/*
 * Global parameters
 */
var internalFirebaseUrl = 'https://test-reschedulemed.firebaseio.com';
var internalFbOption = 'int';
var otherFbOption = 'fb';
var replaceTagForFirebaseUrl = '%%%GRUNT_REPLACE_FIREBASE_ROOT_URL%%%';
var fbOptionUsageError = 'Need to specify --' + internalFbOption +
  ' for internal Firebase or --' + otherFbOption + '="<Firebase URL>"';


/* Glob
 * ------------------------------------------------------
 * [Docs](https://www.npmjs.org/package/glob)
 *
 * Glob is a file pattern matcher used by node (and thus grunt).  It is mainly
 * used here to check if directories are empty before running certain tasks.
 */

var glob = require("glob");


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


/* Module: Concat
 * ------------------------------------------------------
 * [Docs](https://npmjs.org/package/grunt-contrib-concat)
 *
 * Concatenate files from `src/` into a single app level file in `build`.  Each
 * command may target a subset of `src/`.  Using a single file in production
 * means less requests are made when loading a page's resources.
 *
 * A `'use strict';` statement is appended to the top of the output file, so
 * each individual source code file should not include it.
 *
 * ### Commands ###
 *
 *   * `grunt concat` - Run all concat commands (below).
 *   * `grunt concat:js` - Concatenate js files into a single build file.
 */
    , concat: {
          js: {
              options: {
                  banner: "'use strict';\n\n" +
                          "/* ReSchedule JS\n" +
                          " * ============================================================================= */\n\n"
                , separator: '\n\n'
                , footer: '\n'
              }
            , src: [
                  // load specific files here first
                  'src/js/global.js',
                  'src/js/pageGlobal.js',

                  // load all the namespace definitions
                  'src/js/account/account.js',
                  'src/js/auth/auth.js',
                  'src/js/cohort/cohort.js',
                  'src/js/collection/collection.js',
//                  'src/js/dashboard/dashboard.js',
                  'src/js/group/group.js',
                  'src/js/job/job.js',
                  'src/js/preference/preference.js',
                  'src/js/program/program.js',
                  'src/js/resident/resident.js',
                  'src/js/rotation/rotation.js',
                  'src/js/schedule/schedule.js',

                  // load namespace files
                  'src/js/*/*.api.js',
                  'src/js/*/component/*.js',
                  'src/js/*/page/*.js',

                  // general include
                  'src/js/**/*.js'
              ]
            , dest: 'build/js/main.js'
            , nonull: true
          }
      }


/* Module: Copy
 * ------------------------------------------------------
 * [Docs](https://www.npmjs.org/package/grunt-contrib-copy)
 *
 * Copy files and folders.
 *
 * ### Commands ###
 *
 *   * `grunt copy` - Run all copy commands (below).
 *   * `grunt copy:download` - Copy downloadable files to build.
 *   * `grunt copy:img` - Copy images to build.
 *   * `grunt copy:lib` - Copy library files to build.
 *   * `grunt copy:pages` - Copy website pages to build.
 */
    , copy: {
          download: {
              expand: true
            , cwd: 'src/download/'
            , src: './**'
            , dest: 'build/download/'
          }
        , img: {
              expand: true
            , cwd: 'src/img/'
            , src: './**'
            , dest: 'build/img/'
          }
        , lib: {
              expand: true
            , cwd: 'src/lib/'
            , src: './**'
            , dest: 'build/lib/'
          }
        , pages: {
            files: [
                {
                    expand: true
                  , cwd: 'src/'
                  , src: './*'
                  , filter: 'isFile'
                  , dest: 'build/'
                }
            ]
          }
        , js: {
            files: [
            {
                expand: true
              , cwd: 'src/js/'
              , src: './schedule-viewer.js'
              , dest: 'build/js/'
            }
          ]
        }
      }


/* Module: Githooks
 * ------------------------------------------------------
 * [Docs](https://npmjs.org/package/grunt-githooks)
 *
 * Add grunt tasks to the project's githooks.
 *
 * NOTE: custom githooks are defined in  `githooks/`, which must be linked to
 *       `.git/hooks/` before running this command.  See `githooks/README.md`
 *       for specific setup instructions.
 *
 * Each command only needs to be run once to setup the githook (ie not as part
 * of a build script).
 *
 * ### Commands ###
 *
 *   * `grunt githooks` - Run all githooks commands (below).
 *   * `grunt githooks:precommit` - Adds the `grunt precommit` task to the
 *      existing precommit githook (or creates a new githook).  See that for
 *      specifics on what is done.
 */
    , githooks: {
          options: {
            'dest': '.git/hooks'
          }

        , precommit: {
              'pre-commit': 'precommit'
            , options: {
                  hashbang: '#!/bin/sh'
                , template: 'node_modules/grunt-githooks/templates/shell.hb'
                , startMarker: '### GRUNT-GITHOOKS START'
                , endMarker: '### GRUNT-GITHOOKS END'
              }
          }
      }


/* Module: Handlebars
 * ------------------------------------------------------
 * [Docs](https://www.npmjs.org/package/grunt-contrib-handlebars)
 *
 * Do some stuff with templates
 *
      , handlebars: {
          compile: {
            options: {
                namespace: 'Resident.templates',

                //convert filepath into function name
                processName: function(filepath) {
                  var pathPieces = filepath.split('/');
                  return pathPieces[pathPieces.length - 1].split('.')[0];
                }
              },

              files: {
                'build/js/templates.js' : 'src/.handlebars'
              }
          }
      }*/


/* Module: jsHint
 * ------------------------------------------------------
 * [Docs](https://npmjs.org/package/grunt-contrib-jshint)
 * [jsHint Options](http://www.jshint.com/docs/options/)
 *
 * Lint javascript files for errors.
 *
 * NOTE: In all cases, 3rd party files (lib) and minimized files (.min.js) are
 *       excluded from linting.  3rd party js files often have different style
 *       guidelines and minimized files don't have any style by definition,
 *       thus both have a tendency to cause jsHint errors.
 *
 * The commands are setup to be inclusive, so that a file should be linted by
 * default unless it is in pre-approved section (ie a library).
 *
 * ### Commands ###
 *
 *   * `grunt jshint` - Run all jshint commands (below).  `grunt jshint:all` is
 *      prefered.
 *   * `grunt jshint:all` - Lint all js files, including those in the project's
 *      root (like `Gruntfile.js`).
 *   * `grunt jshint:build` - Lint `build/`.
 *   * `grunt jshint:source` - Lint `src/`.
 *   * `grunt jshint:test` - Lint `test/`.
 */
    , jshint: {
          // global options
          options: {
              // options here to override JSHint defaults
              // http://www.jshint.com/docs/options/

              // turn on warnings
              // true = on, false = off
              // http://www.jshint.com/docs/options/#enforcing-options
              bitwise: true
            , curly: true
            , forin: true
            , freeze: true
            , immed: true
            , indent: false
            , latedef: true
            , newcap: true
            , noarg: true
            , noempty: true
            , nonew: true
            , quotmark: false
            , strict: false
            , undef: true
            , unused: false
            , trailing: true

              // turn off warnings
              // true = off, false = on
              // http://www.jshint.com/docs/options/#relaxing-options
            , globalstrict: true
            , laxbreak: true
            , laxcomma: true
            , shadow: true

              // environments
              // declares variables that will exist in the global scope
              // http://www.jshint.com/docs/options/#environments
            , browser: true
            , devel: true
            , jquery: true

              // set global vars
              // turns off warnings for varialbes defined in the global scope:
              //   * true = warning on
              //   * false = warning off
            , globals: {
                  "rs": false            // ReSchedule (us!)

                , "analytics": false     // segment.io

                , "randomColor": false   // randomColor lib

                , "moment": false        // moment time lib

                , "afterEach": false     // jasmine
                , "beforeEach": false
                , "describe": false
                , "expect": false
                , "it": false
                , "jasmine": false
                , "spyOn": false

                , "module": false        // Gruntfile.js
                , "require": false

                , "_": false             // underscore.js
                , "Handlebars" : false
                , "Firebase" : false
                , "Promise" : false
              }
          }

          // commands
        , all: {
            src: [
                // generally include
                '**/*.js'

                // except 3rd party and minified files
              , '!node_modules/**/*.js'
              , '!src/lib/**/*.js'
              , '!build/lib/**/*.js'
              , '!**/*.min.js'
              , '!build/js/templates.js'

                // but specifically include these
                // ex: `src/lib/myCustomLibComponent/ohYeah.js`
            ]
          }
     }


/* Module: Karma
 * ------------------------------------------------------
 * [Docs](https://www.npmjs.org/package/grunt-karma)
 *
 * ### Commands ###
 *   * `grunt karma` - Run all karma commands (below).
 *   * `grunt karma:js` - Run js unit tests in a single run.
 */
    , karma: {
          // global options
          options: {
              basePath: './'
            , browsers: ['PhantomJS']
            , frameworks: ["jasmine"]
          }

        , js: {
              singleRun: true
            , files: [
                  // All files needed to run the app, usually the same as what index.html loads.
                  'build/lib/**/*.js'
                , 'build/js/main.js'

                  // tests to run
                , 'test/jsunit/**/*.js'
              ]
          }
      }

/* Module: Text replace
 * ------------------------------------------------------
 * [Docs](https://www.npmjs.com/package/grunt-text-replace)
 *
 * Modify JS files or html files in build to point to the right Firebase URL.
 *
 */
    , replace: {
        firebaseURLInJS: {
          src: 'build/js/*.js',
          overwrite: true,
          replacements: [{
            from: replaceTagForFirebaseUrl,
            to: grunt.option(otherFbOption) || internalFirebaseUrl
          }]
        },
        firebaseURLInHtml: {
          src: 'build/*.html',
          overwrite: true,
          replacements: [{
            from: replaceTagForFirebaseUrl,
            to: grunt.option(otherFbOption) || internalFirebaseUrl
          }]
        }
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
                , cwd: 'src/scss'
                , src: ['*.scss']
                , dest: 'build/css'
                , ext: '.css'
              }]

            , options: {
                style: 'nested'
              }
          }
        , stylin_min: {
            files: [{
                expand: true // consider all scss files in the directory
              , cwd: 'src/scss'
              , src: ['*.scss']
              , dest: 'build/css'
              , ext: '.min.css'
            }],

            options: {
              style: 'compressed'
            }
          }
      }


/* Module: Trim Trailing Spaces
 * ------------------------------------------------------
 * [Docs](https://npmjs.org/package/grunt-trimtrailingspaces)
 *
 * Auto-remove trailing whitespace.  Yay clean code.
 *
 * NOTE: In all cases, 3rd party files (lib) and minimized files (.min.js) are
 *       excluded from linting.  3rd party js files often have different style
 *       guidelines and minimized files don't have any style by definition,
 *       thus both have a tendency to cause jsHint errors.
 *
 * ### Commands ###
 *
 *   * `grunt trimtrailingspaces` - Run all trimtrailingspaces commands (below).
 *   * `grunt trimtrailingspaces:js` - Trim js files.
 *   * `grunt trimtrailingspaces:markdown` - Trim markdown files.
 *   * `grunt trimtrailingspaces:scss` - Trim scss files.
 */
    , trimtrailingspaces: {
          options: {
              filter: 'isFile'
            , encoding: 'utf8'
            , failIfTrimmed: false
          }

        , js: {
            src: [
                // generally include
                '**/*.js'

                // except 3rd party and minified files
              , '!node_modules/**/*.js'
              , '!src/lib/**/*.js'
              , '!build/lib/**/*.js'
              , '!**/*.min.js'

                // but specifically include these
                // ex: `src/lib/myCustomLibComponent/ohYeah.js`
            ]
          }

        , markdown: {
            src: [
                // generally include
                '**/*.md'
              , '**/*.markdown'

                // except 3rd party files
              , '!node_modules/**/*.md'
              , '!node_modules/**/*.markdown'
              , '!src/lib/**/*.md'
              , '!src/lib/**/*.markdown'
              , '!build/lib/**/*.md'
              , '!build/lib/**/*.markdown'

                // but specifically include these
            ]
          }

        , scss: {
            src: [
                // generally include
                '**/*.scss'

                // except 3rd party files
              , '!node_modules/**/*.scss'
              , '!src/lib/**/*.scss'
              , '!build/lib/**/*.scss'

                // but specifically include these
            ]
          }
      }


/* Module: Uglify
 * ------------------------------------------------------
 * [Docs](https://npmjs.org/package/grunt-contrib-uglify)
 *
 * Does [JS minification](https://en.wikipedia.org/wiki/Minification_(programming).
 * A source map is produced to aid in debugging.
 *
 * Setup a new command for each app-level js file (as produced by
 * `grunt concat`).
 *
 * ### Commands ###
 *
 *   * `grunt uglify` - Run all uglify commads (below).
 *   * `grunt uglify:js` - Minifies the site's js file.
 */
    , uglify: {
          // globals
          options: {
            sourceMap: true
          }

        , yomama: {} // jk

        , js: {
              expand: true
            , cwd: 'build/js/'
            , src: './main.js'
            , dest: 'build/js/'
            , ext: '.min.js'
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

        , download: {
              files: ['src/download/**']
            , tasks: ['build_download']
          }

        , img: {
              files: ['src/img/**']
            , tasks: ['build_img']
          }

        , js: {
              files: ['src/js/**']
            , tasks: ['build_js']
          }

        , lib: {
              files: ['src/lib/**']
            , tasks: ['build_lib']
          }

        , pages: {
              files: ['src/*.*'] // TODO: hack for only files
            , tasks: ['build_pages']
          }

        , styles: {
              files: ['src/scss/**']
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
      'checkFbParam'
    , 'clean:build'
    , 'trimtrailingspaces'
    , 'build_download'
    , 'build_img'
    , 'build_js'
    , 'build_lib'
    , 'build_pages'
    , 'build_styles'
  ]);

  grunt.registerTask('build_download', [
      'copy:download'
  ]);

  grunt.registerTask('build_img', [
      'copy:img'
  ]);

  grunt.registerTask('build_js', [
      'concat:js'
      , 'replace:firebaseURLInJS'
      , 'uglify:js'
      , 'copy:js'
  ]);

  grunt.registerTask('build_lib', [
      'copy:lib'
  ]);

  grunt.registerTask('build_pages', [
      'copy:pages',
      'replace:firebaseURLInHtml'
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
    , 'test'
  ]);


/* Task: Precommit
 * ------------------------------------------------------
 * Execute other tasks before a commit is allowed to go through.  This task
 * is setup as a githook by `grunt githooks:precommit`.
 *
 * Run with `grunt precommit`.
 */
  grunt.registerTask('precommit', [
      'build'
    , 'test'
  ]);


/* Task: check parameters
 * ------------------------------------------------------
 * Checks whether the Firebase has been specified by command line and
 * errors out otherwise.
 *
 * Run with `grunt checkFbParam`.
 */
  grunt.registerTask('checkFbParam', function() {
    if(!grunt.option(internalFbOption) && !grunt.option(otherFbOption)) {
      grunt.log.error(fbOptionUsageError);
      return false;
    }
  });

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

  // A helper to prevent `grunt karma` from failing if there are no
  // unit tests, for example on project initialization.
  grunt.registerTask('test_js', function() {
    if (glob.sync('test/jsunit/**/*.js').length) {
      grunt.task.run([
          'karma'
      ]);
    }
  });

}; // end module.exports functiono
