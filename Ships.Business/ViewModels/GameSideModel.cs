using System.Collections.Generic;

namespace Ships.Business.ViewModels
{
    public class GameSideModel
    {
        public UserModel Player { get; set; }
        public IList<ShipModel> Ships { get; set; }
        public IList<ShotModel> Shots { get; set; }
    }
}
