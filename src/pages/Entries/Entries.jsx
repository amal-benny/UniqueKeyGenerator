import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
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

const Entries = () => {
    const [staffs] = useState(["other", "Rashid", "Sandosh", "Muneer", "Balan", "SRS deer", "Srs Keralam", "San grp", "Gobi", "kerala + 8pm deer"])
    const [entries, setEntries] = useState([
        {
            id:"1",
            date: "02-09-2002",
            time: "09:00",
            staff_name: "Rasheed",
        },
        {
            id:"2",
            date: "04-09-2002",
            time: "01:00",
            staff_name: "Muneer",
        },
        {
            id:"3",
            date: "07-09-2002",
            time: "08:00",
            staff_name: "Balan",
        },
        {
            id:"4",
            date: "08-09-2002",
            time: "01:00",
            staff_name: "Sns deer",
        }

    ])

    const navigate = useNavigate()

    return (
        <div className='mt-[80px]'>
            <h2 className="text-center scroll-m-20 pb-2 text-4xl font-semibold tracking-tight pt-2 first:mt-0">
                Entries
            </h2>
            {/* Search Form */}
            <div className='flex justify-center items-center  md:items-end gap-3 flex-col md:flex-row px-20 '>
                <div>
                    <label htmlFor="date">Date</label>
                    <Input type="date" name="date" />
                </div>
                {/* time */}
                <div>
                    <label htmlFor="time">Time</label>
                    <Select defaultValue="01:00" name='time'>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="" />
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
                <div>
                    <label htmlFor="staff">Staff</label>
                    <Select name='staff'>
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
                </div>
                {/* search */}
                <Button className={""}>Search</Button>
            </div>
            {/* table */}
            <div className='px-10 mt-4'>
            <Button className="float-right mb-2" onClick={()=>{navigate("/add-entries")}}>Add +</Button>
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
                                    <TableCell className="font-medium border" value>{entry.date}</TableCell>
                                    <TableCell className="font-medium border">{entry.time}</TableCell>
                                    <TableCell className="font-medium border text-center">{entry.staff_name}</TableCell>
                                    <TableCell className="font-medium border text-right">
                                        <div className='flex flex-row gap-2'>
                                        <Button variant="secondary">Edit</Button><Button variant="destructive">Delete</Button>
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

export default Entries