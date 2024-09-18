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

    // makes sure that only conversation with two users are retreived.
    const properConversation = conversations.filter(
      (conversation) => conversation.users.length > 1
    );

    return properConversation;
  } catch (error) {
    return [];
  }
};

export default getConversations;
