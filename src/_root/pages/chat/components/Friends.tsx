import  { useEffect, useState } from 'react';
import moment from 'moment';
import { FaRegCheckCircle } from "react-icons/fa";

const Friends = (props:any) => {
     const { fndInfo, msgInfo } = props.friend;
     const myId = props.myId;
     const { activeUser } = props;
     const [image, setimage] = useState()

     useEffect(() => {
          setimage(fndInfo.image)
     }, [fndInfo])

     return (
          <div className='friend'>
               <div className='friend-image'>
                    <div className='image'>
                         <img src={image} alt='' />
                         {
                              activeUser && activeUser.length > 0 && activeUser.some((u:any) => u.userId === fndInfo._id) ? <div className='active_icon'></div> : ''
                         }

                    </div>
               </div>

               <div className='friend-name-seen'>
                    <div className='friend-name'>
                         <h4 className={msgInfo?.senderId !== myId && msgInfo?.status !== undefined && msgInfo.status !== 'seen' ? 'unseen_message Fd_name ' : 'Fd_name'} >{fndInfo.userName}</h4>



                         <div className='msg-time'>
                              {
                                   // msgInfo && msgInfo.senderId === myId ? <span>You </span> : <span className={msgInfo?.senderId !== myId && msgInfo?.status !== undefined && msgInfo.status !== 'seen' ? 'unseen_message ' : ''}> {fndInfo.userName + ' '} </span>
                              }
                              {
                                   msgInfo && msgInfo.message.text ? <span className={msgInfo?.senderId !== myId && msgInfo?.status !== undefined && msgInfo.status !== 'seen' ? 'unseen_message ' : ''}>{msgInfo.message.text.slice(0, 10)}</span> : msgInfo && msgInfo.message.image ? <span>Sent A image &nbsp;</span> : <span>Connect You &nbsp;</span>
                              }
                              <span className='time1'>&nbsp;{msgInfo ? moment(msgInfo.createdAt).startOf("minute").fromNow() : moment(fndInfo.createdAt).startOf('minute').fromNow()}</span>

                         </div>
                    </div>

                    {
                         myId === msgInfo?.senderId ?
                              <div className='seen-unseen-icon'>
                                   {
                                        msgInfo.status === 'seen' ?
                                             <img src={image} alt='' /> : msgInfo.status === 'delivared' ? <div className='delivared'> <FaRegCheckCircle /> </div> : <div className='unseen'> </div>
                                   }

                              </div> :
                              <div className='seen-unseen-icon'>
                                   {
                                        msgInfo?.status !== undefined && msgInfo?.status !== 'seen' ? <div className='seen-icon'> </div> : ''
                                   }


                              </div>
                    }


               </div>

          </div>
     )
};

export default Friends;
