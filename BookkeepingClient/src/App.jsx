
import { useEffect, useState } from 'react'
import './App.css'
import Dropdown from 'react-bootstrap/Dropdown';
import { BASE_URL } from "./config";
import AddNewYear from './Components/AddNewYear';
import DisplayBookkeeping from './Components/DisplayBookkeeping';

function App() {

  const [years,setYears] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState("index");
  const [selectedYear,setSelectedYear] = useState();
 

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await fetch(`${BASE_URL}/Years`);
        let yearsList = await response.json();
        setYears(yearsList.sort((a,b) => a.year > b.year? -1: 1) || []); 
      } catch (error) {
        console.error("Error fetching years:", error);
      }
    };

    fetchYears();
  },[]);


  const handleSelect = (option) => {
      setSelectedComponent(option)
  }

  const handleYearClick = (option) => {
      setSelectedYear(option);
      setSelectedComponent("year");      
  }


  const Index = () => {
    return(
      <div className='d-flex flex-column justify-content-between align-items-center mt-5'>
        <h1>Welcome to the ultimate BookKeeping Tool!</h1>
        <h3>Select a year to see and start using it!</h3>
      </div>
    )
  } 

  return (
    <div className='container my-5'>
        <Dropdown data-bs-theme="dark">
        <Dropdown.Toggle id="dropdown-button-dark-example1" variant="secondary">
          Select Year
        </Dropdown.Toggle>

        <Dropdown.Menu>
        {years.length > 0 ? (
          years.map((year) => (
            <Dropdown.Item key={year.id} onClick={() => handleYearClick(year)}>{year.year}</Dropdown.Item>
          ))
        ) : (
          <Dropdown.Item disabled>Loading...</Dropdown.Item>
        )} 
          <Dropdown.Divider />
          <Dropdown.Item onClick={() => handleSelect("add")}>Add new Year</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

        <div className='mt-4'>
          {selectedComponent === "index" && <Index></Index>}
          {selectedComponent === "add" && <AddNewYear existingyears = {years.map(y=>y.year)}                
                  setSelectedComponent = {setSelectedComponent}/>}
          {selectedComponent === "year" && <DisplayBookkeeping year = {selectedYear}/>}
        </div>

    
    </div>
  )
}

export default App
