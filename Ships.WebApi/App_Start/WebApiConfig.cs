using System.Net.Http.Formatting;
using System.Text.RegularExpressions;
using System.Web.Http;
using System.Web.Http.ExceptionHandling;
using Ships.WebApi.Attributes;
using Ships.WebApi.Common;
using Newtonsoft.Json.Serialization;

namespace Ships.WebApi
{
    public class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "Api",
                routeTemplate: "{*url}",
                defaults: new { controller = "ErrorApi", action = "Handle404" });

            ConfigureJsonFormatterOnly(config);
            
            config.Services.Replace(typeof(IExceptionHandler), new ApiExceptionHandler());

            config.Filters.Add(new ValidateModelStateAttribute());
            config.Filters.Add(new CheckModelForNullAttribute());
        }

        private static void ConfigureJsonFormatterOnly(HttpConfiguration config)
        {
            var formatter = config.Formatters.JsonFormatter;
            formatter.SerializerSettings.ContractResolver = new JsonLowerCaseUnderscoreContractResolver();

            RemoveFormattersExcept(config.Formatters, formatter);
        }

        private static void RemoveFormattersExcept(MediaTypeFormatterCollection allFormatters, MediaTypeFormatter formatter)
        {
            allFormatters.Insert(0, formatter);
            for (int i = allFormatters.Count - 1; i > 0; i--)
            {
                allFormatters.RemoveAt(i);
            }
        }
    }

    public class JsonLowerCaseUnderscoreContractResolver : DefaultContractResolver
    {
        private Regex regex = new Regex("[a-zA-Z](?=[A-Z])");

        protected override string ResolvePropertyName(string propertyName)
        {
            return regex.Replace(propertyName, "$0_").ToLower();
        }
    }
}