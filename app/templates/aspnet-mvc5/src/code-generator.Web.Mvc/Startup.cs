using System.Reflection;
using System.Web;
using System.Web.Mvc;
using <%= projectName %>;
using <%= projectName %>.Infrastructure.ModelBuilders;
using <%= projectName %>.Infrastructure.ModelBuilders.Abstractions;
using Microsoft.Owin;
using Microsoft.Owin.Security;
using Owin;
using SimpleInjector;
using SimpleInjector.Integration.Web;
using SimpleInjector.Integration.Web.Mvc;

[assembly: OwinStartup(typeof(Startup))]

namespace <%= projectName %>
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            SetupIocContainer();
        }

        private void SetupIocContainer()
        {
            var container = new Container();

            container.RegisterMvcControllers(Assembly.GetExecutingAssembly());
            container.RegisterMvcIntegratedFilterProvider();
            var lifestyle = new WebRequestLifestyle();

            container.RegisterSingle<ILogger, NLogLogger>();
            container.RegisterSingle<ICache, MemoryCache>();
            container.Register<IAuthenticationManager>(() => HttpContext.Current.GetOwinContext().Authentication);
            container.Register<IHomeModelBuilder, HomeModelBuilder>(lifestyle);

            DependencyResolver.SetResolver(new SimpleInjectorDependencyResolver(container));
        }
    }
}
