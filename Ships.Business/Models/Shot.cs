using System;

namespace Ships.Business.Models
{
    public class Shot
    {
        public int Id { get; set; }

        public int GameSideFK { get; set; }
        public int X { get; set; }
        public int Y { get; set; }
        public DateTime DoneAt { get; set; }
    }
}
