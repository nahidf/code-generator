'use strict';
var util = require('util');
var path = require('path');
var chalk = require('chalk');
var yeoman = require('yeoman-generator');
var wiring = require('html-wiring');
var yosay = require('yosay');

var codegenerator = yeoman.generators.Base.extend({
  constructor: function() {
    yeoman.generators.Base.apply(this, arguments);
    this.pkg = JSON.parse(wiring.readFileAsString(path.join(__dirname, '../package.json')));
  },

  init: function() {
    this.log(yosay('Welcome to project generator!'));
  },

  askFor: function() {
    var cb = this.async();
    var prompts = [{
      type: 'list',
      name: 'type',
      message: 'What type of application do you want to create?',
      choices: [{
        name: 'ASP.NET MVC application',
        value: 'aspnet-mvc5'
      },{
        name: 'ASP.NET Web API Application',
        value: 'aspnet-webapi2'
      }]
    }];

    this.prompt(prompts, function(props) {
      this.type = props.type;

      cb();
    }.bind(this));
  },

  askForName: function() {
    var cb = this.async();

    var app = '';
    switch (this.type) {
      case 'aspnet-mvc5':
        app = 'code-generator.Web.Mvc';
        break;
      case 'aspnet-webapi2':
        app = 'code-generator.Web.Http';
        break;
    }

    var prompts = [{
      name: 'solutionName',
      message: 'What\'s the name of this solution?',
      default: 'code-generator'
    }, {
      name: 'projectName',
      message: 'What\'s the name of this web project?',
      default: app
    }, {
        name: 'url',
        message: 'What\'s the url of this web project?',
        default: 'web.code-generator.com'
    },
    {
        name: 'iisSiteName',
        message: 'What\'s the iis site name for this web project?',
        default: 'code-generator'
    },{
      name: 'port',
      message: 'Which port you would like to use (higher than 1024)?',
      default: '9000'
    }];

    this.prompt(prompts, function(props) {
      this.solutionName = props.solutionName;
      this.projectName = props.projectName;
      this.port = props.port;
      this.url = props.url;
      this.iisSiteName = props.iisSiteName;

      // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript#answer-8809472
      function generateUUID() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
          return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
        });
        return uuid;
      };

      this.projectGuid = generateUUID();
      this.testProjectGuid = generateUUID();
      this.compositionProjectGuid = generateUUID();
      this.coreProjectGuid = generateUUID();
      this.contentProjectGuid = generateUUID();
      this.assemblyGuid = generateUUID();
      this.year = new Date().getFullYear();

      cb();
    }.bind(this));
  },

  writing: function() {
    switch (this.type) {
        case 'aspnet-mvc5':
            this.copy(this.type + '/code-generator.sln', this.solutionName + '.sln');
            this.copy(this.type + '/README.md', 'README.md');
            this.copy(this.type + '/Settings.StyleCop', 'Settings.StyleCop');
            this.copy(this.type + '/gitignore', '.gitignore');
            this.copy(this.type + '/Gruntfile.js', 'Gruntfile.js');
            this.copy(this.type + '/_bower.json', 'bower.json');
            this.copy(this.type + '/_package.json', 'package.json');
            this.copy(this.type + '/bowerrc', '.bowerrc');
            this.copy(this.type + '/jshintrc', '.jshintrc');
            this.copy(this.type + '/jscrc', '.jscrc');

            this.copy(this.type + '/.nuget/NuGet.Config', '.nuget/NuGet.Config');
            this.copy(this.type + '/.nuget/NuGet.exe', '.nuget/NuGet.exe');
            this.copy(this.type + '/.nuget/NuGet.targets', '.nuget/NuGet.targets');

            this.copy(this.type + '/src/code-generator.Web.Mvc/code-generator.Web.Mvc.csproj', 'src/' + this.projectName + '/' + this.projectName + '.csproj');
            this.copy(this.type + '/src/code-generator.Web.Mvc/favicon.ico', 'src/' + this.projectName + '/favicon.ico');
            this.copy(this.type + '/src/code-generator.Web.Mvc/Global.asax', 'src/' + this.projectName + '/Global.asax');
            this.copy(this.type + '/src/code-generator.Web.Mvc/Global.asax.cs', 'src/' + this.projectName + '/Global.asax.cs');
            this.copy(this.type + '/src/code-generator.Web.Mvc/packages.config', 'src/' + this.projectName + '/packages.config');
            this.copy(this.type + '/src/code-generator.Web.Mvc/NLog.config', 'src/' + this.projectName + '/NLog.config');
            this.copy(this.type + '/src/code-generator.Web.Mvc/Startup.cs', 'src/' + this.projectName + '/Startup.cs');
            this.copy(this.type + '/src/code-generator.Web.Mvc/Web.config', 'src/' + this.projectName + '/Web.config');
            this.copy(this.type + '/src/code-generator.Web.Mvc/Web.Debug.config', 'src/' + this.projectName + '/Web.Debug.config');
            this.copy(this.type + '/src/code-generator.Web.Mvc/Web.Release.config', 'src/' + this.projectName + '/Web.Release.config');
            this.copy(this.type + '/src/code-generator.Web.Mvc/Web.Integration.Live.config', 'src/' + this.projectName + '/Web.Integration.Live.config');
            this.copy(this.type + '/src/code-generator.Web.Mvc/Web.UAT.Live.config', 'src/' + this.projectName + '/Web.UAT.Live.config');
            this.copy(this.type + '/src/code-generator.Web.Mvc/Web.Integration.Preview.config', 'src/' + this.projectName + '/Web.Integration.Preview.config');
            this.copy(this.type + '/src/code-generator.Web.Mvc/Web.UAT.Preview.config', 'src/' + this.projectName + '/Web.UAT.Preview.config');
            this.copy(this.type + '/src/code-generator.Web.Mvc/Web.Production.config', 'src/' + this.projectName + '/Web.Production.config');
            this.copy(this.type + '/src/code-generator.Web.Mvc/Web.Staging.config', 'src/' + this.projectName + '/Web.Staging.config');

            this.copy(this.type + '/src/code-generator.Web.Mvc/App_Start/FilterConfig.cs', 'src/' + this.projectName + '/App_Start/FilterConfig.cs');
            this.copy(this.type + '/src/code-generator.Web.Mvc/App_Start/RouteConfig.cs', 'src/' + this.projectName + '/App_Start/RouteConfig.cs');

            this.copy(this.type + '/src/code-generator.Web.Mvc/Controllers/HomeController.cs', 'src/' + this.projectName + '/Controllers/HomeController.cs');
            this.copy(this.type + '/src/code-generator.Web.Mvc/Infrastructure/ModelBuilders/HomeModelBuilder.cs', 'src/' + this.projectName + '/Infrastructure/ModelBuilders/HomeModelBuilder.cs');
            this.copy(this.type + '/src/code-generator.Web.Mvc/Infrastructure/ModelBuilders/Abstractions/IModelBuilder.cs', 'src/' + this.projectName + '/Infrastructure/ModelBuilders/Abstractions/IModelBuilder.cs');
            this.copy(this.type + '/src/code-generator.Web.Mvc/Infrastructure/ModelBuilders/Abstractions/IHomeModelBuilder.cs', 'src/' + this.projectName + '/Infrastructure/ModelBuilders/Abstractions/IHomeModelBuilder.cs');
            this.copy(this.type + '/src/code-generator.Web.Mvc/Models/HomeModel.cs', 'src/' + this.projectName + '/Models/HomeModel.cs');
            this.copy(this.type + '/src/code-generator.Web.Mvc/Properties/AssemblyInfo.cs', 'src/' + this.projectName + '/Properties/AssemblyInfo.cs');

            this.copy(this.type + '/src/code-generator.Web.Mvc/Views/_ViewStart.cshtml', 'src/' + this.projectName + '/Views/_ViewStart.cshtml');
            this.copy(this.type + '/src/code-generator.Web.Mvc/Views/Web.config', 'src/' + this.projectName + '/Views/Web.config');
            this.copy(this.type + '/src/code-generator.Web.Mvc/Views/Home/Index.cshtml', 'src/' + this.projectName + '/Views/Home/Index.cshtml');
            this.copy(this.type + '/src/code-generator.Web.Mvc/Views/Shared/_Layout.cshtml', 'src/' + this.projectName + '/Views/Shared/_Layout.cshtml');
            this.copy(this.type + '/src/code-generator.Web.Mvc/Views/Shared/Error.cshtml', 'src/' + this.projectName + '/Views/Shared/Error.cshtml');

            this.copy(this.type + '/test/code-generator.Web.Mvc.Tests/code-generator.Web.Mvc.Tests.csproj', 'test/' + this.projectName + '.Tests/' + this.projectName + '.Tests.csproj');
            this.copy(this.type + '/test/code-generator.Web.Mvc.Tests/app.config', 'test/' + this.projectName + '.Tests/app.config');
            this.copy(this.type + '/test/code-generator.Web.Mvc.Tests/HomeControllerTests.cs', 'test/' + this.projectName + '.Tests/HomeControllerTests.cs');
            this.copy(this.type + '/test/code-generator.Web.Mvc.Tests/packages.config', 'test/' + this.projectName + '.Tests/packages.config');
            this.copy(this.type + '/test/code-generator.Web.Mvc.Tests/TestHelpers.cs', 'test/' + this.projectName + '.Tests/TestHelpers.cs');
            this.copy(this.type + '/test/code-generator.Web.Mvc.Tests/Properties/AssemblyInfo.cs', 'test/' + this.projectName + '.Tests/Properties/AssemblyInfo.cs');
            break;
        case 'aspnet-webapi2':
            this.copy(this.type + '/README.md', 'README.md');
        break;
      default:
        this.log('Unknown project type');
    }
  },

  end: function() {
    this.log('\r\n');
    this.log('Your project is now created, you can use the following command to get going');
    this.log(chalk.green('    grunt build'));
    this.log('\r\n');
  }
});

module.exports = codegenerator;
