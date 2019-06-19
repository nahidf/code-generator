using System.Security.Claims;
using System.Web;
using System.Web.Mvc;
using Moq;

namespace <%= projectName %>.Tests
{
    public static class TestHelpers
    {
        public static ControllerContext CreateControllerContext(bool authenticated = true)
        {
            var identity = authenticated
                ? new ClaimsIdentity(new[]
                {
                    new Claim(ClaimsIdentity.DefaultNameClaimType, "testuser"),
                    new Claim(ClaimTypes.NameIdentifier, "testuser"),
                }, "Application")
                : new ClaimsIdentity();

            var user = new ClaimsPrincipal(identity);
            var httpCtxStub = new Mock<HttpContextBase>();
            httpCtxStub.SetupGet(ctx => ctx.User).Returns(user);

            var controllerContext = new ControllerContext {HttpContext = httpCtxStub.Object};

            return controllerContext;
        }
    }
}