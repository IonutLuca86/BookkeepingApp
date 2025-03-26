using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BookkeepingAPI.Migrations
{
    /// <inheritdoc />
    public partial class InitialData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DummyExpenses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    yearId = table.Column<int>(type: "int", nullable: false),
                    monthId = table.Column<int>(type: "int", nullable: false),
                    expenseTypeId = table.Column<int>(type: "int", nullable: false),
                    Amount = table.Column<double>(type: "float", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DummyExpenses", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DummyIncomes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    yearId = table.Column<int>(type: "int", nullable: false),
                    monthId = table.Column<int>(type: "int", nullable: false),
                    incomeTypeId = table.Column<int>(type: "int", nullable: false),
                    Amount = table.Column<double>(type: "float", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DummyIncomes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ExpensesTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ExpenseType = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExpensesTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "IncomeTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IncomeType = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IncomeTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Months",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Month = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Months", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Years",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Year = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Years", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Expenses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    yearId = table.Column<int>(type: "int", nullable: false),
                    monthId = table.Column<int>(type: "int", nullable: false),
                    Amount = table.Column<double>(type: "float", nullable: false),
                    expenseTypeId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Expenses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Expenses_ExpensesTypes_expenseTypeId",
                        column: x => x.expenseTypeId,
                        principalTable: "ExpensesTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Expenses_Months_monthId",
                        column: x => x.monthId,
                        principalTable: "Months",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Expenses_Years_yearId",
                        column: x => x.yearId,
                        principalTable: "Years",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Incomes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    yearId = table.Column<int>(type: "int", nullable: false),
                    monthId = table.Column<int>(type: "int", nullable: false),
                    Amount = table.Column<double>(type: "float", nullable: false),
                    incomeTypeId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Incomes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Incomes_IncomeTypes_incomeTypeId",
                        column: x => x.incomeTypeId,
                        principalTable: "IncomeTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Incomes_Months_monthId",
                        column: x => x.monthId,
                        principalTable: "Months",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Incomes_Years_yearId",
                        column: x => x.yearId,
                        principalTable: "Years",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "DummyExpenses",
                columns: new[] { "Id", "Amount", "expenseTypeId", "monthId", "yearId" },
                values: new object[,]
                {
                    { 1, 200.0, 1, 1, 1 },
                    { 2, 70.0, 1, 2, 1 },
                    { 3, 120.0, 1, 3, 1 },
                    { 4, 200.0, 1, 4, 1 },
                    { 5, 300.0, 1, 5, 1 },
                    { 6, 50.0, 1, 6, 1 },
                    { 7, 50.0, 1, 7, 1 },
                    { 8, 100.0, 1, 1, 2 },
                    { 9, 130.0, 1, 2, 2 },
                    { 10, 150.0, 1, 3, 2 },
                    { 11, 200.0, 1, 4, 2 },
                    { 12, 300.0, 1, 5, 2 },
                    { 13, 50.0, 1, 6, 2 },
                    { 14, 50.0, 1, 7, 2 },
                    { 15, 100.0, 1, 8, 2 }
                });

            migrationBuilder.InsertData(
                table: "DummyIncomes",
                columns: new[] { "Id", "Amount", "incomeTypeId", "monthId", "yearId" },
                values: new object[,]
                {
                    { 1, 100.0, 1, 1, 1 },
                    { 2, 50.0, 1, 2, 1 },
                    { 3, 150.0, 1, 3, 1 },
                    { 5, 800.0, 1, 5, 1 },
                    { 6, 50.0, 1, 6, 1 },
                    { 7, 100.0, 1, 7, 1 },
                    { 8, 100.0, 1, 1, 2 },
                    { 9, 50.0, 1, 2, 2 },
                    { 10, 150.0, 1, 3, 2 },
                    { 11, 800.0, 1, 5, 2 },
                    { 12, 50.0, 1, 6, 2 },
                    { 13, 100.0, 1, 7, 2 }
                });

            migrationBuilder.InsertData(
                table: "ExpensesTypes",
                columns: new[] { "Id", "ExpenseType" },
                values: new object[,]
                {
                    { 1, "Rent" },
                    { 2, "Utilities" },
                    { 3, "Groceries" },
                    { 4, "Other" }
                });

            migrationBuilder.InsertData(
                table: "IncomeTypes",
                columns: new[] { "Id", "IncomeType" },
                values: new object[,]
                {
                    { 1, "Salary" },
                    { 2, "Bonus" },
                    { 3, "Other" }
                });

            migrationBuilder.InsertData(
                table: "Months",
                columns: new[] { "Id", "Month" },
                values: new object[,]
                {
                    { 1, "January" },
                    { 2, "February" },
                    { 3, "March" },
                    { 4, "April" },
                    { 5, "May" },
                    { 6, "June" },
                    { 7, "July" },
                    { 8, "August" },
                    { 9, "September" },
                    { 10, "October" },
                    { 11, "November" },
                    { 12, "December" }
                });

            migrationBuilder.InsertData(
                table: "Years",
                columns: new[] { "Id", "Year" },
                values: new object[,]
                {
                    { 1, 2021 },
                    { 2, 2022 },
                    { 3, 2023 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Expenses_expenseTypeId",
                table: "Expenses",
                column: "expenseTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Expenses_monthId",
                table: "Expenses",
                column: "monthId");

            migrationBuilder.CreateIndex(
                name: "IX_Expenses_yearId",
                table: "Expenses",
                column: "yearId");

            migrationBuilder.CreateIndex(
                name: "IX_Incomes_incomeTypeId",
                table: "Incomes",
                column: "incomeTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Incomes_monthId",
                table: "Incomes",
                column: "monthId");

            migrationBuilder.CreateIndex(
                name: "IX_Incomes_yearId",
                table: "Incomes",
                column: "yearId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DummyExpenses");

            migrationBuilder.DropTable(
                name: "DummyIncomes");

            migrationBuilder.DropTable(
                name: "Expenses");

            migrationBuilder.DropTable(
                name: "Incomes");

            migrationBuilder.DropTable(
                name: "ExpensesTypes");

            migrationBuilder.DropTable(
                name: "IncomeTypes");

            migrationBuilder.DropTable(
                name: "Months");

            migrationBuilder.DropTable(
                name: "Years");
        }
    }
}
