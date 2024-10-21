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

const AddWinners = () => {
    const [currentData, setCurrentData] = useState({
        date: '',
        time: '',
        winning: {
            first: "",
            second: "",
            third: "",
            fourth: "",
            fifth: "",
            guarantee: ["","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""],
            A:"",
            B:"",
            C:"",
            AB:"",
            BC:"",
            AC:"",
            BOXKK1:"",
            BOXKK2:"",
            BOXKK3:"",
            BOXKK4:"",
            BOXKK5:"",
            BOXKK6:""
        }
    })

    const handleUpload = async() => {
        try {
            toast.loading("loading")
            if(!currentData.date || !currentData.time){
                toast.dismiss()
                return toast.error("Date and time is required");
            }
            await axios.post(`${process.env.REACT_APP_BASE_URL}api/main/add-winners`, currentData)
            toast.dismiss()
        } catch (error) {
            toast.dismiss()
            error.response
            ? toast.error(`Error: ${error.response.data.message}`)
            : toast.error("Failed")
        }

    }

    // Generate an array of 30 guarantee prizes
    const guaranteePrizes = Array.from({ length: 30 }, (_, index) => (
        <TableRow key={index}>
            <TableCell className="font-medium border-2 border-black">{index + 6}</TableCell>
            <TableCell className="font-medium border-2 border-black">guarantee</TableCell>
            <TableCell className="font-medium border-2 border-black text-center">
                <Input
                    type="number"
                    onChange={(e) => {
                        setCurrentData((prevData) => {
                            const guarantee = [...prevData.winning.guarantee];
                            guarantee[index] = e.target.value;
                            return {
                                ...prevData,
                                winning: { ...prevData.winning, guarantee },
                            };
                        });
                    }}
                />
            </TableCell>
        </TableRow>
    ));

    return (
        <div className='mt-[80px]'>
            <h2 className="text-center scroll-m-20 pb-2 text-4xl font-semibold tracking-tight pt-2 first:mt-0">
                Add Winners
            </h2>
            {/* Search Form */}
            <div className='flex justify-center items-center  md:items-end gap-3 flex-col md:flex-row px-20 '>
                <div>
                    <label htmlFor="date">Date</label>
                    <Input
                    type="date"
                        onChange={(e) => setCurrentData((prev) => ({
                            ...prev,
                            date: e.target.value
                        }))}
                    />
                </div>
                {/* time */}
                <div>
                    <label htmlFor="time">Time</label>
                    <Select onValueChange={(e) => { setCurrentData({ ...currentData, time: e }) }} name='time'>
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
            </div>
            {/* table */}
            <div className='px-10 mt-4 max-w-[800px] mx-auto'>
                <Table className="border rounded-md ">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center border-2 border-black">S No.</TableHead>
                            <TableHead className="text-center border-2 border-black">Name</TableHead>
                            <TableHead className="text-center border-2 border-black">Number</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="font-medium border-2 border-black">1</TableCell>
                            <TableCell className="font-medium border-2 border-black">1st Prize</TableCell>
                            <TableCell className="font-medium border-2 border-black text-center">
                                <Input
                                    
                                    onChange={(e) => {
                                        setCurrentData((prevData) => ({
                                            ...prevData,
                                            winning: {
                                                ...prevData.winning,
                                                first: e.target.value,
                                            },
                                        }));
                                    }}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium border-2 border-black">2</TableCell>
                            <TableCell className="font-medium border-2 border-black">2nd Prize</TableCell>
                            <TableCell className="font-medium border-2 border-black text-center">
                                <Input
                                    onChange={(e) => {
                                        setCurrentData((prevData) => ({
                                            ...prevData,
                                            winning: {
                                                ...prevData.winning,
                                                second: e.target.value,
                                            },
                                        }));
                                    }}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium border-2 border-black">3</TableCell>
                            <TableCell className="font-medium border-2 border-black">3rd Prize</TableCell>
                            <TableCell className="font-medium border-2 border-black text-center">
                                <Input
                                    onChange={(e) => {
                                        setCurrentData((prevData) => ({
                                            ...prevData,
                                            winning: {
                                                ...prevData.winning,
                                                third: e.target.value,
                                            },
                                        }));
                                    }}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium border-2 border-black">4</TableCell>
                            <TableCell className="font-medium border-2 border-black">4th Prize</TableCell>
                            <TableCell className="font-medium border-2 border-black text-center">
                                <Input
                                    onChange={(e) => {
                                        setCurrentData((prevData) => ({
                                            ...prevData,
                                            winning: {
                                                ...prevData.winning,
                                                fourth: e.target.value,
                                            },
                                        }));
                                    }}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium border-2 border-black">5</TableCell>
                            <TableCell className="font-medium border-2 border-black">5th Prize</TableCell>
                            <TableCell className="font-medium border-2 border-black text-center">
                                <Input
                                    onChange={(e) => {
                                        setCurrentData((prevData) => ({
                                            ...prevData,
                                            winning: {
                                                ...prevData.winning,
                                                fifth: e.target.value,
                                            },
                                        }));
                                    }}
                                />
                            </TableCell>
                        </TableRow>
                        {guaranteePrizes}
                        <TableRow>
                            <TableCell className="font-medium border-2 border-black">A</TableCell>
                            <TableCell className="font-medium border-2 border-black">A</TableCell>
                            <TableCell className="font-medium border-2 border-black text-center">
                                <Input
                                    onChange={(e) => {
                                        setCurrentData((prevData) => ({
                                            ...prevData,
                                            winning: {
                                                ...prevData.winning,
                                                A: e.target.value,
                                            },
                                        }));
                                    }}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium border-2 border-black">B</TableCell>
                            <TableCell className="font-medium border-2 border-black">B</TableCell>
                            <TableCell className="font-medium border-2 border-black text-center">
                                <Input
                                    onChange={(e) => {
                                        setCurrentData((prevData) => ({
                                            ...prevData,
                                            winning: {
                                                ...prevData.winning,
                                                B: e.target.value,
                                            },
                                        }));
                                    }}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium border-2 border-black">C</TableCell>
                            <TableCell className="font-medium border-2 border-black">C</TableCell>
                            <TableCell className="font-medium border-2 border-black text-center">
                                <Input
                                    onChange={(e) => {
                                        setCurrentData((prevData) => ({
                                            ...prevData,
                                            winning: {
                                                ...prevData.winning,
                                                C: e.target.value,
                                            },
                                        }));
                                    }}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium border-2 border-black">AB</TableCell>
                            <TableCell className="font-medium border-2 border-black">AB</TableCell>
                            <TableCell className="font-medium border-2 border-black text-center">
                                <Input
                                    onChange={(e) => {
                                        setCurrentData((prevData) => ({
                                            ...prevData,
                                            winning: {
                                                ...prevData.winning,
                                                AB: e.target.value,
                                            },
                                        }));
                                    }}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium border-2 border-black">BC</TableCell>
                            <TableCell className="font-medium border-2 border-black">BC</TableCell>
                            <TableCell className="font-medium border-2 border-black text-center">
                                <Input
                                    onChange={(e) => {
                                        setCurrentData((prevData) => ({
                                            ...prevData,
                                            winning: {
                                                ...prevData.winning,
                                                BC: e.target.value,
                                            },
                                        }));
                                    }}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium border-2 border-black">AC</TableCell>
                            <TableCell className="font-medium border-2 border-black">AC</TableCell>
                            <TableCell className="font-medium border-2 border-black text-center">
                                <Input
                                    onChange={(e) => {
                                        setCurrentData((prevData) => ({
                                            ...prevData,
                                            winning: {
                                                ...prevData.winning,
                                                AC: e.target.value,
                                            },
                                        }));
                                    }}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium border-2 border-black">BOXKK1</TableCell>
                            <TableCell className="font-medium border-2 border-black">BOXKK1</TableCell>
                            <TableCell className="font-medium border-2 border-black text-center">
                                <Input
                                    onChange={(e) => {
                                        setCurrentData((prevData) => ({
                                            ...prevData,
                                            winning: {
                                                ...prevData.winning,
                                                BOXKK1: e.target.value,
                                            },
                                        }));
                                    }}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium border-2 border-black">BOXKK2</TableCell>
                            <TableCell className="font-medium border-2 border-black">BOXKK2</TableCell>
                            <TableCell className="font-medium border-2 border-black text-center">
                                <Input
                                    onChange={(e) => {
                                        setCurrentData((prevData) => ({
                                            ...prevData,
                                            winning: {
                                                ...prevData.winning,
                                                BOXKK2: e.target.value,
                                            },
                                        }));
                                    }}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium border-2 border-black">BOXKK3</TableCell>
                            <TableCell className="font-medium border-2 border-black">BOXKK3</TableCell>
                            <TableCell className="font-medium border-2 border-black text-center">
                                <Input
                                    onChange={(e) => {
                                        setCurrentData((prevData) => ({
                                            ...prevData,
                                            winning: {
                                                ...prevData.winning,
                                                BOXKK3: e.target.value,
                                            },
                                        }));
                                    }}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium border-2 border-black">BOXKK4</TableCell>
                            <TableCell className="font-medium border-2 border-black">BOXKK4</TableCell>
                            <TableCell className="font-medium border-2 border-black text-center">
                                <Input
                                    onChange={(e) => {
                                        setCurrentData((prevData) => ({
                                            ...prevData,
                                            winning: {
                                                ...prevData.winning,
                                                BOXKK4: e.target.value,
                                            },
                                        }));
                                    }}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium border-2 border-black">BOXKK5</TableCell>
                            <TableCell className="font-medium border-2 border-black">BOXKK5</TableCell>
                            <TableCell className="font-medium border-2 border-black text-center">
                                <Input
                                    onChange={(e) => {
                                        setCurrentData((prevData) => ({
                                            ...prevData,
                                            winning: {
                                                ...prevData.winning,
                                                BOXKK5: e.target.value,
                                            },
                                        }));
                                    }}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium border-2 border-black">BOXKK6</TableCell>
                            <TableCell className="font-medium border-2 border-black">BOXKK6</TableCell>
                            <TableCell className="font-medium border-2 border-black text-center">
                                <Input
                                    onChange={(e) => {
                                        setCurrentData((prevData) => ({
                                            ...prevData,
                                            winning: {
                                                ...prevData.winning,
                                                BOXKK6: e.target.value,
                                            },
                                        }));
                                    }}
                                />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                <Button className="mb-5 mt-5" onClick={handleUpload}>Upload</Button>
            </div>
        </div>
    )
}

export default AddWinners