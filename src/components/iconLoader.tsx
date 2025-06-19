import React from "react";

interface IconLoaderProps {
  iconName: string;
  className?: string;
}

const IconLoader: React.FC<IconLoaderProps> = ({
  iconName,
  className = "w-6 h-6",
}) => {
  return (
    <span
      className={`material-symbols-rounded text-yellow-400 ${className}`}
      style={{
        fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
      }}
    >
      {iconName}
    </span>
  );
};

export default IconLoader;
