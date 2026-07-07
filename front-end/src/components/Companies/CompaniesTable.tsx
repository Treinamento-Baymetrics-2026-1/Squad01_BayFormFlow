import { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, LucideEdit, LucideEllipsis } from "lucide-react";
import { Button } from "../ui/button";
import { usePagination } from "@/hooks/usePagination";
import { CompaniesFormModal } from "./CompaniesFormModal";
import { TablePagination } from "../ui/PaginationDefault";

const empresas = [
  {
    razaoSocial: "Tech Corp",
    cnpj: "12.345.678/0001-90",
    email: "admin@techcorp.com.br",
    status: "Ativo",
  },
  {
    razaoSocial: "Grupo Delta",
    cnpj: "98.765.432/0001-11",
    email: "admin@grupodelta.com.br",
    status: "Ativo",
  },
  {
    razaoSocial: "Indústria Alfa",
    cnpj: "45.678.901/0001-23",
    email: "admin@industriaalfa.com.br",
    status: "Ativo",
  },
  {
    razaoSocial: "Construtora BV",
    cnpj: "23.456.789/0001-45",
    email: "admin@construtorabv.com.br",
    status: "Ativo",
  },
  {
    razaoSocial: "Metalúrgica SR",
    cnpj: "87.654.321/0001-67",
    email: "admin@metalurgicasr.com.br",
    status: "Inativo",
  },
  {
    razaoSocial: "Construtora MVM",
    cnpj: "34.567.890/0001-89",
    email: "admin@construtoramvm.com.br",
    status: "Inativo",
  },
];

interface Empresa {
  razaoSocial: string;
  cnpj: string;
  email: string;
  status: string;
}

export const CompaniesTable = () => {
  const { currentItems, paginationProps } = usePagination({ data: empresas });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Empresa | null>(null);

  const handleEditClick = (empresa: Empresa) => {
    setSelectedCompany(empresa);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedCompany(null);
  };

  const handleToggleStatus = (email: string, currentStatus: string) => {
    console.log(`Alterando status de ${email}. Status atual: ${currentStatus}`);
  };

  return (
    <div className="w-full px-16 py-17.5">
      <div className="flex justify-between items-center w-full">
        <h3 className="font-bold text-2xl text-blue-primary">Empresas</h3>
        <Button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="w-40 h-9 rounded-lg border px-4 py-2 gap-2.5 bg-blue-primary shadow-box-field cursor-pointer text-white"
        >
          <Plus size={18} />
          Nova empresa
        </Button>
      </div>
      <div>
        <p className="font-normal text-base leading-6 tracking-normal text-gray-placeholder">
          Gestão das empresas clientes contratantes
        </p>
      </div>
      <div className="w-full overflow-hidden rounded-xl border border-neutral-blue mt-22.25">
        <Table>
          <TableHeader className="bg-blue-primary">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="text-white font-medium py-4 px-6 text-left">
                Razão social
              </TableHead>
              <TableHead className="text-white font-medium py-4 px-10 text-left">
                CNPJ
              </TableHead>
              <TableHead className="text-white font-medium py-4 text-left">
                E-mail
              </TableHead>
              <TableHead className="text-white font-medium py-4 text-center">
                Status
              </TableHead>
              <TableHead className="text-white font-medium py-4 text-center">
                Ações
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
                <TableCell className="text-black py-4 px-6 text-left">
                  {item.razaoSocial}
                </TableCell>
                <TableCell className="text-black py-4 px-10 text-left">
                  {item.cnpj}
                </TableCell>
                <TableCell className="text-black py-4 text-left">
                  {item.email}
                </TableCell>

                <TableCell className="py-4 px-8 text-center">
                  <span
                    className={`inline-flex items-center justify-center px-4 py-1 text-sm font-medium rounded-full w-24 h-7 ${getStatusStyles(item.status)}`}
                  >
                    {item.status}
                  </span>
                </TableCell>

                <TableCell className="py-4 px-8 text-center whitespace-nowrap">
                  <button
                    onClick={() => handleEditClick(item)}
                    className="inline-flex items-center justify-center px-1.5 hover:cursor-pointer text-blue-primary"
                  >
                    <LucideEdit size={18} />
                  </button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="inline-flex items-center justify-center px-1.5 cursor-pointer text-black">
                        <LucideEllipsis size={18} />
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align="end"
                      className="rounded-md border shadow-box-field gap-2 p-1 min-w-52.75 bg-white"
                    >
                      <DropdownMenuItem
                        onClick={() =>
                          handleToggleStatus(item.email, item.status)
                        }
                        className="cursor-pointer text-sm font-medium py-2 px-4 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none text-accent-foreground"
                      >
                        {item.status === "Ativo"
                          ? "Desativar Empresa"
                          : "Ativar Empresa"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination {...paginationProps} />
      </div>

      {isEditModalOpen && selectedCompany && (
        <CompaniesFormModal
          empresa={selectedCompany}
          onClose={handleCloseEditModal}
        />
      )}

      {isAddModalOpen && (
        <CompaniesFormModal onClose={() => setIsAddModalOpen(false)} />
      )}
    </div>
  );
};

function getStatusStyles(status: string) {
  switch (status) {
    case "Ativo":
      return "text-status-active border border-status-active";
    case "Inativo":
      return "text-gray-placeholder border border-gray-placeholder";
    default:
      return "";
  }
}
