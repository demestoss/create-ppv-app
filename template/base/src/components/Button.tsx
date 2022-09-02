import React, { FC, memo, PropsWithChildren } from "react";
import { clsx } from "clsx";

enum ColorEnum {
  primary = "primary",
  critical = "critical",
  success = "success",
}

enum VariantEnum {
  inline = "inline",
  outline = "outline",
  solid = "solid",
}

namespace Button {
  export interface Props {
    color?: Color;
    variant?: Variant;
    onClick?: () => void;
  }

  export type Color = keyof typeof ColorEnum;

  export type Variant = keyof typeof VariantEnum;
}

const baseVariantStyleMap: { [key in VariantEnum]: string } = {
  inline: "bg-transparent",
  outline: "border-2 rounded-md p-2 px-5 bg-white",
  solid: "rounded-md p-2 px-5",
};

const colorStyleMap: { [key in ColorEnum]: { [key in VariantEnum]: string } } = {
  primary: {
    inline: "text-amber-500 hover:text-amber-600",
    outline: "text-amber-500 hover:text-amber-600 border-amber-500 hover:border-amber-600",
    solid: "bg-amber-200 hover:bg-amber-300 text-amber-700",
  },
  critical: {
    inline: "text-red-400 hover:text-red-500",
    outline: "text-red-400 hover:text-red-500 border-red-400 hover:border-red-500",
    solid: "bg-red-400 hover:bg-red-500 text-white",
  },
  success: {
    inline: "text-green-500 hover:text-green-600",
    outline: "text-green-500 hover:text-green-600 border-green-500 hover:border-green-600",
    solid: "bg-green-400 hover:bg-green-500 text-white",
  },
};

const Button: FC<PropsWithChildren<Button.Props>> = ({
  variant = "solid",
  color = "primary",
  onClick,
  children,
}) => {
  return (
    <button
      className={clsx(
        "transition-colors",
        baseVariantStyleMap[variant],
        colorStyleMap[color][variant]
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const MemoedButton = memo(Button);

export { Button, MemoedButton };
