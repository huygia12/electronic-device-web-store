import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { FC, HTMLAttributes, useEffect, useState } from "react";

interface CustomPaginationProps extends HTMLAttributes<HTMLDivElement> {
  parentPageState?: number;
  onPageChange: (page: number) => void;
  totalPages: number;
  displayInColumn?: boolean;
}

const CustomPagination: FC<CustomPaginationProps> = ({
  className,
  parentPageState: currentPage = 1,
  totalPages = 0,
  displayInColumn = false,
  ...props
}) => {
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    if (currentPage !== page) {
      setPage(currentPage);
    }
  }, [currentPage]);

  if (totalPages === 0) {
    return;
  }

  const handlePageChange = (newPageNumber: number) => {
    setPage(newPageNumber);
    props.onPageChange(newPageNumber);
  };

  return (
    <Pagination className={cn("mt-8", className)}>
      <PaginationContent
        className={cn("justify-center", displayInColumn && "w-full flex-col")}
      >
        {page !== 1 && (
          <PaginationItem
            className={displayInColumn ? "self-start" : undefined}
          >
            <PaginationPrevious onClick={() => handlePageChange(page - 1)} />
          </PaginationItem>
        )}

        <div className="flex flex-row">
          {page > 2 && (
            <PaginationItem>
              <PaginationLink onClick={() => handlePageChange(1)}>
                1
              </PaginationLink>
            </PaginationItem>
          )}

          {page > 3 && <PaginationEllipsis />}

          {page > 1 && (
            <PaginationItem>
              <PaginationLink onClick={() => handlePageChange(page - 1)}>
                {page - 1}
              </PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationLink isActive>{page}</PaginationLink>
          </PaginationItem>

          {totalPages - page > 0 && (
            <PaginationItem>
              <PaginationLink onClick={() => handlePageChange(page + 1)}>
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          )}

          {totalPages - page > 2 && <PaginationEllipsis />}

          {totalPages - page > 1 && (
            <PaginationItem>
              <PaginationLink onClick={() => handlePageChange(totalPages)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          )}
        </div>

        {page !== totalPages && (
          <PaginationItem className={displayInColumn ? "self-end" : undefined}>
            <PaginationNext onClick={() => handlePageChange(page + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default CustomPagination;
