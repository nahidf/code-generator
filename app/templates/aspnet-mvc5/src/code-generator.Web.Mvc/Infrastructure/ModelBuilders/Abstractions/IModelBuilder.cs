using System.Web;

namespace <%= projectName %>.Infrastructure.ModelBuilders.Abstractions
{
    public interface IModelBuilder<out TModel>
    {
        TModel Build(HttpRequestBase request);
    }
}