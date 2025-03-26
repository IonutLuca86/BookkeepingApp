
import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { BASE_URL } from '../config';

export default function CumulativeTable({selectedYear,setCumulativeResults}){

    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const [incomeData,setIncomeData] = useState([]);
    const [expensesData,setExpensesData] = useState([]);
    const [cumulativeIncomesData,setCumulativeIncomesData] = useState([]);
    const [cumulativeExpensesData,setCumulativeExpensesData] = useState([]);
    const [cumulativeResults,setCumResults] = useState([]);

    useEffect(() => {

        const fetchIncomes = async (selectedYear) => {
                    try{
                        let response = await fetch(`${BASE_URL}/Income/dummy/${selectedYear.id}`);
                        let incomes = await response.json();
                        const incomesArray = Array.from({ length: 12 }).map((_, monthIndex) => {
                            const existingIncomes = incomes.filter((res) => res.monthId === monthIndex + 1);
                            const total =  existingIncomes.reduce((sum,income) => sum + income.amount, 0);
                            return total;
                        });
                        setIncomeData(incomesArray);                                  
                    }catch(error){
                        console.log("Failed to load incomes"+error)
                    }
                }
                const fetchExpenses = async (selectedYear) => {
                    try{
                        let response = await fetch(`${BASE_URL}/Expenses/dummy/${selectedYear.id}`);
                        if(response.ok)
                        {
                            let expenses = await response.json();
                            const expensesArray = Array.from({ length: 12 }).map((_, monthIndex) => {
                                const existingExpenses = expenses.filter((res) => res.monthId === monthIndex + 1);
                                const total =  existingExpenses.reduce((sum,expense) => sum + expense.amount, 0);
                                return total;
                            });
                            setExpensesData(expensesArray);                           
                        }
                     
                    }catch(error){
                        console.log("Failed to load expenses"+error)
                    }
                }

        const fetchCumulativeExpenses = async (selectedYear) => {
            try{
                let response = await fetch(`${BASE_URL}/Expenses/cumulative/${selectedYear.id}`);
                let expenses = await response.json();
                const cumulativeExpensesArray = Array.from({ length: 12 }).map((_, monthIndex) => {
                    const existingExpenses = expenses.find((res) => res.monthId === monthIndex + 1);
                    
                    return existingExpenses ? existingExpenses.amount : 0;
                });
                setCumulativeExpensesData(cumulativeExpensesArray);            
            }catch(error){
                console.log("Failed to load cumulative expenses "+error)
            }
        }
        const fetchCumulativeIncomes = async (selectedYear) => {
            try{
                let response = await fetch(`${BASE_URL}/Income/cumulative/${selectedYear.id}`);
                let incomes = await response.json();
                const cumulativeIncomesArray = Array.from({ length: 12 }).map((_, monthIndex) => {
                    const existingIncomes = incomes.find((res) => res.monthId === monthIndex + 1);
                    
                    return existingIncomes ? existingIncomes.amount : 0;
                });
                setCumulativeIncomesData(cumulativeIncomesArray);                
            }catch(error){
                console.log("Failed to load cumulative incomes "+error)
            }
        }
          
        fetchIncomes(selectedYear);
        fetchExpenses(selectedYear);
        fetchCumulativeIncomes(selectedYear);
        fetchCumulativeExpenses(selectedYear);   
    },[selectedYear]);

    useEffect(() => {
        const calculateCumulativeResults = () => {
            if (!incomeData || !expensesData) return;
    
            const results = new Array(12).fill(0);
    
            for (let index = 0; index < 12; index++) {
                const incomeAmount = incomeData[index] || 0; 
                const expenseAmount = expensesData[index] || 0;
    
                results[index] = incomeAmount - expenseAmount;
            }
    
            setCumResults(results);
            setCumulativeResults(results);
        };
    
        calculateCumulativeResults();
    }, [incomeData, expensesData]);   


    
    return(
        <>       
        <Table striped bordered hover>
                <thead>
                    <tr >
                    <th style={{background: '#ADD8E6'}}></th>
                    {months.map((month,index) =>(
                        <th key={index} style={{background: '#ADD8E6'}}>{month}</th>                
                    ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td style={{fontWeight: 'bold'}}>Income</td>
                    {incomeData.map((income,index) => (
                        <td key={index}>{income}</td>
                    ))}
                    </tr>
                    <tr>
                    <td style={{fontWeight: 'bold'}}>Cumulative Income</td>
                    {cumulativeIncomesData.map((income,index) => (
                        <td key={index}>{income}</td>
                    ))}
                    </tr>
                    <tr>
                    <td style={{fontWeight: 'bold'}}>Cost</td>
                    {expensesData.map((expense,index) => (
                        <td key={index}>{expense}</td>
                    ))}
                    </tr>
                    <tr>
                    <td style={{fontWeight: 'bold'}}> Cumulative Cost</td>
                    {cumulativeExpensesData.map((expense,index) => (
                        <td key={index}>{expense}</td>
                    ))}
                    </tr>
                    <tr >
                    <td style={{background: '#ADD8E6',fontWeight: 'bold'}}>Result</td>
                    {cumulativeResults.map((res,index) => (
                        <td key={index} style={{background: '#ADD8E6'}}>{res ? res:0}</td>
                    ))}
                    </tr>
                </tbody>
            </Table>
        
        </>
    )
}