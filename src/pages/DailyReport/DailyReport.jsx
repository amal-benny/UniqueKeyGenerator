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

const DailyReport = () => {
  // Get today's date in the format YYYY-MM-DD
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Add leading zero if necessary
    const day = String(today.getDate()).padStart(2, '0'); // Add leading zero if necessary
    return `${year}-${month}-${day}`;
  };
  const [currentDate, setCurrentDate] = useState(getTodayDate())
  const [otherAmount, setOtherAmount] = useState({})
  const [lotteryDetails, setLotteryDetails] = useState({})
  const [winningAmount, setWinningAmount] = useState({})
  const [bottomTableCount, setBottomTableCount] = useState(0)
  const [bottomTableTotal, setBottomTableTotal] = useState(0)
  const [staffs, setStaffs] = useState([])
  const [topTableTotal, setTopTableTotal] = useState(0);
  const [bottomTable, setBottomTable] = useState([]);
  const [topTable, setTopTable] = useState({
    single: {
      "01:00": 0,
      "03:00": 0,
      "06:00": 0,
      "08:00": 0
    },
    double: {
      "01:00": 0,
      "03:00": 0,
      "06:00": 0,
      "08:00": 0
    },
    lsk: {
      "01:00": 0,
      "03:00": 0,
      "06:00": 0,
      "08:00": 0
    },
    boxkk: {
      "01:00": 0,
      "03:00": 0,
      "06:00": 0,
      "08:00": 0
    }
  });

  // const handleSearch = async () => {
  //     try {
  //         toast.loading("Calculating..")
  //         if (!currentData.date) {
  //             toast.dismiss()
  //             return toast.error("Please enter date")
  //         }
  //         const res = await axios.get(process.env.REACT_APP_BASE_URL + "api/main/get-daily-entries/"+currentData.date);
  //         const res2 = await axios.get(process.env.REACT_APP_BASE_URL + "api/main/get-other-amount");
  //         setOtherAmount(res2.data[0])

  //         function groupAndCalculate(entries, otherDetails) {
  //             const groups = {
  //               A: 0,
  //               B: 0,
  //               C: 0,
  //               AB: 0,
  //               AC: 0,
  //               BC: 0
  //             };

  //             // Helper to sum values based on staff name
  //             const addToGroup = (groupKey, count) => {
  //               if (groups.hasOwnProperty(groupKey)) {
  //                 groups[groupKey] += count;
  //               }
  //             };

  //             // Process each entry
  //             entries.forEach(entry => {
  //               const { staff_name, count } = entry;
  //               if (staff_name === 'Balan') {
  //                 addToGroup('A', count);
  //               } else if (staff_name === 'San_grp' && entry.lottery_name === 'B') {
  //                 addToGroup('B', count);
  //               } else if (staff_name === 'San_grp' && entry.lottery_name === 'AC') {
  //                 addToGroup('C', count);
  //               }

  //               // Double combinations (AB, AC, BC)
  //               if (staff_name === 'Balan' && entry.lottery_name === 'LSK-SUPER') {
  //                 addToGroup('AB', count);
  //                 addToGroup('AC', count);
  //               } else if (staff_name === 'San_grp' && entry.lottery_name === 'B') {
  //                 addToGroup('BC', count);
  //               }
  //             });

  //             // Add lsk and boxkk from otherDetails
  //             const { lsk, boxkk } = otherDetails;
  //             groups.lsk = parseFloat(lsk.$numberDecimal);
  //             groups.boxkk = parseFloat(boxkk.$numberDecimal);
  //             return groups;
  //           }

  //           // Example usage:
  //           const entries = [
  //             // Your entry data here
  //           ];

  //           const result = groupAndCalculate(entries, otherAmount);
  //           console.log(result);

  //         // const { data } = await axios.get(process.env.REACT_APP_BASE_URL + "api/main/get-entry/" + currentData.date + "/" + currentData.time + "/" + currentData.staff_name);
  //         // // Initialize an empty object to store grouped results
  //         // setLotteryDetails(data)
  //         // // Initialize the object to store total counts for each group
  //         // const groupTotals = {
  //         //     Single: 0,
  //         //     Double: 0,
  //         //     lsk: 0,
  //         //     boxkk: 0
  //         // };
  //         // // Iterate over the data to calculate the total count for each group
  //         // data.forEach((dat) => {
  //         //     const { lottery_name, count } = dat;
  //         //     // Create a mapping object for lottery_name to corresponding state keys
  //         //     const groupMap = {
  //         //         A: "Single",
  //         //         B: "Single",
  //         //         C: "Single",
  //         //         AB: "Double",
  //         //         BC: "Double",
  //         //         AC: "Double",
  //         //         "LSK-SUPER": "lsk",
  //         //         BOXKK: "boxkk"
  //         //     };

  //         //     // Get the corresponding group from the map
  //         //     const group = groupMap[lottery_name];

  //         //     if (group) {
  //         //         // Add the count to the corresponding group total
  //         //         groupTotals[group] += count;
  //         //     }
  //         // });
  //         // // After processing the entire data array, update the state with the final totals
  //         // setTopTable((prevData) => ({
  //         //     ...prevData,
  //         //     Single: groupTotals.Single,
  //         //     Double: groupTotals.Double,
  //         //     lsk: groupTotals.lsk,
  //         //     boxkk: groupTotals.boxkk
  //         // }));
  //         // // get all winners for the day
  //         // const winnersData = await axios.get(process.env.REACT_APP_BASE_URL + "api/main/search-winners/" + currentData.date + "/" + currentData.time);
  //         // data.forEach((lotteryItem) => {
  //         //     const { ticket_number, lottery_name, count } = lotteryItem;
  //         //     const { winning } = winnersData.data[0];  // Assuming you're working with the first object in the winningData array

  //         //     let winningPosition = '';

  //         //     // Check if ticket_number matches the main winning positions
  //         //     if (ticket_number === winning.first) {
  //         //         winningPosition = 'first';
  //         //     } else if (ticket_number === winning.second) {
  //         //         winningPosition = 'second';
  //         //     } else if (ticket_number === winning.third) {
  //         //         winningPosition = 'third';
  //         //     } else if (ticket_number === winning.fourth) {
  //         //         winningPosition = 'fourth';
  //         //     } else if (ticket_number === winning.fifth) {
  //         //         winningPosition = 'fifth';
  //         //     }

  //         //     // Check if ticket_number is in the guarantee list
  //         //     if (winning.guarantee.includes(ticket_number)) {
  //         //         winningPosition = 'guarantee';
  //         //     }

  //         //     // Check for A, B, C, AB, AC, BC, BOXKK1-6
  //         //     if (lottery_name === 'A' && winning.A){
  //         //         winningPosition = 'A';
  //         //     } else if (lottery_name === 'B' && winning.B) {
  //         //         winningPosition = 'B';
  //         //     } else if (lottery_name === 'C' && winning.C) {
  //         //         winningPosition = 'C';
  //         //     } else if (lottery_name === 'AB' && winning.AB) {
  //         //         winningPosition = 'AB';
  //         //     } else if (lottery_name === 'AC' && winning.AC) {
  //         //         winningPosition = 'AC';
  //         //     } else if (lottery_name === 'BC' && winning.BC) {
  //         //         winningPosition = 'BC';
  //         //     }
  //         //     // If a winning position is found, update the topTable state
  //         //     if (winningPosition) {
  //         //         setBottomTable((prevData) => ([...prevData, {
  //         //             lottery_name: lottery_name,
  //         //             ticket_number: ticket_number,
  //         //             count: count,
  //         //             winning_position: winningPosition,
  //         //         }]));
  //         //     }
  //         // });
  //         // toast.dismiss()
  //         // toast.success("success")
  //     } catch (error) {
  //         error.response
  //             ? toast.error("Error: " + error.response.data.message)
  //             : toast.error("Failed");
  //     }
  // }
  const handleSearch = async () => {
    try {
      setTopTable({
        single: {
          "01:00": 0,
          "03:00": 0,
          "06:00": 0,
          "08:00": 0
        },
        double: {
          "01:00": 0,
          "03:00": 0,
          "06:00": 0,
          "08:00": 0
        },
        lsk: {
          "01:00": 0,
          "03:00": 0,
          "06:00": 0,
          "08:00": 0
        },
        boxkk: {
          "01:00": 0,
          "03:00": 0,
          "06:00": 0,
          "08:00": 0
        }
      })
      setBottomTable([])
      setTopTableTotal(0)
      setBottomTableCount(0)
      setBottomTableTotal(0)
      if (!currentDate) {
        return toast.error("Date is requried")
      }
      const response1 = await axios.get(process.env.REACT_APP_BASE_URL + "api/main/search-winners-by-date/" + currentDate);
      const response2 = await axios.get(process.env.REACT_APP_BASE_URL + "api/main/get-daily-entries/" + currentDate);
      const entries = response2.data;
      const winning = response1.data[0].winning;
      // Map lottery names to categories
      const groupMap = {
        A: "single",
        B: "single",
        C: "single",
        AB: "double",
        BC: "double",
        AC: "double",
        "LSK-SUPER": "lsk",
        BOXKK: "boxkk"
      };

      // Initialize totals for each category and time
      // // Accumulate counts per category and time from entries
      // entries.forEach((entry) => {
      //   const { lottery_name, count, time, ticket_number } = entry;
      //   const category = groupMap[lottery_name];
      //   // If the entry's lottery name maps to a category and the time is valid, update totals
      //   if (category && categoryTotals[category][time] !== undefined) {
      //     categoryTotals[category][time] += count;
      //   }
      // });

      // Initialize an array to store winning entries
      const winningEntries = [];
      // Loop through each entry to identify if it's a winning ticket based on the winners object
      entries.forEach((entry) => {
        const { ticket_number, lottery_name, time, count } = entry;

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

        // If there's a winning position, add to winning entries
        if (winningPosition) {
          winningEntries.push({
            lottery_name,
            ticket_number,
            time,
            count,
            winning_position: winningPosition
          });
        }
      });
      setBottomTableCount(0)
      setBottomTableTotal(0)
      winningEntries.forEach((entry)=>{
        setBottomTableCount((prev)=>(prev+entry.count))
        setBottomTableTotal((prev)=>(prev+(entry.count * winningAmount[entry.winning_position])))
      })
      setBottomTable(winningEntries)
      const updatedTopTable = {
        single: {
          "01:00": 0,
          "03:00": 0,
          "06:00": 0,
          "08:00": 0
        },
        double: {
          "01:00": 0,
          "03:00": 0,
          "06:00": 0,
          "08:00": 0
        },
        lsk: {
          "01:00": 0,
          "03:00": 0,
          "06:00": 0,
          "08:00": 0
        },
        boxkk: {
          "01:00": 0,
          "03:00": 0,
          "06:00": 0,
          "08:00": 0
        }
      }
      let tempTotal = 0
      entries.forEach((entry) => {
        const group = groupMap[entry.lottery_name]; // Map lottery name to group
        if (group && updatedTopTable[group] && updatedTopTable[group][entry.time] !== undefined) {
          updatedTopTable[group][entry.time] += entry.count;
        }
        tempTotal += entry.count * Number(otherAmount[group]["$numberDecimal"])
      });
      setTopTableTotal(tempTotal)
      setTopTable(updatedTopTable);
    } catch (error) {
      console.log(error)
    }
  }

  // const handleEditClick = (date, time, staff_name) => {
  //     const params = new URLSearchParams({
  //         date: date,
  //         time: time,
  //     });
  //     navigate(`/edit-entries?${params.toString()}`);
  // }

  // const calculateTotalCountForBottom = ()=>{
  //     let data = 0;
  //     bottomTable.forEach(({count})=>{
  //         data += count
  //     })
  //     return data
  // }

  // const name2group = {
  //   A: "single",
  //   B: "single",
  //   C: "single",
  //   AB: "double",
  //   BC: "double",
  //   AC: "double",
  //   "LSK-SUPER": "lsk",
  //   BOXKK: "boxkk"
  // };
  // const calculateSalesTotal = ()=>{
  //   let total = 0
  //   allEntries.forEach((entry)=>{
  //     let group = name2group[entry.lottery_name]
  //     total += (entry.count * otherAmount[group]['$numberDecimal'])
  //   })
  //   return total
  // }

  // const calculateWinningTotal = ()=>{
  //     let data = 0;
  //     bottomTable.forEach(({count, winning_position})=>{
  //         data += count * winningAmount[winning_position]
  //     })
  //     return data
  // }

  const codeToLotteryName = {
    "lsk":"LSK-SUPER",
     "single":"Single",
     "double":"Double",
     "boxkk":"BOXKK"
  }

  const fetchData = async () => {
    try {
      const res2 = await axios.get(process.env.REACT_APP_BASE_URL + "api/main/get-other-amount");
      const res3 = await axios.get(process.env.REACT_APP_BASE_URL + "api/main/get-winning-amount");
      setOtherAmount(res2.data[0])
      setWinningAmount(res3.data)
    } catch (error) {
      error.response
        ? toast.error("Error: " + error.response.data.message)
        : toast.error("Failed");
    }
  };

  useEffect(() => {
    fetchData();
  }, [])

  // useEffect(()=>{
  // },[topTable])

  return (
    <div className='mt-[80px]'>
      <h2 className="text-center scroll-m-20 pb-2 text-4xl font-semibold tracking-tight pt-2 first:mt-0">
        Daily Report
      </h2>
      {/* Search Form */}
      <div className='flex justify-center items-center  md:items-end gap-3 flex-col md:flex-row px-20 '>
        <div>
          <label htmlFor="date">Date</label>
          <Input onChange={(e) => { setCurrentDate(e.target.value) }} value={currentDate} type="date" name="date" />
        </div>
        {/* search */}
        <Button onClick={handleSearch}>Search</Button>
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
                Object.keys(topTable).map((lottery_name,index)=>(
                  topTable[lottery_name]["01:00"] > 0 ?
                  <TableRow key={index}>
                    <TableCell className="font-medium border">{codeToLotteryName[lottery_name]} (01:00)</TableCell>
                    <TableCell className="font-medium border">{topTable[lottery_name]["01:00"]}</TableCell>
                    <TableCell className="font-medium border text-right">{otherAmount[lottery_name]["$numberDecimal"]}</TableCell>
                    <TableCell className="font-medium border text-right">{(topTable[lottery_name]["01:00"])*(otherAmount[lottery_name]["$numberDecimal"])}</TableCell>
                  </TableRow>
                  :""
                ))
            }
            {
                Object.keys(topTable).map((lottery_name,index)=>(
                  topTable[lottery_name]["03:00"] > 0 ?
                  <TableRow key={index}>
                    <TableCell className="font-medium border">{codeToLotteryName[lottery_name]} (03:00)</TableCell>
                    <TableCell className="font-medium border">{topTable[lottery_name]["03:00"]}</TableCell>
                    <TableCell className="font-medium border text-right">{otherAmount[lottery_name]["$numberDecimal"]}</TableCell>
                    <TableCell className="font-medium border text-right">{(otherAmount[lottery_name]["$numberDecimal"])*(topTable[lottery_name]["03:00"])}</TableCell>
                  </TableRow>
                  : ""
                ))
            }
            {
                Object.keys(topTable).map((lottery_name,index)=>(
                  topTable[lottery_name]["06:00"] > 0 ?
                  <TableRow key={index}>
                    <TableCell className="font-medium border">{codeToLotteryName[lottery_name]} (06:00)</TableCell>
                    <TableCell className="font-medium border">{topTable[lottery_name]["06:00"]}</TableCell>
                    <TableCell className="font-medium border text-right">{otherAmount[lottery_name]["$numberDecimal"]}</TableCell>
                    <TableCell className="font-medium border text-right">{(topTable[lottery_name]["06:00"])*(otherAmount[lottery_name]["$numberDecimal"])}</TableCell>
                  </TableRow>
                  : ""
                ))
            }
            {
                Object.keys(topTable).map((lottery_name,index)=>(
                  topTable[lottery_name]["08:00"] > 0 ?
                  <TableRow key={index}>
                    <TableCell className="font-medium border">{codeToLotteryName[lottery_name]} (08:00)</TableCell>
                    <TableCell className="font-medium border">{topTable[lottery_name]["08:00"]}</TableCell>
                    <TableCell className="font-medium border text-right">{otherAmount[lottery_name]["$numberDecimal"]}</TableCell>
                    <TableCell className="font-medium border text-right">{(topTable[lottery_name]["08:00"])*(otherAmount[lottery_name]["$numberDecimal"])}</TableCell>
                  </TableRow>
                  :""
                ))
            }
            <TableRow>
              <TableCell className="font-medium border"></TableCell>
              <TableCell className="font-medium border"></TableCell>
              <TableCell className="font-medium border text-right">Sales Total= </TableCell>
              <TableCell className="font-medium border text-right">{topTableTotal}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        {
                    topTable.double <= 0 && topTable.single <= 0 && topTable.boxkk <= 0 && topTable.lsk <= 0 ?
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
              bottomTable.map((winn,index)=>(

              <TableRow key={index}>
                <TableCell className="font-medium border">{winn.lottery_name}</TableCell>
                <TableCell className="font-medium border">{winn.ticket_number}</TableCell>
                <TableCell className="font-medium border">{winn.count}</TableCell>
                <TableCell className="font-medium border">{winn.winning_position}</TableCell>
                <TableCell className="font-medium border">{winningAmount[winn.winning_position]*winn.count}</TableCell>
              </TableRow>
            ))
            }
            <TableRow>
              <TableHead className="text-center border text-black font-bold">TOTAL</TableHead>
              <TableHead className="text-center border"></TableHead>
              <TableHead className="text-left border text-black ">{bottomTableCount}</TableHead>
              <TableHead className="text-right border w-40 text-black">Total Winning: </TableHead>
              <TableHead className="text-center border w-40 text-black">{bottomTableTotal}</TableHead>
            </TableRow>
            <TableRow>
              <TableHead className="text-center border text-black font-bold"></TableHead>
              <TableHead className="text-center border"></TableHead>
              <TableHead className="text-left border text-black "></TableHead>
              <TableHead className="text-right border w-40 text-black">Sales Amount: </TableHead>
              <TableHead className="text-center border w-40 text-black">{topTableTotal}</TableHead>
            </TableRow>
            <TableRow>
              <TableHead className="text-center border text-black font-bold"></TableHead>
              <TableHead className="text-center border"></TableHead>
              <TableHead className="text-left border text-black "></TableHead>
              <TableHead className="text-right border w-40 text-black">Balance: </TableHead>
              <TableHead className="text-center border w-40 text-black">{(topTableTotal - bottomTableTotal) > 0 ? "+" : "" + (topTableTotal - bottomTableTotal)}</TableHead>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default DailyReport
