"use client"
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Column, Id, Task } from '@/types/types'
import { CirclePlus } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import ColumnContainer from './ColumnContainer'
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, MouseSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext } from '@dnd-kit/sortable'
import { createPortal } from 'react-dom'
import TaskCard from './TaskCard'

function KanbanBoard() {

    const [columns, setColumns] = useState<Column[]>([])
    const [tasks, setTasks] = useState<Task[]>([]);
    const columnIds = useMemo(() => columns.map((col)=>col.id), [columns])
    const [activeColumn, setActiveColumn] = useState<Column | null>(null);
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [mount, setMount] = useState(false);
    console.log(columns)

    useEffect(() => {
      setMount(true);
    }, [])
    

    function createColumn() {
        const columnToAdd:Column = {
            id: generateId(),
            title: `Column ${columns.length + 1}`
        }
        setColumns([...columns,columnToAdd]);
    }

    function updateTask(id: Id, content: string) {
        const newTask= tasks.map((task)=>{
            if(task.id !== id) return task;
            return {...task,content}
        })
        setTasks(newTask);
    }

    function deleteTask (id:Id) {
        const newTasks = tasks.filter((task)=> task.id!==id);
        setTasks(newTasks)
    }

    function deleteColumn(id: Id) {
        const filteredColumns = columns.filter((col)=>col.id !== id);
        setColumns(filteredColumns)

        const newTasks = tasks.filter(t=>t.columnId !== id)
        setTasks(newTasks);
    }

    function generateId() {
        return Math.floor(Math.random() * 100001);
    }

    function createTask(columnId: Id) {
        const newTask: Task = {
            id: generateId(),
            columnId: columnId,
            content: `Task Length ${tasks.length + 1}`
        }
        setTasks([...tasks,newTask]);
    }

    function updateColumn(id: Id, title: string) {
        const newColumn = columns.map((col) => {
            if(col.id !==id) return col;
            return {...col, title};
        })
        setColumns(newColumn);
    }

    function onDragStart(event: DragStartEvent) {
        console.log(event)
        if(event.active.data.current?.type === "Column"){
            setActiveColumn(event.active.data.current.column)
            return;
        }
        if(event.active.data.current?.type === "Task"){
            setActiveTask(event.active.data.current.task)
            return;
        }
    }

    function onDragEnd(event: DragEndEvent) {
        const {active, over} = event;
        if(!over) return;
        const activeColumnId  = active.id;
        const overColumnId = over.id;
        if(activeColumnId === overColumnId) return;
        setColumns((columns) =>{
            const activeColumnIndex = columns.findIndex(
                (col) => col.id === activeColumnId)
            
            const overColumnIndex = columns.findIndex(
                (col) => col.id === overColumnId
            )

            return arrayMove(columns, activeColumnIndex, overColumnIndex);
        })
    }

    function onDragOver(event:DragOverEvent) 
    {
        const {active, over} = event;
        if(!over) return;
        const activeColumnId  = active.id;
        const overColumnId = over.id;
        if(activeColumnId === overColumnId) return;
        const isActiveTask = active.data.current?.type === "Task";
        const isOverTask = over.data.current?.type === "Task";
        if(isActiveTask && isOverTask){
            setTasks(tasks => {
                const activeIndex = tasks.findIndex((t)=>t.id === activeColumnId);
                const overIndex = tasks.findIndex((t)=> t.id === overColumnId);
                tasks[activeIndex].columnId = tasks[overIndex].columnId
                return arrayMove(tasks, activeIndex, overIndex)
            })
        }
        const isOverAColumn = over.data.current?.type === "Column";
        if (isActiveTask && isOverAColumn){
            setTasks((tasks)=>{
                const activeIndex = tasks.findIndex((t)=>t.id === activeColumnId);
                tasks[activeIndex].columnId = overColumnId
                return arrayMove(tasks, activeIndex, activeIndex)
            }) 
        }
    }

    return (
        <div className={cn('m-auto min-h-screen w-full bg-zinc-900', 
            'flex items-center overflow-x-auto overflow-y-hidden')}>
            <DndContext sensors={useSensors(
                useSensor(PointerSensor,{
                    activationConstraint:{            
                        distance:3
                    },
                }),
                useSensor(MouseSensor, {
                    activationConstraint: {
                        distance: 10,
                    }
                })
            )} onDragStart={onDragStart} 
               onDragEnd={onDragEnd}
               onDragOver={onDragOver}>
                <div className={cn('m-auto flex gap-4')}>
                    <div className='flex gap-2'>
                        <SortableContext items={columnIds}>
                        {
                            columns.map((col)=>(
                                <div key={col.id}>
                                    <ColumnContainer key={col.id} 
                                        column={col} 
                                        deleteColumn={deleteColumn}
                                        updateColumn={updateColumn}
                                        createTask={createTask}
                                        deleteTask={deleteTask}
                                        tasks={tasks.filter(task => task.columnId === col.id)}
                                        updateTask={updateTask}/>
                                </div>
                            ))
                        }
                        </SortableContext>
                    </div>
                    <Button onClick={createColumn} className='border-sky-400 border-2'>
                        <CirclePlus />Add Column
                    </Button>
                </div>
                
                {mount && createPortal(
                    <DragOverlay>
                        {
                            activeColumn && 
                            <ColumnContainer 
                                column={activeColumn} 
                                deleteColumn={deleteColumn}
                                updateColumn={updateColumn}
                                createTask={createTask}
                                deleteTask={deleteTask}
                                tasks={tasks.filter(task => task.columnId === activeColumn.id)}
                                updateTask={updateTask}
                                />
                        }
                        {
                            activeTask && 
                            <TaskCard task={activeTask} 
                                        deleteTask={deleteTask}
                                        updateTask={updateTask}/>
                        }
                    </DragOverlay>, document.body
                )} 
            </DndContext>
        </div>
    )
}

export default KanbanBoard


