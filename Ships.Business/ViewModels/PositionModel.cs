using System.ComponentModel.DataAnnotations;

namespace Ships.Business.ViewModels
{
    public class PositionModel
    {
        [Required]
        public int? X { get; set; }

        [Required]
        public int? Y { get; set; }
    }
}
