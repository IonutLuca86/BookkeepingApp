using BookkeepingAPI.Context;
using BookkeepingAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookkeepingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExpensesController : Controller
    {
        private readonly BookkeepingContext db;

        public ExpensesController(BookkeepingContext context)
        {
            db = context;
        }

        [HttpGet("{yearId:int}")]
        public async Task<IActionResult> GetExpenses(int yearId)
        {
            try
            {
                var expenses = await db.Expenses.Where(e => e.yearId == yearId)
                    .Include(e => e.Year)
                    .Include(e => e.Month)
                    .Include(e => e.ExpenseType)
                    .ToListAsync();
                return Ok(expenses);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddExpense(Expenses expense)
        {
            try
            {
                db.Expenses.Add(expense);
                await db.SaveChangesAsync();
                return Ok(expense);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("cumulative/{year}")]
        public async Task<IActionResult> GetCumulativeExpenses(int year)
        {
            try
            {
                var cumulativeExpenses = new List<CumulativeExpenses>();
                var expenses = await db.Expenses.Where(e => e.yearId == year).ToListAsync();
                double sum = 0;
                foreach (var expense in expenses)
                {
                    sum += expense.Amount;
                    cumulativeExpenses.Add(new CumulativeExpenses()
                    {
                        yearId = expense.yearId,           
                        monthId = expense.monthId,              
                        Amount = sum
                    });
                }
                return Ok(cumulativeExpenses);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdateExpense(Expenses expense)
        {
            try
            {
                db.Expenses.Update(expense);
                await db.SaveChangesAsync();
                return Ok(expense);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExpense(int id)
        {
            try
            {
                var expense = await db.Expenses.FindAsync(id);
                db.Expenses.Remove(expense);
                await db.SaveChangesAsync();
                return Ok(expense);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
