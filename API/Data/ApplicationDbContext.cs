using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<TaskItem> Tasks { get; set; }
        public DbSet<Category> Categories { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Configure TaskItem relationships
            builder.Entity<TaskItem>()
                .HasOne(t => t.CreatedBy)
                .WithMany()
                .HasForeignKey(t => t.CreatedById)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<TaskItem>()
                .HasOne(t => t.AssignedTo)
                .WithMany()
                .HasForeignKey(t => t.AssignedToId)
                .OnDelete(DeleteBehavior.SetNull);

            // Configure Category relationships
            builder.Entity<TaskItem>()
                .HasMany(t => t.Categories)
                .WithMany(c => c.Tasks)
                .UsingEntity(j => j.ToTable("TaskCategories"));

            // Configure default values
            builder.Entity<TaskItem>()
                .Property(t => t.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            builder.Entity<TaskItem>()
                .Property(t => t.UpdatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            builder.Entity<Category>()
                .Property(c => c.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            builder.Entity<Category>()
                .Property(c => c.UpdatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
        }
    }
}
