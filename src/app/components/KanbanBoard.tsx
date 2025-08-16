"use client"
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Column, Id } from '@/types/types'
import { CirclePlus } from 'lucide-react'
import React, { useState } from 'react'
import ColumnContainer from './ColumnContainer'

function KanbanBoard() {

    const [columns, setColumns] = useState<Column[]>([])
    console.log(columns)

    function createColumn() {
        const columnToAdd:Column = {
            id: generateId(),
            title: `Column ${columns.length + 1}`
        }
        setColumns([...columns,columnToAdd]);
    }

    function deleteColumn(id: Id) {
        const filteredColumns = columns.filter((col)=>col.id !== id);
        setColumns(filteredColumns)
    }

    function generateId() {
        return Math.floor(Math.random() * 100001);
    }

    return (
        <div className={cn('m-auto min-h-screen w-full bg-zinc-900', 
            'flex items-center overflow-x-auto overflow-y-hidden')}>
            <div className={cn('m-auto flex gap-4')}>
                <div className='flex gap-2'>
                    {
                        columns.map((col)=>(
                            <div key={col.id}>
                                <ColumnContainer key={col.id} column={col} deleteColumn={deleteColumn}/>
                            </div>
                        ))
                    }
                </div>
                <Button onClick={createColumn} className='border-sky-400 border-2'>
                    <CirclePlus />Add Column
                </Button>
            </div>
        </div>
    )
}

export default KanbanBoard


