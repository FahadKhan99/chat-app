import prisma from "@/app/libs/prismaClient";
import getCurrentUser from "./getCurrentUser";

const getConversations = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser?.email) {
    return [];
  }

  try {
    const conversations = await prisma.conversation.findMany({
      orderBy: {
        lastMessageAt: "desc",
      },
      where: {
        users: {
          some: {
            id: currentUser.id, // Filter where currentUser is part of the users
          },
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            sender: true,
            seen: true, // array of people who has seen the messages
          },
        },
      },
    });

    return conversations;
  } catch (error: any) {
    return [];
  }
};

export default getConversations;
