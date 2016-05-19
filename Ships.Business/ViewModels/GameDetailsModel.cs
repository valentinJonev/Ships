namespace Ships.Business.ViewModels
{
    public class GameDetailsModel
    {
        public int Id { get; set; }

        public GameSideModel CurrentSide { get; set; }
        public GameSideModel OtherSide { get; set; }
        public string NextShotPlayerId { get; set; }
        public string WinnerPlayerId { get; set; }
    }
}
