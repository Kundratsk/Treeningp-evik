using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace WorkoutTracker.API.Models
{
    public class Exercise
    {
        public int Id { get; set; }

        public int WorkoutId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Range(1, 100)]
        public int Sets { get; set; }

        [Range(1, 1000)]
        public int Reps { get; set; }

        [Range(0, 500)]
        public double WeightKg { get; set; }

        [JsonIgnore]
        public Workout? Workout { get; set; }
    }
}
