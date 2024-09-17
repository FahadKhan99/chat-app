import clsx from "clsx";
import React from "react";

interface Props {
  type?: "button" | "reset" | "submit" | undefined;
  fullWidth?: boolean;
  onClick?: () => void;
  secondary?: boolean;
  danger?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

const Button = ({
  children,
  fullWidth,
  type,
  onClick,
  secondary,
  disabled,
  danger,
}: Props) => {
  return (
    <div>
      <button
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={clsx(`
          flex
          justify-center
          rounded-md
          py-2
          px-3
          text-sm
          font-semibold
          focus-visible:outline
          focus-visible:outline-2
          focus-visible:outline-offset-2
          `,
          disabled && "opacity-50 cursor-default",
          fullWidth && "w-full",
          secondary ? "text-gray-900" : "text-white",
          danger && "bg-rose-500 hover:bg-rose-600 focus-visible:outline-rose-600",
          !secondary && !danger && "bg-sky-500 hover:bg-sky-600 focus-visible:outline-sky-600"
        )}
      >
        {children}
      </button>
    </div>
  );
};

export default Button;
