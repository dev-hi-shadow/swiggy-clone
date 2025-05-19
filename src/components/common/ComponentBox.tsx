import React from "react";
import Badge, { BadgeColor } from "../ui/badge/Badge";

interface IProps {
  title: string;
  value: string;
  Icon: React.ReactNode;
  badge?: {
    label: string;
    color: string;
    icon: React.ReactNode;
  };
}

const ComponentBox = ({ title, Icon, value, badge }: IProps) => {
  return (
    <div className="flex flex-row gap-x-2 items-center h-fit rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="flex items-center justify-center w-14 h-14 bg-gray-100 rounded-xl dark:bg-gray-800">
        {Icon}
      </div>

      <div className="flex items-end justify-between">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {title}
          </span>
          <div className="flex justify-center items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <h4 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
              {value}
            </h4>
            {badge && (
              <Badge color={badge.color as BadgeColor}>
                <span className="flex gap-1 items-center">
                  {badge.icon}
                  {badge.label}
                </span>
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentBox;
