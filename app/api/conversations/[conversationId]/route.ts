import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismaClient";
import { pusherServer } from "@/app/libs/pusher";

interface Props {
  params: {
    conversationId?: string;
  };
}

export async function DELETE(req: Request, { params }: Props) {
  try {
    const { conversationId } = params;
    const currentUser = await getCurrentUser();

    if (!currentUser?.email || !currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    /*

      Note: we can't include users in delete operations, hence we have to find the existing conversation with included users, using which we will remove the conversation from their sidebar

    */

    // find existing conversation
    const existingConversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });

    if (!existingConversation) {
      return new NextResponse("Invalid conversation Id", { status: 400 });
    }

    const deletedConversation = await prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        users: {
          some: {
            id: currentUser.id, // Ensures that the current user is part of the conversation
          },
        },
      },
    });

    existingConversation.users.forEach((user) => {
      if (user.email) {
        pusherServer.trigger(
          user.email,
          "conversation:remove",
          existingConversation
        );
      }
    });

    return NextResponse.json(deletedConversation);
  } catch (error: any) {
    console.log(error, "ERROR_CONVERSATION_DELETE");
    return new NextResponse("Interal server error", { status: 500 });
  }
}
