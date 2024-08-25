import React, { useEffect, useRef, useState } from 'react'
import Chatting from '../Zustand/Zustand'
import css from '../CSS/chat.module.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useSocketContext } from '../Context/socketcontext'
import { formatDistanceToNow } from 'date-fns';


function Chat() {
    const [userdata, setUserData] = useState([]); // Changed to single state variable
    const [msg, setmsg] = useState("")
    const { conversation, setConversation } = Chatting();
    const { message, setMessage } = Chatting()
    const [search, setSearch] = useState("");
    const [conversationerror, setconversationerror] = useState("");
    const { onlineusers } = useSocketContext()
    const { socket } = useSocketContext()

    const currentUser = localStorage.getItem("userid")
    const navigate = useNavigate();

    const lastMessageRef=useRef()

    //last message ref
    useEffect(()=>{
        setTimeout(()=>{
            lastMessageRef.current?.scrollIntoView({behavior:"smooth"})
        },100)
    },[message])

    // getting side bar chat users
    useEffect(() => {
        // console.log("data",currentUser)
        axios.get(`${import.meta.env.VITE_SERVER_URL}/GetUserData/${currentUser}`)
            .then((res) => {
                const data = res.data;
                setUserData(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    // handle message send buttton and post the msg in backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (conversation) {
                const recieverid = conversation._id;
                if (msg === "") {
                    return
                }
                await axios.post(`${import.meta.env.VITE_SERVER_URL}/SendMessage/${recieverid}`, { senderid: localStorage.getItem("userid"), msg })
                    .then((res) => {
                        setMessage([...message, res.data])
                    })
                // Clear the message input after sending
                setmsg("");
            }
        } catch (err) {
            console.log(err);
        }
    };

    // handle message get from server
    useEffect(() => {
        if (conversation) {
            const run = () => {
                axios.get(`${import.meta.env.VITE_SERVER_URL}/${conversation._id}`, { params: { senderid: currentUser } })
                    .then(async (res) => {
                        // console.log(res.data)
                        setconversationerror(null)
                        setMessage(res.data)
                    })
                    .catch(async (err) => {
                        setMessage([])
                        setconversationerror(err)
                    })
            }
            run()
        }
    }, [conversation])

    // handle process of sending messages
    const handleSend = (e) => {
        setmsg(e.target.value)
    };


    // listening of messages
    const useListenMessages = () => {
        useEffect(() => {
            socket?.on("newMessage", (newMessage) => {
                setMessage([...message, newMessage])
            })

            return () => {
                socket?.off("newMessage")
            }
        }, [socket, setMessage, message])
    }
    useListenMessages()


    return (
        <div className={css.container}>
            <div className={css.chatmembers}>
                <input type="text" onChange={(e) => setSearch(e.target.value)} placeholder="search" value={search} />
                {userdata && userdata.filter(user => user.username.toLowerCase().includes(search.toLowerCase())).map((data) => (
                    <div key={data._id}>
                        <h2 onClick={() => setConversation(data)}>{data.username}</h2><span> {onlineusers.includes(data._id) ? "online" : "offline"}</span>
                    </div>
                ))}
                <button onClick={() => { navigate("/"); localStorage.clear(); }}>LogOut</button>
            </div>
            <div className={css.chatarea}>
                <h2>{conversation ? conversation.username : "Chat with someone"}</h2>
                {/* Display messages here */}
                <div className={css.messagearea}>
                    {conversationerror && <p>{`${conversationerror.response.data.error} with ${conversation.username}`}</p>}
                    {message && message.map((data) => (
                        <div key={data._id} 
                            ref={lastMessageRef}>
                            <div style={{ textAlign: data.senderid === localStorage.getItem("userid") ? "right" : "left" }} className={css.message}>

                                <p className={css.messagetext}>
                                    {data.message}
                                </p>
                                <p className={css.time}>
                                    {formatDistanceToNow(new Date(data.createdAt), { addSuffix: true })}
                                </p>
                            </div>
                            <br />
                        </div>

                    ))}
                </div>
                <input type="text" value={msg} onChange={(e) => handleSend(e)} />
                <button onClick={(e) => handleSubmit(e)}>Send</button>
            </div>
        </div>
    );
}


export default Chat