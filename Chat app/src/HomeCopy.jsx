import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { IoIosCreate } from "react-icons/io";
import { SERVER_API_URL, SERVER_BASE_URL } from "../utils/serverUrls.js"
import { io } from "socket.io-client";

const connectionUrl = SERVER_BASE_URL;

const HomeCopy = () => {
  const LoggedIn = useSelector((state) => state.LoggedIn);
  const Token = useSelector((state) => state.Token);
  const CurrentUser = useSelector((state) => state.CurrentUser);
  const navigate = useNavigate();

  const [curChat, setCurChat] = useState(); //the chat of which messages will be displayed in the right section
  const [chats, setChats] = useState([]); //the list of all chats between the current user and other users
  const [curChatMsgs, setCurChatMsgs] = useState([]);
  const [curUserToChatWith, setCurUserToChatWith] = useState();
  const [isConnected, setIsConnected] = useState(false);
  const [gError, setGError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [MSGS_WINDOW, SETMSGSWINDOW] = useState(false);
  const [dummy, setDummy] = useState(false);


  const [messageInput, setMessageInput] = useState("");
  const [socket, setSocket] = useState();
  useEffect(() => {
    if (!LoggedIn) {
      navigate("/login");
      return;
    }
    //get all users who have a chat with CurrentUser
    //set chats to result

    async function fetchUserChats(token) {
      const res = await fetch(SERVER_API_URL + "/users/chats/" + CurrentUser._id, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
      const resJson = await res.json();

      if (resJson.status != 'success') {
        setGError(resJson.message);
      } else {
        setChats(resJson.data);
      }
    }

    if (Token.length > 0 && CurrentUser) {
      console.log('fetching chats with token ' + Token);

      //get all user chats
      fetchUserChats(Token);
    }
  }, [Token, dummy]);


  //establish a socket.io connection as soon as the token is available
  useEffect(() => {
    const msgsWindow = document.getElementById('chat-msgs');
    SETMSGSWINDOW(msgsWindow);
    if (Token) {
      const ssocket = io("http://localhost:5000", {
        reconnection: true, // Enable auto-reconnect
        reconnectionAttempts: 5, // Retry connection 5 times
        reconnectionDelay: 2000, // Wait 2 seconds before retrying,
        auth: {
          token: Token
        }
      });
      ssocket.on("connect", () => {
        setIsConnected(true);
        setSocket(ssocket)
        console.log('Connected Successfully');
      })
      ssocket.on('receiveMessage', (msg) => {
        setDummy(!dummy);
        console.log('receiving message');

        const { from, contents, timestamp } = msg;
        console.log('from is ' + from);
        console.log('current user is ' + CurrentUser.email);
        console.log('length of chats is ' + chats.length);

        //add the message to the chat corresponding to the from field 
        let fromChat = chats.find((c) => {
          return ((c.members[0] == CurrentUser.email && c.members[1] == from) || (c.members[1] == CurrentUser.email && c.members[0] == from))
        })
        //if the message from the currently open chat ==> show the message instantly
        if (fromChat) {
          if (fromChat.members.includes(curUserToChatWith)) {
            setCurChatMsgs((prev) => [...prev, msg])
            msgsWindow.scrollTop = msgsWindow.scrollHeight;
          } else {
            console.log("fromChat doesn't include curUserToChatWith");
          }
        } else {
          setGError("No chat");
          console.log('No chat');

          return;
        }

      })
      ssocket.on("disconnect", () => {
        setIsConnected(false);
        console.log('disconnected');
      })

      return () => {
        ssocket.off("connect");
        ssocket.off("disconnect");
      };
    }
  }, [Token, curChat])

  useEffect(() => {
    async function getAllChatMsgs() {
      const chatMsgsRes = await fetch(SERVER_API_URL + "/chats/" + curChat._id, {
        headers: {
          'Authorization': "Bearer " + Token
        },

      })

      const chatMsgsJson = await chatMsgsRes.json();
      if (chatMsgsJson.status != 'success') {
        setGError(chatMsgsJson.message);
        setCurChat(); //set current chat to undefined
        return;
      }
      setCurChatMsgs(chatMsgsJson.data);
    }
    if (curChat) {
      //get all chat messages and set message box with these chats
      console.log('curChat is ' + curChat);

      getAllChatMsgs();
    }
  }, [curChat, dummy])

  async function sendMessage(value) {
    //add the message to chat messages
    const newMsg = {
      from: CurrentUser.email,
      to: curUserToChatWith,
      contents: value,
      chat_id: curChat._id,
      timestamp: Date.now(),
      seen: false,
      delivered: false
    }
    
    setCurChatMsgs((prev) => [...prev, newMsg])
    //send the message to the backend
    /*const res = await fetch(SERVER_API_URL+"/chats/"+curChat._id,{
      method : "POST",
      headers : {
        'Authorization' : "Bearer " + Token,
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({
        from : CurrentUser.email,
        to : curUserToChatWith,
        contents : value,
        chat_id : curChat._id
      })
    })
    const resJson = await res.json();
    if (resJson.status != 'success') {
      setGError(resJson.message)
    }else{
      console.log('sent successfully');
      setMessageInput("");
    }*/
    if (socket) {
      socket.emit('sendMessage', newMsg);
      setMessageInput("");
      MSGS_WINDOW.scrollTop = MSGS_WINDOW.scrollHeight;
    } else {
      console.log('no socket');
    }
  }
  return (
    <>

      {isConnected &&
        <>
          {gError && <p className='bg-red-600 text-white text-center p-2 mt-12'>{gError}</p>}
          <div className='bg-green-300 w-[100%] h-[100vh] flex items-center justify-center'>
            <div className='w-[75%] h-[80%] bg-slate-200 rounded-lg flex flex-nowrap '>
              <div className='msgs w-[30%] h-[100%] bg-slate-100 flex flex-col p-2'>

                <div className='w-[100%] flex gap-4 items-center'>
                  <div className='flex flex-col gap-0'>
                    <input type='text' value={searchInput} onChange={async (e) => {
                      setSearchInput(e.target.value)
                      //get all users that correspond to the entered search value
                      if (e.target.value) {
                        const res = await fetch(SERVER_API_URL + "/users/search/" + e.target.value);
                        const resJson = await res.json();
                        if (resJson.status != 'success') {
                          console.log('setting gerror from getting sewarch result');
                          setGError(resJson.message);
                        } else {
                          setSearchSuggestions(resJson.data);
                        }
                      } else {
                        setSearchSuggestions([]);
                      }
                    }} placeholder='Search' className='outline-none rounded-s-full rounded-e-full p-2 w-[90%] focus:bg-slate-200 focus:shadow-md' />

                    {searchSuggestions.length > 0 &&
                      <ul className='flex flex-col list-none p-1 w-[90%]'>
                        {
                          searchSuggestions.map((s) => {
                            return (
                              <li onClick={async (e) => {
                                /* get inside a chat with that user */
                                setCurUserToChatWith(s.email); //to open chat with that user
                                setSearchSuggestions([]); //to close suggestions menu

                                //fist check if there is a chat with that user or not
                                //get all user chats
                                const allUserChats = await fetch(SERVER_API_URL + "/users/chats/" + CurrentUser._id, {
                                  headers: {
                                    'Authorization': 'Bearer ' + Token
                                  }
                                });
                                console.log('s is ' + s.email);

                                const allChatsJson = await allUserChats.json();
                                if (allChatsJson.status != 'success') {
                                  setGError(allChatsJson.message);
                                  return;
                                } else {
                                  //filter chats to get the chat with that user
                                  let theChat = allChatsJson.data.find((c) => {
                                    return (
                                      //check if it contains both and no other emails
                                      //c.members.includes(CurrentUser.email) && c.members.includes(s.email)
                                      (c.members[0] == CurrentUser.email && c.members[1] == s.email) || (c.members[1] == CurrentUser.email && c.members[0] == s.email)
                                    )

                                  });
                                  console.log("allChatsJson.data " + allChatsJson.data);
                                  console.log("theChat" + theChat);
                                  if (theChat) {
                                    //found the chat with that user
                                    setCurChat(theChat);
                                    
                                  } else {
                                    //create a new chat
                                    const newChatRes = await fetch(SERVER_API_URL + "/users/chats/" + CurrentUser._id, {
                                      method: "POST",
                                      headers: {
                                        'Authorization': 'Bearer ' + Token,
                                        'Content-Type': "application/json"
                                      },
                                      body: JSON.stringify({
                                        anotherUser: s.email
                                      })
                                    });
                                    const newChatJson = await newChatRes.json();
                                    if (newChatJson.status != 'success') {
                                      setGError(newChatJson.message)
                                      return;
                                    } else {
                                      setCurChat(newChatJson.data);
                                      setChats([...chats, newChatJson.data])
                                    }
                                  }
                                }
                                //if exists, get that chat messages and set current chat to that chat
                                //else, create a new chat
                              }} className='border border-2 p-2 bg-green-300 hover:bg-green-500 text-slate-700 rounded-xl font-semibold cursor-pointer'>{s.name}</li>
                            )
                          })
                        }
                      </ul>
                    }
                  </div>
                  <IoIosCreate size={30} className='cursor-pointer' />
                </div>
                <div className='overflow-y-scroll mt-2'>
                  <h1 className='text-xl text-slate-700 text-center'>All Chats</h1>
                  {/* render chats here */ chats.length > 0 &&
                    chats.map((c) => {
                      return (
                        <div className='w-[100%] py-2 my-2 bg-white text-center rounded-lg cursor-pointer' onClick={() => {
                          setCurChat(c);
                          setCurUserToChatWith(
                            c.members[0] == CurrentUser.email ? c.members[1] : c.members[0]
                          )
                        }}>
                          {
                            c.members[0] == CurrentUser.email ? c.members[1].split('@')[0] : c.members[0].split('@')[0]
                          }
                        </div>
                      )
                    })
                  }
                </div>
              </div>
              <div className='chat w-[70%] h-[100%]'>

                {curChat &&
                  <div className='relative h-[100%] w-[100%]'>
                    <div id='chat-msgs' className='chat-msgs bg-slate-50 w-[98%] h-[90%] rounded-md relative top-2 mx-auto flex flex-col overflow-scroll items-end'>

                      {curChatMsgs.length > 0 ?

                        curChatMsgs.map((msg) => {
                          return (
                            <div className={`border border-2 bg-white p-2 mx-1 mt-1 flex ${msg.from == CurrentUser.email ? "self-end" : "self-start"}`}>
                              {msg.contents}
                            </div>
                          )
                        }) :
                        <div className='flex flex-col items-center justify-center w-[100%] h-[100%]'>
                          <h1 className='text-2xl text-slate-700'>No Messages to show</h1>
                          <p>Send a message to start chatting</p>
                        </
                        div>
                      }
                    </div>
                    <div className='input-div flex gap-0 absolute bottom-1 left-1 gap-3 w-[100%]'>
                      <input type='text' value={messageInput} onChange={(e) => setMessageInput(e.target.value)} onKeyDown={(e) => {
                        if (e.key == 'Enter') {
                          sendMessage(e.target.value);
                        }
                      }} placeholder='Enter Your Message' className='w-[90%] rounded-md p-1' />

                    </div>
                  </div>
                }
                {!curChat &&
                  <div className='h-[100%] w-[100%] flex flex-col items-center justify-center gap-0'>
                    <img src='icon.png' className='w-[30%]' />
                    <h1 className='text-green-600 text-3xl font-bold'>Speaker</h1>
                    <p>Select a chat and start speaking...</p>
                  </div>
                }
              </div>
            </div>
          </div>
        </>
      }

    </>
  )
}

export default HomeCopy