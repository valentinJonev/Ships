using System.ComponentModel.DataAnnotations;

namespace Ships.Business.ViewModels
{
    public class ShotCreateModel : PositionModel
    {
        [Required]
        public string PlayerId { get; set; }
    }
}
