
/**
 * Gruntfile.js
 */

module.exports = function( grunt ) {
	'use strict';

	var gzip = require('gzip-js');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		build: {
			dist: {
				dest: 'dist/jquery.panzoom.js',
				src: 'jquery.panzoom.js'
			},
			manifest: {
				src: 'panzoom.jquery.json'
			},
			bower: {
				src: 'bower.json'
			}
		},
		compare_size: {
			files: [
				'dist/jquery.panzoom.js',
				'dist/jquery.panzoom.min.js'
			],
			options: {
				cache: 'dist/.sizecache.json',
				compress: {
					gz: function( contents ) {
						return gzip.zip( contents, {} ).length;
					}
				}
			}
		},
		jsonlint: {
			pkg: {
				src: 'package.json'
			},
			bower: {
				src: 'bower.json'
			},
			jquery: {
				src: 'panzoom.jquery.json'
			}
		},
		jshint: {
			all: [
				'Gruntfile.js',
				'jquery.panzoom.js',
				'test/bdd/*.js'
			],
			options: {
				jshintrc: '.jshintrc'
			}
		},
		uglify: {
			'dist/jquery.panzoom.min.js': [
				'dist/jquery.panzoom.js'
			],
			options: {
				preserveComments: 'some'
			}
		},
		mocha: {
			// runs all html files in phantomjs
			all: {
				src: [ 'test/index.html' ],
				options: {
					mocha: {
						ui: 'bdd',
						ignoreLeaks: false
					}
				}
			}
		},
		watch: {
			files: [
				'<%= jshint.all %>',
				'package.json',
				'test/index.html'
			],
			tasks: 'test'
		}
	});

	// Load necessary tasks from NPM packages
	grunt.loadNpmTasks('grunt-compare-size');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-mocha');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-jsonlint');

	grunt.registerMultiTask(
		'build',
		'Build jquery.panzoom and package manifest',
		function() {
			var data = this.data;
			var src = data.src;
			var dest = data.dest || src;
			var version = grunt.config('pkg.version');
			var compiled = grunt.file.read( src );

			// Replace version and date
			compiled = compiled
				// Replace version in JSON files
				.replace( /("version":\s*")[^"]+/, '$1' + version )
				// Replace version tag
				.replace( /@VERSION/g, version )
				.replace( '@DATE', (new Date).toDateString() );

			// Write source to file
			grunt.file.write( dest, compiled );

			grunt.log.ok( 'File written to ' + dest );
		}
	);

	grunt.registerTask( 'test', [ 'jsonlint', 'jshint', 'build', 'uglify', 'compare_size', 'mocha' ]);

	// Default grunt
	grunt.registerTask( 'default', [ 'test' ]);
};
