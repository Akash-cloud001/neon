import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    
  } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BrainCircuit, ChevronDown, File, Plus } from "lucide-react"
  
  export function AppSidebar() {
    return (
      <Sidebar className="p-0">
        <SidebarHeader className="px-4 pt-4 ">
          <div className="flex items-center justify-between gap-2">
            {/* <Image src="/logo.png" alt="logo" width={32} height={32} /> */}
            <BrainCircuit />
            <DropdownMenu>
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
          </DropdownMenu>
          </div>
        </SidebarHeader>
        <SidebarContent className="pt-4 text-primary dark:text-primary">
          <p className="px-4 text-foreground dark:text-foreground -mb-3 font-semibold">
            Chats
          </p>
          <SidebarGroup >
            <Button className="flex items-center w-full justify-start gap-2" variant="ghost">
              <File className="size-4"/> <p>Your first chat</p>
            </Button>
          </SidebarGroup>
          <SidebarGroup />
        </SidebarContent>
        <SidebarFooter className="pb-4">
        <Button variant="outline">
              <Plus/> Create new Chat
            </Button>
        </SidebarFooter>
      </Sidebar>
    )
  }