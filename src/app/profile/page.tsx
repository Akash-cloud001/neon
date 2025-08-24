import { Button } from '@/components/ui/button'
import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, Plus } from 'lucide-react';
import ModalCards from '@/components/ModalCards'

const page = () => {
    return (
        <section className='font-mono w-full px-8 py-6'>
            <div className='flex items-center justify-between'>
                <p className='tracking-tight'>
                    Total Modals <span className='font-bold'>10</span>
                </p>
                <DropdownMenu>
                    <DropdownMenuTrigger className='float-end'>
                        <Button variant='outline' className='w-full font-mono border-dashed'>
                            <Plus /> NEW MODAL
                            <ChevronDown />
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
            {/* <hr className='my-8' /> */}
            <div className='mt-8 flex flex-row items-start justify-start gap-8 flex-wrap'>
                {/* section to showcase the list of modals and their api keys... */}
               <ModalCards />
            </div>
        </section>
    )
}

export default page