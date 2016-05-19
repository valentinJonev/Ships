using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Ships.Business.ViewModels
{
    public class ShipModel
    {
        [Required]
        public IList<PositionModel> Positions { get; set; }
    }
}
