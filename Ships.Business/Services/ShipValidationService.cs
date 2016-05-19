using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Threading.Tasks;
using Ships.Business.Common;
using Ships.Business.Context;
using Ships.Business.ViewModels;

namespace Ships.Business.Services
{
    public class ShipValidationService : BaseValidationService
    {
        public ShipValidationService(ShipsContext context)
            : base(context)
        {
        }

        public async Task ValidateForCreate(IPrincipal currentPrincipal, GamePositionCreateModel model)
        {
            if (!(await ValidateExistingUserId(model.PlayerId)))
            {
                AddError("There is no such user.");
            }

            await ValidateCurrentUser(currentPrincipal, model.PlayerId);
            ValidateShipsPositions(model.Ships);

            HandleErrors();
        }

        private void ValidateShipsPositions(IList<ShipModel> ships)
        {
            if (HasShipsBeyondMatrix(ships))
            {
                AddError("There is a ship beyond the matrix.");
            }

            if (!ArePositionsEnough(ships))
            {
                AddErrorFormat("Positions should be exactly {0}.", ShipsConst.POSITIONS_COUNT);
            }

            if (HasDublicating(ships))
            {
                AddError("There are duplicationg positions.");
            }

            if (AreAllShipsValid(ships))
            {
                AddErrorFormat("A ship is not valid (ships must be between {0} and {1} positions, and in straight line).", ShipsConst.MIN_SHIP_LENGTH, ShipsConst.MAX_SHIP_LENGTH);
            }

            HandleErrors();
        }

        private bool HasShipsBeyondMatrix(IList<ShipModel> ships)
        {
            IEnumerable<PositionModel> positions = ships.SelectMany(x => x.Positions);
            return positions
                .Where(x => x.X < 0 || x.X > ShipsConst.MATRIX_SIZE - 1 || x.Y < 0 || x.X > ShipsConst.MATRIX_SIZE - 1)
                .Any();
        }

        private bool ArePositionsEnough(IList<ShipModel> ships)
        {
            return ships.SelectMany(x => x.Positions).Count() == ShipsConst.POSITIONS_COUNT;
        }

        private bool HasDublicating(IList<ShipModel> ships)
        {
            return ships
                .SelectMany(x => x.Positions)
                .GroupBy(x => new { x.X, x.Y })
                .Where(x => x.Count() > 1)
                .Any();
        }

        private bool AreAllShipsValid(IList<ShipModel> ships)
        {
            foreach (ShipModel ship in ships)
            {
                if (IsShipValid(ship))
                {
                    return false;
                }
            }

            return true;
        }

        private bool IsShipValid(ShipModel ship)
        {
            if (ship.Positions.Count < ShipsConst.MIN_SHIP_LENGTH || ship.Positions.Count > ShipsConst.MAX_SHIP_LENGTH)
            {
                return false;
            }

            IEnumerable<PositionModel> sortedPositions = ship.Positions.OrderBy(x => x.X).ThenBy(x => x.Y);
            Queue<PositionModel> positions = new Queue<PositionModel>(sortedPositions);

            PositionModel lastPos = positions.Dequeue();
            PositionModel curPos = positions.Dequeue();
            bool isHorizontal = ArePositionsHorizontal(lastPos, curPos);

            while (curPos != null)
            {
                if (!IsPositionNextToLast(isHorizontal, lastPos, curPos))
                {
                    return false;
                }

                lastPos = curPos;
                if (positions.Count > 0)
                {
                    curPos = positions.Dequeue();
                }
                else
                {
                    curPos = null;
                }
            }

            return true;
        }

        private bool ArePositionsHorizontal(PositionModel firstPos, PositionModel secondPos)
        {
            return firstPos.X != secondPos.X;
        }

        private bool IsPositionNextToLast(bool isHorizontal, PositionModel lastPos, PositionModel curPos)
        {
            return (isHorizontal && Math.Pow(lastPos.X.Value - curPos.X.Value, 2) == 1 && lastPos.Y == curPos.Y)
                    || (!isHorizontal && lastPos.X.Value == curPos.X.Value && Math.Pow(lastPos.Y.Value - curPos.Y.Value, 2) == 1);
        }
    }
}
