namespace Ships.Business.Models
{
    public class Position
    {
        public int Id { get; set; }

        public int ShipFK { get; set; }
        public int X { get; set; }
        public int Y { get; set; }
    }
}
