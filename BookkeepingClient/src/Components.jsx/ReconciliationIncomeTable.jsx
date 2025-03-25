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
    const originalEntry = updatedData[type.id][index];
    updatedData[type.id][index] = value;
    setIncomeTableData(updatedData);
    const newIncome = {
        yearId: selectedYear.id,
        monthId: parseInt(index), 
        incomeTypeId: parseInt(type.id),
        amount: parseFloat(value)
    };
    updateIncomeData(newIncome);
    // if(e.key === "Enter"){
    //     if(originalEntry != value)
    //         saveIncomeData(type.id,index,selectedYear,value,'PUT');
    //     else
    //         saveIncomeData(type.id,index,selectedYear,value,'POST')
    // }
    
};


const saveIncomeData = async (typeId,monthId,year,amount,method) => {
        try{  
                const newIncome = {
                    yearId: parseInt(year.id),
                    monthId: parseInt(monthId),
                    incomeTypeId: parseInt(typeId),
                    amount: parseFloat(amount)
                }  
                console.log(newIncome)          
                const response = await fetch(`${BASE_URL}/Income`, {
                    method: `${method}`,
                    headers: {
                      'Content-Type': 'application/json',                     
                    },
                    body: JSON.stringify(newIncome),
            });
            if(response.ok)
            {
                console.log("New income has been saved successfully!")
                // setUpdateTrigger((prev) => prev+1);
            }
                
            }
            catch(error){
                console.log("Failed to save new income "+error);
            }   
};



    return(
        <>

                     <Table striped="columns" bordered hover>
                            <thead>  
                                <tr>
                                <th></th>
                            {months.map((month,index) =>(
                            <th key={index} style={{textAlign: "center" }}>{month}</th>                
                        ))} 
                                    </tr> 
                                       
                            </thead>
                            <tbody>
                              
                                {incomeTypes.length > 0 && incomeTypes.map((type, rowIndex) => (
                        <tr key={rowIndex}>
                            <td style={{ width: "80px", textAlign: "center" }}>{type.incomeType}</td>
                            {Array.from({ length: 12 }).map((_, colIndex) => (
                                <td key={colIndex}>
                                    <input
                                        type="text"
                                        value={incomeTableData[type.id]?.[colIndex+1] || ""}
                                        onChange={(e) => handleIncomeCellChange({ key: '', target: e.target }, type, colIndex + 1)}
                                        onKeyDown={(e) => handleIncomeCellChange(e, type, colIndex + 1)}
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