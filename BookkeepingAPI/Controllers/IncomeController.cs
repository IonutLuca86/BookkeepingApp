using BookkeepingAPI.Context;
using BookkeepingAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookkeepingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IncomeController : Controller
    {
        private readonly BookkeepingContext db;

        public IncomeController(BookkeepingContext context)
        {
            db = context;
        }

        [HttpGet("{yearId:int}")]
        public async Task<IActionResult> GetIncomes(int yearId)
        {
            try
            {
                var incomes = await db.Incomes.Where(i => i.yearId == yearId)
                    .Include(i => i.Year)
                    .Include(i => i.Month)
                    .Include(i=> i.IncomeType)
                    .ToListAsync();
                return Ok(incomes);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [HttpGet("dummy/{yearId:int}")]
        public async Task<IActionResult> GetDummyIncomes(int yearId)
        {
            try
            {
                var incomes = await db.DummyIncomes.Where(i => i.yearId == yearId).ToListAsync();
                return Ok(incomes);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [HttpGet("cumulative/{year}")]
        public async Task<IActionResult> GetCumulativeIncomes(int year)
        {
            try
            {
                var cumulativeIncomes = new List<CumulativeIncomes>();
                var incomes = await db.DummyIncomes.Where(i => i.yearId == year).ToListAsync();
                var incomesSums = new Dictionary<int, double>();
                for (int i = 1; i <= 12; i++)
                {
                    var incomesForMonth = incomes.Where(income => income.monthId == i);

                    double totalIncomeForMonth = incomesForMonth.Count() != 0 ? incomesForMonth.Sum(income => income.Amount) : 0;

                    incomesSums[i] = totalIncomeForMonth;
                }
                var sortedDictionary = new SortedDictionary<int, double>(incomesSums);
                double sum = 0;
                foreach (var income in sortedDictionary)
                {
                    sum += income.Value;
                    cumulativeIncomes.Add(new CumulativeIncomes()
                    {
                        yearId = year,                 
                        monthId = income.Key,           
                        Amount = sum
                    });
                }
                return Ok(cumulativeIncomes);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddIncome([FromBody] NewIncome income)
        {
            try
            {
                var year = await db.Years.FirstOrDefaultAsync(y => y.Id == income.yearId);
                var month = await db.Months.FirstOrDefaultAsync(m => m.Id == income.monthId);
                var incomeType = await db.IncomeTypes.FirstOrDefaultAsync(t => t.Id == income.incomeTypeId);
                
                var newIncome = new Incomes
                {
                    yearId = income.yearId,
                    Year = year,
                    monthId = income.monthId,
                    Month = month,
                    incomeTypeId = income.incomeTypeId,
                    IncomeType = incomeType,
                    Amount = income.Amount
                };
                db.Incomes.Add(newIncome);
                await db.SaveChangesAsync();
                return Ok(income);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdateIncome([FromBody] NewIncome income)
        {
            try
            {
                var existingIncome = await db.Incomes.SingleOrDefaultAsync(e =>
                        e.yearId == income.yearId &&
                        e.monthId == income.monthId &&
                        e.incomeTypeId == income.incomeTypeId);

                if (existingIncome == null)
                {
                    return NotFound("Expense not found.");
                }
                existingIncome.Amount = income.Amount;

                db.Incomes.Update(existingIncome);
                await db.SaveChangesAsync();
                return Ok(income);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteIncome(int id)
        {
            try
            {
                var income = await db.Incomes.FindAsync(id);
                db.Incomes.Remove(income);
                await db.SaveChangesAsync();
                return Ok(income);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

    }
}
