"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "../../../lib/utils";
import { ButtonProps, buttonVariants } from "components/ui/button";
import { useEffect, useState } from "react";

const PaginationContainer = ({
  className,
  ...props
}: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-end", className)}
    {...props}
  />
);
PaginationContainer.displayName = "PaginationContainer";

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">;

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      className
    )}
    {...props}
  />
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5", className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

type PaginationProps = {
  className?: string;
  page: number;
  pageSize: number;
  totalItems: number;
  onChangePage: (page: number) => void;
};

const Pagination = ({
  className,
  page,
  pageSize,
  totalItems,
  onChangePage,
}: PaginationProps) => {
  const [pagination, setPagination] = useState<number[]>([]);
  const length = Math.floor(
    totalItems / pageSize + (totalItems % pageSize > 0 ? 1 : 0)
  );

  useEffect(() => {
    setPagination(
      Array.from(
        {
          length: length,
        },
        (e, i) => i + 1
      ).filter((e) => {
        if (page === 0) {
          return e <= 3;
        }
        if (page === length - 1) {
          return e > length - 3;
        }
        return e - (page + 1) >= -1 && e - (page + 1) <= 1;
      })
    );
  }, [page, totalItems, pageSize]);

  return (
    <PaginationContainer className={cn("pr-10", className)}>
      <PaginationContent>
        {page > 0 && (
          <PaginationItem onClick={() => onChangePage(page - 1)}>
            <PaginationPrevious lang="fr" />
          </PaginationItem>
        )}

        {pagination[0] !== 1 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {pagination.map((item, index) => (
          <PaginationItem key={index} onClick={() => onChangePage(item - 1)}>
            <PaginationLink isActive={item === page + 1}>{item}</PaginationLink>
          </PaginationItem>
        ))}
        {pagination.at(-1)! < length && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {page < length - 1 && (
          <PaginationItem onClick={() => onChangePage(page + 1)}>
            <PaginationNext lang="fr" />
          </PaginationItem>
        )}
      </PaginationContent>
    </PaginationContainer>
  );
};

export {
  Pagination,
  PaginationContainer,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
