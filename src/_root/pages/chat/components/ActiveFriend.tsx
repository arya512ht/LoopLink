
import { useEffect, useState } from 'react';

const ActiveFriend = ({user,setCurrentFriend}:any) => {

     const [currentfriendimage,setcurrentfriendimage]=useState()

     useEffect(()=>{
          console.log(user)
          setcurrentfriendimage(user.userInfo.image)
     },[user])

  return (
       <div onClick={()=> setCurrentFriend({
          _id : user.userInfo.id,
          email: user.userInfo.email,
          image : user.userInfo.image,
          userName : user.userInfo.userName
       })} className='active-friend'>
            <div className='image-active-icon'>
                 
                 <div className='image'>
                 <img src={currentfriendimage} alt='' />
                    <div className='active-icon'></div>
                 </div>

                
                 

            </div>

       </div>
  )
};

export default ActiveFriend;
