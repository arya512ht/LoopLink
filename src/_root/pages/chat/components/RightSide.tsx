import  { useEffect, useState } from 'react';
import Message from './Message';
import MessageSend from './MessageSend';

const RightSide = (props:any) => {

     const { currentfriend, inputHendle, newMessage, sendMessage, message, scrollRef, emojiSend, ImageSend, activeUser, typingMessage } = props;

     const [currentfriendimage, setcurrentfriendimage] = useState()

     useEffect(() => {
          setcurrentfriendimage(currentfriend.image)
     }, [currentfriend])


     return (
          <div className='col-9'>
               <div className='right-side'>
                    <input type="checkbox" id='dot' />
                    <div className='row1'>
                         <div className='col-12'>
                              <div className='message-send-show'>
                                   <div className='header'>
                                        <div className='image-name'>
                                             <div className='back-arrow' onClick={() => { var div = document.querySelector('.col-9'); div.style.display='none'; document.querySelector('.col-3').style.display='block';}}>
                                                  &larr;
                                             </div>
                                             <div className='image'>
                                                  <img src={currentfriendimage} alt='' />

                                                  {
                                                       activeUser && activeUser.length > 0 && activeUser.some((u:any) => u.userId === currentfriend._id) ? <div className='active-icon'></div> : ''
                                                  }


                                             </div>
                                             <div className='name'>
                                                  <h3>{currentfriend.userName} </h3>

                                             </div>
                                        </div>
                                   </div>

                                   <Message
                                        message={message}
                                        currentfriend={currentfriend}
                                        scrollRef={scrollRef}
                                        typingMessage={typingMessage}
                                   />

                                   <MessageSend
                                        inputHendle={inputHendle}
                                        newMessage={newMessage}
                                        sendMessage={sendMessage}
                                        emojiSend={emojiSend}
                                        ImageSend={ImageSend}
                                   />


                              </div>
                         </div>

                    </div>
               </div>
          </div>
     )
};

export default RightSide;
