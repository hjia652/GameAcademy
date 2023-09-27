using A2.Handler;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;

using A2.Data;
using A2.Models;
using Microsoft.EntityFrameworkCore.ChangeTracking;
namespace A2.Data
{
    public interface IA2Repo
    {
        public IEnumerable<User> GetAllUsers();
        public User? GetUserByUsername(string e);
        public bool ValidLogin(string username, string password);
        public bool reg(User newUser);
        public bool WaitReco();
        public bool IsInGame(string id, string username);
        public bool HaveGameRecord(string id);
        public GameRecord QuitGame(string id);
        public GameRecord FindRecord();
        public GameRecord UpdateRecord(string x);
        public GameRecord NewRecord(string user);
        public GameRecord FindGameRecord(string id);
        public GameRecord RegisterMove(string username, string move, string id);
    }
}