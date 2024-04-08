import { useEffect, useState, useRef } from 'react';
import {   FaSistrix } from "react-icons/fa";
import ActiveFriend from './chat/components/ActiveFriend';
import Friends from './chat/components/Friends';
import RightSide from './chat/components/RightSide';
import { useDispatch, useSelector } from 'react-redux';
import { getFriends, messageSend, getMessage, ImageMessageSend, seenMessage, updateMessage, getTheme } from './chat/store/actions/messengerAction';

import toast, { Toaster } from 'react-hot-toast';
import { io } from 'socket.io-client';
// @ts-ignore
import useSound from 'use-sound';
import { useUserContext } from "@/context/AuthContext";;
// const notificationSound = require('./chat/audio/notification.mp3');
// const sendingSound = require('./chat/audio/sending.mp3');

const Messenger = () => {

     const [imageURL, setimageURL] = useState();

     const { user }:any = useUserContext();

     const scrollRef:any = useRef();
     const socket:any = useRef() ;


     const { friends, message, mesageSendSuccess, message_get_success, new_user_add } = useSelector((state:any) => state.messenger);
     // const { user } = useSelector((state:any) => state.auth);
     console.log(user)

     const [currentfriend, setCurrentFriend] = useState<any>('');
     const [newMessage, setNewMessage] = useState('');

     const [activeUser, setActiveUser] = useState([]);
     const [socketMessage, setSocketMessage] = useState<any>('');
     const [typingMessage, setTypingMessage] = useState('');

     useEffect(() => {
          setimageURL(user.imageUrl);

          
     }, [user])

     useEffect(() => {
          socket.current = io('https://looplink-chat-socket.onrender.com') ;
          socket.current.on('getMessage', (data:any) => {
               setSocketMessage(data);
          })

          socket.current.on('typingMessageGet', (data:any) => {
               setTypingMessage(data);
          })

          socket.current.on('msgSeenResponse', (msg:any) => {
               dispatch({
                    type: 'SEEN_MESSAGE',
                    payload: {
                         msgInfo: msg
                    }
               })
          })

          socket.current.on('msgDelivaredResponse', (msg:any) => {
               dispatch({
                    type: 'DELIVARED_MESSAGE',
                    payload: {
                         msgInfo: msg
                    }
               })
          })

          socket.current.on('seenSuccess', (data:any) => {
               dispatch({
                    type: 'SEEN_ALL',
                    payload: data
               })
          })

     }, []);


     useEffect(() => {
          if (socketMessage && currentfriend) {
               if (socketMessage.senderId === currentfriend.id && socketMessage.reseverId === user.id) {
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
          socket.current.emit('addUser', user.id, user)

     }, []);

     useEffect(() => {
          socket.current.on('getUser', (users:any) => {
               const filterUser = users.filter((u:any) => u.userId !== user.id)
               setActiveUser(filterUser);
          })

          socket.current.on('new_user_add', (data:any) => {
               dispatch({
                    type: 'NEW_USER_ADD',
                    payload: {
                         new_user_add: data
                    }
               })
          })



     }, []);

     useEffect(() => {
          if (socketMessage && socketMessage.senderId !== currentfriend.id && socketMessage.reseverId === user.id) {
               // notificationSPlay();
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




     const inputHendle = (e:any) => {
          setNewMessage(e.target.value);

          socket.current.emit('typingMessage', {
               senderId: user.id,
               reseverId: currentfriend.id,
               msg: e.target.value
          })

     }

     const sendMessage = (e:any) => {
          e.preventDefault();
          // sendingSPlay();
          const data = {
               senderName: user.userName,
               reseverId: currentfriend.id,
               message: newMessage ? newMessage : '❤',
               senderId: user.id
          }


          socket.current.emit('typingMessage', {
               senderId: user.id,
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
          dispatch(getFriends(user.id));
          dispatch({ type: 'NEW_USER_ADD_CLEAR' })
     }, [new_user_add]);

     useEffect(() => {
          if (friends && friends.length > 0)
               setCurrentFriend(friends[0].fndInfo)

     }, [friends]);


     useEffect(() => {
          console.log("getmessage")
          if (friends.length > 0) {
               dispatch(getMessage({ fdId: currentfriend?.id, myId: user.id }));

          }
     }, [currentfriend?.id]);


     useEffect(() => {
          if (message.length > 0) {
               if (message[message.length - 1].senderId !== user.id && message[message.length - 1].status !== 'seen') {
                    dispatch({
                         type: 'UPDATE',
                         payload: {
                              id: currentfriend.id
                         }
                    })
                    socket.current.emit('seen', { senderId: currentfriend.id, reseverId: user.id })
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


     const emojiSend = (emu:any) => {
          setNewMessage(`${newMessage}` + emu);
          socket.current.emit('typingMessage', {
               senderId: user.id,
               reseverId: currentfriend.id,
               msg: emu
          })
     }

     const ImageSend = (e:any) => {

          if (e.target.files.length !== 0) {
               // sendingSPlay();
               const imagename = e.target.files[0].name;
               const newImageName = Date.now() + imagename;

               socket.current.emit('sendMessage', {
                    senderId: user.id,
                    senderName: user.userName,
                    reseverId: currentfriend.id,
                    time: new Date(),
                    message: {
                         text: '',
                         image: newImageName
                    }
               })

               const formData = new FormData();

               formData.append('senderName', user.userName);
               formData.append('senderId', user.id);
               formData.append('imageName', newImageName);
               formData.append('reseverId', currentfriend.id);
               formData.append('image', e.target.files[0]);
               dispatch(ImageMessageSend(formData));

          }

     }

     // const [hide, setHide] = useState(true);

     // const logout = () => {
     //      dispatch(userLogout());
     //      socket.current.emit('logout', user.id);
     // }

     useEffect(() => {
          dispatch(getTheme());
     }, []);

     const search = (e:any) => {

          const getFriendClass:any = document.getElementsByClassName('hover-friend');
          const frienNameClass:any = document.getElementsByClassName('Fd_name');
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
                                             <h3>{user.userName} </h3>
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
                                        friends && friends.length > 0 ? friends.map((fd:any) => <div onClick={() => { setCurrentFriend(fd.fndInfo); var div:any = document.querySelector('.col-9'); div.style.display = window.screen.width <= 850 && 'block'; div = document.querySelector('.col-3'); div.style.display = window.screen.width <= 850 && 'none'; }} className={currentfriend.id === fd.fndInfo.id ? 'hover-friend active' : 'hover-friend'}>
                                             <Friends activeUser={activeUser} myId={user.id} friend={fd} />
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
