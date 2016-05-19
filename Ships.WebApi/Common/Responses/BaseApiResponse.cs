using System;
using System.Collections.Generic;

namespace Ships.WebApi.Common
{
    public class BaseApiResponse
    {
        public BaseApiResponse()
        {
            Errors = new List<string>();
        }

        public string Message { get; set; }

        public List<string> Errors { get; private set; }

        public static BaseApiResponse InternalServerError(string message = null)
        {
            var response = new BaseApiResponse()
            {
                Message = "Internal server error"
            };

            if (message != null)
            {
                response.AddError(message);
            }

            return response;
        }

        public static BaseApiResponse NotFound(Uri requestUri)
        {
            return new BaseApiResponse()
            {
                Message = string.Format("Resource '{0}' not found.", requestUri.ToString())
            };
        }

        public static BaseApiResponse OperationImpossible(string message = null)
        {
            var response = new BaseApiResponse()
            {
                Message = "Operation is impossible",
            };

            if (message != null)
            {
                response.AddError(message);
            }

            return response;
        }

        internal static BaseApiResponse Forbidden()
        {
            return new BaseApiResponse()
            {
                Message = "Operation is forbidden",
            };
        }

        public void AddError(string errorMessage)
        {
            Errors.Add(errorMessage);
        }
    }
}