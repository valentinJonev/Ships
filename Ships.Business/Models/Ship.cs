using System.Collections.Generic;

namespace Ships.Business.Models
{
    public class Ship
    {
        public Ship()
        {
            Positions = new HashSet<Position>();
        }

        public int Id { get; set; }

        public int GameSideFK { get; set; }

        public ICollection<Position> Positions { get; set; }
    }
}
