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
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import toast from 'react-hot-toast'

const AddEntries = () => {
    const [staffs] = useState(["other", "Rashid", "Sandosh", "Muneer", "Balan", "SRS deer", "Srs Keralam", "San grp", "Gobi", "kerala + 8pm deer"])
    const [currentEntry, setCurrentEntry] = useState({
        date: "",
        time: "",
        staff_name: "",
        lottery_name: "",
        ticket_number: "",
        count: ""
    });
    const [endNo, setEndNo] = useState(null)
    const [entries, setEntries] = useState([
        {
            id: "1",
            date: "02-09-2002",
            time: "09:00",
            staff_name: "Rasheed",
            lottery_name: "LSK-SUPER",
            ticket_number: 123,
            count: 12
        },
    ])

    const [lotteryName, setLotteryName] = useState({
        1: ["A", "B", "C"],
        2: ["AB", "AC", "BC"],
        3: ["LSK-SUPER", "BOXKK", "BOX"]
    })
    const [lotteryNames, setLotteryNames] = useState(["A", "B", "C"])
    const [maxLength, setMaxLength] = useState(1)
    const [isAny, setAny] = useState([false, false]) // false => any is visible false => end number is visible

    const handleNumberChange = (number) => {
        setLotteryNames(lotteryName[number])
        setCurrentEntry({ ...currentEntry, ticket_number: "" })
        setMaxLength(number)
    }


    const handleTicketNoLength = (e) => {
        const inputValue = e.target.value;
        // Check if the length exceeds the maxLength
        if (inputValue.length > maxLength) {
            // Slice the input to the maximum allowed length
            e.target.value = inputValue.slice(0, maxLength);
            return
        }
        setCurrentEntry({ ...currentEntry, ticket_number: inputValue })
    };

    const handleLotteryNameChange = (lottery_name) => {
        setCurrentEntry({ ...currentEntry, lottery_name: lottery_name })
        if (lottery_name == "LSK-SUPER") {
            setAny([true, false])
        }
        else {
            setAny([false, false])
        }
    }

    const handleAnyChange = (anyStatus) => {
        setAny([true, anyStatus])
    }

    const generateHash = () => Math.random().toString(36).substring(2, 9);

    const handleAdd = () => {
        // Clear previous error messages before validating new input
        const clearErrors = () => {
            // Clear any toast notifications or error states here
            toast.dismiss(); // If you are using toast notifications
        };

        // Clear previous errors
        clearErrors();

        // Generate a new ID for the entry
        const newEntry = { ...currentEntry, id: generateHash() };
        console.log(currentEntry)
        // Validation checks
        if (!newEntry.date) {
            return toast.error("Date is required");
        }
        if (!newEntry.time) {
            return toast.error("Time is required");
        }
        if (!newEntry.staff_name) {
            return toast.error("Please select staff");
        }
        if (!newEntry.lottery_name) {
            return toast.error("Please select lottery name");
        }
        if (!newEntry.ticket_number) {
            return toast.error("Please enter ticket number");
        }
        if (!newEntry.count) {
            return toast.error("Please enter count");
        }
        if ((isAny[0] && isAny[1]) && (endNo == null)) {
            return toast.error("Please enter end number");
        }
        if ((isAny[0] && isAny[1]) && endNo <= newEntry.ticket_number) {
            return toast.error("End number cannot be less than ticket number");
        }

        // If any checkbox is pressed
        if (isAny[0] && isAny[1]) {
            const temp_array = [];
            for (let i = newEntry.ticket_number; i <= endNo; i++) {
                // Create a new entry for each ticket number
                temp_array.push({ ...newEntry, ticket_number: i, id: generateHash() });
            }
            setEntries([...temp_array,...entries]); // Add all entries to the state
        }
        else if (currentEntry.lottery_name == "BOX") {             
            const ticketNumberStr = newEntry.ticket_number.toString();
            const permutations = generatePermutations(ticketNumberStr); // Generate permutations
            const temp_array = permutations.map(permutation => {
                return { ...newEntry, lottery_name:"LSK-SUPER",ticket_number: parseInt(permutation), id: generateHash(), };
            });
            if(currentEntry.ticket_number == 100){
                setEntries([...["100","001","010"],...entries]); // Add all permutations as entries
            }
            setEntries([...temp_array,...entries]); // Add all permutations as entries
        }

        else {
            setEntries([newEntry,...entries]); // Add the single new entry
        }
    };

    // Function to reset the form values
    const resetForm = () => {
        setCurrentEntry({
            date: '',
            time: '',
            staff_name: '',
            lottery_name: '',
            ticket_number: '',
            count: '',
        });
    };

    const handleRemove = (id) => {
        const newData = entries.filter((entry) => (entry.id != id))
        setEntries(newData)
    }

    const calculateTotalCount = () => {
        return entries.reduce((total, entry) => {
            const entryCount = entry.count ? parseInt(entry.count, 10) : 0;
            return total + entryCount;
        }, 0);
    };
    // Helper function to generate permutations of a string
    const generatePermutations = (str) => {
        if (str.length <= 1) return [str];

        let perms = [];
        for (let i = 0; i < str.length; i++) {
            let char = str[i];
            let remaining = str.slice(0, i) + str.slice(i + 1);
            let remainingPerms = generatePermutations(remaining);

            for (let perm of remainingPerms) {
                perms.push(char + perm);
            }
        }
        return perms;
    }

    const navigate = useNavigate()
    return (
        <div className='mt-[80px]'>
            <h2 className="text-center scroll-m-20 pb-2 text-4xl font-semibold tracking-tight pt-2 first:mt-0">
                Add Entry
            </h2>
            <div className='space-y-5'>
                {/* Search Form row 1 */}
                <div className='flex justify-center items-center  md:items-end gap-3 flex-col md:flex-row px-10 '>
                    <RadioGroup onValueChange={handleNumberChange} defaultValue={1} className="flex gap-5">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value={1} id="1" />
                            <Label htmlFor={"1"}>1</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value={2} id="2" />
                            <Label htmlFor="2">2</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value={3} id="3" />
                            <Label htmlFor="3">3</Label>
                        </div>
                    </RadioGroup>
                </div>
                {/* Search Form row 2 */}
                <div className='flex justify-center items-center  md:items-end gap-3 md:gap-8 flex-col md:flex-row px-10 '>
                    <div>
                        <label htmlFor="date">Date</label>
                        <Input onChange={(e) => { setCurrentEntry({ ...currentEntry, date: e.target.value }) }} type="date" name="date" />
                    </div>
                    {/* time */}
                    <div>
                        <label htmlFor="time">Time</label>
                        <Select onValueChange={(e) => { setCurrentEntry({ ...currentEntry, time: e }) }} name='time'>
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
                        <label htmlFor="staff">Staff</label>
                        <Select onValueChange={(e) => { setCurrentEntry({ ...currentEntry, staff_name: e }); }} name='staff'>
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
                    <div>
                        <label htmlFor="lottery_name">Lottery Name</label>
                        <Select onValueChange={handleLotteryNameChange} defaultValue="" name='lottery_name'>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select Lottery" />
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    lotteryNames.map((lottery_name) => (
                                        <SelectItem value={lottery_name} key={lottery_name} >{lottery_name}</SelectItem>
                                    ))
                                }
                            </SelectContent>
                        </Select>
                    </div>

                    {
                        isAny[0] ?
                            <div className="flex items-center justify-center my-auto space-x-2">
                                <Checkbox onCheckedChange={handleAnyChange} id="any" />
                                <label
                                    htmlFor="any"
                                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Any
                                </label>
                            </div>
                            :
                            ""
                    }
                </div>


                {/* Search Form row 3*/}
                <div className='flex justify-center items-center  md:items-end gap-3 flex-col md:flex-row px-20 '>
                    <div>
                        <label htmlFor="ticket-no">Ticket No</label>
                        <Input onChange={handleTicketNoLength} value={currentEntry.ticket_number} type="number" name="ticket-no" />
                    </div>
                    <div>
                        <label htmlFor="count">Count</label>
                        <Input onChange={(e) => { setCurrentEntry({ ...currentEntry, count: e.target.value }) }} value={currentEntry.count} type="number" name="count" />
                    </div>
                    {
                        isAny[1] ?
                            <div>
                                <label htmlFor="end-no">End No.</label>
                                <Input onChange={(e) => { setEndNo(String(e.target.value)) }} type="number" name="end-no" />
                            </div>
                            : ""
                    }
                    {/* search */}
                    <Button className={"bg-sky-500 text-white hover:bg-sky-600"} onClick={handleAdd}>Add</Button>
                </div>
            </div>



            {/* table */}
            <div className='px-10 mt-4'>
                <Table className="border rounded-md">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center border">S No.</TableHead>
                            <TableHead className="text-center border">Lottery Name</TableHead>
                            <TableHead className="text-center border">Ticket Number</TableHead>
                            <TableHead className="text-center border w-40">Count</TableHead>
                            <TableHead className="text-center border w-40">Amount</TableHead>
                            <TableHead className="text-center border w-40">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            entries.map((entry, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium border">{index + 1}</TableCell>
                                    <TableCell className="font-medium border">{entry.lottery_name}</TableCell>
                                    <TableCell className="font-medium border text-center">{entry.ticket_number}</TableCell>
                                    <TableCell className="font-medium border text-center">{entry.count}</TableCell>
                                    <TableCell className="font-medium border text-center">{entry.amount}</TableCell>
                                    <TableCell className="font-medium border text-center"><Button onClick={(e) => { handleRemove(entry.id) }} variant="destructive">Remove</Button></TableCell>
                                </TableRow>
                            ))
                        }
                        <TableRow >
                            <TableCell className="font-medium border"></TableCell>
                            <TableCell className="font-medium border"></TableCell>
                            <TableCell className="font-medium border text-right">TOTAL :</TableCell>
                            <TableCell className="border text-center font-bold">{calculateTotalCount()}</TableCell>
                            <TableCell className="font-medium border text-center">123</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                <Button className={"mt-2"}>Save</Button>
            </div>
        </div>
    )
}

export default AddEntries