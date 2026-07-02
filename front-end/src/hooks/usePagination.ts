import { useState } from "react";
interface UsePaginationProps<T> {
  data: T[];
  initialItemsPerPage?: number;
}

export function usePagination<T>({
  data,
  // aqui se altera a quantidade de itens por página (se não passar o valor posteriormente, ele se torna padrão)
  initialItemsPerPage = 6,
}: UsePaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = data.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  //spread na chamada do componente
  const paginationProps = {
    currentPage,
    totalPages,
    handlePrevPage,
    handleNextPage,
    goToPage,
  };

  return {
    currentItems,
    setItemsPerPage,
    paginationProps,
  };
}
