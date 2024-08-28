import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

// created use context
const SocketContext = createContext()

export const useSocketContext = () => {
    return useContext(SocketContext)
}

export const SocketContextProvider = ({ children }) => {
    const [userdata, setUserData] = useState([]);
    const [socket, setSocket] = useState(null)
    const [onlineusers, setonlineusers] = useState([''])

    const currentUser = localStorage.getItem("userid");
    // console.log(currentUser)
    useEffect(() => {
        console.log("fetch",currentUser)
        const fetchData = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/GetUserDataById/${currentUser}`);
                setUserData(res.data);
            } catch (err) {
                console.log("Error fetching user data:", err);
            }
        };
        fetchData();
    }, [currentUser])

    useEffect(() => {
        const fetchData =  () => {
            if (userdata) {
                    const socket = io('https://chat-project-n1meirq12-aniketgoyal51s-projects.vercel.app', {
                        query: {
                            userid: userdata._id
                        }
                    });

                    setSocket(socket);

                    // Listening to the "getonlineusers" event
                    socket.on("getonlineusers", (onlineUserIds) => {
                        // Update the online users state with all online user IDs
                        setonlineusers(onlineUserIds);
                        // console.log(onlineusers); // Note: onlineusers may not be updated immediately after calling setonlineusers due to closure.
                    });

                    return () => socket.close();
            }

            else {
                if (socket) {
                    socket.close()
                    setSocket([])
                }
            }
        }
        fetchData();
    }, [userdata])
    // console.log(onlineusers)

    return <SocketContext.Provider value={{ socket, onlineusers }}>{children}</SocketContext.Provider>
}