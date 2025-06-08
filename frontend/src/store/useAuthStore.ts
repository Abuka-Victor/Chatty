import { create } from "zustand"
import toast from "react-hot-toast"
import { io, Socket } from "socket.io-client"

import apiClient from "../lib/axios"
import { isMyApiError } from "../lib/utils"
import type { AxiosError } from "axios"

export interface User {
  _id: string,
  id: string,
  email: string,
  fullName: string,
  profilePic: string,
  createdAt: string,
  updatedAt: string,
}

interface UserSignUp {
  email: string,
  fullName: string,
  password: string,
}

interface UserLogin {
  email: string,
  password: string,
}

interface UserUpdate {
  profilePic: string | ArrayBuffer | null
}

interface AuthInterface {
  authUser: User | null,
  isSigningUp: boolean,
  isLoggingIn: boolean,
  isLoggingOut: boolean,
  isUpdatingProfile: boolean,
  isCheckingAuth: boolean,
  onlineUsers: string[],
  socket: Socket | null,
  checkAuth: () => void,
  signUp: (data: UserSignUp) => void,
  login: (data: UserLogin) => void,
  logout: () => void,
  connectSocket: () => void,
  disconnectSocket: () => void,
  updateProfile: (data: UserUpdate) => void,
}

const BASE_URL = "http://localhost:8080"

export const useAuthStore = create<AuthInterface>((set, get) => ({
  authUser: null,
  socket: null,
  isSigningUp: false,
  isLoggingIn: false,
  isLoggingOut: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  checkAuth: async () => {
    try {
      const res = await apiClient.get("/auth/check")
      set({ authUser: res.data })

      get().connectSocket()
    } catch (error) {
      console.log("Error in checkauth: ", error)
      set({ authUser: null })
    } finally {
      set({ isCheckingAuth: false })
    }
  },
  signUp: async (data) => {
    set({ isSigningUp: true })
    try {
      const res = await apiClient.post("/auth/signup", data)
      set({ authUser: res.data })
      toast.success("Account created succesfully!")

      get().connectSocket()
    } catch (error) {
      if (isMyApiError(error) && error.response) {
        toast.error((error.response.data as AxiosError).message)
      }
      console.log("Error in signup: ", error)
      set({ authUser: null })
    } finally {
      set({ isSigningUp: false })
    }
  },
  login: async (data) => {
    set({ isLoggingIn: true })
    try {
      const res = await apiClient.post("/auth/login", data)
      set({ authUser: res.data })
      toast.success("Login succesfull!")

      get().connectSocket();
    } catch (error) {

      if (isMyApiError(error) && error.response) {
        toast.error((error.response.data as AxiosError).message)
      }
      console.log("Error in login: ", error)
      set({ authUser: null })
    } finally {
      set({ isLoggingIn: false })
    }
  },
  logout: async () => {
    set({ isLoggingOut: true })
    try {
      await apiClient.post("auth/logout")
      set({ authUser: null })
      get().disconnectSocket();
      toast.success("Logged out successfully!")
    } catch (error) {
      if (isMyApiError(error) && error.response) {
        toast.error((error.response.data as AxiosError).message)
      }
      console.log("Error in logout: ", error)
    } finally {
      set({ isLoggingOut: false })
    }
  },
  updateProfile: async (data) => {
    set({ isLoggingOut: true })
    try {
      const res = await apiClient.put("auth/update-profile", data)
      set({ authUser: res.data })
      toast.success("Profile updated successfully")
    } catch (error) {
      toast.loading("Payload might be too large. Consider Reducing the size of the Image", { duration: 3 * 1000 });
      if (isMyApiError(error) && error.response) {
        toast.error((error.response.data as AxiosError).message)
      }
      // toast.error(error.response.data.message)
      console.log("Error in logout: ", error)
    } finally {
      set({ isLoggingOut: false })
    }
  },
  connectSocket: () => {
    const { authUser } = get()
    if (!authUser || get().socket?.connected) {
      return;
    }
    const socket = io(BASE_URL, {
      query: {
        userId: authUser.id
      }
    });
    socket.connect()
    set({ socket: socket })

    socket.on("getOnlineUsers", (data) => {
      set({ onlineUsers: data })
    })
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket?.disconnect()
  }
}))