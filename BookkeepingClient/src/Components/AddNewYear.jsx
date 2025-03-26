import { useState } from "react";
import { BASE_URL } from "../config";


export default function AddNewYear(props) {

    const currentYear = (new Date()).getFullYear();
    console.log(props)
    const availableYears = Array.from(new Array(20),(val,index) =>{
        const year = currentYear - index;
        return props.existingyears.some(y => y === year) ? null : year;
    }).filter(Boolean);
    const [showConfirmation,setShowConfirmation] = useState(false);
    const [newYear,setNewYear] = useState(null);
    const [showButton,setShowButton] = useState(false);
  

    const handleSelectChange = (event) => {
        const year = parseInt(event.target.value);
        setNewYear(year);
        setShowButton(true); 
    };

    const handleCancel = () => {
        setShowConfirmation(false);
        setNewYear(null);
    }

    const handleConfirm = async () => {
        try{            
            const response = await fetch(`${BASE_URL}/Years`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',                     
                },
                body: JSON.stringify({ year: newYear }),
        });
        if(response.ok)
        {
            alert("Year has been saved successfully!")
            setShowConfirmation(false);
            setShowButton(false);
            props.setSelectedComponent("index");
        }
            
        }
        catch(error){
            console.log("Failed to save new year"+error);
        }
    }

    console.log(newYear)
    console.log(showConfirmation)
    return(
        <div>  
                <label htmlFor="year">Select new year to add: </label>
                <select name="yearSelect" id="year" onChange={handleSelectChange}>
                    <option value="">---</option>
                    {
                        availableYears.map((year,index) => (
                            <option value={year} key={index}>{year}</option>
                        ))
                    }
                </select>
                {showButton && (<button className="btn-outline-secondary" onClick={() => setShowConfirmation(true)}>Add</button>)}
                {showConfirmation && (
                            <div className="">
                                <div className="">
                                    <p>Are you sure you want to add the new year?</p>
                                    <div>
                                    <button onClick={handleConfirm} className="">Yes</button>
                                    <button onClick={handleCancel}>No</button>
                                    </div>
                                   
                                </div>
                            </div>
                        )}    
        </div>
    )
}