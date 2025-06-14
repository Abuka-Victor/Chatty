import { create } from "zustand"

import apiClient from "../lib/axios"
import toast from "react-hot-toast"
import type { User } from "./useAuthStore"
import { isMyApiError } from "../lib/utils"
import { AxiosError } from "axios"
import { useAuthStore } from "./useAuthStore"


interface Message {
  _id: string
  receiverId: string,
  senderId: string,
  text: string | null,
  image: string | null,
  type?: "sent" | "received",
  createdAt: string,
  updatedAt: string
}
// interface ChatBotMessage {
//   _id: string
//   senderId: string,
//   text: string | null,
//   image: string | null,
//   createdAt: string,
//   updatedAt: string
// }

interface ChatInterface {
  messages: Message[]
  users: User[]
  selectedUser: User | null,
  isUsersLoading: boolean,
  isMessagesLoading: boolean,
  isMessageSending: boolean,
  getUsers: () => void,
  getMessages: (id: string) => void,
  getChatbotMessages: () => void,
  setSelectedUser: (user: User | null) => void,
  sendMessage: (data: { text: string | null, image: string | ArrayBuffer | null }) => void,
  sendChatBotMessage: (data: { text: string | null, image: string | ArrayBuffer | null }) => void,
  subscribeToMessages: () => void,
  unsubscribeFromMessages: () => void,
}

export const useChatStore = create<ChatInterface>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isMessageSending: false,

  getUsers: async () => {
    set({ isUsersLoading: true })
    try {
      const res = await apiClient.get("message/users")
      const chatBotUser: User = {
        _id: "chatbot",
        id: "chatbot",
        email: "test@chatbot.com",
        fullName: "Chat Bot",
        profilePic: "https://img.freepik.com/free-vector/graident-ai-robot-vectorart_78370-4114.jpg?semt=ais_hybrid&w=740",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      set({ users: [...res.data, chatBotUser] })
      // toast.success("Users retrieved successfully!")
    } catch (error) {
      if (isMyApiError(error) && error.response) {
        toast.error((error.response.data as AxiosError).message)
        console.log("Error in fetching users: ", error)
      }
    } finally {
      set({ isUsersLoading: false })
    }
  },

  getMessages: async (id) => {
    set({ isMessagesLoading: true })
    try {
      const res = await apiClient.get(`message/${id}`)
      set({ messages: res.data })
      // toast.success("Messages retrieved successfully!")
    } catch (error) {
      console.log("Error in fetching messages: ", error)
    } finally {
      set({ isMessagesLoading: false })
    }
  },

  getChatbotMessages: async () => {
    set({ isMessagesLoading: true })
    try {
      const res = await apiClient.get(`chatbot/`)
      set({ messages: res.data })
      // toast.success("Messages retrieved successfully!")
    } catch (error) {
      console.log("Error in fetching messages: ", error)
    } finally {
      set({ isMessagesLoading: false })
    }
  },

  sendMessage: async (data) => {
    set({ isMessageSending: true })
    const { selectedUser, messages } = get()
    try {
      const res = await apiClient.post(`message/users/${selectedUser!._id}`, data)
      set({ messages: [...messages, res.data] })
      // toast.success("Message sent successfully!")
    } catch (error) {
      console.log("Error in posting message: ", error)
    } finally {
      set({ isMessageSending: false })
    }
  },

  sendChatBotMessage: async (data) => {
    set({ isMessageSending: true })
    const { messages } = get()
    try {
      const res = await apiClient.post(`chatbot/`, data)
      set({ messages: [...messages, res.data[0], res.data[1]] })
      // toast.success("Message sent successfully!")
    } catch (error) {
      console.log("Error in posting message: ", error)
    } finally {
      set({ isMessageSending: false })
    }
  },

  setSelectedUser: (user) => {
    try {
      set({ selectedUser: user })
    } catch (error) {
      console.log("Error in selecting user: ", error)
    }
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket?.off("newMessage")
  },

  subscribeToMessages: () => {
    const { selectedUser } = get()
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket

    socket?.on("newMessage", (data) => {
      if (data.senderId === get().selectedUser?._id)
        set({ messages: [...get().messages, data] })
    })
  }

}))