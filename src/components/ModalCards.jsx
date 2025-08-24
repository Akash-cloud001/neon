import { Button } from '@/components/ui/button'
import React from 'react'
import { Trash } from 'lucide-react';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const ModalCards = () => {
  return (
    <Card className='w-full max-w-2xs  md:max-w-80'>
        <CardHeader>
            <CardTitle>Modal_Name</CardTitle>
            <CardDescription>added_date</CardDescription>
            <CardAction>
                <Button variant='outline' className='text-destructive/80 hover:text-destructive'>
                    <Trash /> 
                </Button>
            </CardAction>
        </CardHeader>
        <CardContent>
            <h2>
                API KEY
            </h2>
            <CardDescription>njkfioahfnasonfo...</CardDescription>
        </CardContent>
    </Card>
  )
}

export default ModalCards