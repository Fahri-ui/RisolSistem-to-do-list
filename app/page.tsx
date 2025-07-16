"use client";

import { useEffect, useState } from "react";

interface Todo {
  id: number;
  title: string;
  status: "pending" | "completed";
}

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const res = await fetch("/api/todos");
    const data = await res.json();
    setTodos(data);
  };

  const handleAddTask = async () => {
    if (!newTitle.trim()) return;
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, status: "pending" }),
    });
    if (res.ok) {
      setNewTitle("");
      fetchTodos();
    }
  };

  const toggleStatus = async (task: Todo) => {
    const newStatus = task.status === "pending" ? "completed" : "pending";
    await fetch("/api/todos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: task.id, status: newStatus }),
    });
    fetchTodos();
  };

  const startEditing = (task: Todo) => {
    setEditingId(task.id);
    setEditedTitle(task.title);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditedTitle("");
  };

  const saveEdit = async () => {
    if (!editedTitle.trim()) return;
    await fetch("/api/todos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editingId, title: editedTitle }),
    });
    setEditingId(null);
    setEditedTitle("");
    fetchTodos();
  };

  const handleDelete = async (id: number) => {
    await fetch("/api/todos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchTodos();
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter") {
      action();
    }
  };

  const completedTodos = todos.filter(todo => todo.status === "completed");
  const pendingTodos = todos.filter(todo => todo.status === "pending");

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-gray-800 rounded-full flex items-center justify-center text-white text-xl">
              ✓
            </div>
            Task Manager
          </h1>
          <p className="text-gray-300">Kelola tugas Anda dengan efisien</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">Total Tasks</p>
                <p className="text-2xl font-bold text-white">{todos.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center text-blue-300 text-xl">
                📋
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">Pending</p>
                <p className="text-2xl font-bold text-yellow-400">{pendingTodos.length}</p>
              </div>
              <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-yellow-400 text-xl">
                ⏳
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">Completed</p>
                <p className="text-2xl font-bold text-green-400">{completedTodos.length}</p>
              </div>
              <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-green-400 text-xl">
                ✅
              </div>
            </div>
          </div>
        </div>

        {/* Add Task */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 mb-8">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Tulis task baru..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, handleAddTask)}
              className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
            />
            <button
              onClick={handleAddTask}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-gray-800 text-white rounded-lg hover:from-blue-700 hover:to-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 flex items-center gap-2 font-medium"
            >
              <span className="text-lg">➕</span>
              Add Task
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {todos.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 text-2xl">
                📝
              </div>
              <p className="text-gray-300 text-lg">Belum ada task yang dibuat</p>
              <p className="text-gray-500 text-sm">Mulai dengan menambahkan task baru di atas</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className={`bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-700 transition-all duration-200 hover:shadow-xl hover:border-gray-600 ${
                    todo.status === "completed" ? "opacity-75" : ""
                  }`}
                >
                  {editingId === todo.id ? (
                    <div className="flex gap-3 items-center">
                      <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, saveEdit)}
                        className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                        autoFocus
                      />
                      <button
                        onClick={saveEdit}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 flex items-center gap-2"
                      >
                        <span>💾</span>
                        Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 flex items-center gap-2"
                      >
                        <span>❌</span>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleStatus(todo)}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 text-lg ${
                          todo.status === "completed"
                            ? "bg-green-500 border-green-500 text-white"
                            : "border-gray-500 hover:border-blue-400 text-gray-400 hover:text-blue-400"
                        }`}
                      >
                        {todo.status === "completed" ? "✓" : "○"}
                      </button>

                      <div className="flex-1">
                        <span
                          className={`text-lg transition-all duration-200 ${
                            todo.status === "completed"
                              ? "line-through text-gray-500"
                              : "text-white"
                          }`}
                        >
                          {todo.title}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              todo.status === "completed"
                                ? "bg-green-900 text-green-300 border border-green-700"
                                : "bg-yellow-900 text-yellow-300 border border-yellow-700"
                            }`}
                          >
                            {todo.status === "completed" ? (
                              <>
                                <span>✅</span>
                                Completed
                              </>
                            ) : (
                              <>
                                <span>⏳</span>
                                Pending
                              </>
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEditing(todo)}
                          className="p-2 text-blue-400 hover:bg-gray-700 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                          title="Edit task"
                        >
                          <span className="text-lg">✏️</span>
                        </button>
                        <button
                          onClick={() => handleDelete(todo.id)}
                          className="p-2 text-red-400 hover:bg-gray-700 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                          title="Delete task"
                        >
                          <span className="text-lg">🗑️</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}