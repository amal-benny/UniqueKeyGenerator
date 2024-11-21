import  { useState } from "react";
import Table from "./Table";

const App = () => {
  const [tableData, setTableData] = useState([]);

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
