"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";

type PaginationProps = {
  onPrev: () => void;
  onNext: () => void;
  isPrevDisabled: boolean;
  isNextDisabled: boolean;
};

export default function BtnPagination({
  onPrev,
  onNext,
  isPrevDisabled,
  isNextDisabled,
}: PaginationProps) {
  return (
    <Pagination>
      <PaginationContent className="w-full justify-end gap-3">
        <PaginationItem>
          <Button
            className="bg-primary border-white"
            variant="outline"
            onClick={onPrev}
            disabled={isPrevDisabled}
          >
            <ChevronLeftIcon
              className="-ms-1 text-white"
              size={16}
              aria-hidden="true"
            />
            <span className="text-white">Previous</span>
          </Button>
        </PaginationItem>
        <PaginationItem>
          <Button
            className="bg-primary border-white"
            variant="outline"
            onClick={onNext}
            disabled={isNextDisabled}
          >
            <span className="text-white">Next</span>
            <ChevronRightIcon
              className="-me-1 text-white"
              size={16}
              aria-hidden="true"
            />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
