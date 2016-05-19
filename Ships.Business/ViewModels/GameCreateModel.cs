using System.ComponentModel.DataAnnotations;

namespace Ships.Business.ViewModels
{
    public class GameCreateModel
    {
        [Required]
        public string FirstPlayerId { get; set; }

        [Required]
        public string SecondPlayerId { get; set; }
    }
}
