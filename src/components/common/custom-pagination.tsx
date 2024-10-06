import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { FC, HTMLAttributes } from "react";

interface CustomPaginationProps extends HTMLAttributes<HTMLDivElement> {
  currentPage?: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
}

const CustomPagination: FC<CustomPaginationProps> = ({
  currentPage = 1,
  ...props
}) => {
  if (props.totalPages === 0) {
    return;
  }

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        {currentPage !== 1 && (
          <PaginationItem>
            <PaginationPrevious
              onClick={() => props.setCurrentPage(currentPage - 1)}
            />
          </PaginationItem>
        )}

        {currentPage > 2 && (
          <PaginationItem>
            <PaginationLink onClick={() => props.setCurrentPage(1)}>
              1
            </PaginationLink>
          </PaginationItem>
        )}

        {currentPage > 3 && <PaginationEllipsis />}

        {currentPage > 1 && (
          <PaginationItem>
            <PaginationLink
              onClick={() => props.setCurrentPage(currentPage - 1)}
            >
              {currentPage - 1}
            </PaginationLink>
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationLink isActive>{currentPage}</PaginationLink>
        </PaginationItem>

        {props.totalPages - currentPage > 0 && (
          <PaginationItem>
            <PaginationLink
              onClick={() => props.setCurrentPage(currentPage + 1)}
            >
              {currentPage + 1}
            </PaginationLink>
          </PaginationItem>
        )}

        {props.totalPages - currentPage > 2 && <PaginationEllipsis />}

        {props.totalPages - currentPage > 1 && (
          <PaginationItem>
            <PaginationLink
              onClick={() => props.setCurrentPage(props.totalPages)}
            >
              {props.totalPages}
            </PaginationLink>
          </PaginationItem>
        )}

        {currentPage !== props.totalPages && (
          <PaginationItem>
            <PaginationNext
              onClick={() => props.setCurrentPage(currentPage + 1)}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default CustomPagination;
