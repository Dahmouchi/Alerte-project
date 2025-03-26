import { hash } from "bcrypt";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { name, username, password } = await request.json();

  if (!name || !username || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({ where: { username } });
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  const hashedPassword = await hash(password, 10);

  const user = await prisma.user.create({
    data: { name, username, password: hashedPassword,email:username },
  });

  return NextResponse.json({ message: "Signup successful!", user });
}
