import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismaClient";
import { pusherServer } from "@/app/libs/pusher";

interface Props {
  params: {
    conversationId: string;
  };
}

// make sure that the Props should be after req: Request
export async function POST(req: Request, { params }: Props) {
  try {
    const currentUser = await getCurrentUser();
    const { conversationId } = params;

    if (!currentUser?.email || !currentUser.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // finding the existing conversation the given ID
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true,
          },
        },
      },
    });

    if (!conversation) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    // finding the last message
    const lastMessage = conversation.messages[conversation.messages.length - 1];

    if (!lastMessage) {
      return NextResponse.json(conversation);
    }

    // updating the seen of last message
    const updatedMessage = await prisma.message.update({
      where: {
        id: lastMessage.id,
      },
      data: {
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
      include: {
        seen: true,
        sender: true,
      },
    });

    await pusherServer.trigger(currentUser.email, "conversation:update", {
      id: conversationId,
      messages: [updatedMessage],
    });

    const seenIds = Array.isArray(lastMessage.seen)
      ? lastMessage.seen.map((user) => user.id)
      : [];

    // If currentUser has already seen the message, return the conversation
    if (seenIds.indexOf(currentUser.id) !== -1) {
      console.log("seenIds - ", seenIds);
      return NextResponse.json(conversation);
    }

    // we can alert every user that we have seen that message
    await pusherServer.trigger(
      conversationId!,
      "message:update",
      updatedMessage
    );

    return NextResponse.json(updatedMessage);
  } catch (error) {
    return new NextResponse("Internal server error", { status: 500 });
  }
}
