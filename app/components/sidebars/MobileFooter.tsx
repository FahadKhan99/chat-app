"use client";

import useConversation from "@/app/hooks/useConversation";
import useRoutes from "@/app/hooks/useRoutes";
import SideBarItem from "./SidebarItem";

const MobileFooter = () => {
  const routes = useRoutes();
  const { isOpen } = useConversation();

  if (isOpen) {
    return null;
  }

  return (
    <div className="fixed justify-between lg:hidden w-full bottom-0 z-40 flex items-center bg-white border-t-[1px]">
      {routes.map((route) => (
        <SideBarItem
          key={route.label}
          href={route.href}
          active={route.active}
          onClick={route.onClick}
          icon={route.icon}
          label={route.label}
        />
      ))}
    </div>
  );
};

export default MobileFooter;
