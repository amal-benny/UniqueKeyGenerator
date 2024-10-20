import { Input } from '@/components/ui/input'
import React, { useContext, useEffect, useState } from 'react'
import axios from "../../config/AxiosConfig"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { AuthContext } from '@/context/authContext'

const StaffAmount = () => {
    const [staffs,setStaff] = useState([])
    const {user} = useContext(AuthContext);
    
    const [currentData,setCurrentData] = useState({
        _id:""
    })
    
    const fetchData = async()=>{
        try {
            const res = await axios.get(process.env.REACT_APP_BASE_URL + "api/main/get-staff");
            setStaff(res.data.staffs)
        } catch (error) {
            
            error.response ? toast.error( "Error : " + error.response.data.message) : toast.error("failed")
        }
    }
    useEffect(()=>{
        fetchData()
    },[])

    const handleSave = async()=>{
        try {
            const res = await axios.post(process.env.REACT_APP_BASE_URL+'api/main/edit-staff', currentData);
            const updatedStaffs = staffs.map((data) => {
                if (data._id === currentData._id) {
                    console.log(currentData)
                    return {
                        ...data,
                        single: currentData.single,
                        double: currentData.double,
                        lsk: currentData.lsk,
                        boxkk: currentData.boxkk
                    };
                }
                return data;
            });
            setStaff(updatedStaffs)
            toast.success("Success")
        } catch (error) {
            error.response ? toast.error( "Error : " + error.response.data.message) : toast.error("failed")
        }
    }

    return (
        <div className='mt-[80px]'>
            <h2 className="text-center scroll-m-20 pb-2 text-4xl font-semibold tracking-tight pt-2 first:mt-0">
                Staff Amount
            </h2>
            {/* Search Form */}
            {
            user.username === "admin" ? 
            <div className='flex justify-center items-center  md:items-end gap-3 flex-col md:flex-row px-20 '>
                {/* staff */}
                <div>
                    <label htmlFor="staff">Staff</label>
                    <Select onValueChange={(e)=>{setCurrentData({...currentData,_id:e})}} name='staff'>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Staff" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                staffs.map((staff) => (
                                    <SelectItem value={staff._id} key={staff._id}>{staff.staff_name}</SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label htmlFor="single">Single</label>
                    <Input type="number" onChange={(e)=>{setCurrentData({...currentData,single:e.target.value})}} className="" name="single" />
                </div>
                <div>
                    <label htmlFor="double">Double</label>
                    <Input type="number" onChange={(e)=>{setCurrentData({...currentData,double:e.target.value})}} className="" name="double" />
                </div>
                <div>
                    <label htmlFor="lsk" >LSK</label>
                    <Input type="number" onChange={(e)=>{setCurrentData({...currentData,lsk:e.target.value})}} className="" name="lsk" />
                </div>
                <div>
                    <label htmlFor="boxkk" >BOXKK</label>
                    <Input type="number" onChange={(e)=>{setCurrentData({...currentData,boxkk:e.target.value})}} className="" name="boxkk" />
                </div>
                {/* search */}
                <Button onClick={handleSave}>Save</Button>
            </div>
            : ""    
        }
            {/* table */}
            <div className='px-10 mt-4'>
                <Table className="border rounded-md">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center border">S No</TableHead>
                            <TableHead className="text-center border">Staff Name</TableHead>
                            <TableHead className="text-center border">Single</TableHead>
                            <TableHead className="text-center border">Double</TableHead>
                            <TableHead className="text-center border">LSK</TableHead>
                            <TableHead className="text-center border">BOXKK</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            staffs.map((staff, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium border text-center" value>{index+1}</TableCell>
                                    <TableCell className="font-medium border text-center">{staff.staff_name}</TableCell>
                                    <TableCell className="font-medium border text-center">{staff.single.$numberDecimal ? staff.single.$numberDecimal:staff.single}</TableCell>
                                    <TableCell className="font-medium border text-center">{staff.double.$numberDecimal ? staff.double.$numberDecimal:staff.double}</TableCell>
                                    <TableCell className="font-medium border text-center">{staff.lsk.$numberDecimal ? staff.lsk.$numberDecimal:staff.lsk}</TableCell>
                                    <TableCell className="font-medium border text-center">{staff.boxkk.$numberDecimal ? staff.boxkk.$numberDecimal:staff.boxkk}</TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default StaffAmount