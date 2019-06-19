using System.Web.Mvc;
using <%= projectName %>.Infrastructure.ModelBuilders.Abstractions;

namespace <%= projectName %>.Controllers
{
    public class HomeController : Controller
    {
        private readonly IHomeModelBuilder _homeModelBuilder;
        private readonly ILogger _logger;

        public HomeController(IHomeModelBuilder homeModelBuilder, ILogger logger)
        {
            _homeModelBuilder = homeModelBuilder;
            _logger = logger;
        }

        public ActionResult Index()
        {
            var model = _homeModelBuilder.Build(Request);
            _logger.Log(string.Format("Built homde model with welcome text: {0}", model.WelcomeText), LogLevel.Debug);

            return View(model);
        }
    }
}