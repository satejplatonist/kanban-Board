import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Column, Id, Task } from '@/types/types';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { FilePlus, Trash2 } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import {CSS} from '@dnd-kit/utilities';
import { Input } from '@/components/ui/input';
import TaskCard from './TaskCard';

interface Props{
    column: Column,
    deleteColumn: (id: Id)=>void,
    updateColumn: (id: Id, title: string) => void,
    createTask: (id: Id) => void,
    tasks: Task[],
    deleteTask: (id: Id) => void,
    updateTask: (id: Id, content: string) => void
}

function ColumnContainer({column,deleteColumn, updateColumn, createTask, deleteTask, tasks, updateTask}:Props) {
  const [editMode, setEditMode] = useState(false);
  const tasksIds = useMemo(() => tasks.map((task)=>task.id), [tasks])
  const {setNodeRef, attributes, listeners, transform, transition, isDragging} = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column
    },
    disabled: editMode
  })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform)
  }

  if(isDragging)
  {
    return <div ref={setNodeRef} 
    style={style} 
    className={cn('bg-zinc-700 text-zinc-100','opacity-60',
    'h-96 w-80 rounded-md','flex flex-col','border-2 border-sky-600')}>

    </div>
  }

  return (
    <div ref={setNodeRef} style={style} 
      className={cn('bg-zinc-800 text-zinc-100 border-2 border-zinc-700/60',
                    'h-96 w-80 rounded-md','flex flex-col')}>

        <div className='bg-sky-900 text-md h-12 rounded-t-md
        cursor-grab p-2 border-sky-800 border-2 flex flex-row gap-2 
        items-center justify-between'>
            <div {...attributes} {...listeners} 
            className='flex flex-row items-center justify-start gap-x-2 flex-1'
            onClick={(e) => {
              e.stopPropagation()
              setEditMode(true)
            }}>
              <div className='bg-sky-500 px-2 py-0.5 rounded-xl'>1</div>
              {!editMode && column.title}
              {editMode && 
                <Input autoFocus onBlur={()=>{
                  setEditMode(false)
                }} onKeyDown={e=>{
                   if(e.key !== "Enter") return;
                   setEditMode(false);
                }} onChange={(e) => 
                  updateColumn(column.id, e.target.value)
                } className='bg-zinc-700 focus:border-rose-500 focus:border-2 border-rounded outline-none px-2'/>
              }
            </div>
            <Button className={cn('bg-zinc-800 ml-2',
                'border-2 border-cyan-700','hover:border-red-800 hover:bg-red-900')}
                onClick={(e) => {
                  e.stopPropagation()
                  console.log('reached here')
                  deleteColumn(column.id)
                }}>
                <Trash2 className='text-zinc-100 hover:text-red-500'/>
            </Button>

        </div>

        <div className='flex flex-grow flex-col gap-2 p-2
        overflow-x-hidden overflow-y-auto'>
          <SortableContext items={tasksIds}>
          {
            tasks.map((task)=>(
              <TaskCard 
                key={task.id} 
                task={task}
                deleteTask={deleteTask}
                updateTask={updateTask}/>
            ))
          }
          </SortableContext>
        </div>

        <div className='p-1 flex flex-row-reverse'>
          <Button className='border-2 border-sky-600'
            onClick={()=>createTask(column.id)}>
            <FilePlus/>Add Task
          </Button>
        </div>
    </div>
  )
}

export default ColumnContainer