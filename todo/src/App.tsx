import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import TaskItem from "./components/TaskItem";

interface TaskType {
  id: string;
  text: string;
}

const STORAGE_KEY = "todo_tasks_v1";
const THEME_KEY = "todo_theme";

function reorder(list: TaskType[], startIndex: number, endIndex: number): TaskType[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

export default function App() {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState<boolean>(
    localStorage.getItem(THEME_KEY) === "dark"
  );

  useEffect(() => {
    // load tasks
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setTasks(JSON.parse(raw));
    } catch (e) {
      console.warn("Could not parse saved tasks", e);
    }

    // apply saved theme
    document.documentElement.classList.toggle("dark", darkMode);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem(THEME_KEY, darkMode ? "dark" : "light");
  }, [darkMode]);

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
    <div
      className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-500 
      ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-green-50 via-white to-green-100"
      }`}
    >
      <div
        className={`w-full max-w-2xl p-6 rounded-2xl shadow-lg transition-colors duration-500
        ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}
      `}
      >
        <header className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 drop-shadow-sm">
              To-Do List
            </h1>
            <p className="text-sm md:text-base opacity-75">
              Manage your tasks easily — drag & drop to reorder
            </p>
          </div>

          {/* 🌗 Theme Toggle Button */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full text-sm font-medium transition
              ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600 text-yellow-300"
                  : "bg-green-100 hover:bg-green-200 text-green-800"
              }`}
            title="Toggle theme"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </header>

        {/* input */}
        <div className="flex gap-2 mb-6">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onEnterAdd}
            placeholder="Add a new task..."
            className={`flex-1 px-4 py-3 rounded-l-md border focus:outline-none focus:ring-2
            ${
              darkMode
                ? "border-gray-700 bg-gray-700 placeholder-gray-400 focus:ring-green-500"
                : "border-gray-200 bg-white placeholder-gray-400 focus:ring-green-300"
            }`}
          />
          <button
            onClick={handleAddTask}
            className="px-5 py-3 rounded-r-md bg-green-600 text-white font-medium hover:bg-green-700 transition"
          >
            Add
          </button>
        </div>

        {/* list */}
        <div
          className={`p-4 rounded-lg shadow-inner transition-colors
          ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}
        >
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="task-list">
              {(provided) => (
                <ul
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-3"
                >
                  {tasks.length === 0 && (
                    <li className="italic opacity-70 p-4">
                      No tasks yet — add one above.
                    </li>
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
        <footer className="mt-4 text-sm flex justify-between items-center opacity-80">
          <span>
            {tasks.length} task{tasks.length !== 1 ? "s" : ""}
          </span>
          <button
            onClick={() => setTasks([])}
            disabled={tasks.length === 0}
            className={`px-5 py-2.5 rounded-lg font-semibold transition duration-200 shadow-md hover:shadow-lg
              ${
                darkMode
                  ? "bg-green-700 text-white hover:bg-green-600 disabled:bg-green-900"
                  : "bg-green-600 text-white hover:bg-green-700 disabled:bg-green-300"
              }`}
          >
            Clear All
          </button>
        </footer>
      </div>
    </div>
  );
}
