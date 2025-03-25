import { useEffect, useState } from "react";
import { BASE_URL } from "../config";
import Table from 'react-bootstrap/Table';
import CumulativeTable from "./CumulativeTable";
import ReconciliationIncomeTable from "./ReconciliationIncomeTable";
import ReconciliationExpensesTable from "./ReconciliationExpensesTable";
import Button from 'react-bootstrap/Button';

export default function DisplayBookkeeping(year) {

    const selectedYear = year.year;
    const [incomes,setIncomes] = useState([]);
    const [expenses,setExpenses] = useState([]);
    const [cumulativeIncomes,setCumulativeIncomes] = useState([]);
    const [cumulativeExpenses,setCumulativeExpenses] = useState([]);
    const [updateTrigger,setUpdateTrigger] = useState(0);
    const [updatedIncomeData,setUpdatedIncomeData] = useState({});
    const [updatedExpensesData,setUpdatedExpensesData] = useState({});
    const [reconResults,setReconResults] = useState([])

    
    useEffect(() => {
        const fetchIncomes = async (selectedYear) => {
            try{
                let response = await fetch(`${BASE_URL}/Income/${selectedYear.id}`);
                let incomes = await response.json();
                setIncomes(incomes);              
            }catch(error){
                console.log("Failed to load incomes"+error)
            }
        }
        const fetchExpenses = async (selectedYear) => {
            try{
                let response = await fetch(`${BASE_URL}/Expenses/${selectedYear.id}`);
                if(response.ok)
                {
                    let expenses = await response.json();
                    setExpenses(expenses);
                }
             
            }catch(error){
                console.log("Failed to load expenses"+error)
            }
        }
        const fetchCumulativeExpenses = async (selectedYear) => {
            try{
                let response = await fetch(`${BASE_URL}/Expenses/cumulative/${selectedYear.id}`);
                let expenses = await response.json();
                setCumulativeExpenses(expenses);
            }catch(error){
                console.log("Failed to load cumulative expenses "+error)
            }
        }
        const fetchCumulativeIncomes = async (selectedYear) => {
            try{
                let response = await fetch(`${BASE_URL}/Income/cumulative/${selectedYear.id}`);
                let incomes = await response.json();
                setCumulativeIncomes(incomes);
            }catch(error){
                console.log("Failed to load cumulative incomes "+error)
            }
        }


        fetchIncomes(selectedYear);
        fetchExpenses(selectedYear);
        fetchCumulativeIncomes(selectedYear);
        fetchCumulativeExpenses(selectedYear);        
    },[selectedYear,updateTrigger]);

    const updateIncomeData = (newIncome) => {
        setUpdatedIncomeData((prevData) => {
            if (!Array.isArray(prevData)) {
                console.error("Previous state is not an array. Resetting to a new array.");
                return [newIncome]; // If somehow it isn't an array, reset with the new entry
            }
    
            // Check if the entry already exists
            const existingIndex = prevData.findIndex(
                (entry) =>
                    entry.incomeTypeId === newIncome.incomeTypeId &&
                    entry.monthId === newIncome.monthId
            );
    
            if (existingIndex > -1) {
                // Update the existing entry
                const updatedArray = [...prevData];
                updatedArray[existingIndex] = newIncome;
                return updatedArray;
            } else {
                // Add the new entry
                return [...prevData, newIncome];
            }
        });
    };
    console.log(updatedIncomeData)
    const updateExpensesData = (newExpense) => {
        setUpdatedExpensesData((prevData) => {
            if (!Array.isArray(prevData)) {
                console.error("Previous state is not an array. Resetting to a new array.");
                return [newExpense]; // If somehow it isn't an array, reset with the new entry
            }
    
            // Check if the entry already exists
            const existingIndex = prevData.findIndex(
                (entry) =>
                    entry.expenseTypeId === newExpense.incomeTypeId &&
                    entry.monthId === newExpense.monthId
            );
    
            if (existingIndex > -1) {
                // Update the existing entry
                const updatedArray = [...prevData];
                updatedArray[existingIndex] = newExpense;
                return updatedArray;
            } else {
                // Add the new entry
                return [...prevData, newExpense];
            }
        });
    };
    console.log(updatedExpensesData)


const ReconciliationResults = () =>{
    setReconResults(
        Array.from({ length: 12 }).map((_, monthIndex) => {
            // Get all incomes and expenses for this month (1-based monthId)
            const incomeForMonth = incomes.find((income) => income.monthId === monthIndex + 1);
            const expenseForMonth = expenses.find((expense) => expense.monthId === monthIndex + 1);
        
            // Calculate the difference based on matching incomeTypeId and expenseTypeId
            const incomeAmount = incomeForMonth ? incomeForMonth.amount : 0;
            const expenseAmount = expenseForMonth ? expenseForMonth.amount : 0;
        
            return incomeAmount - expenseAmount
            
}))
} 
// console.log(reconResults)

    return(
        <div>
            <h2>Bookkeeping of the year {selectedYear.year}:</h2>

            <div>
            <CumulativeTable 
                    incomes = {incomes} 
                    expenses = {expenses} 
                    cumulativeIncomes = {cumulativeIncomes}
                    cumulativeExpenses = {cumulativeExpenses} />
            <h2>Reconciliation year {selectedYear.year}</h2>
            <Table striped bordered hover>
                    <thead>
                        <tr>
                         <th></th>       
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <td >Income</td>
                        <ReconciliationIncomeTable 
                                    selectedYear = {selectedYear}
                                    incomes = {incomes} 
                                    updateIncomeData={updateIncomeData} />
                             </tr>
                             <tr>
                        <td>Expenses</td>
                        <ReconciliationExpensesTable 
                                    selectedYear = {selectedYear}                                 
                                    expenses = {expenses}
                                    updateExpensesData = {updateExpensesData} />
                       
                        </tr>
                        <tr>
                        <td></td>
                        <td>Reconciliation Result</td>
                        {Array.from({ length: 12 }).map((_, colIndex) => (
                                <td key={colIndex}>
                                    {reconResults[colIndex] || 0}
                                </td>
                            ))}
                        </tr>
                        <tr>
                        <td></td>
                        <td>Final Result</td>
                        
                        </tr>
                        <tr>
                            <td></td>
                        <td>Cumulative Final Result</td>
                        
                        </tr>
                    </tbody>
                </Table>  
                <Button variant="outline-success">Save Reconciliation Data</Button>     
            </div>
    
        </div>
    )
}