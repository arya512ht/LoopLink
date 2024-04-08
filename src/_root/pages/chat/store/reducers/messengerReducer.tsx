import {FRIEND_GET_SUCCESS,MESSAGE_GET_SUCCESS,MESSAGE_SEND_SUCCESS,SOCKET_MESSAGE,UPDATE_FRIEND_MESSAGE,MESSAGE_SEND_SUCCESS_CLEAR,SEEN_MESSAGE,DELIVARED_MESSAGE,UPDATE,MESSAGE_GET_SUCCESS_CLEAR} from "../types/messengerType";

const messengerState = {
     friends : [],
     message : [],
     mesageSendSuccess : false,
     message_get_success : false,
     themeMood : '',
     new_user_add : ''
}

export const messengerReducer = (state=messengerState,action:any) => {
     const {type,payload} = action;


     if(type === 'THEME_GET_SUCCESS' || type === 'THEME_SET_SUCCESS'){
          return {
               ...state,
               themeMood : payload.theme
          }
     }





     if(type === FRIEND_GET_SUCCESS){
          return {
               ...state,
               friends : payload.friends
          }
     }

     if(type === MESSAGE_GET_SUCCESS){
          return {
               ...state,
               message_get_success : true,
               message : payload.message
          }
     }

     if(type === MESSAGE_SEND_SUCCESS){
          return {
               ...state,
               mesageSendSuccess : true,
               message : [...state.message,payload.message]
          }
     }

     if(type === SOCKET_MESSAGE){
          return {
               ...state,
               message : [...state.message,payload.message]
          }
     }

     if(type === UPDATE_FRIEND_MESSAGE){
          const index:any = state.friends.findIndex((f:any)=>f.fndInfo.id === payload.msgInfo.reseverId || f.fndInfo.id === payload.msgInfo.senderId);
          const v:any = state.friends[index];
          v.msgInfo = payload.msgInfo;
          v.msgInfo.status = payload.status;
          return state;
     }


     
     if(type === MESSAGE_SEND_SUCCESS_CLEAR){
          return {
               ...state,
               mesageSendSuccess : false               
          }
     }


     if(type === SEEN_MESSAGE){
          const index = state.friends.findIndex((f:any)=>f.fndInfo.id === payload.msgInfo.reseverId || f.fndInfo.id === payload.msgInfo.senderId);
          const v:any = state.friends[index];
          v.msgInfo.status = 'seen';
         return {
              ...state
         };
     }

     if(type === DELIVARED_MESSAGE){

          const index = state.friends.findIndex((f:any)=>f.fndInfo.id === payload.msgInfo.reseverId || f.fndInfo.id === payload.msgInfo.senderId);
          console.log(index)
          const v:any = state.friends[index];
          v.msgInfo.msgInfo.status = 'delivared';
         return {
              ...state
         };
     }


     if(type === UPDATE){
          const index = state.friends.findIndex((f:any)=>f.fndInfo.id === payload.id);
          const v:any = state.friends[index];
          
          if(v.msgInfo.msgInfo){
               v.msgInfo.status = 'seen';
          }
          return {
               ...state
          }
     }

     if(type === MESSAGE_GET_SUCCESS_CLEAR){
          return {
               ...state,
               message_get_success : false
          }
     }

     if(type === 'SEEN_ALL'){
          const index = state.friends.findIndex((f:any)=>f.fndInfo.id === payload.reseverId);
          const v:any = state.friends[index];
          v.msgInfo.status = 'seen';
          return {
               ...state
          }
     }

     if(type === 'LOGOUT_SUCCESS'){
          return {
               ...state,
               friends : [],
               message : [],
               mesageSendSuccess : false,
               message_get_success : false,
              
          }
     }

     if(type === 'NEW_USER_ADD'){
          return{
               ...state,
               new_user_add : payload.new_user_add
          }
     }

     if(type === 'NEW_USER_ADD_CLEAR'){
          return{
               ...state,
               new_user_add : ''
          }
     }
 


     return state;
}