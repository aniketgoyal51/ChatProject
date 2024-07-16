import { create } from "zustand"

const Chatting = create((set) => ({
    conversation:null,
    setConversation: (convo) => set({ conversation:convo }),
    message:[],
    setMessage: (msg) => set({ message:msg }),
}))

export default Chatting;