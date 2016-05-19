using System;

namespace Ships.Business.Models
{
    public class Game
    {
        public int Id { get; set; }

        public int FirstSideFK { get; set; }
        public int SecondSideFK { get; set; }
        public int NextMoveSideFK { get; set; }
        public int? WinnerSideFK { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? StartedAt { get; set; }
        public DateTime? EndedAt { get; set; }

        public GameSide FirstSide { get; set; }
        public GameSide SecondSide { get; set; }
        public GameSide NextShotSide { get; set; }
        public GameSide WinnerSide { get; set; }
    }
}
