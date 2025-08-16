import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Column, Id } from '@/types/types';
import { Trash2 } from 'lucide-react';
import React from 'react';

interface Props{
    column: Column,
    deleteColumn: (id: Id)=>void
}

function ColumnContainer({column,deleteColumn}:Props) {
  return (
    <div className={cn('bg-zinc-800 text-zinc-100',
                    'h-96 w-80 rounded-md','flex flex-col')}>

        <div className='bg-sky-900 text-md h-12 rounded-t-md
        cursor-grab p-2 border-sky-800 border-2 flex flex-row gap-2 
        items-center justify-start'>

            <div className='bg-sky-500 px-2 py-0.5 rounded-xl'>1</div>
            {column.title}
            <Button className={cn('ml-auto','bg-zinc-800',
                'border-2 border-cyan-700','hover:border-red-800 hover:bg-red-900')}
                onClick={() => deleteColumn(column.id)}>
                <Trash2 className='text-zinc-100 hover:text-red-500'/>
            </Button>

        </div>

        <div className='flex flex-grow'>Content</div>
    </div>
  )
}

export default ColumnContainer