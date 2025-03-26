namespace BookkeepingAPI.Models
{
    public class DummyExpenses
    {
        public int Id { get; set; }
        public int yearId { get; set; }
        public int monthId { get; set; }
        public int expenseTypeId { get; set; }
        public double Amount { get; set; }
    }
}
