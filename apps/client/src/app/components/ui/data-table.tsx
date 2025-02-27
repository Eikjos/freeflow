"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  PaginationResult,
  Pagination as PaginationType,
} from "@repo/shared-types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "components/ui/table";
import { useEffect, useState } from "react";
import { cn } from "../../../lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  apiData: (filter: PaginationType) => Promise<PaginationResult<TData>>;
  pageSize: number;
  className?: string;
}

export function DataTable<TData>({
  columns,
  apiData,
  className,
  pageSize,
}: DataTableProps<TData>) {
  const [page, setPage] = useState<number>(0);
  const [data, setData] = useState<TData[]>([]);
  const [pagination, setPagination] = useState<number[]>([]);

  const fetchData = async () => {
    await apiData({ page, pageSize }).then((res) => {
      setData(res.data);
      setPagination(
        Array(
          res.totalItems / res.pageSize + (res.totalItems % res.pageSize) > 0
        )
          .map((e, i) => i + 1)
          .filter((e) => {
            if (page === 0) {
              return e <= 3;
            }
            return e - (page + 1) >= -1 && e - (page + 1) <= 1;
          })
      );
    });
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <div className={cn("rounded-md border", className)}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Vous n'avez pas encore de données.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Pagination className="mt-5 pr-10">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          {pagination[0] !== 1 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          {pagination.map((item, index) => (
            <PaginationItem key={index}>
              <PaginationLink isActive={item === page + 1}>
                {item}
              </PaginationLink>
            </PaginationItem>
          ))}
          {pagination[pagination.length - 1] !== page + 1 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}
