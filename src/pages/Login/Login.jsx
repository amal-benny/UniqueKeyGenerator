import React, { useContext, useState } from 'react'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'
import { AuthContext } from '@/context/authContext'
import { useNavigate } from 'react-router-dom'


const Login = () => {
    const [username, setUsername] = useState("")
    const [password,setPassword] = useState("")
    const {login} = useContext(AuthContext)
    const navigate = useNavigate();
    const handleSubmit = async ()=>{
        try {
        toast.loading("Signing in")
        if(!username || !password){
            return toast.error("Username and password is required")
        }
        if(password.length < 8){
            return toast.error("password should be atleast 8 characters long")
        }
        await login(username,password)
        navigate("/")
    } catch (error) {
            toast.dismiss()
            error.response ? toast.error(error) : toast.error(error)
        }
        finally
        {
            // toast.dismiss()
        }
    }

    return (
        <div className='w-[400px] mx-auto mt-40'>
            <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center my-10 mt-[-40px] text-pink-600'>Wify</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {/* form */}
                    <Input onChange={(e)=>{setUsername(e.target.value)}} type="username" placeholder="Username"/>
                    <Input onChange={(e)=>{setPassword(e.target.value)}} type="password" placeholder="Password"/>
                </CardContent>
                <div className='text-center mb-2'>
                    <Button variant="link">Forgot password ?</Button>
                </div>
                <CardFooter>
                    <Button className="mx-auto" onClick={handleSubmit}>Login</Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Login