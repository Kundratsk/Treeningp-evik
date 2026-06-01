using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WorkoutTracker.API.Data;
using WorkoutTracker.API.DTOs;
using WorkoutTracker.API.Models;

namespace WorkoutTracker.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WorkoutsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public WorkoutsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/workouts?search=jalgade&category=Jõud&sortBy=date&sortDesc=true&page=1&pageSize=5
        [HttpGet]
        public async Task<ActionResult> GetWorkouts(
            [FromQuery] string? search,
            [FromQuery] string? category,
            [FromQuery] string sortBy = "date",
            [FromQuery] bool sortDesc = true,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 5)
        {
            var query = _context.Workouts.Include(w => w.Exercises).AsQueryable();

            // Search
            if (!string.IsNullOrEmpty(search))
                query = query.Where(w => w.Title.Contains(search) || (w.Notes != null && w.Notes.Contains(search)));

            // Filter by category
            if (!string.IsNullOrEmpty(category))
                query = query.Where(w => w.Category == category);

            // Sort
            query = sortBy.ToLower() switch
            {
                "title" => sortDesc ? query.OrderByDescending(w => w.Title) : query.OrderBy(w => w.Title),
                "duration" => sortDesc ? query.OrderByDescending(w => w.DurationMinutes) : query.OrderBy(w => w.DurationMinutes),
                "calories" => sortDesc ? query.OrderByDescending(w => w.CaloriesBurned) : query.OrderBy(w => w.CaloriesBurned),
                _ => sortDesc ? query.OrderByDescending(w => w.Date) : query.OrderBy(w => w.Date)
            };

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            var workouts = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new
            {
                data = workouts,
                totalCount,
                totalPages,
                currentPage = page,
                pageSize
            });
        }

        // GET: api/workouts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Workout>> GetWorkout(int id)
        {
            var workout = await _context.Workouts
                .Include(w => w.Exercises)
                .FirstOrDefaultAsync(w => w.Id == id);

            if (workout == null)
                return NotFound(new { message = $"Treeningut ID-ga {id} ei leitud." });

            return Ok(workout);
        }

        // GET: api/workouts/stats
        [HttpGet("stats")]
        public async Task<ActionResult> GetStats()
        {
            var workouts = await _context.Workouts.ToListAsync();

            var stats = new
            {
                totalWorkouts = workouts.Count,
                totalMinutes = workouts.Sum(w => w.DurationMinutes),
                totalCalories = workouts.Sum(w => w.CaloriesBurned),
                byCategory = workouts
                    .GroupBy(w => w.Category)
                    .Select(g => new { category = g.Key, count = g.Count() }),
                last7Days = workouts
                    .Where(w => w.Date >= DateTime.Now.AddDays(-7))
                    .OrderBy(w => w.Date)
                    .Select(w => new { date = w.Date.ToString("MM-dd"), calories = w.CaloriesBurned, duration = w.DurationMinutes })
            };

            return Ok(stats);
        }

        // POST: api/workouts
        [HttpPost]
        public async Task<ActionResult<Workout>> CreateWorkout(WorkoutCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var workout = new Workout
            {
                Title = dto.Title,
                Date = dto.Date,
                DurationMinutes = dto.DurationMinutes,
                Category = dto.Category,
                Notes = dto.Notes,
                CaloriesBurned = dto.CaloriesBurned,
                Exercises = dto.Exercises.Select(e => new Exercise
                {
                    Name = e.Name,
                    Sets = e.Sets,
                    Reps = e.Reps,
                    WeightKg = e.WeightKg
                }).ToList()
            };

            _context.Workouts.Add(workout);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetWorkout), new { id = workout.Id }, workout);
        }

        // PUT: api/workouts/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateWorkout(int id, WorkoutUpdateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var workout = await _context.Workouts.FindAsync(id);
            if (workout == null)
                return NotFound(new { message = $"Treeningut ID-ga {id} ei leitud." });

            workout.Title = dto.Title;
            workout.Date = dto.Date;
            workout.DurationMinutes = dto.DurationMinutes;
            workout.Category = dto.Category;
            workout.Notes = dto.Notes;
            workout.CaloriesBurned = dto.CaloriesBurned;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/workouts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWorkout(int id)
        {
            var workout = await _context.Workouts.FindAsync(id);
            if (workout == null)
                return NotFound(new { message = $"Treeningut ID-ga {id} ei leitud." });

            _context.Workouts.Remove(workout);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Treening kustutatud." });
        }
    }
}
