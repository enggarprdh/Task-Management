using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TaskManagerAPI.Data;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _context;

        public UserController(UserManager<ApplicationUser> userManager, ApplicationDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        // GET: api/User
        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            // Get the current user's ID and check if they are an admin
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var isAdmin = User.IsInRole("Admin");

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            // If the user is an admin, return all users
            // If the user is not an admin, return only their own user information
            if (isAdmin)
            {
                var allUsers = await _userManager.Users
                    .Select(u => new UserResponse
                    {
                        Id = u.Id.ToString(),
                        Username = u.UserName,
                        Email = u.Email,
                        FirstName = u.FirstName,
                        LastName = u.LastName,
                        CreatedAt = u.CreatedAt,
                        UpdatedAt = u.UpdatedAt
                    })
                    .ToListAsync();

                return Ok(allUsers);
            }
            else
            {
                var currentUser = await _userManager.FindByIdAsync(userId);
                if (currentUser == null)
                    return NotFound();

                var userResponse = new UserResponse
                {
                    Id = currentUser.Id.ToString(),
                    Username = currentUser.UserName,
                    Email = currentUser.Email,
                    FirstName = currentUser.FirstName,
                    LastName = currentUser.LastName,
                    CreatedAt = currentUser.CreatedAt,
                    UpdatedAt = currentUser.UpdatedAt
                };

                return Ok(new List<UserResponse> { userResponse });
            }
        }

        // GET: api/User/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(string id)
        {
            // Get the current user's ID and check if they are an admin
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var isAdmin = User.IsInRole("Admin");

            if (string.IsNullOrEmpty(currentUserId))
                return Unauthorized();

            // If the user is not an admin and is trying to access another user's information, return Forbidden
            if (!isAdmin && currentUserId != id)
                return Forbid();

            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound();

            var userResponse = new UserResponse
            {
                Id = user.Id.ToString(),
                Username = user.UserName,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            };

            return Ok(userResponse);
        }
    }

    public class UserResponse
    {
        public string Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
} 