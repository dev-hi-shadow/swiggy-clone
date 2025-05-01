import { ArrowUpIcon, GroupIcon } from "../../icons/svgs";
import Badge from "../ui/badge/Badge";

export default function EcommerceMetrics() {
  return (
    <div className="grid grid-cols-1 h-fit gap-4 sm:grid-cols-3 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="flex flex-row gap-x-2 items-center h-fit rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-14 h-14 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between ">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Kitchen Queue
            </span>
            <div className="flex justify-center items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <h4 className=" font-bold text-gray-800 text-title-sm dark:text-white/90">
                3,782
              </h4>
              <Badge color="success">
                <ArrowUpIcon />
                11.01%
              </Badge>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
      {/* <!-- Metric Item Start --> */}
      <div className="flex flex-row gap-x-2 items-center h-fit rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-14 h-14 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between ">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              On Deck
            </span>
            <div className="flex justify-center items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <h4 className=" font-bold text-gray-800 text-title-sm dark:text-white/90">
                3,782
              </h4>
              <Badge color="success">
                <ArrowUpIcon />
                11.01%
              </Badge>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="flex flex-row gap-x-2 items-center h-fit rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-14 h-14 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between ">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Blitz
            </span>
            <div className="flex justify-center items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <h4 className=" font-bold text-gray-800 text-title-sm dark:text-white/90">
                3,782
              </h4>
              <Badge color="success">
                <ArrowUpIcon />
                11.01%
              </Badge>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
}
