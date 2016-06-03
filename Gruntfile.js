module.exports = function (grunt) {

    grunt.initConfig({
        connect: {
            server: {
                options: {
                    hostname: '10.0.2.15',
                    port: 3000,
                    base: 'src',
                    livereload: true
                }
            }
        },
        sass: {
            dist: {
                options: {
                    loadPath: 'src/vendor/bootstrap/scss'
                },
                files: {
                    'src/css/main.css': 'src/scss/main.scss'
                }
            }
        },
        watch: {
            options: {
                spawn: false,
                livereload: true
            },
            css: {
                files: ['src/scss/*.scss'],
                tasks: ['sass']
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['connect', 'watch']);
};
