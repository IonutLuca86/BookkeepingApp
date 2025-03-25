using BookkeepingAPI.Context;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookkeepingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TypesController : Controller
    {
        private readonly BookkeepingContext db;

        public TypesController(BookkeepingContext context)
        {
            db = context;
        }

        [HttpGet("incomes")]
        public async Task<IActionResult> GetIncomeTypes()
        {
            try
            {
                var incomeTypes = await db.IncomeTypes.ToListAsync();
                return Ok(incomeTypes);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("expenses")]
        public async Task<IActionResult> GetExpenseTypes()
        {
            try
            {
                var expenseTypes = await db.ExpensesTypes.ToListAsync();
                return Ok(expenseTypes);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
