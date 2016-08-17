module.exports = function (grunt)
{
    require("load-grunt-tasks")(grunt); // npm install --save-dev load-grunt-tasks

    grunt.initConfig({
        "browserSync": {
          dev: {
            options: {
                proxy: 'localhost/canvas/index.html',
                files: 'stylesheets/*.css, lib/*.js, src/*.js'
            }
          }
        }
    });

    grunt.registerTask("default", ["browserSync"]);
};


// module.exports = function(grunt) {

//   // Project configuration.
//   grunt.initConfig({
//     pkg: grunt.file.readJSON('package.json'),

//     browserSync: {
//       dev: {
//         options: {
//             proxy: 'localhost/canvas/index.html',
//             files: 'stylesheets/*.css, js/*.js, application/**/*.php, application/views/**/*.phtml, assets/**/*.yml'
//         }
//       }
//     },
//     babel: {
//       options: {
//         sourceMap: true,
//         presets: ['es2015']
//       },
//       dist: {
//         files: {
//           "lib/canvas-scroll.js": "src/canvas-scroll.js"
//         }
//       }
//     }
//   });

//   grunt.loadNpmTasks('grunt-browser-sync', 'grunt-babel');

//   // Default task(s).
//   grunt.registerTask('default', ['babel']);//,'browserSync', 'babel']);
  
// };