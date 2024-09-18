"use client";

import { User } from "@prisma/client";

import {
  Avatar as AvatarShadcn,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import useActiveList from "../hooks/useActiveList";

interface Props {
  user: User;
}

const Avatar = ({ user }: Props) => {
  const { members } = useActiveList();

  const userEmail = user?.email ?? "";
  const isActive = members.indexOf(userEmail) !== -1;

  // to display the initials as avatar
  const getInitials = () => {
    if (!user?.name) {
      return "";
    }
    const [firstName, lastName] = user.name.split(" ");
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
    return firstInitial + lastInitial;
  };

  return (
    // <div className="relative">
    //   <div className="relative inline-block rounded-full overflow-hidden h-9 w-9 md:h-11 md:w-11">
    //     <Image
    //       alt={`${user?.name} avatar`}
    //       src={user?.image || "/placeholder.jpg"}
    //       fill={true}
    //     />
    //   </div>
    //   {/* the following is for user active or not  */}
    //   <span className="absolute block rounded-full bg-green-500 ring-2 ring-white top-0 right-0 h-9 w-9 md:h-3 md:w-3" />
    // </div>

    <div className="relative">
      <div className="relative inline-block rounded-full h-9 w-9 md:h-11 md:w-11">
        <AvatarShadcn>
          <AvatarImage
            src={user?.image || "/images/placeholder.jpg"}
            alt={`${user?.name} avatar`}
          />
          <AvatarFallback className="select-none font-semibold text-gray-500">
            {getInitials()}
          </AvatarFallback>
        </AvatarShadcn>
        {isActive && (
          <span className="absolute block rounded-full bg-green-500 ring-2 ring-white top-0 right-0 h-3 w-3 md:h-3 md:w-3" />
        )}
      </div>
    </div>
  );
};

export default Avatar;
