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
  createdAt: string,
  updatedAt: string
}

interface ChatInterface {
  messages: Message[]
  users: User[]
  selectedUser: User | null,
  isUsersLoading: boolean,
  isMessagesLoading: boolean,
  isMessageSending: boolean,
  getUsers: () => void,
  getMessages: (id: string) => void,
  setSelectedUser: (user: User | null) => void,
  sendMessage: (data: { text: string | null, image: string | ArrayBuffer | null }) => void,
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
      set({ users: res.data })
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