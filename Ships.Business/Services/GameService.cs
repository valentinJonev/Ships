using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Security.Principal;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity.EntityFramework;
using Ships.Business.Common;
using Ships.Business.Context;
using Ships.Business.Models;
using Ships.Business.ViewModels;

namespace Ships.Business.Services
{
    public class GameService : BaseService
    {
        private ShipsContext context;

        public GameService(ShipsContext context)
        {
            this.context = context;
        }

        public async Task<int> CreateAsync(GameCreateModel model, IPrincipal currentPrincipal)
        {
            IdentityUser user = await context.Users.SingleAsync(x => x.UserName == currentPrincipal.Identity.Name);

            Game game = ModelToGame(model.FirstPlayerId, user.Id);

            context.Games.Add(game);
            await context.SaveChangesAsync();

            return game.Id;
        }

        public async Task<GameDetailsModel> GetAsync(int id, string userId)
        {
            Game game = await context.Games
                .Include("FirstSide.Player")
                .Include("FirstSide.Ships")
                .Include("FirstSide.Ships.Positions")
                .Include("FirstSide.Shots")
                .Include("SecondSide.Player")
                .Include("SecondSide.Ships")
                .Include("SecondSide.Ships.Positions")
                .Include("SecondSide.Shots")
                .Include("WinnerSide")
                .Include("NextShotSide")
                .FirstOrDefaultAsync(x => x.Id == id);
            if (game == null)
            {
                throw new EntityNotFoundException();
            }

            bool isFirstSidePlayer = userId.Equals(game.FirstSide.PlayerFK, StringComparison.InvariantCultureIgnoreCase);

            return GameToModel(game, isFirstSidePlayer);
        }

        private static Game ModelToGame(string firstPlayerId, string currentPlayerId)
        {
            var firstSide = new GameSide()
            {
                PlayerFK = firstPlayerId
            };

            var secondSide = new GameSide()
            {
                PlayerFK = currentPlayerId
            };

            return new Game()
            {
                FirstSide = firstSide,
                SecondSide = secondSide,
                CreatedAt = DateTime.UtcNow,
                NextShotSide = firstSide
            };
        }

        private static GameDetailsModel GameToModel(Game game, bool isFirstSidePlayer)
        {
            var model = new GameDetailsModel();
            if (isFirstSidePlayer)
            {
                model.CurrentSide = SideToModel(game.FirstSide, true);
                model.OtherSide = SideToModel(game.SecondSide, false);
            }
            else
            {
                model.CurrentSide = SideToModel(game.SecondSide, true);
                model.OtherSide = SideToModel(game.FirstSide, false);
            }

            model.Id = game.Id;
            model.NextShotPlayerId = game.NextShotSide.PlayerFK;
            model.WinnerPlayerId = (game.WinnerSide != null) ? game.WinnerSide.PlayerFK : null;

            return model;
        }

        private static GameSideModel SideToModel(GameSide side, bool fillShips)
        {
            var model = new GameSideModel()
            {
                Player = UserToModel(side.Player),
                Shots = side.Shots.Select(x => MovesToModel(x, side.Ships)).ToList(),
            };

            if (fillShips)
            {
                model.Ships = side.Ships.Select(x => ShipToModel(x)).ToList();
            }

            return model;
        }

        private static ShotModel MovesToModel(Shot shot, ICollection<Ship> ships)
        {
            return new ShotModel()
            {
                X = shot.X,
                Y = shot.Y,
                IsHit = ships
                    .SelectMany(x => x.Positions)
                    .Where(x => x.X == shot.X && x.Y == shot.Y).Any()
            };
        }

        private static UserModel UserToModel(IdentityUser player)
        {
            return new UserModel()
            {
                Id = player.Id,
                Name = player.UserName
            };
        }

        private static ShipModel ShipToModel(Ship ship)
        {
            return new ShipModel()
            {
                Positions = ship.Positions.Select(x => PositionToModel(x)).ToList()
            };
        }

        private static PositionModel PositionToModel(Position position)
        {
            return new PositionModel()
            {
                X = position.X,
                Y = position.Y
            };
        }
    }
}
