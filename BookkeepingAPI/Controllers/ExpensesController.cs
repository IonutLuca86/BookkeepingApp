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
        [HttpGet("dummy/{yearId:int}")]
        public async Task<IActionResult> GetDummyExpenses(int yearId)
        {
            try
            {
                var expenses = await db.DummyExpenses.Where(e => e.yearId == yearId).ToListAsync();
                return Ok(expenses);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [HttpPost]
        public async Task<IActionResult> AddExpense([FromBody] NewExpense expense)
        {
            try
            {
                var year = await db.Years.SingleOrDefaultAsync(y => y.Id == expense.yearId);
                var month = await db.Months.SingleOrDefaultAsync(m => m.Id == expense.monthId);
                var expenseType = await db.ExpensesTypes.SingleOrDefaultAsync(et => et.Id == expense.expenseTypeId);

                var newExpense = new Expenses
                {
                    yearId = expense.yearId,
                    Year = year,
                    monthId = expense.monthId,
                    Month = month,
                    expenseTypeId = expense.expenseTypeId,
                    ExpenseType = expenseType,
                    Amount = expense.Amount
                };
                db.Expenses.Add(newExpense);
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
                var expenses = await db.DummyExpenses.Where(e => e.yearId == year).ToListAsync();
                var expensesSums = new Dictionary<int, double>();
                for (int i = 1; i <= 12; i++)
                {
                    var expensesForMonth = expenses.Where(expense => expense.monthId == i);

                    double totalExpensesForMonth = expensesForMonth.Count() != 0 ? expensesForMonth.Sum(expense => expense.Amount) : 0;

                    expensesSums[i] = totalExpensesForMonth;
                }
                var sortedDictionary = new SortedDictionary<int, double>(expensesSums);
                double sum = 0;
                foreach (var expense in sortedDictionary)
                {
                    sum += expense.Value;
                    cumulativeExpenses.Add(new CumulativeExpenses()
                    {
                        yearId = year,
                        monthId = expense.Key,
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
        public async Task<IActionResult> UpdateExpense([FromBody] NewExpense expense)
        {
            try
            {
                var existingExpense = await db.Expenses.SingleOrDefaultAsync(e =>
                            e.yearId == expense.yearId &&
                            e.monthId == expense.monthId &&
                            e.expenseTypeId == expense.expenseTypeId);
                if (existingExpense == null)
                {
                    return NotFound("Expense not found.");
                }
                existingExpense.Amount = expense.Amount;

                db.Expenses.Update(existingExpense);
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
