namespace BookkeepingAPI.Models
{
    public class CumulativeIncomes
    {
        public int yearId { get; set; }
        public int monthId { get; set; }
        public double Amount { get; set; }
    }
    public class NewIncome : CumulativeIncomes
    {
        public int incomeTypeId { get; set; }  
    }
    public class Incomes : NewIncome
    {
        public int Id { get; set; }    
        public Years Year { get; set; }   
        public Months Month { get; set; }     
        public IncomeTypes IncomeType { get; set; }       

    }
    
   
}
