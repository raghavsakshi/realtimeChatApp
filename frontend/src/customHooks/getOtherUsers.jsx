import axios from "axios"
import { useEffect } from "react"
import { serverUrl } from "../main"
import { setOtherUsers } from "../redux/userSlice"
import { useDispatch, useSelector } from "react-redux"
const useOtherUsers=()=>{
    let {userData}=useSelector(state=>state.user)
    let dispatch =useDispatch()
    useEffect(()=>{
        if(!userData) return;
        const fetchUser =async ()=>{
            try {
                let result=await axios.get(`${serverUrl}/api/user/others`,
                    {withCredentials:true})
                    dispatch(setOtherUsers(result.data))
            } catch (error) {
                console.log(error)
            }
        }
        fetchUser()
    },[userData])
}
export default useOtherUsers
