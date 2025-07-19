import { NextRequest } from "next/server";

const todos = [
  { id: 1, title: "Belajar Next.js", status: "pending" },
  { id: 2, title: "Kerjakan Tugas Kampus", status: "completed" },
];

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = parseInt((await params).id);
  const task = todos.find((t) => t.id === id);

  if (!task) {
    return new Response(JSON.stringify({ error: "Task not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(task), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = parseInt((await params).id);
  const index = todos.findIndex((t) => t.id === id);

  if (index === -1) {
    return new Response(JSON.stringify({ error: "Task not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const deletedTask = todos.splice(index, 1)[0];

  return new Response(JSON.stringify(deletedTask), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
