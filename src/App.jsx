import { useContext } from 'react';
import Navbar from './globals/Navbar'
import Login from './pages/Login/Login'
import { AuthContext } from './context/authContext.jsx';
import { Toaster } from 'react-hot-toast';
import { Navigate, Route, Routes } from 'react-router-dom';
import NotFound from './globals/NotFound';
import Entries from './pages/Entries/Entries';
import AddEntries from './pages/AddEntries/AddEntries';
import StaffAmount from './pages/StaffAmount/StaffAmount';
import EditEntry from './pages/EditEntry/EditEntry';
import WinningAmount from './pages/WinningAmount/WinningAmount';
import Winners from './pages/Winners/Winners';
import AddWinners from './pages/AddWinners/AddWinners';

function App() {
  const { user } = useContext(AuthContext);
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
          <Route path="/add-entries" element={<AddEntries/>} />
          <Route path="/edit-entries" element={<EditEntry/>} />
          <Route path="/staff-amount" element={<StaffAmount/>} />
          <Route path="/winning-amount" element={<WinningAmount/>} />
          <Route path="/winners" element={<Winners/>} />
          <Route path="/add-winners" element={<AddWinners/>} />
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
          <Route path="/add-entries" element={<AddEntries/>} />
          <Route path="/edit-entries" element={<EditEntry/>} />
          <Route path="/staff-amount" element={<StaffAmount/>} />
          <Route path="/winning-amount" element={<WinningAmount/>} />
          <Route path="/winners" element={<Winners/>} />
          <Route path="/add-winners" element={<AddWinners/>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </>
      )
    }
  }


  return (
    <div className='app'>
          <Toaster/>
          {
            user ? <Navbar /> : ""
          }
          {renderRoutes()}
        </div>
  )
}

export default App
