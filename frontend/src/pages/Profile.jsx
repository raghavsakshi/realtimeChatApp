import React from 'react'
import dp from "../assets/dp.jpeg"
import { IoCameraOutline } from 'react-icons/io5'
import { useDispatch, useSelector } from 'react-redux'
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react'
import { useRef } from 'react';
import { serverUrl } from '../main';
import { setUserData } from '../redux/userSlice';
import axios from "axios";
function Profile() {
    let {userData} =useSelector(state=>state.user)
    let navigate=useNavigate()
    let [name,setName] =useState(userData?.name || "")
    let [frontendImage,setFrontendImage] =useState(userData?.image || dp)
   let [backendImage,setBackendImage] =useState(null)
   let image=useRef()
   let [saving,setSaving]=useState(false)
   let [error,setError] =useState("")
   let dispatch =useDispatch()
   const handleImage =(e)=>{
    let file =e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
   }
   const handleProfile = async (e)=>{
e.preventDefault()
 setSaving(true)
 setError("")
try {
    let formData =new FormData()
    formData.append("name",name)
    if(backendImage){
        formData.append("image",backendImage)
    }

        console.log("Uploading:", {name, hasImage: !!backendImage});
        console.log("Server URL being used:", serverUrl); // Debug log
    let result = await axios.put(`${serverUrl}/api/user/profile`, formData ,
        {withCredentials:true})
    console.log("Profile update response:", result.data); // Debug log
    setSaving(false)
    dispatch(setUserData(result.data))

    navigate("/")
} catch (error) {

        console.log("Profile update error:", error); // Debug log
        console.log("Error response:", error.response); // Debug log
    setSaving(false)
        // Add error state to show user what went wrong
    setError(error?.response?.data?.message || "Failed to save profile")
}
   }
    return(
   <div className='w-full h-[100vh] bg-slate-200 flex flex-col justify-center items-center gap-[20px]' >
    <div className='fixed top-[20px] left-[20px] cursor-pointer' onClick={()=>navigate("/")}>
        <IoMdArrowBack className='w-[50px] h-[50px] text-gray-600'/>
    </div>
<div className=" bg-white rounded-full border-4 border-[#20c7ff]  shadow-gray-400 shadow-lg  relative "
 onClick={()=>image.current.click()}>
    <div className="w-[200px] h-[200px] overflow-hidden rounded-full flex justify-center items-center">
        <img src={frontendImage} alt="" className='h-[100%]' />
    </div>
    <div  className="absolute bottom-6 right-4 rounded-full w-[35px] h-[35px] bg-[#20c7ff] text-gray-700 
     flex justify-center items-center  shadow-gray-400 shadow-lg">
<IoCameraOutline className="  w-[25px] h-[25px] text-gray-700" />
</div>
</div>

<form className='w-[95%]  max-w-[500px] flex flex-col gap-[20px] items-center justify-center' onSubmit={handleProfile}>
    <input type="file" accept='image/*' ref={image} hidden onChange={handleImage}/>
<input type="text" placeholder='Enter your name'  className='w-[90%] h-[50px] outline-none border-2 border-[#20c7ff] 
px-[20px] py-[10px] bg-[white] rounded-lg shadow-gray-400 shadow-lg text-gray-700 text-[19px]' onChange={(e)=>{
    setName(e.target.value)}} value ={name}/>
<input type="text" readOnly  className='w-[90%] h-[50px] outline-none border-2 border-[#20c7ff] 
px-[20px] py-[10px] bg-[white] rounded-lg shadow-gray-400 shadow-lg text-gray-400 text-[19px]' value={userData?.userName}/>
<input type="email" readOnly  className='w-[90%] h-[50px] outline-none border-2 border-[#20c7ff] 
px-[20px] py-[10px] bg-[white] rounded-lg shadow-gray-400 shadow-lg text-gray-400 text-[19px]' value={userData?.email}/>

{error && <div className="text-red-500 text-center">{error}</div>}
<button className='px-[20px] py-[10px] bg-[#20c7ff] rounded-2xl shadow-gray-400 shadow-lg text-[20px]
w-[200px] mt-[20px] font-semibold hover:shadow-inner' disabled={saving}>{saving ? "saving...":"Save Profile"}</button>
</form>
   </div>
    )
}

export default Profile



