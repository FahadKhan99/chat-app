import prisma from "@/app/libs/prismaClient";
import getSession from "./getSession";
import { User } from "@prisma/client";

export default async function getUsers() {
  const session = await getSession();

  if (!session?.user?.email) {
    return [];
  }

  try {
    // finding all users except the loged in one (us)
    const users: User[] = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        NOT: {
          email: session.user.email,
        },
      },
    });

    return users;
  } catch (error: any) {
    return [];
  }
}
