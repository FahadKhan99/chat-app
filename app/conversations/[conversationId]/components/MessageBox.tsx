import Avatar from "@/app/components/Avatar";
import { FullMessageType } from "@/app/types";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import Image from "next/image";
import { useState } from "react";
import ImageModal from "./ImageModal";

interface Props {
  message: FullMessageType;
  isLastMessage?: boolean;
}

const MessageBox = ({ message, isLastMessage }: Props) => {
  const session = useSession();
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const isOwn = session?.data?.user?.email === message?.sender?.email;

  // the following will produce somelike -> John, Sam, Dave for groups and normally a single name
  const seenList = (message.seen || [])
    .filter(
      (user) => user.email !== message?.sender?.email // removing sender email from seen
    )
    .map((user) => user.name)
    .join(", ");

  // following are some dynamic classes
  const container = clsx("flex gap-3 p-4", isOwn && "justify-end");

  const avatar = clsx(isOwn && "order-2");

  const body = clsx("flex flex-col gap-2 ", isOwn && "items-end");

  const messageClass = clsx(
    "text-sm w-fit overflow-hidden ",
    isOwn ? "bg-sky-500 text-white" : "bg-gray-100",
    message.image ? "rounded-md p-0" : "rounded-full py-2 px-3"
  );

  return (
    <div className={container}>
      <div className={avatar}>
        <Avatar user={message.sender} />
      </div>

      <div className={body}>
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500 ">{message.sender.name}</div>
          <div className="text-xs text-gray-400">
            {format(new Date(message.createdAt), "p")}
          </div>
        </div>

        <div className={messageClass}>
          <ImageModal
            src={message.image}
            isOpen={imageModalOpen}
            onClose={() => setImageModalOpen(false)}
          />
          {message.image ? (
            <Image
              onClick={() => setImageModalOpen(true)}
              alt="image"
              src={message.image}
              height={288}
              width={288}
              className="object-cover cursor-pointer hover:scale-110 transition translate"
            />
          ) : (
            <div>{message.body}</div>
          )}
        </div>
        {isLastMessage && isOwn && seenList.length > 0 && (
          <div className="text-xs font-light text-gray-500 ">
            {`Seen by ${seenList}`}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBox;
