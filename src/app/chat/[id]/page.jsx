'use client'
import React, { useEffect, useState, useRef } from 'react'
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
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if(id){
      setActiveChatId(id);
    }
  }, [id, setActiveChatId])

  // Scroll to bottom when messages change or loading state changes
  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages, loading])

  // Scroll to bottom when component mounts (page reload)
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 300); // Small delay to ensure content is rendered
    
    return () => clearTimeout(timer);
  }, [activeChat])

  const handleUserMsg = async (msg, sender) =>{
    await addMessage(msg.trim(), sender);
    setUserMsg('');
    getAiRes(msg.trim(), 'ai');
  }

  const getAiRes = async(message, sender)=>{
    setLoading(true);
    try {
      const conversationHistory = activeChat?.messages || [];
      const maxHistMsg = 20;
      const recentHist = conversationHistory.slice(-maxHistMsg);

      const res = await fetch('/api/aichat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          conversationHistory: recentHist
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
    <section className='h-[calc(100dvh-69px-16px)] overflow-y-scroll overflow-x-hidden pt-2 sm:pt-4 px-2 sm:px-4 w-full lg:max-w-3xl mx-auto relative scrollbar-hide'>
      <div className="chat-container">
        <div className="chat-messages">
          { activeChat && activeChat.messages.length > 0 ?
            <>
              {activeChat.messages.map((msg, index) => {
                const isLastMessage = index === activeChat.messages.length - 1;
                
                if(msg.sender === 'user'){
                  return (
                      <div className="message-user">
                        <div className="message-avatar-secondary">
                          U
                        </div>
                        <p className="message-text">{msg.text}</p>
                      </div>
                  )
                }
                return (
                  <div className="message-other" key={msg.id}>
                    <div className="message-avatar-primary">
                      N
                    </div>
                    <p className="message-text">{msg.text}</p>
                  </div>
                )
              })}
              
              {/* Show loading indicator only after the last message if it's from user and we're loading */}
              {loading && activeChat.messages.length > 0 && 
               activeChat.messages[activeChat.messages.length - 1].sender === 'user' && (
                <div className="message-other">
                  <div className="message-avatar-primary">
                    N
                  </div>
                  <p className="message-text animate-pulse">AI is thinking...</p>
                </div>
              )}
              
              {/* Invisible element to scroll to */}
              <div ref={messagesEndRef} />
            </>
            :
            <div className="w-full h-full flex items-center justify-center mt-[30%]">
              <div className="text-muted-foreground dark:text-muted-foreground text-sm px-4 gap-4 mt-2 font-semibold flex flex-col items-center justify-center">
                <Image src="/no-chat.png" alt="no chats" width={100} height={100} />
                <div className="text-center">
                  <p>No messages found</p>
                </div>
              </div>
              {/* Invisible element to scroll to (for empty state) */}
              <div ref={messagesEndRef} />
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