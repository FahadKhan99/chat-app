"use client";

import useOtherUser from "@/app/hooks/useOtherUser";
import { Conversation, User } from "@prisma/client";
import { format } from "date-fns";
import { useMemo, useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { HiEllipsisHorizontal } from "react-icons/hi2";
import Avatar from "@/app/components/Avatar";
import ConfirmDelete from "./ConfirmDelete";
import AvatarGroup from "@/app/components/AvatarGroup";
import useActiveList from "@/app/hooks/useActiveList";

interface Props {
  conversation: Conversation & {
    users: User[];
  };
}

const ProfileDrawer = ({ conversation }: Props) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const otherUser = useOtherUser(conversation);

  const { members } = useActiveList();

  const isActive = members.indexOf(otherUser?.email!) !== -1;

  const joinedDate = useMemo(() => {
    return format(new Date(otherUser.createdAt), "PP");
  }, [otherUser.createdAt]);

  const title = useMemo(() => {
    return conversation.name || otherUser.name;
  }, [conversation.name, otherUser.name]);

  const statusText = useMemo(() => {
    if (conversation.isGroup) {
      return `Group has ${conversation.users.length} participants`;
    }
    return isActive ? "Available" : "Offline";
  }, [conversation, isActive]);

  const usersEmail = conversation.users.map((user) => user.email);

  return (
    <>
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetTrigger>
          <HiEllipsisHorizontal
            size={32}
            onClick={() => setDrawerOpen(true)}
            className="text-sky-500 cursor-pointer hover:text-sky-600 transition"
          />
        </SheetTrigger>

        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              <div className="relative mt-14 flex-1 px-4 sm:px-6">
                <div className="flex flex-col items-center">
                  <div className="mb-2">
                    {conversation.isGroup ? (
                      <AvatarGroup users={conversation.users} />
                    ) : (
                      <Avatar user={otherUser} />
                    )}
                  </div>
                  <div>{title}</div>
                  <div className="text-sm text-gray-500">{statusText}</div>

                  <div className="flex flex-col gap-4 my-8">
                    <div className="flex flex-col gap-3 items-center cursor-pointer hover:opacity-75">
                      <ConfirmDelete />
                    </div>

                    <div className="text-sm font-light text-neutral-600">
                      Delete {conversation.isGroup ? "Group" : "Chat"}
                    </div>
                  </div>
                </div>
              </div>
            </SheetTitle>
            <SheetDescription>
              <div className="w-full pb-5 pt-5 sm:px-0 sm:pt-0">
                <dl className="space-y-8 px-4 sm:space-y-6 sm:px-6">
                  {conversation.isGroup && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 ">
                        Emails
                      </dt>
                      <div className="flex flex-col">
                        {usersEmail.map((email) => (
                          <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                            {email}
                          </dd>
                        ))}
                      </div>
                    </div>
                  )}
                  {!conversation.isGroup && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 ">
                        Email
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                        {otherUser.email}
                      </dd>
                    </div>
                  )}
                  {!conversation.isGroup && (
                    <>
                      <hr />
                      <div>
                        <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 ">
                          Joined
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                          {joinedDate}
                        </dd>
                      </div>
                    </>
                  )}
                </dl>
              </div>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ProfileDrawer;
