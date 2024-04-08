import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { FaEllipsisH, FaEdit, FaSistrix, FaSignOutAlt } from "react-icons/fa";
import ActiveFriend from './chat/components/ActiveFriend';
import Friends from './chat/components/Friends';
import RightSide from './chat/components/RightSide';
import { useDispatch, useSelector } from 'react-redux';
import { getFriends, messageSend, getMessage, ImageMessageSend, seenMessage, updateMessage, getTheme, themeSet } from './chat/store/actions/messengerAction';
import { userLogout } from './chat/store/actions/authAction';

import toast, { Toaster } from 'react-hot-toast';
import { io } from 'socket.io-client';
// import useSound from 'use-sound';
import useSound from 'use-sound';
import notificationSound from './chat/audio/notification.mp3';
import sendingSound from './chat/audio/sending.mp3';

const Messenger = () => {

     const [notificationSPlay] = useSound(notificationSound);
     const [sendingSPlay] = useSound(sendingSound);
     const [imageURL, setimageURL] = useState();

     const scrollRef = useRef();
     const socket = useRef();


     const { friends, message, mesageSendSuccess, message_get_success, themeMood, new_user_add } = useSelector(state => state.messenger);
     const { myInfo } = useSelector(state => state.auth);
     console.log(myInfo)

     const [currentfriend, setCurrentFriend] = useState('');
     const [newMessage, setNewMessage] = useState('');

     const [activeUser, setActiveUser] = useState([]);
     const [socketMessage, setSocketMessage] = useState('');
     const [typingMessage, setTypingMessage] = useState('');

     const getImage = async (id:any) => {
          const res = await axios.get(`https://looplink-chat-backend.onrender.com/api/messenger/?imageid=${myInfo?.image}`);
          return res.data.imageURL;
     }

     useEffect(() => {
          // console.log(myInfo)
          // const res = await getImage(myInfo?.image);
          // // console.log(res)
          setimageURL(myInfo.image);

          
     }, [myInfo])

     useEffect(() => {
          socket.current = io('https://looplink-chat-socket.onrender.com');
          socket.current.on('getMessage', (data) => {
               setSocketMessage(data);
          })

          socket.current.on('typingMessageGet', (data) => {
               setTypingMessage(data);
          })

          socket.current.on('msgSeenResponse', msg => {
               dispatch({
                    type: 'SEEN_MESSAGE',
                    payload: {
                         msgInfo: msg
                    }
               })
          })

          socket.current.on('msgDelivaredResponse', msg => {
               dispatch({
                    type: 'DELIVARED_MESSAGE',
                    payload: {
                         msgInfo: msg
                    }
               })
          })

          socket.current.on('seenSuccess', data => {
               dispatch({
                    type: 'SEEN_ALL',
                    payload: data
               })
          })

     }, []);


     useEffect(() => {
          if (socketMessage && currentfriend) {
               if (socketMessage.senderId === currentfriend.id && socketMessage.reseverId === myInfo.id) {
                    dispatch({
                         type: 'SOCKET_MESSAGE',
                         payload: {
                              message: socketMessage
                         }
                    })
                    dispatch(seenMessage(socketMessage));
                    socket.current.emit('messageSeen', socketMessage);
                    dispatch({
                         type: 'UPDATE_FRIEND_MESSAGE',
                         payload: {
                              msgInfo: socketMessage,
                              status: 'seen'
                         }
                    })
               }
          }
          setSocketMessage('')
     }, [socketMessage]);



     useEffect(() => {
          socket.current.emit('addUser', myInfo.id, myInfo)

     }, []);

     useEffect(() => {
          socket.current.on('getUser', (users) => {
               const filterUser = users.filter(u => u.userId !== myInfo.id)
               setActiveUser(filterUser);
          })

          socket.current.on('new_user_add', data => {
               dispatch({
                    type: 'NEW_USER_ADD',
                    payload: {
                         new_user_add: data
                    }
               })
          })



     }, []);

     useEffect(() => {
          if (socketMessage && socketMessage.senderId !== currentfriend.id && socketMessage.reseverId === myInfo.id) {
               notificationSPlay();
               toast.success(`${socketMessage.senderName} Send a New Message`)
               dispatch(updateMessage(socketMessage));
               socket.current.emit('delivaredMessage', socketMessage);
               dispatch({
                    type: 'UPDATE_FRIEND_MESSAGE',
                    payload: {
                         msgInfo: socketMessage,
                         status: 'delivared'
                    }
               })

          }
     }, [socketMessage]);




     const inputHendle = (e) => {
          setNewMessage(e.target.value);

          socket.current.emit('typingMessage', {
               senderId: myInfo.id,
               reseverId: currentfriend.id,
               msg: e.target.value
          })

     }

     const sendMessage = (e) => {
          e.preventDefault();
          sendingSPlay();
          const data = {
               senderName: myInfo.userName,
               reseverId: currentfriend.id,
               message: newMessage ? newMessage : '❤',
               senderId: myInfo.id
          }


          socket.current.emit('typingMessage', {
               senderId: myInfo.id,
               reseverId: currentfriend.id,
               msg: ''
          })

          dispatch(messageSend(data));
          setNewMessage('')
     }


     useEffect(() => {
          if (mesageSendSuccess) {
               socket.current.emit('sendMessage', message[message.length - 1]);
               dispatch({
                    type: 'UPDATE_FRIEND_MESSAGE',
                    payload: {
                         msgInfo: message[message.length - 1]
                    }
               })
               dispatch({
                    type: 'MESSAGE_SEND_SUCCESS_CLEAR'
               })
          }
     }, [mesageSendSuccess]);







     const dispatch = useDispatch();
     useEffect(() => {
          dispatch(getFriends(myInfo.id));
          dispatch({ type: 'NEW_USER_ADD_CLEAR' })
     }, [new_user_add]);

     useEffect(() => {
          if (friends && friends.length > 0)
               setCurrentFriend(friends[0].fndInfo)

     }, [friends]);


     useEffect(() => {
          console.log("getmessage")
          if (friends.length > 0) {
               dispatch(getMessage({ fdId: currentfriend?.id, myId: myInfo.id }));

          }
     }, [currentfriend?.id]);


     useEffect(() => {
          if (message.length > 0) {
               if (message[message.length - 1].senderId !== myInfo.id && message[message.length - 1].status !== 'seen') {
                    dispatch({
                         type: 'UPDATE',
                         payload: {
                              id: currentfriend.id
                         }
                    })
                    socket.current.emit('seen', { senderId: currentfriend.id, reseverId: myInfo.id })
                    dispatch(seenMessage({ id: message[message.length - 1].id }))
               }
          }
          dispatch({
               type: 'MESSAGE_GET_SUCCESS_CLEAR'
          })

     }, [message_get_success]);



     useEffect(() => {
          scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
     }, [message]);


     const emojiSend = (emu) => {
          setNewMessage(`${newMessage}` + emu);
          socket.current.emit('typingMessage', {
               senderId: myInfo.id,
               reseverId: currentfriend.id,
               msg: emu
          })
     }

     const ImageSend = (e) => {

          if (e.target.files.length !== 0) {
               sendingSPlay();
               const imagename = e.target.files[0].name;
               const newImageName = Date.now() + imagename;

               socket.current.emit('sendMessage', {
                    senderId: myInfo.id,
                    senderName: myInfo.userName,
                    reseverId: currentfriend.id,
                    time: new Date(),
                    message: {
                         text: '',
                         image: newImageName
                    }
               })

               const formData = new FormData();

               formData.append('senderName', myInfo.userName);
               formData.append('senderId', myInfo.id);
               formData.append('imageName', newImageName);
               formData.append('reseverId', currentfriend.id);
               formData.append('image', e.target.files[0]);
               dispatch(ImageMessageSend(formData));

          }

     }

     const [hide, setHide] = useState(true);

     const logout = () => {
          dispatch(userLogout());
          socket.current.emit('logout', myInfo.id);
     }

     useEffect(() => {
          dispatch(getTheme());
     }, []);

     const search = (e) => {

          const getFriendClass = document.getElementsByClassName('hover-friend');
          const frienNameClass = document.getElementsByClassName('Fd_name');
          for (var i = 0; i < getFriendClass.length, i < frienNameClass.length; i++) {
               let text = frienNameClass[i].innerText.toLowerCase();
               if (text.indexOf(e.target.value.toLowerCase()) > -1) {
                    getFriendClass[i].style.display = '';
               } else {
                    getFriendClass[i].style.display = 'none';
               }
          }
     }


     return (
          <div className={'messenger theme'}>
               <Toaster
                    position={'top-right'}
                    reverseOrder={false}
                    toastOptions={{
                         style: {
                              fontSize: '18px'
                         }
                    }}

               />


               <div className='row1'>
                    <div className='col-3'>
                         <div className='left-side'>
                              <div className='top'>
                                   <div className='image-name'>
                                        <div className='image'>
                                             <img src={imageURL} alt='' />

                                        </div>
                                        <div className='name'>
                                             <h3>{myInfo.userName} </h3>
                                        </div>
                                   </div>

                                   
                              </div>

                              <div className='friend-search'>
                                   <div className='search'>
                                        <button> <FaSistrix /> </button>
                                        <input onChange={search} type="text" placeholder='Search' className='form-control' />
                                   </div>
                              </div>

                              <div className='active-friends'>
                                   {
                                        activeUser && activeUser.length > 0 ? activeUser.map((u, i) => <ActiveFriend key={i} setCurrentFriend={setCurrentFriend} user={u} />) : ''
                                   }

                              </div>

                              <div className='friends'>
                                   {
                                        friends && friends.length > 0 ? friends.map((fd) => <div onClick={() => { setCurrentFriend(fd.fndInfo); var div = document.querySelector('.col-9'); div.style.display = window.screen.width <= 850 && 'block'; div = document.querySelector('.col-3'); div.style.display = window.screen.width <= 850 && 'none'; }} className={currentfriend.id === fd.fndInfo.id ? 'hover-friend active' : 'hover-friend'}>
                                             <Friends activeUser={activeUser} myId={myInfo.id} friend={fd} />
                                        </div>) : 'No Friend'
                                   }



                              </div>

                         </div>

                    </div>

                    {
                         currentfriend ? <RightSide
                              currentfriend={currentfriend}
                              inputHendle={inputHendle}
                              newMessage={newMessage}
                              sendMessage={sendMessage}
                              message={message}
                              scrollRef={scrollRef}
                              emojiSend={emojiSend}
                              ImageSend={ImageSend}
                              activeUser={activeUser}
                              typingMessage={typingMessage}
                         /> : 'Please Select your Friend'
                    }


               </div>

          </div>
     )
};

export default Messenger;
