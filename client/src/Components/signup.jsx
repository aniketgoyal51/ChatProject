import React from 'react'
import {useForm } from 'react-hook-form'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Signup() {
    const { register, handleSubmit } = useForm()
    const navigate=useNavigate()
    

    const onSubmit = (data) => {
        console.log(data)
        axios.post(`${import.meta.env.VITE_SERVER_URL}/signup`, data)
            .then((res) => {
                console.log(res.data)
                if (res.data === "user already exist") {
                    // alert("user already exist")
                }
                else {
                    navigate('/chat')
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h1>Signup</h1>
            <label htmlFor="">Name</label>
            <input type="text" {...register("username")}/>
            <label htmlFor="">Email</label>
            <input type="text" {...register("email")}/>
            <label htmlFor="">Password</label>
            <input type="password" {...register("password")}/>
            <button type="submit">Signup</button>
        </form>
    )
}

export default Signup