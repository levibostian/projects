/*global module:false*/
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        wordpress_theme_banner: '/* \n' +
            'Theme Name: projects \n' +
            'Theme URI: http://levibostian.com/projects \n' +
            'Author: Levi Bostian \n' +
            'Author URI: http://levibostian.com \n' +
            'Description:  \n' +
            'Version: 1.0.0 \n' +
            'License: MIT \n' +
            'License URI: http://opensource.org/licenses/MIT \n' +
            'Tags:  \n' +
            'Text Domain: projects \n' +
            '*/',
        // Task configuration.
        concat: {
            options: {
                //banner: '<%= banner %>',
                stripBanners: true
            },
            js: {
                src: ['lib/<%= pkg.name %>.js'],
                dest: 'dist/<%= pkg.name %>.js'
            },
            bootstrap: {
                src: ['bower_components/bootstrap/js/*.js'],
                dest: 'dist/bootstrap.js'
            }
        },
        uglify: {
            options: {
                banner: '<%= wordpress_theme_banner %>'
            },
            js: {
                src: '<%= concat.js.dest %>',
                dest: 'dist/<%= pkg.name %>.min.js'
            },
            bootstrap: {
                src: '<%= concat.bootstrap.dest %>',
                dest: 'dist/bootstrap.min.js'
            }
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: true,
                boss: true,
                eqnull: true,
                browser: true,
                globals: {}
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            lib_test: {
                src: ['lib/**/*.js', 'test/**/*.js']
            }
        },
        qunit: {
            files: ['test/**/*.html']
        },
        less: {
            production: {
                options: {
                    paths: ["lib/css", "bower_components/bootstrap/less"],
                    compress: false,
                    banner: '<%= wordpress_theme_banner %>'
                },
                files: {
                    "style.css": "lib/less/style.less"
                }
            }
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            lib_test: {
                files: '<%= jshint.lib_test.src %>',
                tasks: ['jshint:lib_test', 'qunit']
            },
            less: {
                files: 'lib/less/*.less',
                tasks: ['compile']
            },
            js: {
                files: 'lib/js/*.js',
                tasks: ['js-compile']
            }
        },
        compress: {
            main: {
                options: {
                    archive: 'projects.zip'
                },
                files: [
                    {src: ['img/*'], dest: ''},
                    {src: ['inc/*'], dest: ''},
                    {src: ['dist/*.min.js'], dest: ''},
                    {src: ['style.css', 'footer.php', 'header.php', 'index.php', 'functions.php'], dest: ''},
                    {src: ['LICENSE', "README.md", 'screenshot.png'], dest: ''}
                ]
            }
        }  
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-compress');

    // Default task.
    grunt.registerTask('default', ['jshint', 'js-compile', 'compile']);

    grunt.registerTask('compile', ['less']);
    grunt.registerTask('js-compile', ['concat', 'uglify']);
    grunt.registerTask('release', ['js-compile', 'compile']);

};
