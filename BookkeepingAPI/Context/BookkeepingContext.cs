using BookkeepingAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace BookkeepingAPI.Context
{
    public class BookkeepingContext : DbContext
    {
        public BookkeepingContext(DbContextOptions<BookkeepingContext> options) : base(options)
        {
        }
        public DbSet<Expenses> Expenses { get; set; }
        public DbSet<Incomes> Incomes { get; set; }
        public DbSet<ExpensesTypes> ExpensesTypes { get; set; }
        public DbSet<IncomeTypes> IncomeTypes { get; set; }
        public DbSet<Years> Years { get; set; }
        public DbSet<Months> Months { get; set; }
        public DbSet<DummyExpenses> DummyExpenses { get; set; }
        public DbSet<DummyIncomes> DummyIncomes { get; set; }   

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Expenses>()
                .HasOne(e => e.Year)
                .WithMany()
                .HasForeignKey(e => e.yearId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Expenses>()
                .HasOne(e => e.Month)
                .WithMany()
                .HasForeignKey(e => e.monthId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Expenses>()
                .HasOne(e => e.ExpenseType)
                .WithMany()
                .HasForeignKey(e => e.expenseTypeId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Incomes>()
                .HasOne(i => i.Year)
                .WithMany()
                .HasForeignKey(i => i.yearId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Incomes>()
                .HasOne(i => i.Month)
                .WithMany()
                .HasForeignKey(i => i.monthId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Incomes>()
                .HasOne(i => i.IncomeType)
                .WithMany()
                .HasForeignKey(i => i.incomeTypeId)
                .OnDelete(DeleteBehavior.Restrict);


            modelBuilder.Entity<Years>().HasData(
                new Years { Id = 1, Year = 2021 },
                new Years { Id = 2, Year = 2022 },
                new Years { Id = 3, Year = 2023 }
            );

            modelBuilder.Entity<Months>().HasData(
                new Months { Id = 1, Month = "January" },
                new Months { Id = 2, Month = "February" },
                new Months { Id = 3, Month = "March" },
                new Months { Id = 4, Month = "April" },
                new Months { Id = 5, Month = "May" },
                new Months { Id = 6, Month = "June" },
                new Months { Id = 7, Month = "July" },
                new Months { Id = 8, Month = "August" },
                new Months { Id = 9, Month = "September" },
                new Months { Id = 10, Month = "October" },
                new Months { Id = 11, Month = "November" },
                new Months { Id = 12, Month = "December" });

            modelBuilder.Entity<IncomeTypes>().HasData(
                new IncomeTypes { Id = 1, IncomeType = "Salary" },
                new IncomeTypes { Id = 2, IncomeType = "Bonus" },
                new IncomeTypes { Id = 3, IncomeType = "Other" });

            modelBuilder.Entity<ExpensesTypes>().HasData(
                new ExpensesTypes { Id = 1, ExpenseType = "Rent" },
                new ExpensesTypes { Id = 2, ExpenseType = "Utilities" },
                new ExpensesTypes { Id = 3, ExpenseType = "Groceries" },
                new ExpensesTypes { Id = 4, ExpenseType = "Other" });
                       
            modelBuilder.Entity<DummyIncomes>().HasData(
                new DummyIncomes { Id = 1, yearId = 1, monthId = 1, Amount = 100, incomeTypeId = 1 },
                new DummyIncomes { Id = 2, yearId = 1, monthId = 2, Amount = 50, incomeTypeId = 1 },
                new DummyIncomes { Id = 3, yearId = 1, monthId = 3, Amount = 150, incomeTypeId = 1 },            
                new DummyIncomes { Id = 5, yearId = 1, monthId = 5, Amount = 800, incomeTypeId = 1 },
                new DummyIncomes { Id = 6, yearId = 1, monthId = 6, Amount = 50, incomeTypeId = 1 },
                new DummyIncomes { Id = 7, yearId = 1, monthId = 7, Amount = 100, incomeTypeId = 1 },
                new DummyIncomes { Id = 8, yearId = 2, monthId = 1, Amount = 100, incomeTypeId = 1 },
                new DummyIncomes { Id = 9, yearId = 2, monthId = 2, Amount = 50, incomeTypeId = 1 },
                new DummyIncomes { Id = 10, yearId = 2, monthId = 3, Amount = 150, incomeTypeId = 1 },
                new DummyIncomes { Id = 11, yearId = 2, monthId = 5, Amount = 800, incomeTypeId = 1 },
                new DummyIncomes { Id = 12, yearId = 2, monthId = 6, Amount = 50, incomeTypeId = 1 },
                new DummyIncomes { Id = 13, yearId = 2, monthId = 7, Amount = 100, incomeTypeId = 1 }
                );

            modelBuilder.Entity<DummyExpenses>().HasData(
                new DummyExpenses { Id = 1, yearId = 1, monthId = 1, Amount = 200, expenseTypeId = 1 },
                new DummyExpenses { Id = 2, yearId = 1, monthId = 2, Amount = 70, expenseTypeId = 1 },
                new DummyExpenses { Id = 3, yearId = 1, monthId = 3, Amount = 120, expenseTypeId = 1 },
                new DummyExpenses { Id = 4, yearId = 1, monthId = 4, Amount = 200, expenseTypeId = 1 },
                new DummyExpenses { Id = 5, yearId = 1, monthId = 5, Amount = 300, expenseTypeId = 1 },
                new DummyExpenses { Id = 6, yearId = 1, monthId = 6, Amount = 50, expenseTypeId = 1 },
                new DummyExpenses { Id = 7, yearId = 1, monthId = 7, Amount = 50, expenseTypeId = 1 },
                new DummyExpenses { Id = 8, yearId = 2, monthId = 1, Amount = 100, expenseTypeId = 1 },
                new DummyExpenses { Id = 9, yearId = 2, monthId = 2, Amount = 130, expenseTypeId = 1 },
                new DummyExpenses { Id = 10, yearId = 2, monthId = 3, Amount = 150, expenseTypeId = 1 },
                new DummyExpenses { Id = 11, yearId = 2, monthId = 4, Amount = 200, expenseTypeId = 1 },
                new DummyExpenses { Id = 12, yearId = 2, monthId = 5, Amount = 300, expenseTypeId = 1 },
                new DummyExpenses { Id = 13, yearId = 2, monthId = 6, Amount = 50, expenseTypeId = 1 },
                new DummyExpenses { Id = 14, yearId = 2, monthId = 7, Amount = 50, expenseTypeId = 1 },
                new DummyExpenses { Id = 15, yearId = 2, monthId = 8, Amount = 100, expenseTypeId = 1 }
                );
        }
    }

}
