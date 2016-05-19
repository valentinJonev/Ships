using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Ships.Business.ViewModels
{
    public class GamePositionCreateModel
    {
        [Required]
        public string PlayerId { get; set; }

        [Required]
        public IList<ShipModel> Ships { get; set; }
    }
}
