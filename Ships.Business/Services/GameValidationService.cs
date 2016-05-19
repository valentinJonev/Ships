using System;
using System.Data.Entity;
using System.Security.Principal;
using System.Threading.Tasks;
using Ships.Business.Common;
using Ships.Business.Context;
using Ships.Business.Models;
using Ships.Business.ViewModels;

namespace Ships.Business.Services
{
    public class GameValidationService : BaseValidationService
    {
        public GameValidationService(ShipsContext context)
            : base(context)
        {
        }

        public async Task ValidateForCreate(IPrincipal currentPrincipal, GameCreateModel model)
        {
            await ValidateCurrentUser(currentPrincipal, model.SecondPlayerId);

            if (!(await ValidateExistingUserId(model.SecondPlayerId)))
            {
                AddError("There is no such user.");
            }

            HandleErrors();
        }

        public async Task ValidateForDetails(IPrincipal principal, string userId, int id)
        {
            await ValidateCurrentUser(principal, userId);

            Game game = await context.Games
                .Include("FirstSide")
                .Include("SecondSide")
                .FirstOrDefaultAsync(x => x.Id == id);

            ValidateGameExists(game);
            ValidateUserInGame(game, userId);
        }

        private void ValidateGameExists(Game game)
        {
            if (game == null)
            {
                throw new EntityNotFoundException();
            }
        }

        private void ValidateUserInGame(Game game, string userId)
        {
            if (!game.FirstSide.PlayerFK.Equals(userId, StringComparison.InvariantCultureIgnoreCase)
                && !game.SecondSide.PlayerFK.Equals(userId, StringComparison.InvariantCultureIgnoreCase))
            {
                throw new ResourceForbiddenException();
            }
        }
    }
}
