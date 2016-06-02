module.exports = function(grunt) {

  grunt.initConfig({
    connect: {
        server : {
            options: {
                hostname: '10.0.2.15',
                port: 3000,
                base: 'src',
                livereload: false,
                keepalive: true
            }
        }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('default', ['connect']);
};
