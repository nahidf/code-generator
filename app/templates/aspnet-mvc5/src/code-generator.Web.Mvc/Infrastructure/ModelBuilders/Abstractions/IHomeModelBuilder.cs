using System;
using System.Collections.Generic;
using System.Linq;
using <%= projectName %>.Models;

namespace <%= projectName %>.Infrastructure.ModelBuilders.Abstractions
{
    public interface IHomeModelBuilder : IModelBuilder<HomeModel>
    {
    }
}