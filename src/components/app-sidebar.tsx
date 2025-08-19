import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    
  } from "@/components/ui/sidebar"
  import { Button } from "@/components/ui/button"
import { File, Plus } from "lucide-react"
  
  export function AppSidebar() {
    return (
      <Sidebar className="p-0">
        <SidebarHeader className="px-4 py-2 border-b">
          <div>
            {/* <Image src="/logo.png" alt="logo" width={32} height={32} /> */}
            <h1 className="text-xl font-bold text-primary dark:text-primary">
              Neon
            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent className="pt-4 text-primary dark:text-primary">
          <SidebarGroup>
            <Button variant="outline">
              <Plus/> Create new Chat
            </Button>
          </SidebarGroup>


          <SidebarGroup >
            <Button className="flex items-center w-full justify-start gap-2" variant="ghost">
              <File className="size-4"/> <p>Your first chat</p>
            </Button>
          </SidebarGroup>
          <SidebarGroup />
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
    )
  }