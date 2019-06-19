/*global describe, beforeEach, it*/
'use strict';

var path    = require('path');
var helpers = require('yeoman-generator').test;


describe('MVC5 generator', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      this.app = helpers.createGenerator('code-generator:app', [
        '../../app'
      ]);

      done();
    }.bind(this));
  });

  it('creates expected files', function (done) {
    var expected = [
      '.gitignore',
      'Gruntfile.js',
      'bower.json',
      'package.json',
      '.bowerrc',
      '.jshintrc',
      '.jscrc',
      'Settings.StyleCop',
      'README.md',
      'code-generator.sln',
      'src/code-generator.Web.Mvc/code-generator.Web.Mvc.csproj',
      'src/code-generator.Web.Mvc/favicon.ico',
      'src/code-generator.Web.Mvc/Global.asax',
      'src/code-generator.Web.Mvc/Global.asax.cs',
      'src/code-generator.Web.Mvc/packages.config',
      'src/code-generator.Web.Mvc/Web.config',
      'src/code-generator.Web.Mvc/Web.Debug.config',
      'src/code-generator.Web.Mvc/Web.Release.config',
      'src/code-generator.Web.Mvc/App_Start/FilterConfig.cs',
      'src/code-generator.Web.Mvc/App_Start/RouteConfig.cs',
      'src/code-generator.Web.Mvc/Controllers/HomeController.cs',
      'src/code-generator.Web.Mvc/Properties/AssemblyInfo.cs',
      'src/code-generator.Web.Mvc/Views/_ViewStart.cshtml',
      'src/code-generator.Web.Mvc/Views/Web.config',
      'src/code-generator.Web.Mvc/Views/Home/Index.cshtml',
      'src/code-generator.Web.Mvc/Views/Shared/_Layout.cshtml',
      'src/code-generator.Web.Mvc/Views/Shared/Error.cshtml'
    ];

    helpers.mockPrompt(this.app, {
      solutionName: 'code-generator.Solution',
      projectName: 'code-generator.Web.Mvc'
    });

    this.app.options['skip-install'] = true;
    this.app.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  });
});
