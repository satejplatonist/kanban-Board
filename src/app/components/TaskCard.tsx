import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Id, Task } from "@/types/types"
import { useSortable } from "@dnd-kit/sortable"
import { Trash2 } from "lucide-react"
import { useState } from "react"
import {CSS} from '@dnd-kit/utilities';


interface Props{
    task: Task,
    deleteTask: (id: Id) => void,
    updateTask: (id: Id, content: string) => void
}

function TaskCard({task, deleteTask, updateTask}:Props) {

    const [mouseIsOver, setMouseIsOver] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const {setNodeRef, attributes, listeners, transform, transition, isDragging} = useSortable({
        id: task.id,
        data: {
          type: "Task",
          task
        },
        disabled: editMode
    })

    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    }
    
    const toggleMode = () =>{
        setEditMode((prev) => !prev)
        setMouseIsOver(false);
    }

    if(isDragging) {
        return <div ref={setNodeRef} style={style}
        className="bg-zinc-700 opacity-30 p-2.5 h-16
        min-h-16 items-center flex flex-left rounded-sm border-2
        border-sky-500 cursor-grab relative"/>
    }

    if(editMode)
    {
        return <div ref={setNodeRef} style={style} {...attributes} {...listeners}
        className="bg-zinc-700 h-16 min-h-16 rounded-sm flex text-left
        hover:ring-2 hover:ring-inset hover:ring-sky-500 cursor-grab relative">
            <Textarea className="focus:outline-none"
                value={task.content}
                autoFocus
                placeholder="Task content here"
                onBlur={toggleMode}
                onKeyDown={(e)=>{
                    if(e.key === 'Enter' && e.shiftKey) toggleMode();
                }}onChange={(e)=>updateTask(task.id, e.target.value)}></Textarea>
        </div>
    }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}
    className="bg-zinc-700 p-2 h-16 min-h-16 rounded-sm flex text-left
    hover:ring-2 hover:ring-inset hover:ring-sky-500 cursor-grab relative"
     onMouseEnter={() => {
        setMouseIsOver(true);
     }}
     onMouseLeave={() => {
        setMouseIsOver(false);
     }} onClick={toggleMode}>
        <p className="whitespace-pre-wrap overflow-x-hidden overflow-y-auto
        my-auto h-[90%] w-full">
            {task.content}
        </p>   
        {mouseIsOver && <Button className="absolute right-1 top-1/5"
        onClick={() => deleteTask(task.id)}>
            <Trash2/>
        </Button>}
    </div>
  )
}

export default TaskCard