using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TaskManagerAPI.Models
{
    public class ApplicationUser : IdentityUser<Guid>
    {
        public ApplicationUser()
        {
            CreatedTasks = new HashSet<TaskItem>();
            AssignedTasks = new HashSet<TaskItem>();
        }

        [Required]
        [StringLength(50)]
        public string FirstName { get; set; }

        [Required]
        [StringLength(50)]
        public string LastName { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public virtual ICollection<TaskItem> CreatedTasks { get; set; }
        public virtual ICollection<TaskItem> AssignedTasks { get; set; }
    }
}
