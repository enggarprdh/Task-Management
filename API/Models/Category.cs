using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TaskManagerAPI.Models
{
    public class Category : BaseEntity
    {
        public Category()
        {
            Tasks = new HashSet<TaskItem>();
        }

        [Required]
        public string Name { get; set; }

        public string Description { get; set; }

        public virtual ICollection<TaskItem> Tasks { get; set; }
    }
}
