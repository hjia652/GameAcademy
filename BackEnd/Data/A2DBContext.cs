using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;

using A2.Models;
namespace A2.Data
{
    public class A2DBContext : DbContext
    {
        public A2DBContext(DbContextOptions<A2DBContext> options) : base(options) { }
        public DbSet<User> Users { get; set; }
        public DbSet<GameRecord> GameRecords { get; set; }
    }
}