/**
 * Gruntfile for building & deploying MVC projects
 */

'use strict';

var fs = require('fs');
var path = require('path');

module.exports = function (grunt) {

  function generatePublishProfile(opts) {
    var profilePath = grunt.config('app.publishProfile'),
      xmlStr = '<?xml version="1.0" encoding="utf-8"?>' +
        '<Project ToolsVersion="4.0" xmlns="http://schemas.microsoft.com/developer/msbuild/2003">' +
          '<PropertyGroup>' +
            '<WebPublishMethod>FileSystem</WebPublishMethod>' +
            '<LastUsedBuildConfiguration>' + opts.configuration + '</LastUsedBuildConfiguration>' +
            '<LastUsedPlatform>Any CPU</LastUsedPlatform>' +
            '<SiteUrlToLaunchAfterPublish />' +
            '<LaunchSiteAfterPublish>False</LaunchSiteAfterPublish>' +
            '<ExcludeApp_Data>False</ExcludeApp_Data>' +
            '<publishUrl>' + opts.publishUrl + '</publishUrl>' +
            '<DeleteExistingFiles>False</DeleteExistingFiles>' +
          '</PropertyGroup>' +
        '</Project>';

    grunt.file.write(profilePath, xmlStr);

    return {
      xmlStr: xmlStr,
      profilePath: profilePath
    };
  }

  /**
   * Task configurations
   */
  grunt.initConfig({

    // Build settings
    app: {
      solution: grunt.option('solution') || '<%= solutionName %>.sln',
      mvcProject: grunt.option('mvcProject') || 'src/<%= projectName %>/<%= projectName %>.csproj',
      client: 'src/<%= projectName %>/client',
      buildConfiguration: grunt.option('buildConfig') || 'Debug',
      buildTargets: grunt.option('buildTargets') || 'Build',
      packagesConfig: grunt.option('packagesConfig') || 'src/{,*/}packages.config',
      packagesBin: grunt.option('packagesBin') || 'packages',
      dist: 'build',
      js: ['src/**/*.js', 'test/**/*.js'],
      publishProfile: '.tmp/PublishProfiles/Profile.pubxml'
    },

    // NuGet settings
    nuget: {
      exe: grunt.option('nuget.exe') || '.nuget/NuGet.exe',
      config: grunt.option('nuget.config') || '.nuget/NuGet.Config',
      apiKey: grunt.option('nuget.apiKey')
    },

    // Restore NuGet packages
    nugetrestore: {
      restore: {
        src: '<%= app.packagesConfig %>',
        dest: '<%= app.packagesBin %>'
      },
      options: {
        nugetExe: '<%= nuget.exe %>'
      }
    },

    // Run MSBuild
    msbuild: {
      solution: {
        src: ['<%= app.solution %>'],
        options: {
          projectConfiguration: '<%= app.buildConfiguration %>',
          targets: ['<%= app.buildTargets %>']
        }
      },

      mvc: {
        src: ['<%= app.mvcProject %>'],
        options: {
          projectConfiguration: '<%= app.buildConfiguration %>',
          targets: ['<%= app.buildTargets %>'],
          buildParameters: {
            DeployOnBuild: true,
            PublishProfile: path.resolve('<%= app.publishProfile %>')
          }
        }
      }
    },

    // Copies files and folders
    copy: {
      styles: {
        expand: true,
        cwd: '.tmp',
        src: 'styles/*',
        dest: '<%= app.dist %>/client/'
      },
      assets: {
        expand: true,
        cwd: '<%= app.client %>',
        src: ['fonts/*', 'images/*'],
        dest: '<%= app.dist %>/client'
      },
      js: {
        expand: true,
        cwd: '<%= app.client %>',
        src: ['js/**'],
        dest: '<%= app.dist %>/client'
      }
    },

    // Deletes files & folders
    clean: {
      dist: ['<%= app.dist %>/{,*/}*', '!<%= app.dist %>/.gitignore'],
      tmp: ['.tmp']
    },

    // Compile SASS to CSS
    sass: {
      development: {
        options: {
          sourceMap: true
        },
        files: {
          '.tmp/styles/main.css': '<%= app.client %>/scss/main.scss'
        }
      }
    },

    // Watch files for changes, run tasks
    watch: {
      gruntfile: {
        files: ['Gruntfile.js'],
        tasks: ['jshint:all', 'jscs']
      },
      // Watch JS files, run JSHint and style checker
      js: {
        files: '<%= app.js %>',
        tasks: ['jshint:all', 'jscs', 'copy:js']
      },
      // Watch any .NET files, build & publish MVC to local
      dotnet: {
        options: {
          debounceDelay: 1000
        },
        files: ['src/**/*.{cs,config,cshtml,csproj,ascx}'],
        tasks: ['build:mvc']
      },
      // Watch SASS files, compile to CSS and publish
      sass: {
        files: ['<%= app.client %>/scss/{,*/}*.scss'],
        tasks: ['sass:development', 'copy:styles']
      }
    },

    // Validates JS style
    jscs: {
      src: ['<%= app.js %>', '!**/vendor/*.js'],
      options: {
        config: '.jscsrc',
        verbose: true
      }
    },

    // Validates JS code with JSHint
    jshint: {
      all: ['<%= app.js %>', '!**/vendor/*.js'],
      options: {
        '-W030': true,
        jshintrc: true,
        reporter: require('jshint-stylish')
      }
    }
  });

  // Loads all Grunt npm tasks so you don't have to declare them all manually
  require('load-grunt-tasks')(grunt);

  /**
   * Task definitions
   */

  // Restore NuGet dependencies
  grunt.registerTask('restore', ['nugetrestore']);

  grunt.registerTask('build', function(target) {
    if (target === 'sln') {
      grunt.task.run([
        'restore',
        'msbuild:solution'
      ]);
    } else if (target === 'mvc') {
      grunt.task.run([
        'clean:dist',
        'publishProfile',
        'msbuild:mvc',
        'sass:development',
        'copy:styles',
        'copy:assets',
        'copy:js'
      ]);
    } else {
      grunt.task.run([
        'clean:dist',
        'restore',
        'msbuild:solution',
        'publishProfile',
        'msbuild:mvc',
        'sass:development',
        'copy:styles',
        'copy:assets',
        'copy:js'
      ]);
    }
  });

  // Generate a temporary publish profile to be used by MSBuild
  // Note: This is *not* added to the project like a regular Publish Profile
  grunt.registerTask('publishProfile', function() {
    var profile = generatePublishProfile({
      publishUrl: path.resolve(grunt.config('app.dist')),
      configuration: grunt.config('app.buildConfiguration')
    });

    grunt.log.writeln('Publish profile created: ');
    grunt.log.write(JSON.stringify(profile, null, '  '));
  });

  // Helper task to log all custom settings being used
  grunt.registerTask('logSettings', function() {
    grunt.log.writeln('Build settings: ');
    grunt.log.write(JSON.stringify(grunt.config('app'), null, '  '));
  });
};