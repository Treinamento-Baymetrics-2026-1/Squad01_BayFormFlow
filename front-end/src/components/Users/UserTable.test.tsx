import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserTable } from "./UserTable";

//usuario api
vi.mock("@/api/users", () => ({
  getUsersEdgeFunction: vi.fn().mockResolvedValue(null),
}));

//usar o queryclient
const renderComponent = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <UserTable />
    </QueryClientProvider>
  );
};

describe("UserTable", () => {
  it("render title and user", () => {
    renderComponent();

    expect(screen.getByText("Usuários")).toBeInTheDocument();
    expect(screen.getByText("Joana Mota")).toBeInTheDocument();
  });

  it("open modal", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByRole("button", { name: "Novo usuário" }));

    expect(
      screen.getByRole("heading", { name: "Novo usuário" })
    ).toBeInTheDocument();
  });

  it("close modal", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByRole("button", { name: "Novo usuário" }));
    expect(
      screen.getByRole("heading", { name: "Novo usuário" })
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(
      screen.queryByRole("heading", { name: "Novo usuário" })
    ).not.toBeInTheDocument();
  });
});