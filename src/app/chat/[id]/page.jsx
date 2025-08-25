'use client'
import React, { useEffect, useState } from 'react'
import AiInput from '@/components/ui/ai-input'
import { useParams } from 'next/navigation';
import { useChatStore } from '@/store/chat-store';
import Image from 'next/image';

const page = () => {

  const {id} = useParams();
  const {setActiveChatId, addMessage} = useChatStore((state)=>state.actions);
  const {activeChat} = useChatStore((state)=>state);
  const [userMsg, setUserMsg] = useState('');
  const [aiMsg, setAiMsg] = useState('');
  const [loading, setLoading] = useState(false);


  useEffect(() => { 
    if(id){
      setActiveChatId(id);
    }
  }, [id, setActiveChatId])

  const handleUserMsg = async (msg, sender) =>{
    await addMessage(msg.trim(), sender);
    setUserMsg('');
    getAiRes(msg.trim(), 'ai');
  }

  const getAiRes = async(message, sender)=>{
    setLoading(true);
    try {
      const res = await fetch('/api/aichat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message
        })
      });

      const data = await res.json();

      if (data.success) {
        setAiMsg(data.data);
        addMessage(data.data, sender);
      } else {
        setAiMsg('Error: Could not get response');
      }
    } catch (error) {
      console.error('Error:', error);
      setAiMsg('Error: Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className='h-[calc(100dvh-69px-16px)] overflow-y-scroll overflow-x-hidden pt-2 sm:pt-4 px-2 sm:px-4 w-full md:max-w-3xl mx-auto relative scrollbar-hide'>
      <div className="chat-container">
        <div className="chat-messages">
          { activeChat && activeChat.messages.length > 0 ?
            activeChat.messages.map((msg)=>(
              <div className={`${msg.sender === 'user' ? 'message-user' : 'message-other'}`} key={msg.id}>
                {msg.sender !== 'user' && <div className="message-avatar-primary">
                  N
                </div>}
                <p className="message-text">
                  {msg.text}
                </p>
                {msg.sender === 'user' &&<div className="message-avatar-secondary">
                  U
                </div>}
              </div>
            ))
            :
            <div className="w-full h-full flex items-center justify-center mt-[30%]">
              <div className="text-muted-foreground dark:text-muted-foreground text-sm px-4 gap-4 mt-2 font-semibold flex flex-col items-center justify-center">
                <Image src="/no-chat.png" alt="no chats" width={100} height={100} />
                <div className="text-center">
                  <p>No messages found</p>
                </div>
              </div>
            </div>
          }
        </div>
      </div>

      <div className="fixed bottom-0 w-full max-w-3xl z-10 px-2 sm:px-0">
        <AiInput userMsg={userMsg} setUserMsg={setUserMsg} handleUserMsg={handleUserMsg} />
      </div>
    </section>
  )
}

export default page


/** 
 * ? api keys, message->[role, content]
 */

