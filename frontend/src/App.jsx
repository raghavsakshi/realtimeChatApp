import React, { useEffect } from 'react'

import { Navigate,Route,Routes } from 'react-router-dom';
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import useCurrentUser from './customHooks/getCurrentUser';
import { useSelector, useDispatch } from 'react-redux';
import Profile from './pages/Profile';
import Home from './pages/Home';
import useOtherUsers from './customHooks/getOtherUsers';
import {io} from 'socket.io-client';
import { serverUrl } from './main';
import { setOnlineUsers, setSocket } from './redux/userSlice';

function App() {
  useCurrentUser();
  useOtherUsers();
  let {userData,socket,onlineUsers} =useSelector(state=>state.user)
  let dispatch = useDispatch()
  useEffect(()=>{
    if(userData){
const socketio =io(`${serverUrl}`,{
query:{
  userId:userData?._id
}
})
dispatch(setSocket(socketio))

socketio.on("getOnlineUsers",(users)=>{
  dispatch(setOnlineUsers(users))
    })
return () =>socketio.close()
}
else{
  if(socket){
    socket.close()
    dispatch(setSocket(null))
  }
}
  
  },[userData])
  return(
<Routes>
  <Route path ='/login' 
  element ={!userData? <Login/> : <Navigate to="/"/>}/>
    <Route path ='/signup'
     element ={!userData? <SignUp/> : <Navigate to="/profile"/>}/>
     <Route path ='/'
      element ={userData? <Home/> : <Navigate to="/login"/>}/>
      <Route path ='/profile' 
      element ={userData?  <Profile/> : <Navigate to="/SignUp"/>}/>

</Routes>
  )
}
export default App