let todos = [
  { id: 1, title: "Belajar Next.js", status: "pending" },
  { id: 2, title: "Kerjakan Tugas JDA", status: "completed" },
];

export async function GET(): Promise<Response> {
  return new Response(JSON.stringify(todos), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: Request): Promise<Response> {
  const body = await request.json();
  const { title, status } = body;

  const newTask = { id: Date.now(), title, status: status || "pending" };
  todos.push(newTask);

  return new Response(JSON.stringify(newTask), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}

export async function PATCH(request: Request): Promise<Response> {
  const body = await request.json();
  const { id, title, status } = body;

  const existingTask = todos.find((task) => task.id === id);

  if (existingTask) {
    if (title !== undefined) existingTask.title = title;
    if (status !== undefined) existingTask.status = status;

    return new Response(JSON.stringify(existingTask), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ error: "Task not found" }), {
    status: 404,
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE(request: Request): Promise<Response> {
  const body = await request.json();
  const { id } = body;

  const index = todos.findIndex((task) => task.id === id);

  if (index !== -1) {
    const deletedTask = todos.splice(index, 1)[0];
    return new Response(JSON.stringify(deletedTask), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ error: "Task not found" }), {
    status: 404,
    headers: { "Content-Type": "application/json" },
  });
}
