import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismaClient";
import { pusherServer } from "@/app/libs/pusher";

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    const { userId, isGroup, members, name } = await req.json();
    console.log("userId", userId);

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthroized", { status: 401 });
    }

    if (isGroup && (!members || members.length < 2 || !name)) {
      return new NextResponse("Invalid Data", { status: 400 });
    }

    // creating a group chat
    if (isGroup) {
      const newConversation = await prisma.conversation.create({
        data: {
          isGroup,
          name,
          users: {
            // this connects the users with that conversation
            connect: [
              ...members.map((member: { value: string }) => ({
                id: member.value,
              })),
              {
                id: currentUser.id,
              },
            ],
          },
        },
        include: {
          // this insures that the users data should be poplulated with the conversations not just id
          users: true,
        },
      });

      // sending new conversation to all users of that conversation -
      newConversation.users.forEach((user) => {
        if (user.email) {
          pusherServer.trigger(user.email, "conversation:new", newConversation);
        }
      });

      return NextResponse.json(newConversation);
    }

    // creating single chats (NOTE: have to check for existing conversation)
    const existingConversations = await prisma.conversation.findMany({
      where: {
        users: {
          every: {
            id: {
              in: [currentUser.id, userId],
            },
          },
        },
      },
    });

    const singleConversation = existingConversations[0];

    if (singleConversation) {
      return NextResponse.json(singleConversation);
    }

    // conservation doesn't already exists
    const newConversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [
            {
              id: currentUser.id,
            },
            {
              id: userId,
            },
          ],
        },
      },
      include: {
        users: true,
      },
    });

    // sending new conversation to all users of that conversation -
    newConversation.users.forEach((user) => {
      if (user.email) {
        pusherServer.trigger(user.email, "conversation:new", newConversation);
      }
    });

    return NextResponse.json(newConversation);
  } catch (error) {
    console.log(error, "ERROR_CONVERSATIONS");
    return new NextResponse("Internal server error", { status: 500 });
  }
}
