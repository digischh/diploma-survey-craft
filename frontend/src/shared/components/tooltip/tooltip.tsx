import type { FC } from "react";
import type { TooltipProps } from "antd";
import { Tooltip as AntTooltip } from "antd";

type TTooltipProps = TooltipProps;

export const Tooltip: FC<TTooltipProps> = ({ children, ...otherProps }) => {
  return (
    <AntTooltip {...otherProps} arrow={false}>
      {children}
    </AntTooltip>
  );
};
