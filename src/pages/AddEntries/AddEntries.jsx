import { Input } from '@/components/ui/input'
import React, { forwardRef, useEffect, useRef, useState } from 'react'
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
import axios from "../../config/AxiosConfig"
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import toast from 'react-hot-toast'

const AddEntries = () => {
    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Add leading zero if necessary
        const day = String(today.getDate()).padStart(2, '0'); // Add leading zero if necessary
        return `${year}-${month}-${day}`;
    };
    const [staffAmount,setStaffAmount] = useState([])
    const [currentEntry, setCurrentEntry] = useState({
        date: getTodayDate(),
        time: "01:00",
        staff_name: "",
        lottery_name: "",
        ticket_number: "",
        count: ""
    });
    const [endNo, setEndNo] = useState(null)
    const [entries, setEntries] = useState([])
    const [lotteryName, setLotteryName] = useState({
        1: ["A", "B", "C"],
        2: ["AB", "AC", "BC"],
        3: ["LSK-SUPER", "BOXKK", "BOX"]
    })
    const [lotteryNames, setLotteryNames] = useState(["A", "B", "C"])
    const [maxLength, setMaxLength] = useState(1)
    const [isAny, setAny] = useState([false, false]) // false => any is visible false => end number is visible



    // refs
    const ticketNoRef = useRef(null)
    const countRef = useRef(null)
    const buttonRef = useRef(null)
    const endNoRef = useRef(null)



    const handleNumberChange = (number) => {
        setLotteryNames(lotteryName[number])
        setCurrentEntry({ ...currentEntry, ticket_number: "" })
        setMaxLength(number)
    }


    const handleTicketNoLength = (e) => {
        const inputValue = e.target.value;
        // Check if the length exceeds the maxLength
        if (inputValue.length == maxLength){
            if(isAny[1]){
                endNoRef.current.focus();
            }
            else
            {
                countRef.current.focus();
            }
        }
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

    const calculateAmount = (staff_name,lottery_name,count) => {

        if(!lottery_name || !staff_name || !count){
            return 0
        }
        if(lottery_name == "A" || lottery_name == "B" || lottery_name == "C"){
            return staffAmount[staff_name].single * count
        }
        else if(lottery_name == "AB" || lottery_name == "AC" || lottery_name == "BC"){
            return staffAmount[staff_name].double * count
        }
        else if ( lottery_name == "LSK-SUPER" || lottery_name == "BOX"){
            return staffAmount[staff_name].lsk * count
        }
        else if(lottery_name == "BOXKK"){
            return staffAmount[staff_name].boxkk * count
        }
        else
        {
            return 0
        }
    }
    const handleAdd = () => {
        // Clear previous error messages before validating new input
        const clearErrors = () => {
            // Clear any toast notifications or error states here
            toast.dismiss(); // If you are using toast notifications
        };

        // Clear previous errors
        clearErrors();

        // Generate a new ID for the entry
        const newEntry = { ...currentEntry, uid: generateHash(),amount:calculateAmount(currentEntry.staff_name,currentEntry.lottery_name,currentEntry.count) };
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
                temp_array.push({ ...newEntry, ticket_number: i, uid: generateHash(),amount:calculateAmount(currentEntry.staff_name,currentEntry.lottery_name,currentEntry.count)});
            }
            temp_array.reverse()
            setEntries([...temp_array,...entries]); // Add all entries to the state
        }
        else if (currentEntry.lottery_name == "BOX"){             
            const ticketNumberStr = newEntry.ticket_number.toString();
            const permutations = generatePermutations(ticketNumberStr); // Generate permutations
            const temp_array = permutations.map(permutation => {
                return { ...newEntry, lottery_name:"LSK-SUPER",ticket_number: parseInt(permutation), uid: generateHash(),amount:calculateAmount(currentEntry.staff_name,currentEntry.lottery_name,currentEntry.count)};
            });
            if(currentEntry.ticket_number == 100){
                setEntries([...["100","001","010"],...entries]); // Add all permutations as entries
            }
            setEntries([...temp_array,...entries]); // Add all permutations as entries
        }
        else {
            setEntries([newEntry,...entries]); // Add the single new entry
        }

        setCurrentEntry((prev)=>({
            ...prev,
            ticket_number:"",
            count:""
        }));
        setEndNo("")
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

    const handleRemove = (uid) => {
        const newData = entries.filter((entry) => (entry.uid != uid))
        setEntries(newData)
    }

    const calculateTotalCount = () => {
        return entries.reduce((total, entry) => {
            const entryCount = entry.count ? parseInt(entry.count, 10) : 0;
            return total + entryCount;
        }, 0);
    };

    const calculateTotalAmount = () => {
        return entries.reduce((total, entry) => {
            const entryCount = entry.amount ? parseInt(entry.amount, 10) : 0;
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

    const handleSave = async()=>{
        try {
            toast.loading("Uploading")
            await axios.post(process.env.REACT_APP_BASE_URL + "api/main/add-entries",{entries})
            toast.dismiss()
            toast.success("Success")
            setEntries([])
        } catch (error) {
            toast.dismiss()
            error.response ? toast.error( "Error : " + error.response.data.message) : toast.error("failed")
        }
    }

    const fetchStaffAmount = async () => {
        try {
            const res = await axios.get(process.env.REACT_APP_BASE_URL + "api/main/get-staff");
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
            setStaffAmount(staffMap); // Store the hashmap in the state or use it as needed
        } catch (error) {
            error.response
                ? toast.error("Error: " + error.response.data.message)
                : toast.error("Failed");
        }
    };

    const handleEnterPress = (event)=>{
        if (event.key === 'Enter') {
            buttonRef.current.click();
            ticketNoRef.current.focus();
        }
    }

    useEffect(()=>{
        fetchStaffAmount();
        
        document.addEventListener('keydown', handleEnterPress);
        
        return () => {
            document.removeEventListener('keydown', handleEnterPress);
          };      
    },[])

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
                        <Input value={currentEntry.date} onChange={(e) => { setCurrentEntry({ ...currentEntry, date: e.target.value }) }} type="date" name="date" />
                    </div>
                    {/* time */}
                    <div>
                        <label htmlFor="time">Time</label>
                        <Select value={currentEntry.time} onValueChange={(e) => { setCurrentEntry({ ...currentEntry, time: e }) }} name='time'>
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
                                    Object.keys(staffAmount).map((staff, index) => (
                                        <SelectItem value={staff} key={index+1}>{staff}</SelectItem>
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
                        <input ref={ticketNoRef} className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50' onChange={handleTicketNoLength} value={currentEntry.ticket_number} type="number" name="ticket-no" />
                    </div>
                    {
                        isAny[1] ?
                            <div>
                                <label htmlFor="end-no">End No.</label>
                                <input value={endNo} ref={endNoRef} className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50' onChange={(e) => { setEndNo(String(e.target.value)); if(String(e.target.value).length>=maxLength){countRef.current.focus();}}} type="number" name="end-no" />
                            </div>
                            : ""
                    }
                    <div>
                        <label htmlFor="count">Count</label>
                        <input ref={countRef} className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50' onChange={(e) => { setCurrentEntry({ ...currentEntry, count: e.target.value }) }} value={currentEntry.count} type="number" name="count" />
                    </div>
                    {/* search */}
                    <button ref={buttonRef} onClick={handleAdd}></button>
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
                                    <TableCell className="font-medium border text-center"><Button onClick={(e) => { handleRemove(entry.uid) }} variant="destructive">Remove</Button></TableCell>
                                </TableRow>
                            ))
                        }
                        <TableRow >
                            <TableCell className="font-medium border"></TableCell>
                            <TableCell className="font-medium border"></TableCell>
                            <TableCell className="font-medium border text-right">TOTAL :</TableCell>
                            <TableCell className="border text-center font-bold">{calculateTotalCount()}</TableCell>
                            <TableCell className="font-medium border text-center">{calculateTotalAmount()}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                <Button className={"mt-2"} onClick={handleSave}>Save</Button>
            </div>
        </div>
    )
}

export default AddEntries