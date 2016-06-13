module.exports = function (grunt) {

    var now = Date.now();
    grunt.initConfig({
        connect: {
            dev: {
                options: {
                    hostname: '10.0.2.15',
                    port: 3000,
                    base: 'src'
                }
            },
            build: {
                options: {
                    hostname: '10.0.2.15',
                    port: 3000,
                    base: 'dist/src',
                    keepalive : true
                }
            }
        },
        sass: {
            options: {
                loadPath: 'src/vendor/bootstrap/scss',
                cacheLocation : '/tmp/.sass-cache'
            },
            build: {
                options: {
                    style: 'compressed'
                },
                files: {
                    'dist/src/css/main.css': 'src/scss/main.scss'
                }
            },
            dev: {
                files: {
                    'src/css/main.css': 'src/scss/main.scss'
                }
            }
        },
        watch: {
            options: {
                spawn: false,
                livereload: false
            },
            css: {
                files: ['src/scss/*.scss'],
                tasks: ['sass:dev']
            }
        },

        copy: {
            build: {
                files: [
                    {
                        expand: true,
                        src: ['src/404.html', 'src/*.png', 'src/*.png', 'src/*.ico', 'src/service-worker.js'],
                        dest: 'dist/'
                    },
                    {
                        expand: true,
                        src: ['src/img/**'],
                        dest: 'dist/'
                    },
                    {
                        expand: true,
                        src: ['src/js/**/*.html'],
                        dest: 'dist/'
                    },
                ]
            }
        },
        exec: {
            clean: 'rm -rf dist .build-cache'
        },
        concat: {
            buildjs: {
                files: {
                    '.build-cache/jscache/build.js': [
                        'src/vendor/angular/angular.min.js',
                        'src/vendor/angular-route/angular-route.min.js',
                        'src/js/main.js',
                        'src/js/**/*.js'
                    ]
                }
            }
        },
        processhtml: {
            build: {
                files: {
                    'dist/src/index.html' : [ 'src/index.html' ]
                }
            }
        },
        'string-replace': {
            buildjs: {
                files: {
                    'dist/src/js/build.js': '.build-cache/jscache/build.js',
                },
                options: {
                    replacements: [{
                        pattern: /apiKey: "[^"]+"/,
                        replacement: 'apiKey: "AIzaSyCbjZ0v15_9e-wlBYdp7g3nqkSNEfkDql8"'
                    }, {
                        pattern: /authDomain: "[^"]+"/,
                        replacement: 'authDomain: "tippkick-planer.firebaseapp.com"'
                    }, {
                        pattern: /databaseURL: "[^"]+"/,
                        replacement: 'databaseURL: "https://tippkick-planer.firebaseio.com"'
                    }, {
                        pattern: /storageBucket: "[^"]+"/,
                        replacement: 'storageBucket: "tippkick-planer.appspot.com"'
                    }, {
                        pattern: /sourceMappingURL=.*map/g,
                        replacement: ''
                    }
                    ]
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-string-replace');

    grunt.registerTask('default', ['connect:dev', 'watch:css']);
    grunt.registerTask('build', ['exec:clean', 'copy:build', 'sass:build', 'build-js', 'processhtml:build']);

    grunt.registerTask('build-js', ['concat:buildjs', 'string-replace:buildjs']);
};
