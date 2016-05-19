using System.Collections.Generic;
using System.Security.Principal;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Ships.Business.Common;
using Ships.Business.Context;
using Ships.Business.Models;

namespace Ships.Business
{
    public class BaseValidationService
    {
        private IList<string> validationErrors;
        protected ShipsContext context;
        protected UserManager<IdentityUser> userManager;

        internal BaseValidationService(ShipsContext context)
        {
            this.context = context;
            userManager = new UserManager<IdentityUser>(new UserStore<IdentityUser>(context));

            validationErrors = new List<string>();
        }

        public bool HasErrors
        {
            get
            {
                return validationErrors.Count > 0;
            }
        }

        protected void AddError(string error)
        {
            validationErrors.Add(error);
        }

        protected void AddErrorFormat(string error, params object[] args)
        {
            validationErrors.Add(string.Format(error, args));
        }

        protected void HandleErrors()
        {
            if (HasErrors)
            {
                throw new ValidationFailedException(validationErrors);
            }
        }

        protected async Task ValidateCurrentUser(IPrincipal currentPrincipal, string userId)
        {
            IdentityUser user = await userManager.FindByNameAsync(currentPrincipal.Identity.Name);
            if (user == null || !userId.Equals(user.Id, System.StringComparison.InvariantCultureIgnoreCase))
            {
                throw new ResourceForbiddenException();
            }
        }

        protected async Task<bool> ValidateExistingUserId(string userId)
        {
            IdentityUser user = await userManager.FindByIdAsync(userId);

            return user != null;
        }

        protected async Task<bool> ValidateExistingUserName(string username)
        {
            IdentityUser user = await userManager.FindByNameAsync(username);

            return user != null;
        }
    }
}
