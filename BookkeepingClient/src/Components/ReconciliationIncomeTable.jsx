import { useEffect, useState } from "react";
import { BASE_URL } from "../config";
import Table from 'react-bootstrap/Table';

export default function ReconciliationIncomeTable({selectedYear,incomes,updateIncomeData}){

    const [incomeTypes,setIncomeTypes] = useState([]);
    const [incomeTableData, setIncomeTableData] = useState({});
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    useEffect(() => {
        if(!selectedYear) return;
        const fetchIncomeTypes = async () => {
            try{
                let response = await fetch(`${BASE_URL}/Types/incomes`);
                let incomes = await response.json();
                setIncomeTypes(incomes);
            }catch(error){
                console.log("Failed to load incomes "+error)
            }
        }

        fetchIncomeTypes();
    },[selectedYear]);


    useEffect(() => {
        const initialData = {};
        incomes.forEach((income) => {
            if (!initialData[income.incomeTypeId]) {
                initialData[income.incomeTypeId] = Array(12).fill("");;
            }
            initialData[income.incomeTypeId][income.monthId] = (income.amount);
        });
        setIncomeTableData(initialData);
    }, [incomes]);


    const handleIncomeCellChange = (e,type, index) => {
        const value = e.target.value;
        const updatedData = { ...incomeTableData };
        if (!updatedData[type.id]) {
            updatedData[type.id] = [];
        }

        updatedData[type.id][index] = value;
        setIncomeTableData(updatedData);
        
        if(e.type === 'blur'){
            const newIncome = {
                yearId: selectedYear.id,
                monthId: parseInt(index), 
                incomeTypeId: parseInt(type.id),
                amount: value ? parseFloat(value) : 0
            };
            updateIncomeData(newIncome);
        }
        
    };

    return(
        <>
         <Table striped="columns" bordered hover>
                <thead>  
                    <tr>
                        <th style={{background: '#ADD8E6' }}></th>
                        {months.map((month,index) =>(
                        <th key={index} style={{textAlign: "center",background: '#ADD8E6' }}>{month}</th>                
                        ))} 
                    </tr>                             
                </thead>
                <tbody>                    
                    {incomeTypes.length > 0 && incomeTypes.map((type, rowIndex) => (
                    <tr key={rowIndex}>
                        <td style={{ width: "80px", textAlign: "center",fontWeight: 'bold' }}>{type.incomeType}</td>
                        {Array.from({ length: 12 }).map((_, colIndex) => (
                            <td key={colIndex}>
                                <input
                                    type="text"
                                    value={incomeTableData[type.id]?.[colIndex+1] || ""}
                                    onChange={(e) => handleIncomeCellChange({ key: '', target: e.target }, type, colIndex + 1)}
                                    onBlur={(e) => handleIncomeCellChange({ target: e.target, type: 'blur' }, type, colIndex + 1)}
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