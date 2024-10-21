import { Input } from '@/components/ui/input'
import React, { useEffect, useState } from 'react'
import axios from "../../config/AxiosConfig"
import moment from 'moment'
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
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const Winners = () => {
    const [staffs] = useState(["other", "Rashid", "Sandosh", "Muneer", "Balan", "SRS deer", "Srs Keralam", "San grp", "Gobi", "kerala + 8pm deer"])
    const [entries, setEntries] = useState([])
    const [currentData,setCurrentData] = useState({})
    const navigate = useNavigate()
    const fetchData = async()=>{
        try {
            const res = await axios.get(process.env.REACT_APP_BASE_URL + "api/main/get-entries" + (currentData.date ? "/" + currentData.date : "") + (currentData.time ? "/"+ currentData.time :"")+(currentData.staff_name ? "/"+ currentData.staff_name :""));
            setEntries(res.data)
        } catch (error) {
            error.response
            ? toast.error("Error: " + error.response.data.message)
            : toast.error("Failed");
        }
    }
    const handleSearch = ()=>{
        if(!currentData.date || !currentData.time ){
            return toast.error("Please enter date and time")
        }
        fetchData();
    }
    useEffect(()=>{
        fetchData();
    },[])

    const handleEditClick = (date,time,staff_name)=>{
        const params = new URLSearchParams({
            date: date,
            time: time,
            staff_name: staff_name,
          });
          navigate(`/edit-entries?${params.toString()}`);
    }

    return (
        <div className='mt-[80px]'>
            <h2 className="text-center scroll-m-20 pb-2 text-4xl font-semibold tracking-tight pt-2 first:mt-0">
                Entries
            </h2>
            {/* Search Form */}
            <div className='flex justify-center items-center  md:items-end gap-3 flex-col md:flex-row px-20 '>
                <div>
                    <label htmlFor="date">Date</label>
                    <Input onChange={(e)=>{setCurrentData({...currentData,date:e.target.value})}} type="date" name="date" />
                </div>
                {/* time */}
                <div>
                    <label htmlFor="time">Time</label>
                    <Select onValueChange={(e)=>{setCurrentData({...currentData,time:e})}} name='time'>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Time" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="01:00">01:00</SelectItem>
                            <SelectItem value="03:00">03:00</SelectItem>
                            <SelectItem value="06:00">06:00</SelectItem>
                            <SelectItem value="08:00">08:00</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {/* staff */}
                {/* <div>
                    <label htmlFor="staff">Staff</label>
                    <Select onValueChange={(e)=>{setCurrentData({...currentData,staff_name:e})}} name='staff'>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Staff" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                staffs.map((staffName, index) => (
                                    <SelectItem value={staffName} key={index}>{staffName}</SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                </div> */}
                {/* search */}
                <Button className={""} onClick={handleSearch}>Search</Button>
            </div>
            {/* table */}
            <div className='px-10 mt-4'>
            <Button className="float-right mb-2" onClick={()=>{navigate("/add-winners")}}>Add +</Button>
                <Table className="border rounded-md">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center border">Date</TableHead>
                            <TableHead className="text-center border">Time</TableHead>
                            <TableHead className="text-center border">Staff Name</TableHead>
                            <TableHead className="text-center border w-40">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            entries.map((entry, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium border" value>{moment(entry.date).utc().format("DD-MM-YYYY")}</TableCell>
                                    <TableCell className="font-medium border">{entry.time}</TableCell>
                                    <TableCell className="font-medium border text-center">{entry.staff_name}</TableCell>
                                    <TableCell className="font-medium border text-right">
                                        <div className='flex flex-row gap-2'>
                                        <Button variant="secondary" onClick={()=>{handleEditClick(entry.date,entry.time,entry.staff_name)}}>Edit</Button><Button variant="destructive">Delete</Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default Winners