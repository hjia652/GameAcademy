using A2.Handler;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;

using A2.Data;
using A2.Models;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace A2.Data
{
    public class A2Repo : IA2Repo
    {
        private readonly A2DBContext _dbContext;
        public A2Repo(A2DBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public IEnumerable<User> GetAllUsers()
        {
            throw new NotImplementedException();
        }

        public User GetUserByUsername(string e)
        {
            User? user = _dbContext.Users.FirstOrDefault(o => o.UserName == e);
            return user;

        }

        public bool ValidLogin(string username, string password)
        {
            User u = _dbContext.Users.FirstOrDefault(e => e.UserName == username && e.Password == password);
            if (u == null)
                return false;
            return true;
        }
        public bool WaitReco()
        {
            GameRecord gameRecord = _dbContext.GameRecords.FirstOrDefault(e => e.State == "wait");
            return (gameRecord != null);
        }
        public GameRecord FindRecord()
        {
            GameRecord gameRecord = _dbContext.GameRecords.FirstOrDefault(e => e.State == "wait");
            return gameRecord;
        }
        public GameRecord UpdateRecord(string x)
        {
            GameRecord gameRecord = _dbContext.GameRecords.FirstOrDefault(e => e.State == "wait");
            gameRecord.State = "progress";
            gameRecord.Player2 = x;
            _dbContext.GameRecords.Update(gameRecord);
            _dbContext.SaveChanges();
            return gameRecord;
        }
        public GameRecord NewRecord(string user)
        {
            GameRecord gameRecord = new GameRecord();
            var guid = System.Guid.NewGuid();
            gameRecord.GameId = guid.ToString();
            gameRecord.State = "wait";
            gameRecord.Player1 = user;
            _dbContext.GameRecords.Update(gameRecord);
            _dbContext.SaveChanges();
            return gameRecord;
        }
        public bool reg(User newUser)
        {
            User c = _dbContext.Users.FirstOrDefault(o => o.UserName == newUser.UserName);
            if (c == null)
            {
                _dbContext.Users.Add(newUser);
                _dbContext.SaveChanges();
                return true;
            }
            return false;
        }
        public bool HaveGameRecord(string id)
        {
            GameRecord gameRecord = _dbContext.GameRecords.FirstOrDefault(e => e.GameId == id);
            return (gameRecord != null);
        }
        public bool IsInGame(string id, string username)
        {
            GameRecord gameRecord = _dbContext.GameRecords.FirstOrDefault(e => e.Player1 == username || e.Player2 == username);
            return (gameRecord != null);
        }
        public GameRecord QuitGame(string id)
        {
            GameRecord gameRecordToRemove = _dbContext.GameRecords.FirstOrDefault(e => e.GameId == id);
            _dbContext.GameRecords.Remove(gameRecordToRemove);
            _dbContext.SaveChanges();
            return gameRecordToRemove;
        }
        public GameRecord FindGameRecord(string id)
        {
            GameRecord gameRecord = _dbContext.GameRecords.FirstOrDefault(e => e.GameId == id);
            return gameRecord;
        }
        public GameRecord RegisterMove(string username, string gamemove, string id)
        {
            GameRecord gameRecord = _dbContext.GameRecords.FirstOrDefault(e => e.GameId == id);
            if (gameRecord.Player1 != username)
            {
                gameRecord.LastMovePlayer1 = null;
                gameRecord.LastMovePlayer2 = gamemove;
            }
            else
            {
                gameRecord.LastMovePlayer1 = gamemove;
                gameRecord.LastMovePlayer2 = null;
            }
            _dbContext.GameRecords.Update(gameRecord);
            _dbContext.SaveChanges();
            return gameRecord;
        }
        
    }
}
