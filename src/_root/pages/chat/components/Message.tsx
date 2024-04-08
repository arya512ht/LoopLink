import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaRegCheckCircle } from "react-icons/fa";
import axios from 'axios';

const Message = ({ message, currentfriend, scrollRef, typingMessage }:any) => {
     const { myInfo } = useSelector(state => state.auth);

     const [currentfriendimage, setcurrentfriendimage] = useState()
     const [msg,setmsg] = useState(message);

     useEffect(() => {
          // const img = await getImage(currentfriend.image)
          setcurrentfriendimage(currentfriend.image)
     }, [currentfriend])

     const getImage = async (id:any) => {
          const res = await axios.get(`https://looplink-chat-backend.onrender.com/api/messenger/?imageid=${id}`);
          return res.data.imageURL;
     }

     

     // console.log(myInfo)
     return (
          <>
               <div className='message-show'>
                    {
                         message && message.length > 0 ? message.map((m:any, index:any) =>
                         
                              m.senderId === myInfo.id ?
                                   <div ref={scrollRef} className='my-message' key={index}>
                                        <div className='image-message'>
                                             <div className='my-text'>
                                                  <p className='message-text'> {m.message.text === '' ? <img src={m.message.image} /> : m.message.text} </p>

                                                  {
                                                       index === msg.length - 1 && m.senderId === myInfo.id ? m.status === 'seen' ? <img className='img' src={currentfriendimage} alt='' /> : m.status === 'delivared' ? <span> <FaRegCheckCircle /> </span> : <span> <FaRegCheckCircle /> </span> : ''
                                                  }


                                             </div>
                                        </div>
                                        <div className='time'>
                                             {moment(m.createdAt).startOf('mini').fromNow()}
                                        </div>
                                   </div> : <div ref={scrollRef} className='fd-message' key={index}>
                                        <div className='image-message-time'>
                                             <img src={currentfriendimage} alt='' />
                                             <div className='message-time'>
                                                  <div className='fd-text'>
                                                       <p className='message-text'> {m.message.text === '' ? <img src={m.message.image} /> : m.message.text}  </p>
                                                  </div>
                                                  <div className='time'>
                                                       {moment(m.createdAt).startOf('mini').fromNow()}
                                                  </div>
                                             </div>
                                        </div>
                                   </div>
                         ) : <div className='friend_connect'>
                              <img src={currentfriendimage} alt='' />
                              <h3>{currentfriend.userName} Connect You </h3>
                              <span> {moment(currentfriend.createdAt).startOf('mini').fromNow()} </span>
                         </div>
                    }


               </div>
               {
                    typingMessage && typingMessage.msg && typingMessage.senderId === currentfriend._id ? <div className='typing-message'>
                         <div className='fd-message'>
                              <div className='image-message-time'>
                                   <img src={currentfriendimage} alt='' />
                                   <div className='message-time'>
                                        <div className='fd-text'>
                                             <p className='time'>Typing Message.... </p>
                                        </div>

                                   </div>
                              </div>
                         </div>

                    </div> : ''
               }



          </>
     )
};

export default Message;
