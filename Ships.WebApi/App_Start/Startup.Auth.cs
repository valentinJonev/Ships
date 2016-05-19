using Microsoft.Owin.Security.OAuth;
using Owin;
using Ships.WebApi.Owin;

namespace Ships.WebApi
{
    public partial class Startup
    {
        // For more information on configuring authentication, please visit http://go.microsoft.com/fwlink/?LinkId=301864
        public void ConfigureAuth(IAppBuilder app)
        {
            app.UseOAuthBearerAuthentication(new OAuthBearerAuthenticationOptions
            {
                Provider = new OAuthTokenProvider(req => req.Query.Get("access_token"))
            });
        }
    }
}