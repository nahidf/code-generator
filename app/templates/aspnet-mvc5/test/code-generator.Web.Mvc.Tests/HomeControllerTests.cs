using System.Web;
using System.Web.Mvc;
using <%= projectName %>.Controllers;
using <%= projectName %>.Infrastructure.ModelBuilders.Abstractions;
using <%= projectName %>.Models;
using Moq;
using NUnit.Framework;
using Should;

namespace <%= projectName %>.Tests
{
    [TestFixture]
    public class HomeControllerTests
    {
        private Mock<ILogger> _logger;
        private Mock<IHomeModelBuilder> _homeModelBuilder;

        [SetUp]
        public void Init()
        {
            _logger = new Mock<ILogger>();
            _homeModelBuilder = new Mock<IHomeModelBuilder>();
        }

        private HomeController CreateController()
        {
            var controller = new HomeController(_homeModelBuilder.Object, _logger.Object)
            {
                ControllerContext = TestHelpers.CreateControllerContext()
            };
            return controller;
        }

        [Test]
        public void Index_ShouldReturnEmptyViewWithCorrectModel()
        {
            var homeModel = new HomeModel {WelcomeText = "Foo"};
            _homeModelBuilder.Setup(x => x.Build(It.IsAny<HttpRequestBase>())).Returns(homeModel);

            var controller = CreateController();
            var result = controller.Index() as ViewResult;

            result.ShouldNotBeNull();
            result.ViewName.ShouldEqual(string.Empty);
            result.Model.ShouldBeSameAs(homeModel);
        }
    }
}
