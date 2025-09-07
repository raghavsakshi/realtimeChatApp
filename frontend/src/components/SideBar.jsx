import React, { useState, useEffect } from "react"
import dp from "../assets/dp.jpeg"
import { useDispatch, useSelector } from "react-redux"
import { RxCross1 } from "react-icons/rx";
import { IoIosSearch } from "react-icons/io";
import { RiLogoutCircleLine } from "react-icons/ri";
import axios from "axios";
import { serverUrl } from "../main";
import { setOtherUsers, setSelectedUser, setUserData ,setOnlineUsers, setSearchData} from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

function SideBar(){
    let {userData,otherUsers,selectedUser,onlineUsers,searchData}=useSelector(state=>state.user)
    let [search,setSearch]=useState(false)
    let [input,setInput]=useState("")
      let dispatch = useDispatch()
      let navigate =useNavigate()
    const handleLogout= async ()=>{
      try {
        let result =await axios.get(`${serverUrl}/api/auth/logout`,{withCredentials:true})
        dispatch(setUserData(null))
        dispatch(setOtherUsers(null))
        navigate("/login")
      }catch (error){
        console.log(error)
      }
    }
      const handlesearch= async ()=>{
      try {
        let result =await axios.get(`${serverUrl}/api/user/search?query=${input}`,{withCredentials:true})
        dispatch(setSearchData(result.data))
      }
      catch (error){
console.log(error)
      }
      
    }
    useEffect(()=>{
      if(input){
handlesearch()
      }
    },[input])
    return(
    <div className={`lg:w-[30%] w-full  lg:block h-full overflow-hidden bg-slate-200 relative
     ${!selectedUser?"block":"hidden"} ` }>
    <div className="w-[60px] h-[60px] rounded-full overflow-hidden
         shadow-gray-500 shadow-lg text-gray-700 mt-[10px] justify-center flex items-center
          cursor-pointer fixed bottom-[3px] 
         left-[10px] bg-[#20c7ff]" onClick={handleLogout}>
        <RiLogoutCircleLine className="w-[25px] h-[25px]  "/>

      </div>
{input.length>0 &&  
       <div className="flex absolute top-[250px] bg-white w-full h-[500px] overflow-y-auto items-center
        flex-col gap-[10px] z-[150px] shadow-lg pt-[20px] ">
                       {searchData?.map((user)=>(
                          <div key={user._id} className="w-[95%] h-[70px] flex items-center 
                          gap-[20px] px-[10px] hover:bg-[#b2ccdf] border-b-2 border-gray-400 cursor-pointer"
             onClick={()=>{dispatch(setSelectedUser(user))
             setInput("")
             setSearch(false)
            }
             }>
                   <div className="relative rounded-full bg-white flex items-center justify-center">   
                     <div className="w-[60px] h-[60px] bg-white  overflow-hidden rounded-full flex 
                     justify-center items-center
                       ">
  <img src={user.image|| dp} alt="" className='h-[100%]' />

  </div>
  {onlineUsers?.includes(user._id)  && 
    <span className="w-[12px] h-[12px] rounded-full bottom-[6px] right-[-1px] absolute bg-[#3aff20]  
     shadow-gray-500 shadow-md "></span>}
    </div>
    <h1 className="text-gray-800 font-semibold text-[20x]">{user.name ||user.userName}</h1>
    </div>
                       ))}
                    </div>
  }
   
    <div className='w-full h-[300px] bg-[#20c7ff] rounded-b-[30%]  shadow-gray-400 shadow-lg
     flex flex-col  justify-center px-[20px] '>
    <h1 className="text-white font-bold text-[25px] ">Zapchat</h1>
    <div className="w-full flex justify-between items-center">
        <h1 className="text-gray-800 font-bold text-[25px] ">Hii , {userData.name || 'user'}</h1>
            <div className="w-[60px] h-[60px] bg-white overflow-hidden rounded-full
            flex justify-center items-center cursor-pointer
             shadow-gray-500 shadow-lg" onClick={()=>navigate("/profile")}>

        <img src={userData.image || dp} alt="" className='h-[100%]' />
    </div>
    </div>
    <div className="w-full flex items-center justify-center gap-[20px] overflow-y-auto py-[18px]">
        {!search && <div className="w-[60px] h-[60px] bg-white rounded-full overflow-hidden
         shadow-gray-500 shadow-lg mt-[10px] justify-center flex items-center cursor-pointer"
          onClick={()=>setSearch(true)}>
        <IoIosSearch className="w-[25px] h-[25px] "/>
    
    </div>}
            
            {search && <form className="w-full h-[60px]  bg-white shadow-gray-500 shadow-lg
             flex items-center gap-[10px] mt-[10px] 
            rounded-full overflow-hidden px-[20px] relative">
                  <IoIosSearch className="w-[25px] h-[25px] "/>
                  <input type="text" placeholder='search users...' className="w-full h-full 
                   text-[17px] p-[10px] outline-none border-0"
                   onChange={(e)=>setInput(e.target.value)} value={input}/> 
                  <RxCross1 className="w-[25px] h-[25px] cursor-pointer" onClick={()=>setSearch(false)}/>
                   
                </form>}
{!search && otherUsers?.map((user)=>(
onlineUsers?.includes(user._id)  &&
                   <div key={user._id} className="relative rounded-full   shadow-gray-500 shadow-lg 
                   flex items-center justify-center cursor-pointer mt-[10px]"
                     onClick={()=>dispatch(setSelectedUser(user))}>   
                     <div className="w-[60px] h-[60px] bg-white  overflow-hidden rounded-full
                      flex justify-center items-center
                       ">
  <img src={user.image|| dp} alt="" className='h-[100%]' />

  </div>
    <span className="w-[12px] h-[12px] rounded-full bottom-[6px] right-[-1px] absolute bg-[#3aff20] 
      shadow-gray-500 shadow-md "></span>
    </div>
  )) } 
 </div>
    </div>

  <div className="w-full h-[60vh]  overflow-auto flex flex-col gap-[20px] items-center mt-[20px]">
     {otherUsers?.map((user)=>(
         <div key={user._id} className="w-[95%] h-[60px] flex items-center gap-[20px]
         bg-white shadow-lg rounded-full hover:bg-[#b2ccdf] cursor-pointer"
          onClick={()=>dispatch(setSelectedUser(user))}>
                   <div className="relative rounded-full   shadow-gray-500 shadow-lg 
                   flex items-center justify-center mt-[10px]">   
                     <div className="w-[60px] h-[60px] bg-white  overflow-hidden rounded-full 
                     flex justify-center items-center
                       ">
  <img src={user.image|| dp} alt="" className='h-[100%]' />

  </div>
  {onlineUsers?.includes(user._id)  && 
    <span className="w-[12px] h-[12px] rounded-full bottom-[6px] right-[-1px] absolute bg-[#3aff20]  
     shadow-gray-500 shadow-md "></span>}
    </div>
    <h1 className="text-gray-800 font-semibold text-[20x]">{user.name ||user.userName}</h1>
    </div>
        ))}

  </div>
    
    </div>
  
    
    )
}

export default SideBar