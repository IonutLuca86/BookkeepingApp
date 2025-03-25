import { useEffect, useState } from "react";
import { BASE_URL } from "../config";
import Table from 'react-bootstrap/Table';

export default function ReconciliationExpensesTable({expenses,selectedYear,updateExpensesData}){

    const [expensesTypes,setExpensesTypes] = useState([]);
    const [expensesTableData,setExpensesTableData] = useState({});

    useEffect(() => {
        if(!selectedYear) return;

        const fetchExpensesTypes = async () => {
            try{
                let response = await fetch(`${BASE_URL}/Types/expenses`);
                let expenses = await response.json();
                setExpensesTypes(expenses);
            }catch(error){
                console.log("Failed to load expenses "+error)
            }
        }

        fetchExpensesTypes();
   
    },[selectedYear]);
    
    useEffect(() => {
        const initialData = {};
        expenses.forEach((expense) => {
            if (!initialData[expense.expenseTypeId]) {
                initialData[expense.expenseTypeId] = Array(12).fill("");;
            }
            initialData[expense.expenseTypeId][expense.monthId] = (expense.amount);
        });
        setExpensesTableData(initialData);
    }, [expenses]);
    
    const handleExpensesCellChange = (value,type, index) => {
        // const value = e.target.value;
        const updatedData = { ...expensesTableData };
        if (!updatedData[type.id]) {
            updatedData[type.id] = [];
        }
        const originalEntry = updatedData[type.id][index];
        updatedData[type.id][index] = value;
        setExpensesTableData(updatedData);
        const newExpense = {
            yearId: parseInt(selectedYear.id),
            monthId: parseInt(index),
            incomeTypeId: parseInt(type.id),
            amount: parseFloat(value)
        }  
        updateExpensesData(newExpense);
        // if(e.key === "Enter"){
        //     if(originalEntry != value)
        //         saveExpensesData(type.id,index,selectedYear,value,'PUT');
        //     else
        //         saveExpensesData(type.id,index,selectedYear,value,'POST')
        // }
        
    };

    const saveExpensesData = async (typeId,monthId,year,amount,method) => {
        try{  
                const newExpense = {
                    yearId: parseInt(year.id),
                    monthId: parseInt(monthId),
                    incomeTypeId: parseInt(typeId),
                    amount: parseFloat(amount)
                }  
                console.log(newExpense)          
                const response = await fetch(`${BASE_URL}/Expenses`, {
                    method: `${method}`,
                    headers: {
                      'Content-Type': 'application/json',                     
                    },
                    body: JSON.stringify(newExpense),
            });
            if(response.ok)
            {
                console.log("New expense has been saved successfully!")
                // setUpdateTrigger((prev) => prev+1);
            }
                
            }
            catch(error){
                console.log("Failed to save new expense "+error);
            }   
    };

    return(
        <>
        <Table striped="columns" bordered hover>
                            <thead>                           
                                                     
                            </thead>
                            <tbody>
                              
                                {expensesTypes.length > 0 && expensesTypes.map((type, rowIndex) => (
                        <tr key={rowIndex}>
                            <td style={{ width: "70px", textAlign: "center" }}>{type.expenseType}</td>
                            {Array.from({ length: 12 }).map((_, colIndex) => (
                                <td key={colIndex}>
                                    <input
                                        type="text"
                                        value={expensesTableData[type.id]?.[colIndex+1] || ""}
                                        onChange={(e) => handleExpensesCellChange(e.target.value, type, colIndex + 1)}
                                        // onKeyDown={(e) => handleExpensesCellChange(e, type, colIndex + 1)}
                                        style={{ width: "70px", textAlign: "center" }}
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                               
                                
                </tbody>
        </Table>
        </>
    )
}