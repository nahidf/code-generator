using System.Web;
using <%= projectName %>.Infrastructure.ModelBuilders.Abstractions;
using <%= projectName %>.Models;

namespace <%= projectName %>.Infrastructure.ModelBuilders
{
    public class HomeModelBuilder : IHomeModelBuilder
    {
        public HomeModel Build(HttpRequestBase request)
        {
            return new HomeModel
            {
                WelcomeText = string.Format("Hello {0}", request.Browser.Browser)
            };
        }
    }
}