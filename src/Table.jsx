import ToggleButton from "./ToggleButton";

const Table = ({ tableData, handleToggle }) => {
  return (
    <table className="table-auto border-collapse border border-gray-400 w-full">
      <thead>
        <tr className="bg-gray-200">
          <th className="border border-gray-400 px-4 py-2">ID</th>
          <th className="border border-gray-400 px-4 py-2">Client Name</th>
          <th className="border border-gray-400 px-4 py-2">App Name</th>
          <th className="border border-gray-400 px-4 py-2">Generated Key</th>
          <th className="border border-gray-400 px-4 py-2">Created Date and Time</th>
          <th className="border border-gray-400 px-4 py-2">Status</th>
        </tr>
      </thead>
      <tbody>
        {tableData.map((row) => (
          <tr key={row.id} className="text-center">
            <td className="border border-gray-400 px-4 py-2">{row.id}</td>
            <td className="border border-gray-400 px-4 py-2">{row.column1}</td>
            <td className="border border-gray-400 px-4 py-2">{row.column2}</td>
            <td className="border border-gray-400 px-4 py-2">{row.column3}</td>
            <td className="border border-gray-400 px-4 py-2">{row.column4}</td>
            <td className="border border-gray-400 px-4 py-2">
              <ToggleButton
                isToggled={row.isToggled}
                setIsToggled={() => handleToggle(row.id)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
