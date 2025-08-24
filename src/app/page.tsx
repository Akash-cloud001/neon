"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Key, Loader2, Plus } from "lucide-react";
import { useChatStore } from "@/store/chat-store";
import { useRouter } from "next/navigation";

export default function Home() {
const { createChat } = useChatStore((state) => state.actions);
const router = useRouter();
  const [isCreatingChat, setIsCreatingChat] = useState(false)
  const createChatHelper = async () => {
    setIsCreatingChat(true);
    try {
      const newChat = await createChat();
      setIsCreatingChat(false);
      if (newChat) {
        console.log(newChat)
        router.push(`/chat/${newChat.id}`);
      }
    } catch (error) {
      setIsCreatingChat(false);
      alert(`Error creating chat: ${error}`);
    }
  }
  return (
    <div className="font-mono flex flex-col items-center justify-center h-[calc(100vh-69px)] w-full gap-6 px-4">
      <div className="flex flex-row items-center justify-center gap-2 sm:gap-4">
        <BrainCircuit className="w-6 sm:w-10 h-6 sm:h-10" />
        <h1 className="text-xl sm:text-4xl font-semibold tracking-tight leading-1">
          Welcome to Neon
        </h1>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        {/* <Button className="" variant="outline">
          <Key/> Add LLM Keys
        </Button> */}
        <Button variant="outline" onClick={() => { createChatHelper() }} disabled={isCreatingChat}>
          {!isCreatingChat ?
            <>
              <Plus /> Create new Chat
            </>
            :
            <Loader2 className="size-4 animate-spin" />
          }
        </Button>
      </div>
    </div>
  );
}
