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

const Report = () => {
    const [currentData, setCurrentData] = useState({})
    const [lotteryDetails, setLotteryDetails] = useState({})
    const [winningAmount, setWinningAmount] = useState({})
    const [staffs, setStaffs] = useState([])
    const [topTable, setTopTable] = useState({
        Single: 0,
        Double: 0,
        lsk: 0,
        boxkk: 0
    });
    const [bottomTable, setBottomTable] = useState([]);
    const fetchStaffAmount = async () => {
        try {
            const res = await axios.get(process.env.REACT_APP_BASE_URL + "api/main/get-staff");
            const res2 = await axios.get(process.env.REACT_APP_BASE_URL + "api/main/get-winning-amount");
            setWinningAmount(res2.data)
            const staffAmount = res.data.staffs;
            const staffMap = {};
            staffAmount.forEach((staff) => {
                staffMap[staff.staff_name] = {
                    single: parseFloat(staff.single["$numberDecimal"]),
                    double: parseFloat(staff.double["$numberDecimal"]),
                    lsk: parseFloat(staff.lsk["$numberDecimal"]),
                    boxkk: parseFloat(staff.boxkk["$numberDecimal"]),
                    _id: staff._id,
                    createdAt: staff.createdAt,
                    updatedAt: staff.updatedAt
                };
            });
            setStaffs(staffMap); // Store the hashmap in the state or use it as needed
        } catch (error) {
            error.response
                ? toast.error("Error: " + error.response.data.message)
                : toast.error("Failed");
        }
    };
    const handleSearch = async () => {
        try {
            setTopTable({
                Single: 0,
                Double: 0,
                lsk: 0,
                boxkk: 0
            })
            setBottomTable([])
            toast.loading("Calculating..")
            if (!currentData.date || !currentData.time || !currentData.staff_name) {
                toast.dismiss()
                return toast.error("Please enter date, time and Staff")
            }
            const { data } = await axios.get(process.env.REACT_APP_BASE_URL + "api/main/get-entry/" + currentData.date + "/" + currentData.time + "/" + currentData.staff_name);
            // Initialize an empty object to store grouped results
            setLotteryDetails(data)
            // data.forEach((dat) => {
            //     const { lottery_name } = dat;
            //     console.log(dat)
            //     // Create a mapping object for lottery_name to corresponding state keys
            //     const groupMap = {
            //         A: "Single",
            //         B: "Single",
            //         C: "Single",
            //         AB: "Double",
            //         BC: "Double",
            //         AC: "Double",
            //         "LSK-SUPER": "lsk",
            //         BOXKK: "boxkk"
            //     };

            //     // Get the corresponding group from the map
            //     const group = groupMap[lottery_name];

            //     if (group) {
            //         // Update the state based on the group
            //         setTopTable((prevData) => {return (
            //             {
            //                 ...prevData,
            //                 [group]: prevData[group] + dat.count
            //             }
            //         )
            //         }
            //     );
            //     }
            // });

            // Initialize the object to store total counts for each group
            const groupTotals = {
                Single: 0,
                Double: 0,
                lsk: 0,
                boxkk: 0
            };

            // Iterate over the data to calculate the total count for each group
            data.forEach((dat) => {
                const { lottery_name, count } = dat;

                // Create a mapping object for lottery_name to corresponding state keys
                const groupMap = {
                    A: "Single",
                    B: "Single",
                    C: "Single",
                    AB: "Double",
                    BC: "Double",
                    AC: "Double",
                    "LSK-SUPER": "lsk",
                    BOXKK: "boxkk"
                };

                // Get the corresponding group from the map
                const group = groupMap[lottery_name];

                if (group) {
                    // Add the count to the corresponding group total
                    groupTotals[group] += count;
                }
            });

            // After processing the entire data array, update the state with the final totals
            setTopTable((prevData) => ({
                ...prevData,
                Single: groupTotals.Single,
                Double: groupTotals.Double,
                lsk: groupTotals.lsk,
                boxkk: groupTotals.boxkk
            }));
            // get all winners for the day
            const winnersData = await axios.get(process.env.REACT_APP_BASE_URL + "api/main/search-winners/" + currentData.date + "/" + currentData.time);
            data.forEach((lotteryItem) => {
                const { ticket_number, lottery_name, count } = lotteryItem;
                const { winning } = winnersData.data[0];  // Assuming you're working with the first object in the winningData array

                let winningPosition = '';

                // Check if ticket_number matches the main winning positions
                if (ticket_number === winning.first) {
                    winningPosition = 'first';
                } else if (ticket_number === winning.second) {
                    winningPosition = 'second';
                } else if (ticket_number === winning.third) {
                    winningPosition = 'third';
                } else if (ticket_number === winning.fourth) {
                    winningPosition = 'fourth';
                } else if (ticket_number === winning.fifth) {
                    winningPosition = 'fifth';
                }
                // Check if ticket_number is in the guarantee list
                if (winning.guarantee.includes(ticket_number)) {
                    winningPosition = 'guarantee';
                }
                // Check for A, B, C, AB, AC, BC, BOXKK1-6
                if (lottery_name === 'A' && winning.A && ticket_number == winning.A) {
                    winningPosition = 'A';
                } else if (lottery_name === 'B' && winning.B && ticket_number == winning.B) {
                    winningPosition = 'B';
                } else if (lottery_name === 'C' && winning.C && ticket_number == winning.C) {
                    winningPosition = 'C';
                } else if (lottery_name === 'AB' && winning.AB && ticket_number == winning.AB) {
                    winningPosition = 'AB';
                } else if (lottery_name === 'AC' && winning.AC && ticket_number == winning.AC) {
                    winningPosition = 'AC';
                } else if (lottery_name === 'BC' && winning.BC && ticket_number == winning.BC) {
                    winningPosition = 'BC';
                }
                // If a winning position is found, update the topTable state
                if (winningPosition) {
                    setBottomTable((prevData) => ([...prevData, {
                        lottery_name: lottery_name,
                        ticket_number: ticket_number,
                        count: count,
                        winning_position: winningPosition,
                    }]));
                }
            });
            toast.dismiss()
            toast.success("success")
        } catch (error) {
            error.response
                ? toast.error("Error: " + error.response.data.message)
                : toast.error("Failed");
        }
    }
    // const handleSearch = () => {
    //     if (!currentData.date || !currentData.time) {
    //         return toast.error("Please enter date and time")
    //     }
    //     SearchData();
    // }
    useEffect(() => {
        fetchStaffAmount();
    }, [])

    // const handleEditClick = (date, time, staff_name) => {
    //     const params = new URLSearchParams({
    //         date: date,
    //         time: time,
    //     });
    //     navigate(`/edit-entries?${params.toString()}`);
    // }

    const calculateTotalCountForBottom = () => {
        let data = 0;
        bottomTable.forEach(({ count, winning_position }) => {
            data += count
        })
        return data
    }

    const calculateSalesTotal = () => {
        const data = (topTable.boxkk * (staffs[currentData.staff_name] != undefined ? staffs[currentData.staff_name].boxkk : 0)) +
            (topTable.lsk * (staffs[currentData.staff_name] != undefined ? staffs[currentData.staff_name].lsk : 0)) +
            (topTable.Double * (staffs[currentData.staff_name] != undefined ? staffs[currentData.staff_name].double : 0)) +
            (topTable.Single * (staffs[currentData.staff_name] != undefined ? staffs[currentData.staff_name].single : 0))
        return data
    }

    const calculateWinningTotal = () => {
        let data = 0;
        bottomTable.forEach(({ count, winning_position }) => {
            data += count * winningAmount[winning_position]
        })
        return data
    }

    return (
        <div className='mt-[80px]'>
            <h2 className="text-center scroll-m-20 pb-2 text-4xl font-semibold tracking-tight pt-2 first:mt-0">
                Report
            </h2>
            {/* Search Form */}
            <div className='flex justify-center items-center  md:items-end gap-3 flex-col md:flex-row px-20 '>
                <div>
                    <label htmlFor="date">Date</label>
                    <Input onChange={(e) => { setCurrentData({ ...currentData, date: e.target.value }); setTopTable({ Single: 0, Double: 0, lsk: 0, boxkk: 0 }) }} type="date" name="date" />
                </div>
                {/* time */}
                <div>
                    <label htmlFor="time">Time</label>
                    <Select onValueChange={(e) => { setCurrentData({ ...currentData, time: e }); setTopTable({ Single: 0, Double: 0, lsk: 0, boxkk: 0 }) }} name='time'>
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
                <div>
                    <label htmlFor="staff">Staff Name</label>
                    <Select onValueChange={(e) => { setCurrentData({ ...currentData, staff_name: e }); setTopTable({ Single: 0, Double: 0, lsk: 0, boxkk: 0 }) }} name='staff'>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Staff" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                Object.keys(staffs).map((staff, index) => (
                                    <SelectItem value={staff} key={index + 1}>{staff}</SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                </div>
                {/* search */}
                <Button onClick={handleSearch} >Search</Button>
            </div>
            {/* table */}
            <div className='px-10 mt-4 max-w-[1400px]'>
                <Table className="border rounded-md">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center border">Ticket Name</TableHead>
                            <TableHead className="text-center border">Count</TableHead>
                            <TableHead className="text-center border">Sales Amount</TableHead>
                            <TableHead className="text-center border w-40">Total Sales Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            topTable.Single > 0 ?
                                <TableRow>
                                    <TableCell className="font-medium border">{"Single"}</TableCell>
                                    <TableCell className="font-medium border">{topTable.Single}</TableCell>
                                    <TableCell className="font-medium border text-center">{staffs[currentData.staff_name].single}</TableCell>
                                    <TableCell className="font-medium border text-right">{staffs[currentData.staff_name].single * topTable.Single}</TableCell>
                                </TableRow>
                                :
                                ""
                        }
                        {
                            topTable.Double > 0 ?
                                <TableRow>
                                    <TableCell className="font-medium border">{"Double"}</TableCell>
                                    <TableCell className="font-medium border">{topTable.Double}</TableCell>
                                    <TableCell className="font-medium border text-center">{staffs[currentData.staff_name].double}</TableCell>
                                    <TableCell className="font-medium border text-right">{staffs[currentData.staff_name].double * topTable.Double}</TableCell>
                                </TableRow>
                                :
                                ""
                        }
                        {
                            topTable.lsk > 0 ?
                                <TableRow>
                                    <TableCell className="font-medium border">{"LSK SUPER"}</TableCell>
                                    <TableCell className="font-medium border">{topTable.lsk}</TableCell>
                                    <TableCell className="font-medium border text-center">{staffs[currentData.staff_name].lsk}</TableCell>
                                    <TableCell className="font-medium border text-right">{staffs[currentData.staff_name].lsk * topTable.lsk}</TableCell>
                                </TableRow>
                                :
                                ""
                        }
                        {
                            topTable.boxkk > 0 ?
                                <TableRow>
                                    <TableCell className="font-medium border">{"BOXKK"}</TableCell>
                                    <TableCell className="font-medium border">{topTable.boxkk}</TableCell>
                                    <TableCell className="font-medium border text-center">{staffs[currentData.staff_name].boxkk}</TableCell>
                                    <TableCell className="font-medium border text-right">{staffs[currentData.staff_name].boxkk * topTable.boxkk}</TableCell>
                                </TableRow>
                                :
                                ""
                        }
                        <TableRow>
                            <TableCell className="font-medium border"></TableCell>
                            <TableCell className="font-medium border"></TableCell>
                            <TableCell className="font-medium border text-right">Sales Total= </TableCell>
                            <TableCell className="font-medium border text-right">{calculateSalesTotal()}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                {
                    topTable.Double <= 0 && topTable.Single <= 0 && topTable.boxkk <= 0 && topTable.lsk <= 0 ?
                        <h3 className="font-medium border text-center my-4" span="4">No Data Found</h3>
                        : ""
                }
            </div>
            <div className='px-10 mt-4 max-w-[1400px]'>
                <Table className="border rounded-md">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center border">Ticket Name</TableHead>
                            <TableHead className="text-center border">Ticket Number</TableHead>
                            <TableHead className="text-center border">Count</TableHead>
                            <TableHead className="text-center border w-40">Win position</TableHead>
                            <TableHead className="text-center border w-40">Winning Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            bottomTable.map((w, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium border" value>{w.lottery_name}</TableCell>
                                    <TableCell className="font-medium border">{w.ticket_number}</TableCell>
                                    <TableCell className="font-medium border text-center">{w.count}</TableCell>
                                    <TableCell className="font-medium border text-center">{w.winning_position}</TableCell>
                                    <TableCell className="font-medium border text-right">{winningAmount[w.winning_position] * w.count}</TableCell>
                                </TableRow>
                            ))
                        }
                        <TableRow>
                            <TableCell className="font-bold border text-black" value>Total</TableCell>
                            <TableCell className="font-medium border"></TableCell>
                            <TableCell className="font-bold border text-center text-black">{calculateTotalCountForBottom()}</TableCell>
                            <TableCell className="font-bold border text-left text-black">Total Winning:</TableCell>
                            <TableCell className="font-medium border text-right">{calculateWinningTotal()}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-bold border text-black" value></TableCell>
                            <TableCell className="font-medium border"></TableCell>
                            <TableCell className="font-bold border text-center text-black"></TableCell>
                            <TableCell className="font-bold border text-left text-black">Sales Total:</TableCell>
                            <TableCell className="font-medium border text-right">{calculateSalesTotal()}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-bold border text-black" value></TableCell>
                            <TableCell className="font-medium border"></TableCell>
                            <TableCell className="font-bold border text-center text-black"></TableCell>
                            <TableCell className="font-bold border text-left text-black">Balance:</TableCell>
                            <TableCell className="font-medium border text-right">{(calculateWinningTotal() - calculateSalesTotal()) < 0 ? "-" + (calculateWinningTotal() - calculateSalesTotal()) : "+" + (calculateWinningTotal() - calculateSalesTotal())}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                {/* {
                    winners.length == 0 ?
                            <h3 className="font-medium border text-center my-4" span="4">No Data Found</h3>
                     : ""
                } */}
            </div>
        </div>
    )
}

export default Report