import React, { useEffect, useState, useRef } from "react"
import { IoMdArrowBack } from "react-icons/io";
import dp from "../assets/dp.jpeg"
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/userSlice";
import { FaImages } from "react-icons/fa";
import { RiEmojiStickerLine } from "react-icons/ri";
import { IoMdSend } from "react-icons/io";
import EmojiPicker from 'emoji-picker-react';
import { setMessages } from "../redux/messageSlice";
import axios from "axios";
import { serverUrl } from "../main";
import SenderMessage from "./SenderMessage";
import ReceiverMessage from "./ReceiverMessage";


function MessageArea(){
    let {selectedUser,userData,socket}= useSelector(state=>state.user)
    let dispatch =useDispatch()
    let [showPicker,setShowPicker]=React.useState(false)
    let [input,setInput] =useState("")
    let [frontendImage,setFrontendImage]=useState(null)
    let [backendImage,setBackendImage]=useState(null)
    let image=useRef()
    let {messages}=useSelector(state=>state.message)

    const handleImage =(e)=>{
    let file =e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
   }

    const handleSendMessage=async (e)=>{

        e.preventDefault()
        if(input.length==0 && backendImage==null){
            return 
        }
        try {
            let formData =new FormData()
            formData.append("message",input)
            if(backendImage){
                formData.append("image",backendImage)
            }
            let result=await axios.post(`${serverUrl}/api/message/send/${selectedUser._id}`,formData,{withCredentials:true})
      dispatch(setMessages([...messages,result.data]))
            setInput("")
            setFrontendImage(null)
            setBackendImage(null)
        } catch (error) {
            console.log(error)
        }
    }
const onEmojiClick =(emojiData) => {
setInput(prevInput=>prevInput+emojiData.emoji)
setShowPicker(false)
  };
  useEffect(()=>{
if(socket){
socket.on("newMessage",(mess)=>{
    dispatch(setMessages(prevMessages => [...prevMessages, mess]))
})
return ()=>socket.off("newMessage")
}
  },[socket, dispatch])

    return (
    <div className={`lg:w-[70%] ${selectedUser?"flex":"hidden"}  relative lg:flex w-full h-full bg-slate-200 border-l-2 border-gray-300`}>

  {selectedUser && 
  <div className="w-full h-[100vh]  flex flex-col">
   <div className='w-full h-[100px] bg-[#1797c2] rounded-b-[30px]  shadow-gray-400 shadow-lg 
         gap-[20px] flex  items-center px-[20px] '>
<div className=' cursor-pointer' onClick={()=>dispatch(setSelectedUser(null))}>
          <IoMdArrowBack className='w-[40px] h-[40px] text-white'/>
      </div>
        <div className="w-[50px] h-[50px] bg-white overflow-hidden rounded-full flex justify-center items-center cursor-pointer
                   shadow-gray-500 shadow-lg">
          <img src={selectedUser?.image ||dp } alt="" className='h-[100%]' />
          </div>
          <h1 className="text-white font-semibold text-[20x]">{selectedUser?.name || "user"} </h1>
      </div>
      <div className="w-full h-[70%] flex flex-col py-[30px] px-[20px] overflow-auto gap-[20px]">
{showPicker &&  <div className="absolute bottom-[120px] left-[20px]">
    <EmojiPicker width={250} height={350} className="shadow-lg z-[100]"
onEmojiClick={onEmojiClick}/> </div>}

 {messages && messages.map((mess, index)=>(
<div key={mess._id || index}>
{mess.sender==userData._id?<SenderMessage image={mess.image} message={mess.message}/>
:<ReceiverMessage image={mess.image} message={mess.message}/>}
</div>
))}

      </div>
    </div>}
     {!selectedUser && <div className="w-full h-full justify-center flex flex-col items-center">
        <h1 className="text-gray-700 font-bold text-[50x] ">Welcome to Zapchat</h1>
        <span className="text-gray-700 font-semibold text-[30x]"> Chat Friendly !</span>
        </div>}

{selectedUser &&  <div className="w-full lg:w-[70%] h-[100px] fixed bottom-[20px] flex items-center justify-center ">
     <img src={frontendImage} alt="" className='w-[80px] absolute bottom-[100px] right-[20%] rounded-lg shadow-gray-400 shadow-lg'/>
      <form className="w-[95%] lg:w-[70%] h-[60px] bg-[#1797c2] shadow-gray-400 shadow-lg rounded-full
       flex items-center gap-[10px] px-[20px] " onSubmit={handleSendMessage}>
       

<div onClick={()=>setShowPicker(prev=>!prev)}>
    <RiEmojiStickerLine className="w-[25px]  h-[25px] cursor-pointer text-white" />
</div>
<input type="file" accept='image/*' ref={image} hidden onChange={handleImage}/>
<input type="text" placeholder="Message" className="w-full h-full bg-transparent placeholder-white" 
onChange={(e)=>setInput(e.target.value)} value={input}/>
<div onClick={()=>image.current.click()}>
    <FaImages  className="w-[25px]  h-[25px] cursor-pointer text-white"  />
</div>
{(input.length>0 ||  backendImage!= null) && (<button type="submit">
     <IoMdSend   className="w-[25px] h-[25px] cursor-pointer text-white"/>
 </button>)
}

 </form>
</div>
}  
 </div>
     )
}

export default MessageArea 