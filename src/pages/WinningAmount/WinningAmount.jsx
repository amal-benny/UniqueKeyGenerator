import React, { useContext, useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { AuthContext } from '@/context/authContext'
import axios from "../../config/AxiosConfig"

const WinningAmount = () => {
  const [winningAmounts, setWinningAmounts] = useState({})
  const [amountsToUpdate, setAmountsToUpdate] = useState([])
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const handleAmountChange = (name, value) => {
    setWinningAmounts(prevAmounts => ({
      ...prevAmounts,
      [name]: value
    }))
    if (!amountsToUpdate.includes(name)) {
      setAmountsToUpdate(prev => [...prev, name])
    }
  }

  const fetchData = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BASE_URL}api/main/get-winning-amount`)
      setWinningAmounts(res.data)
    } catch (error) {
      error.response
        ? toast.error(`Error: ${error.response.data.message}`)
        : toast.error("Failed to fetch data")
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSave = async () => {
    try {
      const updatedAmounts = {}
      amountsToUpdate.forEach(name => {
        updatedAmounts[name] = winningAmounts[name]
      })

      await axios.post(`${process.env.REACT_APP_BASE_URL}api/main/update-winning-amount`, updatedAmounts)
      toast.success("Successfully updated winning amounts")
      setAmountsToUpdate([])
    } catch (error) {
      error.response
        ? toast.error(`Error: ${error.response.data.message}`)
        : toast.error("Failed to update winning amounts")
    }
  }

  return (
    <div className='mt-[80px]'>
      <h2 className="text-center scroll-m-20 pb-2 text-4xl font-semibold tracking-tight pt-2 first:mt-0">
        Winning Amount
      </h2>
      <div className='px-10 mt-4 max-w-[800px] mx-auto'>
        <Table className="border-2 border-black rounded-md">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center border-black border-2">S No</TableHead>
              <TableHead className="text-center border-black border-2">Name</TableHead>
              <TableHead className="text-center border-black border-2">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(winningAmounts).map(([name, value], index) => (
              !['_id', 'date', 'time','updatedAt'].includes(name) && (
                <TableRow key={name}>
                  <TableCell className="font-medium border-2 border-black text-center">{index - 2}</TableCell>
                  <TableCell className="font-medium border-2 border-black text-center">{name}</TableCell>
                  <TableCell className="font-medium border-2 border-black text-center max-w-10">
                    <Input
                      onChange={(e) => handleAmountChange(name, e.target.value)}
                      disabled={user.username == "manager" ? true : false}
                      value={value}
                      type="number"
                    />
                  </TableCell>
                </TableRow>
              )
            ))}
          </TableBody>
        </Table>
        {
            user.username == "admin" ?

        <Button 
          className="mb-16 mt-5" 
          onClick={handleSave}
          disabled={amountsToUpdate.length === 0}
        >
          Update
        </Button> : ""
        }
      </div>
    </div>
  )
}

export default WinningAmount