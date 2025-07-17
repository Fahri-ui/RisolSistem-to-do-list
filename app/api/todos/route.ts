import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ GET semua data
export async function GET() {
  const todos = await prisma.todo.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(todos);
}

// ✅ CREATE data baru
export async function POST(request: Request) {
  const { title } = await request.json();
  const newTodo = await prisma.todo.create({
    data: { title },
  });
  return NextResponse.json(newTodo);
}

// ✅ UPDATE (PATCH)
export async function PATCH(request: Request) {
  const { id, title, status } = await request.json();

  const updatedTodo = await prisma.todo.update({
    where: { id },
    data: {
      ...(title && { title }),
      ...(status && { status }),
    },
  });

  return NextResponse.json(updatedTodo);
}

// ✅ DELETE
export async function DELETE(request: Request) {
  const { id } = await request.json();
  await prisma.todo.delete({ where: { id } });
  return NextResponse.json({ message: "Deleted" });
}
