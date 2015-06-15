module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.loadTasks('./_/grunt/tasks');

  function loadConfig(path) {
    var glob = require('glob');
    var object = {};
    var key;
   
    glob.sync('*', {cwd: path}).forEach(function(option) {
      key = option.replace(/\.js$/,'');
      object[key] = require(path + option);
    });
   
    return object;
  }

  var config = {
    pkg: grunt.file.readJSON('package.json'),
    env: process.env
  };
 
  grunt.util._.extend(config, loadConfig('./_/grunt/options/'));

  grunt.initConfig(config);

  //---------------------------------
  //
  // ALIASES
  //
  //---------------------------------

  grunt.registerTask('default', [
    'browserify',
    'sass',
    'autoprefixer',
    'imagemin',
    'watch'
  ]);

  grunt.registerTask('clean', [
    'jsbeautifier:modify',
    'jshint'
  ]);
  grunt.registerTask('verify', [
    'jsbeautifier:verify',
    'jshint'
  ]);

  grunt.registerTask('production', [
    'browserify',
    'uglify',
    'sass',
    'autoprefixer',
    'combine_mq',
    'cssmin',
    'imagemin'
  ]);

};
