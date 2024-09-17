"use client";

import clsx from "clsx";
import Link from "next/link";

interface Props {
  label: string;
  icon: any;
  onClick?: () => void;
  href: string;
  active?: boolean;
}

const SideBarItem = ({ label, icon: Icon, onClick, href, active }: Props) => {
  const handleClick = () => {
    if (onClick) {
      return onClick();
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={clsx(
        "group flex gap-x-3 p-3 rounded-md leading-6 text-sm font-semibold text-gray-500 hover:text-black hover:bg-gray-100",
        active && "bg-gray-100 text-black"
      )}
    >
      <Icon className="h-6 w-6 shrink-0" />
      {/* sr-only means hide it on the client but it still exits in the server for better SEO */}
      <span className="sr-only">{label}</span>
    </Link>
  );
};

export default SideBarItem;
