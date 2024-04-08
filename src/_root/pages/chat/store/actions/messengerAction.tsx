import axios from 'axios';
import {FRIEND_GET_SUCCESS,MESSAGE_GET_SUCCESS,MESSAGE_SEND_SUCCESS,THEME_GET_SUCCESS,THEME_SET_SUCCESS} from "../types/messengerType";
// axios.defaults.withCredentials = true

export const getFriends = (myId) => async(dispatch) => {
     try{
          const response = await axios.get(`http://localhost:80/api/messenger/get-friends/?myId=${myId}`);
           dispatch({
                type: FRIEND_GET_SUCCESS,
                payload : {
                     friends : response.data.friends
                }
           })

     }catch (error){
          console.log(error.response.data);
     }
}

export const messageSend = (data) => async(dispatch) => {
    try{
     const response = await axios.post('http://localhost:80/api/messenger/send-message',data);
     dispatch({
          type : MESSAGE_SEND_SUCCESS,
          payload : {
               message : response.data.message
          }
     })
    }catch (error){
     console.log(error.response.data);
    }
}


export const getMessage = ({fdId,myId}) => {
     return async(dispatch) => {
          try{
               const response = await axios.get(`http://localhost:80/api/messenger/get-message/?fdId=${fdId}&myId=${myId}`)
               console.log(fdId," ",myId)
              dispatch({
                   type : MESSAGE_GET_SUCCESS,
                   payload : {
                    message : response.data.message
                   }
              })
          }catch (error){
               console.log(error.response.data)
          }
     }
}


export const ImageMessageSend = (data) => async(dispatch)=>{

     try{
          const response = await axios.post('http://localhost:80/api/messenger/image-message-send',data);
          console.log(response.data.message)
          dispatch({
               type: MESSAGE_SEND_SUCCESS,
               payload : {
                    message : response.data.message
               }
          })
     }catch (error){
          console.log(error.response.data);

     }

}

export const seenMessage = (msg) => async(dispatch)=> {
     try{
          const response = await axios.post('http://localhost:80/api/messenger/seen-message',msg);
          console.log(response.data);
     }catch (error){
          console.log(error.response.message)

     }
}


export const updateMessage = (msg) => async(dispatch)=> {
     try{
          const response = await axios.post('http://localhost:80/api/messenger/delivared-message',msg);
          console.log(response.data);
     }catch (error){
          console.log(error.response.message)

     }
}


export const getTheme = () => async(dispatch) => {

     const theme = localStorage.getItem('theme');
     dispatch({
          type: "THEME_GET_SUCCESS",
          payload : {
               theme : theme? theme : 'white'
          }
     })

}


export const themeSet = (theme) => async(dispatch) => {

     localStorage.setItem('theme',theme);
     dispatch({
          type: "THEME_SET_SUCCESS",
          payload : {
               theme : theme
          }
     })
     
}
