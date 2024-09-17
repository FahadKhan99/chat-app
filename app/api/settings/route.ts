import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismaClient";

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    const { image, name } = await req.json();

    if (!currentUser?.email || !currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        image,
        name,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.log(error, "SETTINGS_ERROR");
    return new NextResponse("Interal server error", { status: 500 });
  }
}
