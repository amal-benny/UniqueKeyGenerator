<<<<<<< HEAD
import  { useState } from "react";
import Table from "./Table";

const App = () => {
  const [tableData, setTableData] = useState([]);
=======
import { useContext, useEffect } from 'react';
import Navbar from './globals/Navbar'
import Login from './pages/Login/Login'
import { AuthContext } from './context/authContext.jsx';
import { Toaster } from 'react-hot-toast';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import NotFound from './globals/NotFound';
import Entries from './pages/Entries/Entries';
import AddEntries from './pages/AddEntries/AddEntries';
import StaffAmount from './pages/StaffAmount/StaffAmount';
import EditEntry from './pages/EditEntry/EditEntry';
import WinningAmount from './pages/WinningAmount/WinningAmount';
import Winners from './pages/Winners/Winners';
import AddWinners from './pages/AddWinners/AddWinners';
import Report from './pages/Report/Report';
import DailyReport from './pages/DailyReport/DailyReport';
import EditWinners from './pages/EditWinners/EditWinners';

function App() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate()
  const renderRoutes = () => {
    if (!user) {
      return (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      )
    }
    else if (user.username == "manager") {
      // manager routes
      return(
        <>
        <Routes>
          <Route path="/" element={<Entries/>} />
          <Route path="/login" element={<Navigate to="/"/>} />
          <Route path="/add-entries" element={<AddEntries/>} />
          <Route path="/edit-entries" element={<EditEntry/>} />
          <Route path="/staff-amount" element={<StaffAmount/>} />
          <Route path="/winning-amount" element={<WinningAmount/>} />
          <Route path="/winners" element={<Winners/>} />
          <Route path="/add-winners" element={<AddWinners/>} />
          <Route path="/edit-winners" element={<EditWinners/>} />
          <Route path="/daily-report" element={<DailyReport/>} />
          <Route path="/report" element={<Report/>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </>
      )
    }
    else {
      //admin routes
      return(
        <>
        <Routes>
          <Route path="/" element={<Entries/>} />
          <Route path="/login" element={<Navigate to="/"/>} />
          <Route path="/add-entries" element={<AddEntries/>} />
          <Route path="/edit-entries" element={<EditEntry/>} />
          <Route path="/staff-amount" element={<StaffAmount/>} />
          <Route path="/winning-amount" element={<WinningAmount/>} />
          <Route path="/winners" element={<Winners/>} />
          <Route path="/add-winners" element={<AddWinners/>} />
          <Route path="/edit-winners" element={<EditWinners/>} />
          <Route path="/daily-report" element={<DailyReport/>} />
          <Route path="/report" element={<Report/>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </>
      )
    }
  }
>>>>>>> 8abe4b6cf3878ff322ef15efefd5dea7d8bf6af6

  const generateUniqueKey = () => {
    const client = document.getElementById("clientName").value;
    const app = document.getElementById("appName").value;

    //date and time
    const now = new Date();
    const gbdate = new Date().toLocaleDateString("en-GB");
    const usTime = now.toLocaleTimeString("en-US");

    if (client && app) {
      const key = crypto.randomUUID();
      
      // New Row
      const newRow = {
        id: tableData.length + 1,
        column1: client,
        column2: app,
        column3: `${key}`,
        column4: `${gbdate} (${usTime})`,
        isToggled: false, 
      };

      setTableData((prevData) => [...prevData, newRow]);
    } else {
      alert("Please enter valid credentials to generate a key.");
    }
  };

  
  const handleToggle = (id) => {
    setTableData((prevData) =>
      prevData.map((row) =>
        row.id === id ? { ...row, isToggled: !row.isToggled } : row
      )
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Unique Key Generator</h1>

     
      <div className="flex gap-4 justify-center mb-4">
        <div>
          <label htmlFor="clientName" className="block mb-1">Client Name:</label>
          <input
            type="text"
            id="clientName"
            className="border border-gray-400 rounded px-2 py-1"
          />
        </div>
        <div>
          <label htmlFor="appName" className="block mb-1">App Name:</label>
          <input
            type="text"
            id="appName"
            className="border border-gray-400 rounded px-2 py-1"
          />
        </div>
        <button
          onClick={generateUniqueKey}
          className="bg-blue-500 text-white px-4 py-2 rounded self-end mt-2"
        >
          Generate Key
        </button>
      </div>

      <Table tableData={tableData} handleToggle={handleToggle} />
    </div>
  );
};

export default App;
