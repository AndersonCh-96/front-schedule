import { Button } from "@/components/ui/button";

interface Props {
  pageIndex: number;
  pageCount: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export function DataTablePagination({
  pageIndex,
  pageCount,
  canPreviousPage,
  canNextPage,
  onPrevious,
  onNext,
}: Props) {
  return (
    <div className="flex gap-4 py-2 justify-center" >
      <Button
        size="sm"
        onClick={onPrevious}
        disabled={!canPreviousPage}
      >
        Anterior
      </Button>

      <span>
        Página {pageIndex + 1} de {pageCount}
      </span>

      <Button
        size="sm"
        onClick={onNext}
        disabled={!canNextPage}
      >
        Siguiente
      </Button>
    </div>
  );
}