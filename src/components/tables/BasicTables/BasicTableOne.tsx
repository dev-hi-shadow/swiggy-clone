import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import _ from "lodash";
import { FormikErrors } from "formik";
export interface ITableHeaderProps<T> {
  header: string;
  name: string;
  className?: string;
  commonClass?: string;
  isVisible?: "Yes" | "No";
  cell?: (
    props: Partial<T>,
    index?: number | string,
    values?: unknown,
    setFieldValue?: (
      field: string,
      value: unknown,
      shouldValidate?: boolean
    ) => Promise<void | FormikErrors<unknown>>
  ) => React.ReactNode | string;
}

interface IProps<T> {
  readonly columns: Array<ITableHeaderProps<T>>;
  readonly data?: Array<unknown> | Record<string, unknown>;
  readonly saveButton?: {
    label?: string;
    onClick: () => void;
    type?: "button" | "submit" | "reset";
    className?: string;
    disabled?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
  };
  readonly cancelButton?: {
    label?: string;
    onClick: () => void;
    type?: "button" | "submit" | "reset";
    className?: string;
    disabled?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
  };
}

export default function BasicTableOne<T>({
  columns = [],
  data = [],
}: IProps<T>) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              {_.map(columns, ({ header }, index) => {
                return (
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    key={index}
                  >
                    {header}
                  </TableCell>
                );
              })}
              {/* <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                User
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Project Name
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Team
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Budget
              </TableCell> */}
            </TableRow>
          </TableHeader>

          {/* Table Body */}

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {_.map(data, (row, key) => (
              <TableRow key={key}>
                {_.map(columns, (column, columnKey) => {
                  return (
                    <TableCell
                      key={columnKey}
                      className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                    >
                      {column?.cell
                        ? column?.cell(row as Partial<T>, key)
                        : "-"}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
