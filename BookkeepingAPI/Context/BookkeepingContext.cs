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
        }
    }

}
