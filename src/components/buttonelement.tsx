import React from "react";

interface ButtonElementProps {
  iconName: string;
  buttonTitle: string;
  onClick?: () => void;
}

const ButtonElement: React.FC<ButtonElementProps> = ({
  iconName,
  buttonTitle,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center md:bg-zinc-950 bg-zinc-900 gap-1 hover:bg-zinc-900 rounded-full px-5 py-2"
    >
      <span className="material-icons">{iconName}</span>
      <span className="text-sm font-medium">{buttonTitle}</span>
    </button>
  );
};

export default ButtonElement;
