using A2.Models;

namespace A2.Dtos
{
    public class GameRecordOut
    {
        public string gameId { get; set; }
        public string state { get; set; }
        public string player1 { get; set; }
        public string? player2 { get; set; }
        public string? lastMovePlayer1 { get; set; }
        public string? lastMovePlayer2 { get; set; }

    }
}