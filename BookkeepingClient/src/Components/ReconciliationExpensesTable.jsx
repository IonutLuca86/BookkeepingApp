import { useEffect, useState } from "react";
import { BASE_URL } from "../config";
import Table from 'react-bootstrap/Table';


export default function ReconciliationExpensesTable({selectedYear,expenses,updateExpensesData}){

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
    
    const handleExpensesCellChange = (e,type, index) => {
        const value = e.target.value;
        const updatedData = { ...expensesTableData };
        if (!updatedData[type.id]) {
            updatedData[type.id] = [];
        }

        updatedData[type.id][index] = value;
        setExpensesTableData(updatedData);
        if(e.type === 'blur'){
            const newExpense = {
                yearId: selectedYear.id,
                monthId: parseInt(index), 
                expenseTypeId: parseInt(type.id),
                amount: value ? parseFloat(value) : 0
            };
            console.log(newExpense)
            updateExpensesData(newExpense);            
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
                <td style={{ width: "70px", textAlign: "center",fontWeight: 'bold' }}>{type.expenseType}</td>
                {Array.from({ length: 12 }).map((_, colIndex) => (
                    <td key={colIndex}>
                        <input
                            type="text"
                            value={expensesTableData[type.id]?.[colIndex+1] || ""}
                            onChange={(e) => handleExpensesCellChange({ key: '', target: e.target }, type, colIndex + 1)}
                            onBlur={(e) => handleExpensesCellChange({ target: e.target, type: 'blur' }, type, colIndex + 1)}
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