import { Avatar } from "@/components/ui/avatar";
import { User } from "@prisma/client";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";

interface Props {
  users: User[];
}

const AvatarGroup = ({ users }: Props) => {
  // this retreive the first three users
  const slicedUser = users?.slice(0, 3);

  const positionMap = {
    0: "top-0 left-[12px]",
    1: "bottom-0 ",
    2: "bottom-0 right-0",
  };

  return (
    <div className="relative h-11 w-11">
      {slicedUser.map((user, i) => (
        <div
          key={i}
          className={`absolute inline-block rounded-full overflow-hidden h-[21px] w-[21px] ${
            positionMap[i as keyof typeof positionMap]
          }`}
        >
          <Image
            src={user.image || "/images/placeholder.jpg"}
            alt="Avatar"
            fill
          />
        </div>
      ))}
    </div>
  );
};

export default AvatarGroup;
