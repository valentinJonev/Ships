using System.Net;
using System.Security;
using System.Web.Http.ExceptionHandling;
using System.Web.Http.ModelBinding;
using Ships.Business.Common;

namespace Ships.WebApi.Common
{
    public class ApiExceptionHandler : ExceptionHandler
    {
        public override void Handle(ExceptionHandlerContext context)
        {
            if (context.Exception is ValidationFailedException)
            {
                var ex = context.Exception as ValidationFailedException;
                if (context.ExceptionContext.ActionContext != null)
                {
                    ModelStateDictionary modelState = context.ExceptionContext.ActionContext.ModelState;
                    modelState.AddValidationErrors(ex.ValidationErrors);

                    context.Result = new CustomHttpResult(
                        context.Request,
                        HttpStatusCode.BadRequest,
                        BadRequestResponse.Create(modelState));
                }
                else
                {
                    context.Result = new CustomHttpResult(
                        context.Request,
                        HttpStatusCode.BadRequest,
                        BadRequestResponse.Create(ex.ValidationErrors));
                }
            }
            else if (context.Exception is EntityNotFoundException)
            {
                context.Result = new CustomHttpResult(
                    context.Request,
                    HttpStatusCode.NotFound,
                    BaseApiResponse.NotFound(context.Request.RequestUri));
            }
            else if (context.Exception is ResourceForbiddenException)
            {
                context.Result = new CustomHttpResult(
                    context.Request,
                    HttpStatusCode.Forbidden,
                    BaseApiResponse.Forbidden());
            }
            else
            {
                context.Result = new CustomHttpResult(
                    context.Request,
                    context.Exception is SecurityException ? HttpStatusCode.Unauthorized : HttpStatusCode.InternalServerError,
                    BaseApiResponse.InternalServerError(context.Exception.Message));
            }
        }
    }
}