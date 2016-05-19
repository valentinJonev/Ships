using System.Security.Principal;
using System.Threading.Tasks;
using System.Web.Http;
using Ships.Business.Services;
using Ships.Business.ViewModels;
using Ships.WebApi.Common;

namespace Ships.WebApi.Controllers
{
    [RoutePrefix("games/{gameId:int}/ships")] 
    public class ShipController : BaseApiController
    {
        private ShipService positionService;
        private ShipValidationService validationService;

        public ShipController(ShipService positionService, ShipValidationService validationService)
        {
            this.positionService = positionService;
            this.validationService = validationService;
        }
        
        [HttpPost, Route("")]
        public async Task<IHttpActionResult> Create(int gameId, GamePositionCreateModel model)
        {
            IPrincipal principal = RequestContext.Principal;
            await validationService.ValidateForCreate(principal, model);

            try
            {
                await positionService.CreateAsync(gameId, model);
            }
            catch (ShipsAlreadyAddedException)
            {
                return Conflict("Ships already added for this user.");
            }

            return base.NoContent();
        }
    }
}