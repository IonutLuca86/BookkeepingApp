
import { useEffect, useState } from 'react'
import './App.css'
import Dropdown from 'react-bootstrap/Dropdown';
import { BASE_URL } from "./config";
import AddNewYear from './Components.jsx/AddNewYear';
import DisplayBookkeeping from './Components.jsx/DisplayBookkeeping';

function App() {

  const [years,setYears] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState("index");
  const [selectedYear,setSelectedYear] = useState();
 

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await fetch(`${BASE_URL}/Years`);
        let yearsList = await response.json();
        console.log(yearsList)
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
      <div>
        <h1>Index Page</h1>
      </div>
    )
  } 

  return (
    <div className='container'>
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

        <div>
          {selectedComponent === "index" && <Index></Index>}
          {selectedComponent === "add" && <AddNewYear existingyears = {years.map(y=>y.year)}                
                  setSelectedComponent = {setSelectedComponent}/>}
          {selectedComponent === "year" && <DisplayBookkeeping year = {selectedYear} />}
        </div>

    
    </div>
  )
}

export default App
