import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LucidePlus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const pesquisas = [
  {
    nome: "Clima organizacional",
    empresa: "Tech Corp",
    gestor: "Joana da Silva",
    prazo: "28/06/2026",
    status: "Cancelada",
    progresso: null,
  },
  {
    nome: "Avaliação de Esporte",
    empresa: "Grupo Delta",
    gestor: "Felipe Moreira",
    prazo: "28/06/2026",
    status: "Em andamento",
    progresso: 70,
  },
  {
    nome: "Map. Diário",
    empresa: "Indústria Alfa",
    gestor: "José Almeida de Lima",
    prazo: "11/06/2026",
    status: "Alteração solicitada",
    progresso: 60,
  },
  {
    nome: "Diagnóstico X",
    empresa: "Construtora BV",
    gestor: "Luana Paiva",
    prazo: "12/06/2026",
    status: "Em andamento",
    progresso: 90,
  },
  {
    nome: "Pesquisa de Mercado",
    empresa: "Metalúrgica SR",
    gestor: "Fernando Mota",
    prazo: "13/06/2026",
    status: "Cancelada",
    progresso: null,
  },
  {
    nome: "TDH Interno",
    empresa: "Tech Corp",
    gestor: "Joana da Silva",
    prazo: "10/05/2026",
    status: "Concluída",
    progresso: 100,
  },
];

export const SurveyTableAdm = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // itens por pagina

  const totalPages = Math.ceil(pesquisas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = pesquisas.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="w-full px-16 py-18.75">
      <div className="flex justify-between items-center w-full">
        <h3 className="font-bold text-2xl text-blue-primary">Pesquisas</h3>
        <Button
          type="button"
          className="w-40 h-9 rounded-lg border px-4 py-2 gap-2.5 bg-blue-primary shadow-box-field"
        >
          <LucidePlus />
          Nova pesquisa
        </Button>
      </div>
      <div>
        <p className="font-normal text-base leading-6 tracking-normal text-gray-placeholder">
          Pesquisas às quais você tem acesso
        </p>
      </div>

      <div className="w-full overflow-hidden rounded-xl border border-neutral-blue mt-22.25">
        <Table>
          {/* cabeçalho */}
          <TableHeader className="bg-blue-primary">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="text-white font-medium py-4 px-6">
                Nome da pesquisa
              </TableHead>
              <TableHead className="text-white font-medium py-4">
                Empresa
              </TableHead>
              <TableHead className="text-white font-medium py-4">
                Gestor responsável
              </TableHead>
              <TableHead className="text-white font-medium py-4 text-center">
                Prazo
              </TableHead>
              <TableHead className="text-white font-medium py-4 text-center">
                Status
              </TableHead>
              <TableHead className="text-white font-medium py-4 text-center">
                Progresso
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="bg-gray-light-placeholder">
            {currentItems.map((item, index) => (
              <TableRow
                key={index}
                className={`border-b border-gray-100 ${
                  index % 2 !== 1 ? "bg-gray-light-placeholder" : "bg-white"
                }`}
              >
                <TableCell className="text-black py-4 px-6">
                  {item.nome}
                </TableCell>
                <TableCell className="text-black py-4">
                  {item.empresa}
                </TableCell>
                <TableCell className="text-black py-4">{item.gestor}</TableCell>
                <TableCell className="text-black py-4 text-center">
                  {item.prazo}
                </TableCell>

                <TableCell className="py-4 text-center">
                  <span
                    className={`inline-flex items-center justify-center px-4 py-1 text-xs font-medium rounded-full w-40 h-7 ${getStatusStyles(item.status)}`}
                  >
                    {item.status}
                  </span>
                </TableCell>

                <TableCell className="py-4 text-center w-48">
                  <div className="flex flex-col items-center justify-center gap-1.5 dynamic-progress-container">
                    <span
                      className={`text-xs font-bold ${item.progresso === 60 ? "text-gray-placeholder" : "text-progress-none"}`}
                    >
                      {item.progresso !== null ? `${item.progresso}%` : "—"}
                    </span>
                    {item.progresso !== null && (
                      <div className="w-28 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${item.progresso === 60 ? "bg-gray-placeholder" : "bg-black"}`}
                          style={{ width: `${item.progresso}%` }}
                        />
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Pagination className="py-8 select-none">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
                onClick={handlePrevPage}
              />
            </PaginationItem>

            {/* pega o tamanho do veotor de dados e transforma no total de páginas*/}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  className="cursor-pointer"
                  isActive={page === currentPage}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
                onClick={handleNextPage}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

// Funçao que define as cores dos status do forms
function getStatusStyles(status: string) {
  switch (status) {
    case "Cancelada":
      return "bg-status-canceled-light text-status-canceled";
    case "Em andamento":
      return "bg-status-progress-light text-status-progress";
    case "Alteração solicitada":
      return "bg-status-change-requested-light text-status-change-requested";
    case "Concluída":
      return "bg-feedback-success-light text-feedback-success";
    default:
      return "bg-status-canceled-light text-gray-placeholder";
  }
}
