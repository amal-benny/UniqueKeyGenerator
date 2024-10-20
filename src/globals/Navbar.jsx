import { Button } from '@/components/ui/button';
import { AuthContext } from '@/context/authContext';
import React, { useContext, useState } from 'react';
import { AiOutlineCloseSquare } from "react-icons/ai";
import { RxHamburgerMenu } from "react-icons/rx";
import { useNavigate } from 'react-router-dom';
const Navbar = () => {
    let Links = [
        { name: "Entries", link: "/" },
        { name: "Winners", link: "/winners" },
        { name: "Winning Amount", link: "/winning_amount" },
        { name: "Staff Amount", link: "/staff_amount" },
        { name: "Report", link: "/report" },
        { name: "Daily Report", link: "/daily_report" },
    ];
    const navigate = useNavigate();
    const { logout, user } = useContext(AuthContext)
    let [open, setOpen] = useState(false);
    return (
        <div className='shadow-md w-full fixed top-0 left-0'>
            <div className='md:flex items-center justify-between bg-white py-4 md:px-10 px-7'>
                {/* logo section */}
                <div className='font-bold text-2xl cursor-pointer flex items-center gap-1'>
                    <span className='text-pink-600' onClick={()=>{navigate("/")}}>Wify</span>
                </div>
                {/* Menu icon */}
                <div onClick={() => setOpen(!open)} className='absolute right-8 top-6 cursor-pointer md:hidden w-7 h-7'>
                    {
                        open ? <AiOutlineCloseSquare size={30} /> : <RxHamburgerMenu size={30} />
                    }
                </div>
                {/* linke items */}
                <ul className={`md:flex md:items-center md:pb-0 pb-12 absolute md:static bg-white md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 gap-5 ease-in ${open ? 'top-12' : 'top-[-490px]'}`}>
                    {
                        Links.map((link) => (
                            <li className=' md:my-0 my-7 font-semibold cursor-pointer'>
                                <a onClick={()=>{navigate(link.link)}} className='text-gray-800 hover:text-pink-600 duration-500'>{link.name}</a>
                            </li>))
                    }
                    <li>
                        {
                            user ?
                                <Button onClick={() => { logout();navigate("/") }}>Logout</Button>
                                : ""
                        }
                    </li>
                </ul>
                {/* button */}
            </div>
        </div>
    );
};

export default Navbar;