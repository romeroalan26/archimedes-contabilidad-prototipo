import { render, screen, fireEvent } from "@testing-library/react";
import { ReconciliationForm } from "../components/ReconciliationForm";
import { ReconciliationMovement } from "../types";

describe("ReconciliationForm", () => {
  it("validates required fields", async () => {
    render(<ReconciliationForm />);

    const submitButton = screen.getByText("Crear Conciliación");
    fireEvent.click(submitButton);

    expect(await screen.findByText("Banco es requerido")).toBeInTheDocument();
  });

  it("validates month range", async () => {
    render(<ReconciliationForm />);

    const monthSelect = screen.getByLabelText("Mes");
    fireEvent.change(monthSelect, { target: { value: "13" } });

    const submitButton = screen.getByText("Crear Conciliación");
    fireEvent.click(submitButton);

    expect(
      await screen.findByText("Mes debe estar entre 1 y 12")
    ).toBeInTheDocument();
  });

  it("validates year range", async () => {
    render(<ReconciliationForm />);

    const yearInput = screen.getByLabelText("Año");
    fireEvent.change(yearInput, { target: { value: "1999" } });

    const submitButton = screen.getByText("Crear Conciliación");
    fireEvent.click(submitButton);

    expect(await screen.findByText("Año no válido")).toBeInTheDocument();
  });
});

describe("Reconciliation Calculations", () => {
  const calculateReconciledBalance = (movements: ReconciliationMovement[]) => {
    return movements.reduce(
      (acc, movement) => acc + (movement.isReconciled ? movement.amount : 0),
      0
    );
  };

  it("calculates reconciled balance correctly", () => {
    const movements: ReconciliationMovement[] = [
      {
        id: "1",
        date: "2024-03-01",
        type: "DEPOSIT",
        description: "Depósito inicial",
        amount: 1000,
        isReconciled: true,
      },
      {
        id: "2",
        date: "2024-03-02",
        type: "CHECK",
        description: "Cheque #123",
        amount: 500,
        isReconciled: false,
      },
    ];

    const balance = calculateReconciledBalance(movements);
    expect(balance).toBe(1000);
  });

  it("handles empty movements array", () => {
    const movements: ReconciliationMovement[] = [];
    const balance = calculateReconciledBalance(movements);
    expect(balance).toBe(0);
  });
});
