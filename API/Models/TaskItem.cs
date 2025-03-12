using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskManagerAPI.Models
{
    public class TaskItem : BaseEntity
    {
        public TaskItem()
        {
            Categories = new HashSet<Category>();
        }

        [Required]
        public string Title { get; set; }


        public string Description { get; set; }

        public DateTime DueDate { get; set; }

        public TaskPriority Priority { get; set; }

        public TaskStatus Status { get; set; }

        [ForeignKey("CreatedBy")]
        public Guid CreatedById { get; set; }
        public virtual ApplicationUser CreatedBy { get; set; }

        [ForeignKey("AssignedTo")]
        public Guid? AssignedToId { get; set; }
        public virtual ApplicationUser AssignedTo { get; set; }

        public virtual ICollection<Category> Categories { get; set; }
    }

    public enum TaskPriority
    {
        Low,
        Medium,
        High,
        Urgent
    }

    public enum TaskStatus
    {
        Todo,
        InProgress,
        Done,
        Cancelled
    }
}
