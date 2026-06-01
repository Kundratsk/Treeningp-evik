using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WorkoutTracker.API.Data;
using WorkoutTracker.API.DTOs;
using WorkoutTracker.API.Models;

namespace WorkoutTracker.API.Controllers
{
    [ApiController]
    [Route("api/workouts/{workoutId}/exercises")]
    public class ExercisesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ExercisesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/workouts/5/exercises
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Exercise>>> GetExercises(int workoutId)
        {
            var workoutExists = await _context.Workouts.AnyAsync(w => w.Id == workoutId);
            if (!workoutExists)
                return NotFound(new { message = $"Treeningut ID-ga {workoutId} ei leitud." });

            var exercises = await _context.Exercises
                .Where(e => e.WorkoutId == workoutId)
                .ToListAsync();

            return Ok(exercises);
        }

        // POST: api/workouts/5/exercises
        [HttpPost]
        public async Task<ActionResult<Exercise>> AddExercise(int workoutId, ExerciseCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var workoutExists = await _context.Workouts.AnyAsync(w => w.Id == workoutId);
            if (!workoutExists)
                return NotFound(new { message = $"Treeningut ID-ga {workoutId} ei leitud." });

            var exercise = new Exercise
            {
                WorkoutId = workoutId,
                Name = dto.Name,
                Sets = dto.Sets,
                Reps = dto.Reps,
                WeightKg = dto.WeightKg
            };

            _context.Exercises.Add(exercise);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetExercises), new { workoutId }, exercise);
        }

        // PUT: api/workouts/5/exercises/3
        [HttpPut("{exerciseId}")]
        public async Task<IActionResult> UpdateExercise(int workoutId, int exerciseId, ExerciseCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var exercise = await _context.Exercises
                .FirstOrDefaultAsync(e => e.Id == exerciseId && e.WorkoutId == workoutId);

            if (exercise == null)
                return NotFound(new { message = "Harjutust ei leitud." });

            exercise.Name = dto.Name;
            exercise.Sets = dto.Sets;
            exercise.Reps = dto.Reps;
            exercise.WeightKg = dto.WeightKg;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/workouts/5/exercises/3
        [HttpDelete("{exerciseId}")]
        public async Task<IActionResult> DeleteExercise(int workoutId, int exerciseId)
        {
            var exercise = await _context.Exercises
                .FirstOrDefaultAsync(e => e.Id == exerciseId && e.WorkoutId == workoutId);

            if (exercise == null)
                return NotFound(new { message = "Harjutust ei leitud." });

            _context.Exercises.Remove(exercise);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Harjutus kustutatud." });
        }
    }
}
