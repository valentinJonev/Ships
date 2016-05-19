using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using Ships.Business.Context;
using Ships.Business.Models;
using Ships.Business.ViewModels;

namespace Ships.Business.Services
{
    public class ShipService : BaseService
    {
        private ShipsContext context;

        public ShipService(ShipsContext context)
        {
            this.context = context;
        }

        public async Task CreateAsync(int gameId, GamePositionCreateModel model)
        {
            Game game = (await context.Games.Where(x => x.Id == gameId)
                .Include("FirstSide")
                .Include("FirstSide.Ships")
                .Include("SecondSide")
                .Include("SecondSide.Ships")
                .ToListAsync()).FirstOrDefault();
            
            if (game.FirstSide.PlayerFK == model.PlayerId)
            {
                HandleAddingShips(game, game.FirstSide, game.SecondSide, model.Ships);
            }
            else
            {
                HandleAddingShips(game, game.SecondSide, game.FirstSide, model.Ships);
            }

            await context.SaveChangesAsync();
        }

        private void HandleAddingShips(Game game, GameSide aSide, GameSide bSide, IList<ShipModel> ships)
        {
            if (aSide.Ships.Count > 0)
            {
                throw new ShipsAlreadyAddedException();
            }

            PopulateShips(aSide, ships);

            if (game.SecondSide.Ships.Count > 0)
            {
                game.StartedAt = DateTime.UtcNow;
            }
        }

        private void PopulateShips(GameSide gameSide, IList<ShipModel> ships)
        {
            foreach (ShipModel ship in ships)
            {
                gameSide.Ships.Add(new Ship()
                {
                    Positions = ToPositions(ship.Positions)
                });
            }
        }

        private List<Position> ToPositions(IList<PositionModel> positions)
        {
            return positions.Select(x => new Position()
            {
                X = x.X.Value,
                Y = x.Y.Value
            }).ToList();
        }
    }
}
