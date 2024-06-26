import axios from 'axios';
import {REGISTER_FAIL,REGISTER_SUCCESS,USER_LOGIN_SUCCESS,USER_LOGIN_FAIL} from "../types/authType";

export const userRegister = (data:any) => {
     return async (dispatch:any) => {

        //   const config = {
        //        headers: {
        //             'Content-Type':'application/josn'
        //        } 
        //   }
          try{
               const response = await axios.post('https://looplink-chat-backend.onrender.com/api/messenger/user-register',data);
               localStorage.setItem('authToken',response.data.token);

               dispatch({
                    type : REGISTER_SUCCESS,
                    payload:{
                         successMessage: response.data.successMessage,
                         token : response.data.token
                    }
               })

          } catch(error:any){
                dispatch({
                    type: REGISTER_FAIL,
                    payload:{
                         error : error.response.data.error.errorMessage 
                    }
                })
          }

     }
}

export const userLogin = (data:any) => {
    return async (dispath:any) => {

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'withCredentials': 'true',
            }
        }

        try {
            const response = await axios.post('https://looplink-chat-backend.onrender.com/api/messenger/user-login', data, config);
            // console.log(response)
            localStorage.setItem('authToken', response.data.token);
            dispath({
                type: USER_LOGIN_SUCCESS,
                payload: {
                    successMessage: response.data.successMessage,
                    token: response.data.token
                }
            })
        } catch (error:any) {
            dispath({
                type: USER_LOGIN_FAIL,
                payload: {
                    error: error.response.data.error.errorMessage
                }
            })
        }
    }
}

export const userLogout = () => async(dispatch:any) => {
     try{
         const response = await axios.post('https://looplink-chat-backend.onrender.com/api/messenger/user-logout',{authToken:localStorage.getItem('authToken')});
         console.log(response)
         if(response.data.success){
             localStorage.removeItem('authToken');
             dispatch({
                 type : 'LOGOUT_SUCCESS'
             })
         }

     }catch (error) {

     }
}




