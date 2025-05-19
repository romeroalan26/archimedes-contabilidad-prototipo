#!/bin/bash

# Fix PayrollHistoryPage.tsx - remove unused imports
sed -i 's/import { usePayrollHistory } from "..\/hooks";//g' src/features/payroll/pages/PayrollHistoryPage.tsx
sed -i 's/import { formatCurrency } from "..\/utils\/format";//g' src/features/payroll/pages/PayrollHistoryPage.tsx
sed -i 's/import type { PayrollDetails } from "..\/types\/payroll";//g' src/features/payroll/pages/PayrollHistoryPage.tsx

# Fix calculations.test.ts - remove unused constants
sed -i '/aplicarTopeCotizable/d' src/features/payroll/utils/__tests__/calculations.test.ts

# Fix ProjectsPage.tsx - remove unused imports
sed -i 's/import { Routes, Route, Outlet } from "react-router-dom";/import { Routes, Route } from "react-router-dom";/g' src/features/projects/components/ProjectsPage.tsx

# Fix PurchaseDetails.tsx - remove unused imports
sed -i 's/import { Purchase } from "..\/types";//g' src/features/purchases/components/PurchaseDetails.tsx

# Fix PurchasesForm.tsx - remove unused variables
sed -i 's/PurchaseItem,//g' src/features/purchases/components/PurchasesForm.tsx
sed -i '/accounts,/d' src/features/purchases/components/PurchasesForm.tsx
sed -i 's/const { fields, append, remove }/const { fields, append }/g' src/features/purchases/components/PurchasesForm.tsx

# Fix NewPurchasePage.tsx - remove unused imports and variables
sed -i 's/, Product//g' src/features/purchases/pages/NewPurchasePage.tsx
sed -i '/const handleSelectSupplier/,/}/d' src/features/purchases/pages/NewPurchasePage.tsx

# Fix PurchasesPage.tsx - remove unused imports
sed -i 's/, Purchase//g' src/features/purchases/PurchasesPage.tsx
sed -i 's/, Product//g' src/features/purchases/PurchasesPage.tsx
sed -i 's/import NewPurchasePage from "..\/pages\/NewPurchasePage";//g' src/features/purchases/PurchasesPage.tsx

# Fix purchaseService.ts - remove unused constants
sed -i '/const API_BASE_URL/d' src/features/purchases/services/purchaseService.ts

# Fix InvoicePDF.tsx - remove unused variables
sed -i '/const contentWidth/d' src/features/sales/components/InvoicePDF.tsx

# Fix SalePayments.tsx - remove unused imports
sed -i 's/import { useSalesStore } from "..\/..\/..\/stores\/salesStore";//g' src/features/sales/components/SalePayments.tsx

# Fix SalesPage.tsx - remove unused variables and functions
sed -i '/const clients/d' src/features/sales/SalesPage.tsx
sed -i 's/const { mutate: createSale }/const { mutate }/g' src/features/sales/SalesPage.tsx

echo "TypeScript errors fixed!" 