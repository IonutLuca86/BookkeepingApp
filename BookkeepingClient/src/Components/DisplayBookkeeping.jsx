import { useEffect, useState } from "react";
import { BASE_URL } from "../config";
import Table from 'react-bootstrap/Table';
import CumulativeTable from "./CumulativeTable";
import ReconciliationIncomeTable from "./ReconciliationIncomeTable";
import ReconciliationExpensesTable from "./ReconciliationExpensesTable";
import Button from 'react-bootstrap/Button';
import debounce from 'lodash/debounce';

export default function DisplayBookkeeping({year}) {

    const selectedYear = year;
    const [incomes,setIncomes] = useState([]);
    const [expenses,setExpenses] = useState([]);
    const [updateTrigger,setUpdateTrigger] = useState(0);
    const [updatedIncomeData,setUpdatedIncomeData] = useState([]);
    const [updatedExpensesData,setUpdatedExpensesData] = useState([]);
    const [reconResults,setReconResults] = useState([]);  
    const [finalResults,setFinalResults] = useState([]);
    const [finalCumulativeResults,setFinalCumulativeResults] = useState([]);
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const [cumulativeResults,setCumulativeResults] = useState([]);  

    
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

        fetchIncomes(selectedYear);
        fetchExpenses(selectedYear);
    
    },[selectedYear,updateTrigger]);

    const debouncedUpdateIncomeData = debounce((newIncome) => {
        setUpdatedIncomeData((prevData) => {
            if (!Array.isArray(prevData)) {
                console.error("Previous state is not an array. Resetting to a new array.");
                return [newIncome];             }
           
            const existingIndex = prevData.findIndex(
                (entry) =>
                    entry.incomeTypeId === newIncome.incomeTypeId &&
                    entry.monthId === newIncome.monthId
            );
    
            if (existingIndex > -1) {                
                const updatedArray = [...prevData];
                updatedArray[existingIndex] = newIncome;
                return updatedArray;
            } else {               
                return [...prevData, newIncome];
            }
        });
    },1500);
   
    const debouncedUpdateExpensesData = debounce((newExpense) => {
        setUpdatedExpensesData((prevData) => {
            if (!Array.isArray(prevData)) {
                console.error("Previous state is not an array. Resetting to a new array.");
                return [newExpense]; 
            }   
            
            const existingIndex = prevData.findIndex(
                (entry) =>
                    entry.expenseTypeId === newExpense.incomeTypeId &&
                    entry.monthId === newExpense.monthId
            );
    
            if (existingIndex > -1) {               
                const updatedArray = [...prevData];
                updatedArray[existingIndex] = newExpense;
                return updatedArray;
            } else {                
                return [...prevData, newExpense];
            }
        });
    },1500);

    useEffect(() => {
        if (updatedIncomeData.length > 0 || updatedExpensesData.length > 0) {         
            setReconResults([]);
        }
        const reconResultsArray = Array.from({ length: 12 }).map((_, monthIndex) => {         
            const updatedIncomesForMonth = updatedIncomeData?.filter((income) => income.monthId === monthIndex + 1) || [];
            const updatedExpensesForMonth = updatedExpensesData?.filter((expense) => expense.monthId === monthIndex + 1) || [];

            const unchangedIncomes = updatedIncomesForMonth.length > 0 ? incomes.filter(income => {
                const updated = updatedIncomesForMonth.find(updatedIncome => 
                    updatedIncome.monthId === income.monthId && 
                    updatedIncome.incomeTypeId === income.incomeTypeId
                );
                return updated && updated.amount === income.amount;
            }) : incomes.filter((income) => income.monthId === monthIndex +1);

            const unchangedExpenses = updatedExpensesForMonth.length > 0 ? expenses.filter(expense => {
                const updated = updatedExpensesForMonth.find(updatedExpense => 
                    updatedExpense.monthId === expense.monthId && 
                    updatedExpense.expenseTypeId === expense.incomeTypeId
                );

                return updated && updated.amount === expense.amount;
            }) : expenses.filter((expense) => expense.monthId === monthIndex + 1);
            

            const incomeAmount = updatedIncomesForMonth.reduce((sum, income) => sum + income.amount, 0) +
                        unchangedIncomes.reduce((sum,income) => sum + income.amount,0) ;
            const expenseAmount =  updatedExpensesForMonth.reduce((sum, expense) => sum + expense.amount, 0) +
                        unchangedExpenses.reduce((sum,expense)=> sum + expense.amount,0);

            const difference = incomeAmount - expenseAmount;
  
           return {
                monthId: monthIndex + 1,
                amount: difference};
        });  
      
        setReconResults(reconResultsArray);

        const finalResultsArray = Array.from({length: 12}).map((_,monthIndex) => {    
            const existingIncomes = cumulativeResults[monthIndex] || 0;
            
            let result = 0;
            if(updatedIncomeData.length > 0 || updatedExpensesData.length > 0){
            const reconValue =  reconResultsArray.find((res) => res.monthId === monthIndex +1) || {amount: 0};
            result = reconValue.amount + existingIncomes;
            }
            else{
                result = existingIncomes;
            }
            return {
                monthId: monthIndex +1,
                amount: result
            }
        });
        setFinalResults(finalResultsArray);
 
        const cumulativeFinalResults = finalResultsArray.reduce((prev, current) => {
            const previousTotal = prev.length > 0 ? prev[prev.length - 1].amount : 0;
            prev.push({
                monthId: current.monthId,
                amount: previousTotal + current.amount
            });
            return prev;
        }, []);
        setFinalCumulativeResults(cumulativeFinalResults);

    }, [selectedYear,expenses, incomes, updatedIncomeData, updatedExpensesData,cumulativeResults]);
    
    const handleSaveClick = () => {
        updatedIncomeData.map((income) => {
            const existingIncome = incomes.find((res) => res.monthId === income.monthId && res.incomeTypeId === income.incomeTypeId);
            if(existingIncome){
                saveData(income,'Income','PUT');
            }
            else{
                saveData(income,'Income','POST');
            }
        });
        updatedExpensesData.map((expense) => {
            const existingExpense = expenses.find((res) => res.monthId === expense.monthId && res.expenseTypeId === expense.expenseTypeId);
            if(existingExpense){
                saveData(expense,'Expenses','PUT');
            }
            else{
                saveData(expense,'Expenses','POST');
            }
        });
        setUpdatedIncomeData([]);
        setUpdatedExpensesData([]);
        setUpdateTrigger((prev) => prev+1);
    }

    const saveData = async (item,type,method) => {
        try{  
             const response = await fetch(`${BASE_URL}/${type}`, {
                    method: `${method}`,
                    headers: {
                      'Content-Type': 'application/json',                     
                    },
                    body: JSON.stringify(item),
            });
            if(response.ok)
            {
                console.log(`New ${type} has been saved successfully!`)
                setUpdateTrigger((prev) => prev+1);
            }             
            }
            catch(error){
                console.log("Failed to save new income "+error);
            }   
    };


    return(
        <div className="d-flex flex-column justify-content-between align-items-center my-5">
            <h2 className="pb-5">Bookkeeping of the year {selectedYear.year}:</h2>
            <CumulativeTable  
                    selectedYear={selectedYear}                   
                    setCumulativeResults = {setCumulativeResults}
                />
            <div>

            <h2 className="text-center mt-5">Reconciliation year {selectedYear.year}</h2>
            <div className="d-flex flex-column justify-content-between align-items-start">
                    <p className="lh-1" style={{fontSize: 'small',color: 'red'}}>*To apply changes made in a cell click outside it when you are finished typing!</p>
                    <p className="lh-1" style={{fontSize: 'small',color: 'red'}}>**Don't forget to save the new data from the reconciliation table if you want to be persistent!</p>
                </div>
            <Table striped bordered hover>
                    <thead>
                        <tr>
                         <th></th>       
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <td style={{background: '#66CDAA', fontWeight: 'bold'}}>Income</td>
                        <td>
                        <ReconciliationIncomeTable 
                                    selectedYear = {selectedYear}
                                    incomes = {incomes} 
                                    updateIncomeData={debouncedUpdateIncomeData} />
                        </td>
                  
                             </tr>
                             <tr>
                        <td style={{background: '#FFB6C1', fontWeight: 'bold'}}>Expenses</td>
                        <td> <ReconciliationExpensesTable 
                                    selectedYear = {selectedYear}                                 
                                    expenses = {expenses}
                                    updateExpensesData = {debouncedUpdateExpensesData}/>                       
                        </td>
                        </tr>
                                               
                    </tbody>
                </Table> 

                <div className="d-flex flex-row justify-content-between align-items-center my-2">
                    <h4>Reconciliation Table Results</h4>
                    {updatedIncomeData.length > 0 || updatedExpensesData.length > 0 ? (
                        <Button variant="outline-success mb-3" onClick={()=>handleSaveClick()}>Save Reconciliation Data</Button>
                    ):(<></>)}
                      
                    </div> 
                
                <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th style={{background: '#ADD8E6'}}></th>
                            {months.map((month,index) =>(
                            <th key={index} style={{textAlign: "center",background: '#ADD8E6' }}>{month}</th>                
                        ))}        
                        </tr>
                    </thead>
                    <tbody>
                    <tr>         
                        <td style={{ width: "135px", textAlign: "center",fontWeight: 'bold' }}>Reconciliation Result</td>                     
                        
                {reconResults.map((res, index) => (
                    <td key={index} style={{ width: "70px", textAlign: "center" }}>
                        {res.amount}
                    </td>
                ))}
           
                        </tr>
                        <tr>                       
                        <td style={{ width: "135px", textAlign: "center",fontWeight: 'bold' }}>Final Result</td> 
                        {finalResults.map((res, index) => (
                    <td key={index} style={{ width: "70px", textAlign: "center" }}>
                        {res.amount}
                    </td>
                ))}                       
                        </tr>
                        <tr>                       
                        <td style={{ width: "135px", textAlign: "center",fontWeight: 'bold' }}>Cumulative Final Result</td>                        
                        {finalCumulativeResults.map((res, index) => (
                            <td key={index} style={{ width: "70px", textAlign: "center" }}>
                                {res.amount}
                            </td>
                        ))}
                        </tr>
                        </tbody> 
                        </Table>   
            </div>
    
        </div>
    )
}