namespace BookkeepingAPI.Models
{
    public class CumulativeExpenses
    {
        public int yearId { get; set; }
        public int monthId { get; set; }
        public double Amount { get; set; }
    }
    public class NewExpense : CumulativeExpenses
    {
        public int expenseTypeId { get; set; }
    }

    public class Expenses : NewExpense
    {
        public int Id { get; set; }
        public Years Year { get; set; }
        public Months Month { get; set; }
        public ExpensesTypes ExpenseType { get; set; }
    }
 



}
