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

        [HttpGet("cumulative/{year}")]
        public async Task<IActionResult> GetCumulativeIncomes(int year)
        {
            try
            {
                var cumulativeIncomes = new List<CumulativeIncomes>();
                var incomes = await db.Incomes.Where(i => i.yearId == year).ToListAsync();
                double sum = 0;
                foreach (var income in incomes)
                {
                    sum += income.Amount;
                    cumulativeIncomes.Add(new CumulativeIncomes()
                    {
                        yearId = income.yearId,                 
                        monthId = income.monthId,           
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
                var year = await db.Years.FindAsync(income.yearId);
                var month = await db.Months.FindAsync(income.monthId);
                var incomeType = await db.IncomeTypes.FindAsync(income.incomeTypeId);
                
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
        public async Task<IActionResult> UpdateIncome([FromBody] Incomes income)
        {
            try
            {
                db.Incomes.Update(income);
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
