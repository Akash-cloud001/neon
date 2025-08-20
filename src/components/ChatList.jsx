import React from "react";
import { Button } from "@/components/ui/button";
import {
  Check,
  Cross,
  EllipsisVertical,
  File,
  SquarePen,
  Trash,
  X,
} from "lucide-react";
import { useChatStore } from "@/store/chat-store";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "./ui/input";

const ChatList = ({ chat }) => {
  const { deleteChat, renameChat } = useChatStore((state) => state.actions);
  const [editChatName, setEditChatName] = useState("");
  const [isEditingChatName, setIsEditingChatName] = useState(false);
  const router = useRouter();
  const handleDeleteChat = async (e) => {
    e.stopPropagation();
    const res = await deleteChat(chat.id);
    router.push("/");
  };
  const handleRenameChat = async (e) => {
    e.stopPropagation();
    await renameChat(chat.id, editChatName);
    setIsEditingChatName(false);
  };
  return (
    <>
      {!isEditingChatName ? (
        <Button
          className="flex items-start w-full justify-between gap-2 mt-1"
          variant="ghost"
          key={chat.id}
          onClick={() => {
            router.push(`/chat/${chat.id}`);
          }}
        >
          <span className="flex items-center gap-2">
            <File className="size-4" />
            <p>{chat.title}</p>
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <EllipsisVertical className="cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {/* Toggle edit */}
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingChatName(!isEditingChatName);
                  setEditChatName(chat.title); // preload current title
                }}
              >
                <SquarePen />
                <span className="text-foreground">
                  {isEditingChatName ? "Cancel" : "Edit"}
                </span>
              </DropdownMenuItem>

              {/* Delete chat */}
              <DropdownMenuItem onClick={handleDeleteChat}>
                <Trash className="text-destructive" />
                <span className="text-destructive">Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Button>
      ) : (
        <div className="flex items-center gap-1 mt-2">
          <Input
            type="text"
            value={editChatName}
            onChange={(e) => setEditChatName(e.target.value)}
            className="w-full"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                renameChat(chat.id, editChatName);
                setIsEditingChatName(false);
              }
            }}
          />
          <Button variant="outline" onClick={handleRenameChat}>
            <Check className="size-3" />
          </Button>
          <Button variant="outline" onClick={() => setIsEditingChatName(false)}>
            <X className="size-3" />
          </Button>
        </div>
      )}
    </>
  );
};

export default ChatList;
