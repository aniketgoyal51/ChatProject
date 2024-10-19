import React, {useState,useEffect} from 'react'
import {useForm } from 'react-hook-form'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Login() {
    const { register, handleSubmit } = useForm()
    const navigate=useNavigate()

    // console.log(import.meta.env.VITE_SERVER_URL)
    const onSubmit = async (data) => {
        await axios.post(`${import.meta.env.VITE_SERVER_URL}/login`, data)
            .then((res) => {
                console.log(res)
            })
            .catch((err) => {
                console.log(err)
            })   
        await axios.get(`${import.meta.env.VITE_SERVER_URL}/GetCurrentUser/${data.email}`)
                .then((res)=>{
                    localStorage.setItem("userid",res.data._id)
                    console.log(res.data._id)
                })
                .catch((err)=>{console.log(err)})
            // console.log(data.email)
        navigate("/chat")
    }


    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h1>Login</h1>
            <label htmlFor="">Email</label>
            <input type="text" {...register("email")}/>
            <label htmlFor="">Password</label>
            <input type="password" {...register("password")}/>
            <button type="submit">Login</button>
        </form>
    )
}

export default Login