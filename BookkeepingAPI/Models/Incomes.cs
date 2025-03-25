namespace BookkeepingAPI.Models
{
    public class Incomes
    {
        public int Id { get; set; }
        public int yearId { get; set; }
        public Years Year { get; set; }
        public int monthId { get; set; }
        public Months Month { get; set; }
        public int incomeTypeId { get; set; }
        public IncomeTypes IncomeType { get; set; }
        public double Amount { get; set; }

    }

    public class NewIncome 
    {
        public int Id { get; set; }
        public int yearId { get; set; }
        public int monthId { get; set; }  
        public int incomeTypeId { get; set; }
        public double Amount { get; set; }
    }

    public class CumulativeIncomes
    {
        public int yearId { get; set; }
        public int monthId { get; set; }
        public double Amount { get; set; }
    }
   
}
