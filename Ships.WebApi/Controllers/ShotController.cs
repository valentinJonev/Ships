using System.Security.Principal;
using System.Threading.Tasks;
using System.Web.Http;
using Ships.Business.Services;
using Ships.Business.ViewModels;
using Ships.WebApi.Common;

namespace Ships.WebApi.Controllers
{
    [RoutePrefix("games/{gameId:int}/shots")]
    public class ShotController : BaseApiController
    {
        private ShotService shotService;
        private ShotValidationService validationService;

        public ShotController(ShotService shotService, ShotValidationService validationService)
        {
            this.shotService = shotService;
            this.validationService = validationService;
        }

        [HttpPost, Route("")]
        public async Task<IHttpActionResult> AddShot(int gameId, ShotCreateModel model)
        {
            IPrincipal principal = RequestContext.Principal;
            await validationService.ValidateForCreate(principal, gameId, model);

            try
            {
                await shotService.CreateAsync(gameId, model);

                return NoContent();
            }
            catch (ShotAlreadyExistsException)
            {
                return Conflict("Shot already exists.");
            }
        }
    }
}
