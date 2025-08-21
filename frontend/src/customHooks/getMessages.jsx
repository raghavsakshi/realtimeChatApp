import axios from "axios"
import { useEffect } from "react"
import { serverUrl } from "../main"
import { useSelector, useDispatch } from "react-redux"
import { setMessages } from "../redux/messageSlice"
const useMessage=()=>{
    let {userData,selectedUser}=useSelector(state=>state.user)
    let dispatch =useDispatch()
    useEffect(()=>{
        if(!selectedUser) return;
        const fetchMessages =async ()=>{
            try {
                let result=await axios.get(`${serverUrl}/api/message/get/${selectedUser._id}`,
                    {withCredentials:true})
                    dispatch(setMessages(result.data))

            } catch (error) {
                console.log(error)
            }
        }
        fetchMessages()
    },[selectedUser,userData])
}
export default useMessage