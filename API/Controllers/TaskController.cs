using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TaskManagerAPI.Data;
using TaskManagerAPI.Models;
using Task = System.Threading.Tasks.Task;
using TaskStatus = TaskManagerAPI.Models.TaskStatus;

namespace TaskManagerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TaskController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public TaskController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: api/Task
        [HttpGet]
        public async Task<IActionResult> GetTasks()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var isAdmin = User.IsInRole("Admin");

            var tasks = isAdmin
                ? await _context.Tasks
                    .Include(t => t.CreatedBy)
                    .Include(t => t.AssignedTo)
                    .Include(t => t.Categories)
                    .ToListAsync()
                : await _context.Tasks
                    .Include(t => t.CreatedBy)
                    .Include(t => t.AssignedTo)
                    .Include(t => t.Categories)
                    .Where(t => t.CreatedById.ToString() == userId)
                    .ToListAsync();

            return Ok(tasks);
        }

        // GET: api/Task/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTask(Guid id)
        {
            var taskItem = await _context.Tasks
                .Include(t => t.CreatedBy)
                .Include(t => t.AssignedTo)
                .Include(t => t.Categories)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (taskItem == null)
                return NotFound();

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var isAdmin = User.IsInRole("Admin");

            if (!isAdmin && taskItem.CreatedById.ToString() != userId)
                return Forbid();

            return Ok(taskItem);
        }

        // POST: api/Task
        [HttpPost]
        public async Task<IActionResult> CreateTask(TaskCreateRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var taskItem = new TaskItem
            {
                Title = request.Title,
                Description = request.Description,
                DueDate = request.DueDate,
                Priority = request.Priority,
                Status = TaskStatus.Todo,
                CreatedById = Guid.Parse(userId),
                AssignedToId = request.AssignedToId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Tasks.Add(taskItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTask), new { id = taskItem.Id }, taskItem);
        }

        // PUT: api/Task/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(Guid id, TaskUpdateRequest request)
        {
            var taskItem = await _context.Tasks.FindAsync(id);
            if (taskItem == null)
                return NotFound();

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var isAdmin = User.IsInRole("Admin");

            if (!isAdmin && taskItem.CreatedById.ToString() != userId)
                return Forbid();

            taskItem.Title = request.Title;
            taskItem.Description = request.Description;
            taskItem.DueDate = request.DueDate;
            taskItem.Priority = request.Priority;
            taskItem.Status = request.Status;
            taskItem.AssignedToId = request.AssignedToId;
            taskItem.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Task/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(Guid id)
        {
            var taskItem = await _context.Tasks.FindAsync(id);
            if (taskItem == null)
                return NotFound();

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var isAdmin = User.IsInRole("Admin");

            if (!isAdmin && taskItem.CreatedById.ToString() != userId)
                return Forbid();

            _context.Tasks.Remove(taskItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    public class TaskCreateRequest
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime DueDate { get; set; }
        public TaskPriority Priority { get; set; }
        public Guid? AssignedToId { get; set; }
    }

    public class TaskUpdateRequest : TaskCreateRequest
    {
        public TaskStatus Status { get; set; }
    }
}
