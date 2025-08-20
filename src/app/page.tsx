import { Button } from "@/components/ui/button";
import { BrainCircuit, Key, PlusIcon } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="font-mono flex flex-col items-center justify-center h-[calc(100vh-69px)] w-full gap-6 px-4">
      <div className="flex flex-row items-center justify-center gap-2 sm:gap-4">
        <BrainCircuit className="w-6 sm:w-10 h-6 sm:h-10" />
        <h1 className="text-xl sm:text-4xl font-semibold tracking-tight leading-1">
          Welcome to Neon
        </h1>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button className="" variant="outline">
          <Key/> Add LLM Keys
        </Button>
        <Button className="" variant="outline">
          <PlusIcon /> Create a new chat
        </Button>
      </div>
    </div>
  );
}
