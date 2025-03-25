using BookkeepingAPI.Context;
using BookkeepingAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookkeepingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class YearsController : Controller
    {
        private readonly BookkeepingContext db;

        public YearsController(BookkeepingContext context)
        {
            db = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetYears()
        {
            try
            {
                var years = await db.Years.ToListAsync();
                return Ok(years);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddYear(Years year)
        {
            try
            {
                db.Years.Add(year);
                await db.SaveChangesAsync();
                return Ok(year);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
