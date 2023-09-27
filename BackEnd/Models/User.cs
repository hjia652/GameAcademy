using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;

using A2.Handler;
namespace A2.Models
{
    public class User
    {
        [Key]
        [Required]
        public string UserName { get; set; }
        public string? Password { get; set; }
        public string? Address { get; set; }
    }
}