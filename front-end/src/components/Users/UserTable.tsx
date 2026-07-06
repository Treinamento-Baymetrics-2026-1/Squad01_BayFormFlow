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
import { LucideEdit, LucideEllipsis, UserPlus } from "lucide-react";
import { Button } from "../ui/button";
import { usePagination } from "@/hooks/usePagination";
import { UserFormModal } from "./UserFormModal";
import { TablePagination } from "../ui/PaginationDefault";

const usuarios = [
  {
    nome: "Joana Mota",
    email: "joana@baymetrics.com",
    perfil: "Administrador",
    status: "Ativo",
    termo: "Aceito",
  },
  {
    nome: "Daiane da Silva",
    email: "daiane@baymetrics.com",
    perfil: "Gestor",
    status: "Ativo",
    termo: "Pendente",
  },
  {
    nome: "Márcia Moreira",
    email: "marcia@baymetrics.com",
    perfil: "Gestor",
    status: "Ativo",
    termo: "Pendente",
  },
  {
    nome: "Diego Nunes de Albuquerque",
    email: "diego@baymetrics.com",
    perfil: "Administrador",
    status: "Ativo",
    termo: "Aceito",
  },
  {
    nome: "Pedro Ferreira Moreno",
    email: "pedro@baymetrics.com",
    perfil: "Validador",
    status: "Inativo",
    termo: "Pendente",
  },
  {
    nome: "João Melônio Melo",
    email: "joão@baymetrics.com",
    perfil: "Validador",
    status: "Inativo",
    termo: "Pendente",
  },
];

interface Usuario {
  nome: string;
  email: string;
  perfil: string;
  status: string;
  termo: string;
}

export const UserTable = () => {
  const {
    currentItems, paginationProps
  } = usePagination({ data: usuarios}); // , initialItemsPerPage: 2 (alterar itens por páginas apenas nessa tela (padrão 6))

  // Estados para controle dos Modais
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);

  const handleEditClick = (usuario: Usuario) => {
    setSelectedUser(usuario);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleResendTerm = (email: string) => {
    console.log(`Reenviando termo para: ${email}`);
  };

  const handleToggleStatus = (email: string, currentStatus: string) => {
    console.log(`Alterando status de ${email}. Status atual: ${currentStatus}`);
  };

  return (
    <div className="w-full px-16 py-17.5">
      <div className="flex justify-between items-center w-full">
        <h3 className="font-bold text-2xl text-blue-primary">Usuários</h3>
        <Button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="w-40 h-9 rounded-lg border px-4 py-2 gap-2.5 bg-blue-primary shadow-box-field cursor-pointer text-white"
        >
          <UserPlus size={18} />
          Novo usuário
        </Button>
      </div>
      <div>
        <p className="font-normal text-base leading-6 tracking-normal text-gray-placeholder">
          Gestão dos usuários da plataforma
        </p>
      </div>
      <div className="w-full overflow-hidden rounded-xl border border-neutral-blue mt-22.25">
        <Table>
          <TableHeader className="bg-blue-primary">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="text-white font-medium py-4 px-6 text-left">
                Nome do usuário
              </TableHead>
              <TableHead className="text-white font-medium py-4 text-left">
                E-mail
              </TableHead>
              <TableHead className="text-white font-medium py-4 text-center">
                Perfil
              </TableHead>
              <TableHead className="text-white font-medium py-4 text-center">
                Status
              </TableHead>
              <TableHead className="text-white font-medium py-4 text-center">
                Termo de responsabilidade
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
                <TableCell className="text-black font-medium py-4 px-6 text-left">
                  {item.nome}
                </TableCell>
                <TableCell className="text-black py-4 text-left">
                  {item.email}
                </TableCell>
                <TableCell className="text-black py-4 text-center">
                  {item.perfil}
                </TableCell>

                <TableCell className="py-4 text-center">
                  <span
                    className={`inline-flex items-center justify-center px-4 py-1 text-sm font-medium rounded-full w-24 h-7 ${getStatusStyles(item.status)}`}
                  >
                    {item.status}
                  </span>
                </TableCell>
                <TableCell className="text-black py-4 text-center">
                  {item.termo}
                </TableCell>
                <TableCell className="py-4 text-center whitespace-nowrap">
                  <button
                    onClick={() => handleEditClick(item)}
                    className="inline-flex items-center justify-center px-1.5 hover:cursor-pointer text-blue-primary"
                  >
                    <LucideEdit size={18} />
                  </button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="inline-flex items-center justify-center px-1.5 cursor-pointer">
                        <LucideEllipsis size={18} />
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align="end"
                      className="rounded-md border shadow-box-field gap-2 p-1 min-w-52.75 min-h-20 bg-white"
                    >
                      <DropdownMenuItem
                        onClick={() => handleResendTerm(item.email)}
                        className="cursor-pointer text-sm font-medium text-accent-foreground py-2 px-4 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
                      >
                        Reenviar termo
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() =>
                          handleToggleStatus(item.email, item.status)
                        }
                        className="cursor-pointer text-sm font-medium py-2 px-4 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none text-accent-foreground"
                      >
                        {item.status === "Ativo"
                          ? "Desativar usuário"
                          : "Ativar usuário"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Componente de paginação (ui/PaginationDefault.tsx) */}
        <TablePagination {...paginationProps} />
      </div>

      {/* Quando clicar em Editar */}
      {isEditModalOpen && selectedUser && (
        <UserFormModal usuario={selectedUser} onClose={handleCloseEditModal} />
      )}

      {/* Quando clicar em Novo Usuário (UserPlus) */}
      {isAddModalOpen && (
        <UserFormModal onClose={() => setIsAddModalOpen(false)} />
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
