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
    public class ShotValidationService : BaseValidationService
    {
        public ShotValidationService(ShipsContext context)
            : base(context)
        {
        }

        public async Task ValidateForCreate(IPrincipal currentPrincipal, int gameId, ShotCreateModel model)
        {
            await ValidateCurrentUser(currentPrincipal, model.PlayerId);

            Game game = await context.Games
                .Include("NextShotSide")
                .FirstOrDefaultAsync(x => x.Id == gameId);

            ValidateGameExists(game);
            ValidateNextShot(game.NextShotSide, model.PlayerId);

            ValidateBounds(model);

            HandleErrors();
        }

        private void ValidateBounds(PositionModel position)
        {
            if (position.X < 0 || position.X >= ShipsConst.MATRIX_SIZE
                || position.Y < 0 || position.Y >= ShipsConst.MATRIX_SIZE)
            {
                AddError("Position is out of boundaries.");
            }
        }

        private void ValidateGameExists(Game game)
        {
            if (game == null)
            {
                throw new EntityNotFoundException();
            }
        }

        private void ValidateNextShot(GameSide side, string userId)
        {
            if (!side.PlayerFK.Equals(userId, StringComparison.InvariantCultureIgnoreCase))
            {
                throw new ResourceForbiddenException();
            }
        }
    }
}
