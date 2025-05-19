# Fix calculations.test.ts - remove unused variables
$calculationsTest = Get-Content -Path "src/features/payroll/utils/__tests__/calculations.test.ts" -Raw
$calculationsTest = $calculationsTest -replace "aplicarTopeCotizable,?", ""
Set-Content -Path "src/features/payroll/utils/__tests__/calculations.test.ts" -Value $calculationsTest

# Fix ProjectsPage.tsx - remove unused imports
$projectsPage = Get-Content -Path "src/features/projects/components/ProjectsPage.tsx" -Raw
$projectsPage = $projectsPage -replace "import \{ Routes, Route, Outlet \} from ""react-router-dom"";", "import { Routes, Route } from ""react-router-dom"";"
Set-Content -Path "src/features/projects/components/ProjectsPage.tsx" -Value $projectsPage

# Fix PurchaseDetails.tsx - remove unused imports
$purchaseDetails = Get-Content -Path "src/features/purchases/components/PurchaseDetails.tsx" -Raw
$purchaseDetails = $purchaseDetails -replace "import \{ Purchase \} from ""../types"";", ""
Set-Content -Path "src/features/purchases/components/PurchaseDetails.tsx" -Value $purchaseDetails

# Fix PurchasesForm.tsx - remove unused variables
$purchasesForm = Get-Content -Path "src/features/purchases/components/PurchasesForm.tsx" -Raw
$purchasesForm = $purchasesForm -replace "PurchaseItem,", ""
$purchasesForm = $purchasesForm -replace "accounts,", ""
$purchasesForm = $purchasesForm -replace "const \{ fields, append, remove \}","const { fields, append }"
Set-Content -Path "src/features/purchases/components/PurchasesForm.tsx" -Value $purchasesForm

# Fix NewPurchasePage.tsx - remove unused imports and functions
$newPurchasePage = Get-Content -Path "src/features/purchases/pages/NewPurchasePage.tsx" -Raw
$newPurchasePage = $newPurchasePage -replace ", Product", ""
$newPurchasePage = $newPurchasePage -replace "const handleSelectSupplier[\s\S]*?\n  \};", ""
Set-Content -Path "src/features/purchases/pages/NewPurchasePage.tsx" -Value $newPurchasePage

# Fix PurchasesPage.tsx - remove unused imports
$purchasesPage = Get-Content -Path "src/features/purchases/PurchasesPage.tsx" -Raw
$purchasesPage = $purchasesPage -replace ", Purchase", ""
$purchasesPage = $purchasesPage -replace ", Product", ""
$purchasesPage = $purchasesPage -replace "import NewPurchasePage from ""./pages/NewPurchasePage"";", ""
Set-Content -Path "src/features/purchases/PurchasesPage.tsx" -Value $purchasesPage

# Fix purchaseService.ts - remove unused constants
$purchaseService = Get-Content -Path "src/features/purchases/services/purchaseService.ts" -Raw
$purchaseService = $purchaseService -replace "const API_BASE_URL = ""/api/purchases"";", ""
Set-Content -Path "src/features/purchases/services/purchaseService.ts" -Value $purchaseService

# Fix InvoicePDF.tsx - remove unused variables
$invoicePDF = Get-Content -Path "src/features/sales/components/InvoicePDF.tsx" -Raw
$invoicePDF = $invoicePDF -replace "const contentWidth = pageWidth - 2 \* margin;", ""
Set-Content -Path "src/features/sales/components/InvoicePDF.tsx" -Value $invoicePDF

# Fix SalePayments.tsx - remove unused imports
$salePayments = Get-Content -Path "src/features/sales/components/SalePayments.tsx" -Raw
$salePayments = $salePayments -replace "import \{ useSalesStore \} from ""../../../stores/salesStore"";", ""
Set-Content -Path "src/features/sales/components/SalePayments.tsx" -Value $salePayments

# Fix SalesPage.tsx - remove unused variables
$salesPage = Get-Content -Path "src/features/sales/SalesPage.tsx" -Raw
$salesPage = $salesPage -replace "const clients = useClientStore\(.*\);", ""
$salesPage = $salesPage -replace "const \{ mutate: createSale \}", "const { mutate }"
Set-Content -Path "src/features/sales/SalesPage.tsx" -Value $salesPage

Write-Host "TypeScript errors fixed!" 