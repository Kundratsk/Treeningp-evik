using System.ComponentModel.DataAnnotations;

namespace WorkoutTracker.API.Models
{
    public class Workout
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public DateTime Date { get; set; }

        [Range(1, 600)]
        public int DurationMinutes { get; set; }

        [Required]
        [MaxLength(50)]
        public string Category { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Notes { get; set; }

        [Range(0, 5000)]
        public int CaloriesBurned { get; set; }

        public List<Exercise> Exercises { get; set; } = new();
    }
}
