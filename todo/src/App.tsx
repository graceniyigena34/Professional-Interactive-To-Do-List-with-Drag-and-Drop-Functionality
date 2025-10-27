import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import TaskItem from "./components/TaskItem";

// Inline task type
interface TaskType {
  id: string;
  text: string;
}

const STORAGE_KEY = "todo_tasks_v1";

function reorder(list: TaskType[], startIndex: number, endIndex: number): TaskType[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

export default function App() {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setTasks(JSON.parse(raw));
    } catch (e) {
      console.warn("Could not parse saved tasks", e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (!input.trim()) return;
    const newTask: TaskType = { id: String(Date.now()), text: input.trim() };
    setTasks((s) => [...s, newTask]);
    setInput("");
  };

  const handleDelete = (id: string) => {
    setTasks((s) => s.filter((t) => t.id !== id));
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (result.source.index === result.destination.index) return;
    const reordered = reorder(tasks, result.source.index, result.destination.index);
    setTasks(reordered);
  };

  const onEnterAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleAddTask();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <header className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">To-Do List</h1>
          <p className="text-sm text-gray-500 mt-1">React + TypeScript + Tailwind — drag to reorder</p>
        </header>

        {/* input */}
        <div className="flex gap-2 mb-6">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onEnterAdd}
            placeholder="Add a new task..."
            className="flex-1 px-4 py-3 rounded-l-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            aria-label="New task"
          />
          <button
            onClick={handleAddTask}
            className="px-5 py-3 rounded-r-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
            aria-label="Add task"
          >
            Add
          </button>
        </div>

        {/* list */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="task-list">
              {(provided) => (
                <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                  {tasks.length === 0 && (
                    <li className="text-gray-500 italic p-4">No tasks yet — add one above.</li>
                  )}

                  {tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided, snapshot) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TaskItem
                            text={task.text}
                            onDelete={() => handleDelete(task.id)}
                            isDragging={snapshot.isDragging}
                          />
                        </li>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        {/* footer */}
        <footer className="mt-4 text-sm text-gray-500 flex justify-between items-center">
          <span>{tasks.length} task{tasks.length !== 1 ? "s" : ""}</span>
          <div>
   <button
  onClick={() => setTasks([])}
  disabled={tasks.length === 0}
  className={`
    px-5 py-2.5
    rounded-lg
    font-semibold
    text-white
    bg-green-600
    hover:bg-green-700
    focus:outline-none
    focus:ring-2
    focus:ring-green-400
    disabled:bg-green-300
    disabled:text-gray-100
    disabled:cursor-not-allowed
    transition
    duration-200
    shadow-md
    hover:shadow-lg
  `}
>
  Clear All
</button>


          </div>
        </footer>
      </div>
    </div>
  );
}
