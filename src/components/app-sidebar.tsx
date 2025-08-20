'use client'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
  } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { BrainCircuit, File, Loader2, Plus } from "lucide-react"
import { useChatStore } from "@/store/chat-store";
import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";
  export function AppSidebar() {

    const { chats } = useChatStore((state) => state);
    const [isCreatingChat, setIsCreatingChat] =  useState(false);
    const router = useRouter();
    const { createChat, loadChats } = useChatStore((state) => state.actions);
    
    const createChatHelper = async() => {
      setIsCreatingChat(true);
      try {
        const newChat = await createChat();
        setIsCreatingChat(false);
        if(newChat){  
          console.log(newChat)
          router.push(`/chat/${newChat.id}`);
        }
      } catch (error) {
        setIsCreatingChat(false);
        alert(`Error creating chat: ${error}`);
      }
    }

    useEffect(() => {
      console.log("chats:: ", chats)
      loadChats();
    }, []);



    return (
      <Sidebar className="p-0">
        <SidebarHeader className="px-4 pt-4 ">
          <div className="flex items-center justify-between gap-2">
            {/* <Image src="/logo.png" alt="logo" width={32} height={32} /> */}
            <BrainCircuit />
            {/* <DropdownMenu>
              <DropdownMenuTrigger >
                <Button variant='outline'>
                  <p className="text-primary dark:text-primary text-sm font-semibold max-w-[100px] truncate">
                    LLM Model
                  </p>
                  <ChevronDown/>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
          </div>
        </SidebarHeader>
        <SidebarContent className="pt-4 text-primary dark:text-primary">
          <p className="px-4 text-foreground dark:text-foreground -mb-3 font-semibold">
            Chats
          </p>
          <SidebarGroup >
            {
              chats.length > 0 ? 
              <>
              {
                chats.map((chat)=>(
                  <Button className="flex items-center w-full justify-start gap-2" variant="ghost" key={chat.id} onClick={()=>{router.push(`/chat/${chat.id}`)}}>
                    <File className="size-4"/> <p>{chat.title}</p>
                  </Button>
                ))
              }
             
              </>
              :
              <p className="text-muted-foreground dark:text-muted-foreground text-sm px-4 flex items-center gap-2">
                Loading Chats <Loader2 className="size-4 animate-spin"/>
              </p>
            }
            
          </SidebarGroup>
          <SidebarGroup />
        </SidebarContent>
        <SidebarFooter className="pb-4">
        <Button variant="outline" onClick={()=>{createChatHelper()}} disabled={isCreatingChat}>
              {!isCreatingChat ?
                <>
                  <Plus/> Create new Chat
                </>
                :
                <Loader2 className="size-4 animate-spin"/>
              }
        </Button>
        </SidebarFooter>
      </Sidebar>
    )
  }