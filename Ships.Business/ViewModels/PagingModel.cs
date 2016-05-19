using System.ComponentModel.DataAnnotations;

namespace Ships.Business.ViewModels
{
    public class PagingModel
    {
        [Required]
        public int? Offset { get; set; }

        [Required]
        public int? Limit { get; set; }
    }
}
