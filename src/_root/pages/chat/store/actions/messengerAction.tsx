import axios from 'axios';
import { FRIEND_GET_SUCCESS, MESSAGE_GET_SUCCESS, MESSAGE_SEND_SUCCESS } from "../types/messengerType";
// axios.defaults.withCredentials = true

export const getFriends = (myId: any) => async (dispatch: any) => {
     try {
          const response = await axios.get(`https://looplink-chat-backend.onrender.com/api/messenger/get-friends/?myId=${myId}`);
          dispatch({
               type: FRIEND_GET_SUCCESS,
               payload: {
                    friends: response.data.friends
               }
          })

     } catch (error: any) {
          console.log(error.response.data);
     }
}

export const messageSend = (data: any) => async (dispatch: any) => {
     try {
          const response = await axios.post('https://looplink-chat-backend.onrender.com/api/messenger/send-message', data);
          dispatch({
               type: MESSAGE_SEND_SUCCESS,
               payload: {
                    message: response.data.message
               }
          })
     } catch (error: any) {
          console.log(error.response.data);
     }
}


export const getMessage = ({ fdId, myId }: any) => {
     return async (dispatch: any) => {
          try {
               const response = await axios.get(`https://looplink-chat-backend.onrender.com/api/messenger/get-message/?fdId=${fdId}&myId=${myId}`)
               console.log(fdId, " ", myId)
               dispatch({
                    type: MESSAGE_GET_SUCCESS,
                    payload: {
                         message: response.data.message
                    }
               })
          } catch (error: any) {
               console.log(error.response.data)
          }
     }
}


export const ImageMessageSend = (data: any) => async (dispatch: any) => {

     try {
          const response = await axios.post('https://looplink-chat-backend.onrender.com/api/messenger/image-message-send', data);
          console.log(response.data.message)
          dispatch({
               type: MESSAGE_SEND_SUCCESS,
               payload: {
                    message: response.data.message
               }
          })
     } catch (error: any) {
          console.log(error.response.data);

     }

}

export const seenMessage = (msg: any) => async () => {
     try {
          const response = await axios.post('https://looplink-chat-backend.onrender.com/api/messenger/seen-message', msg);
          console.log(response.data);
     } catch (error: any) {
          console.log(error.response.message)

     }
}


export const updateMessage = (msg: any) => async () => {
     try {
          const response = await axios.post('https://looplink-chat-backend.onrender.com/api/messenger/delivared-message', msg);
          console.log(response.data);
     } catch (error: any) {
          console.log(error.response.message)

     }
}


export const getTheme = () => async (dispatch: any) => {

     const theme = localStorage.getItem('theme');
     dispatch({
          type: "THEME_GET_SUCCESS",
          payload: {
               theme: theme ? theme : 'white'
          }
     })

}


export const themeSet = (theme: any) => async (dispatch: any) => {

     localStorage.setItem('theme', theme);
     dispatch({
          type: "THEME_SET_SUCCESS",
          payload: {
               theme: theme
          }
     })

}
