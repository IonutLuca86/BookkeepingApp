import { useState,useEffect } from "react";
import Table from 'react-bootstrap/Table';

export default function CumulativeTable({incomes,expenses,cumulativeIncomes,cumulativeExpenses}){

    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const [cumulativeResults,setCumulativeResults] = useState([]);

    useEffect(() => {
        if(cumulativeExpenses || cumulativeIncomes )
            {
                const results = new Array(12).fill(0); 

                for (let index = 0; index < 12; index++) {
                    const income = cumulativeIncomes.find(i => i.monthId === index + 1);
                    const expense = cumulativeExpenses.find(e => e.monthId === index + 1);
        
                    const incomeAmount = income ? parseInt(income.amount) : 0;
                    const expenseAmount = expense ? parseInt(expense.amount) : 0;
        
                    results[index] = incomeAmount - expenseAmount;
                }
        
                setCumulativeResults(results);
            }
    },[cumulativeExpenses,cumulativeIncomes,incomes,expenses])

    return(
        <>       
        <Table striped bordered hover>
                <thead>
                    <tr>
                    <th></th>
                    {months.map((month,index) =>(
                        <th key={index}>{month}</th>                
                    ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td>Income</td>
                    {incomes.map((income) => (
                        <td key={income.id}>{income.amount}</td>
                    ))}
                    </tr>
                    <tr>
                    <td>Cumulative Income</td>
                    {cumulativeIncomes.map((income) => (
                        <td key={income.id}>{income.amount}</td>
                    ))}
                    </tr>
                    <tr>
                    <td>Cost</td>
                    {expenses.map((expense) => (
                        <td key={expense.id}>{expense.amount}</td>
                    ))}
                    </tr>
                    <tr>
                    <td> Cumulative Cost</td>
                    {cumulativeExpenses.map((expense) => (
                        <td key={expense.id}>{expense.amount}</td>
                    ))}
                    </tr>
                    <tr>
                    <td>Result</td>
                    {cumulativeResults.map((res,index) => (
                        <td key={index}>{res ? res:0}</td>
                    ))}
                    </tr>
                </tbody>
            </Table>
        
        </>
    )
}