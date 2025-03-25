namespace BookkeepingAPI.Models
{
    public class Expenses
    {
        public int Id { get; set; }
        public int yearId { get; set; }
        public Years Year { get; set; }
        public int monthId { get; set; }
        public Months Month { get; set; }
        public int expenseTypeId { get; set; }
        public ExpensesTypes ExpenseType { get; set; }
        public double Amount { get; set; }
    }

    public class CumulativeExpenses 
        {
        public int yearId { get; set; }
        public int monthId { get; set; }
        public double Amount { get; set; }
        }
}
