using System;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity.EntityFramework;
using Ships.Business.Context;
using Ships.Business.Models;
using Ships.Business.ViewModels;

namespace Ships.Business.Services
{
    public class ShotService : BaseService
    {
        private ShipsContext context;

        public ShotService(ShipsContext context)
        {
            this.context = context;
        }

        public async Task CreateAsync(int gameId, ShotCreateModel model)
        {
            IdentityUser user = context.Users.Find(model.PlayerId);

            Game game = await context.Games
                .Include("FirstSide.Player")
                .Include("FirstSide.Ships.Positions")
                .Include("FirstSide.Shots")
                .Include("SecondSide.Player")
                .Include("SecondSide.Ships.Positions")
                .Include("SecondSide.Shots")
                .Include("WinnerSide")
                .Include("NextShotSide")
                .FirstOrDefaultAsync(x => x.Id == gameId);


            if (game.FirstSide.PlayerFK.Equals(user.Id, StringComparison.InvariantCultureIgnoreCase))
            {
                bool isWinner = AddShot(game.SecondSide, model);

                if (isWinner)
                {
                    game.WinnerSide = game.FirstSide;
                    game.EndedAt = DateTime.UtcNow;
                }

                if (!IsHit(game.SecondSide, model))
                {
                    game.NextShotSide = game.SecondSide;
                }
            }
            else
            {
                bool isWinner = AddShot(game.FirstSide, model);

                if (isWinner)
                {
                    game.WinnerSide = game.SecondSide;
                    game.EndedAt = DateTime.UtcNow;
                }

                if (!IsHit(game.FirstSide, model))
                {
                    game.NextShotSide = game.FirstSide;
                }
            }

            await context.SaveChangesAsync();
        }

        private bool AddShot(GameSide side, ShotCreateModel model)
        {
            ValidateExists(side, model);
            side.Shots.Add(ModelToShot(model));
            return AreAllShot(side);
        }

        private Shot ModelToShot(PositionModel position)
        {
            return new Shot()
            {
                X = position.X.Value,
                Y = position.Y.Value,
                DoneAt = DateTime.UtcNow
            };
        }

        private void ValidateExists(GameSide side, PositionModel position)
        {
            if (side.Shots.Any(x => x.X == position.X && x.Y == position.Y))
            {
                throw new ShotAlreadyExistsException();
            }
        }

        private bool AreAllShot(GameSide side)
        {
            foreach (Position shipPos in side.Ships.SelectMany(x => x.Positions))
            {
                if (!side.Shots.Any(x => x.X == shipPos.X && x.Y == shipPos.Y))
                {
                    return false;
                }
            }

            return true;
        }

        private bool IsHit(GameSide side, PositionModel model)
        {
            return side.Ships
                .SelectMany(s => s.Positions)
                .Any(p => p.X == model.X.Value && p.Y == model.Y.Value);
        }
    }
}
