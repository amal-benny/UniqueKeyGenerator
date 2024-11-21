const ToggleButton = ({ isToggled, setIsToggled }) => {
  return (
    <div className="flex justify-center">
      <button
        onClick={setIsToggled}
        className={`px-4 py-2 rounded-md text-white font-serif 
          ${isToggled ? "bg-green-500" : "bg-gray-500"}`}
      >
        {isToggled ? "Active" : "Inactive"}
      </button>
    </div>
  );
};

export default ToggleButton;
