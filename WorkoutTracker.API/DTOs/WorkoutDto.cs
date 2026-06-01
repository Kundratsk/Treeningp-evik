using System.ComponentModel.DataAnnotations;

namespace WorkoutTracker.API.DTOs
{
    public class WorkoutCreateDto
    {
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

        public List<ExerciseCreateDto> Exercises { get; set; } = new();
    }

    public class WorkoutUpdateDto
    {
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
    }

    public class ExerciseCreateDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Range(1, 100)]
        public int Sets { get; set; }

        [Range(1, 1000)]
        public int Reps { get; set; }

        [Range(0, 500)]
        public double WeightKg { get; set; }
    }
}
