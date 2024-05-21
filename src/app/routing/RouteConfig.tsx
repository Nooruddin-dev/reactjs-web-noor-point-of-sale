/* eslint-disable */

import React from 'react';
import { BrowserRouter, Routes, Link, Route, Navigate } from "react-router-dom";
import AdminDashboardPage from '../areas/admin/pages/AdminDashboardPage';
import AdminProductsPage from '../areas/admin/pages/AdminProductsPage';
import AdminProductCategoriesPage from '../areas/admin/pages/AdminProductCategoriesPage';
import AdminCreateUpdateProduct from '../areas/admin/pages/AdminCreateUpdateProduct';
import AdminProductTagsPage from '../areas/admin/pages/AdminProductTagsPage';
import LoginPage from '../areas/common/pages/auth/LoginPage';

import { ToastContainer } from 'react-toastify';
//-- ✅ Theme provider ends here
import 'react-toastify/dist/ReactToastify.css';
import AdminManufacturersPage from '../areas/admin/pages/AdminManufacturersPage';
import AdminColorsPage from '../areas/admin/pages/AdminColorsPage';
import AdminInventoryItemsPage from '../areas/admin/pages/AdminInventoryItemsPage';
import AdminWarehousePage from '../areas/admin/pages/AdminWarehousePage';
import AdminInventoryMethodsPage from '../areas/admin/pages/AdminInventoryMethodsPage';
import AdminOrderStatusPage from '../areas/admin/pages/salesManagement/AdminOrderStatusPage';
import AdminUsersListPage from '../areas/admin/pages/usersManagement/AdminUsersListPage';
import AdminTaxCategoriesPage from '../areas/admin/pages/setting/AdminTaxCategoriesPage';
import AdminTaxRulesPage from '../areas/admin/pages/setting/AdminTaxRulesPage';
import HomePage from '../areas/common/pages/HomePage';
import { CashierDashboardPage } from '../areas/cashier/pages/CashierDashboardPage';
import { CashierPointOfSalePage } from '../areas/cashier/pages/CashierPointOfSalePage';
import { useSelector } from 'react-redux';
import { RootState } from '../globalStore/rootReducer';
import BusinessPartnerTypesEnum from '../../_poscommon/common/enums/BusinessPartnerTypesEnum';
import CashierOrdersPage from '../areas/cashier/pages/CashierOrdersPage';
import CashierOrderDetailPage from '../areas/cashier/pages/CashierOrderDetailPage';
import CashierCustomerListPage from '../areas/cashier/pages/CashierCustomerListPage';
import CashierCustomerOrdersHistoryPage from '../areas/cashier/pages/CashierCustomerOrdersHistoryPage';
import { Error404Page } from '../areas/common/pages/Error404Page';
import VisitorPosMainPage from '../areas/visitor/pages/VisitorPosMainPage';
import KitchenOrdersPage from '../areas/kitchen/pages/KitchenOrdersPage';
import KitchenDashboardPage from '../areas/kitchen/pages/KitchenDashboardPage';
import KitchenOrderDetailPage from '../areas/kitchen/pages/KitchenOrderDetailPage';
import LoginProtectedRoute from './LoginProtectedRoute';
import AdminProtectedRoute from './AdminProtectedRoute';
import AdminDiscountsListPage from '../areas/admin/pages/salesManagement/AdminDiscountsListPage';
import AdminCreateUpdateDiscountPage from '../areas/admin/pages/salesManagement/AdminCreateUpdateDiscountPage';
import AdminNotificationsListPage from '../areas/admin/pages/common/AdminNotificationsListPage';
import CashierNotificationsListPage from '../areas/cashier/pages/CashierNotificationsListPage';
import KitchenNotificationsListPage from '../areas/kitchen/pages/KitchenNotificationsListPage';
import AdminOrdersPage from '../areas/admin/pages/salesManagement/AdminOrdersPage';
import AdminPaymentMethodsPage from '../areas/admin/pages/salesManagement/AdminPaymentMethodsPage';
import AdminOrderDetailPage from '../areas/admin/pages/salesManagement/AdminOrderDetailPage';
import AdminUserTypesPage from '../areas/admin/pages/usersManagement/AdminUserTypesPage';
import CashierProtectedRoute from './CashierProtectedRoute';
import VisitorProtectedRoute from './VisitorProtectedRoute';
import AdminShiftNamePage from '../areas/admin/pages/setting/AdminShiftNamePage';
import AdminShiftCashTransactionTypesPage from '../areas/admin/pages/setting/AdminShiftCashTransactionTypesPage';
import AdminShiftCashDrawerReconciliationStatusesPage from '../areas/admin/pages/setting/AdminShiftCashDrawerReconciliationStatusesPage';
import AdminShiftCashTransactionsPage from '../areas/admin/pages/setting/AdminShiftCashTransactionsPage';
import CashierShiftManagementPage from '../areas/cashier/pages/CashierShiftManagementPage';
import CashierShiftTransactionsPage from '../areas/cashier/pages/CashierShiftTransactionsPage';




export default function RouteConfig() {
  const loginUser = useSelector((state: RootState) => state.userData.userData);

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* Admin routes area starts here */}
        <Route path="/admin/dashboard" element={
          <LoginProtectedRoute>
            <AdminProtectedRoute>
              <AdminDashboardPage />
            </AdminProtectedRoute>
          </LoginProtectedRoute>
        } />
        <Route path="/admin/products" element={
          <LoginProtectedRoute>
            <AdminProtectedRoute>
              <AdminProductsPage />
            </AdminProtectedRoute>

          </LoginProtectedRoute>
        } />
        <Route path="/admin/products-categories" element={
          <LoginProtectedRoute>
            <AdminProtectedRoute>
              <AdminProductCategoriesPage />
            </AdminProtectedRoute>

          </LoginProtectedRoute>
        } />
        <Route path="/admin/create-product" element={
          <LoginProtectedRoute>
            <AdminProtectedRoute>
              <AdminCreateUpdateProduct />
            </AdminProtectedRoute>

          </LoginProtectedRoute>
        } />
        <Route path="/admin/update-product/:productId" element={
          <LoginProtectedRoute>
            <AdminProtectedRoute>
              <AdminCreateUpdateProduct />
            </AdminProtectedRoute>

          </LoginProtectedRoute>
        } />
        <Route path="/admin/products-tags" element={
          <LoginProtectedRoute>
            <AdminProtectedRoute>
              <AdminProductTagsPage />
            </AdminProtectedRoute>

          </LoginProtectedRoute>
        } />
        <Route path="/admin/manufacturers" element={
          <LoginProtectedRoute>
            <AdminProtectedRoute>
              <AdminManufacturersPage />
            </AdminProtectedRoute>

          </LoginProtectedRoute>
        } />
        <Route path="/admin/colors" element={
          <LoginProtectedRoute>
            <AdminProtectedRoute>
              <AdminColorsPage />
            </AdminProtectedRoute>

          </LoginProtectedRoute>
        } />
        <Route path="/admin/inventory/items" element={
          <LoginProtectedRoute>
            <AdminProtectedRoute>
              <AdminInventoryItemsPage />
            </AdminProtectedRoute>
          </LoginProtectedRoute>
        } />
        <Route path="/admin/inventory/warehouses" element={
          <LoginProtectedRoute>
            <AdminProtectedRoute>
              <AdminWarehousePage />
            </AdminProtectedRoute>

          </LoginProtectedRoute>
        } />
        <Route path="/admin/inventory/inventory-methods" element={
          <LoginProtectedRoute>
            <AdminProtectedRoute>
              <AdminInventoryMethodsPage />
            </AdminProtectedRoute>

          </LoginProtectedRoute>
        } />
        <Route path="/admin/sales/order-statuses" element={
          <LoginProtectedRoute>
            <AdminProtectedRoute>
              <AdminOrderStatusPage />
            </AdminProtectedRoute>

          </LoginProtectedRoute>
        } />
        <Route path="/admin/users/users-list" element={
          <LoginProtectedRoute>
            <AdminProtectedRoute>
              <AdminUsersListPage />
            </AdminProtectedRoute>
          </LoginProtectedRoute>
        } />
        <Route path="/admin/setting/tax-categories" element={
          <LoginProtectedRoute>
            <AdminProtectedRoute>
              <AdminTaxCategoriesPage />
            </AdminProtectedRoute>
          </LoginProtectedRoute>
        } />
        <Route path="/admin/setting/tax-rules" element={
          <LoginProtectedRoute>
            <AdminProtectedRoute>
              <AdminTaxRulesPage />
            </AdminProtectedRoute>
          </LoginProtectedRoute>
        } />

        <Route path="/admin/discounts" element={
          <LoginProtectedRoute>
            <AdminProtectedRoute>
              <AdminDiscountsListPage />
            </AdminProtectedRoute>
          </LoginProtectedRoute>
        } />

        <Route path="/admin/create-discount" element={
          <LoginProtectedRoute>
            <AdminProtectedRoute>
              <AdminCreateUpdateDiscountPage />
            </AdminProtectedRoute>

          </LoginProtectedRoute>
        } />
        <Route path="/admin/update-discount/:discountId" element={
          <LoginProtectedRoute>
            <AdminProtectedRoute>
              <AdminCreateUpdateDiscountPage />
            </AdminProtectedRoute>

          </LoginProtectedRoute>
        } />

        <Route path="/admin/notifications-list" element={
          <LoginProtectedRoute>
            <AdminProtectedRoute>
              <AdminNotificationsListPage />
            </AdminProtectedRoute>

          </LoginProtectedRoute>
        } />
        <Route path="/admin/sales/sales-orders" element={
          <LoginProtectedRoute>
            <AdminProtectedRoute>
              <AdminOrdersPage />
            </AdminProtectedRoute>

          </LoginProtectedRoute>
        } />

        <Route path="/admin/order-detail/:orderId" element={
          <LoginProtectedRoute>
            <AdminProtectedRoute>
              <AdminOrderDetailPage />
            </AdminProtectedRoute>

          </LoginProtectedRoute>
        } />



        <Route path="/admin/sale/payment-methods" element={
          <LoginProtectedRoute>
            <AdminProtectedRoute>
              <AdminPaymentMethodsPage />
            </AdminProtectedRoute>
          </LoginProtectedRoute>
        } />

        <Route path="/admin/users/users-types" element={
          <LoginProtectedRoute>
            <AdminProtectedRoute>
              <AdminUserTypesPage />
            </AdminProtectedRoute>
          </LoginProtectedRoute>
        } />

        <Route path="/admin/setting/shift-names" element={
          <LoginProtectedRoute>
            <AdminProtectedRoute> <AdminShiftNamePage /> </AdminProtectedRoute>
          </LoginProtectedRoute>
        } />

        <Route path="/admin/setting/shift-cash-transaction-types" element={
          <LoginProtectedRoute>
            <AdminProtectedRoute> <AdminShiftCashTransactionTypesPage /> </AdminProtectedRoute>
          </LoginProtectedRoute>
        } />

        <Route path="/admin/setting/shift-cash-drawer-reconciliation-statuses" element={
          <LoginProtectedRoute>
            <AdminProtectedRoute> <AdminShiftCashDrawerReconciliationStatusesPage /> </AdminProtectedRoute>
          </LoginProtectedRoute>
        } />

        <Route path="/admin/setting/shift-cash-transactions-data" element={
          <LoginProtectedRoute>
            <AdminProtectedRoute> <AdminShiftCashTransactionsPage /> </AdminProtectedRoute>
          </LoginProtectedRoute>
        } />




        {/* Admin routes area ens here */}


        {/* Cashier routes area starts here */}
        <Route path="/cashier/dashboard" element={
          <LoginProtectedRoute>
            <CashierProtectedRoute> <CashierDashboardPage /></CashierProtectedRoute>
          </LoginProtectedRoute>
        } />
        <Route path="/cashier/point-of-sale" element={
          <LoginProtectedRoute>
            <CashierProtectedRoute> <CashierPointOfSalePage /></CashierProtectedRoute>

          </LoginProtectedRoute>
        } />
        <Route path="/cashier/orders-list" element={
          <LoginProtectedRoute>
            <CashierProtectedRoute> <CashierOrdersPage /></CashierProtectedRoute>
          </LoginProtectedRoute>
        } />
        <Route path="/cashier/order-detail/:orderId" element={
          <LoginProtectedRoute>
            <CashierProtectedRoute> <CashierOrderDetailPage /></CashierProtectedRoute>
          </LoginProtectedRoute>
        } />
        <Route path="/cashier/customers-list" element={
          <LoginProtectedRoute>
            <CashierProtectedRoute> <CashierCustomerListPage /></CashierProtectedRoute>
          </LoginProtectedRoute>
        } />
        <Route path="/cashier/customers-orders-history/:customerId" element={
          <LoginProtectedRoute>
            <CashierProtectedRoute> <CashierCustomerOrdersHistoryPage /></CashierProtectedRoute>
          </LoginProtectedRoute>
        } />

        <Route path="/cashier/notifications-list" element={
          <LoginProtectedRoute>
            <CashierProtectedRoute> <CashierNotificationsListPage /></CashierProtectedRoute>
          </LoginProtectedRoute>
        } />

        <Route path="/cashier/shift-management" element={
          <LoginProtectedRoute>
            <CashierProtectedRoute> <CashierShiftManagementPage /></CashierProtectedRoute>
          </LoginProtectedRoute>
        } />

        <Route path="cashier/shift-cash-transactions" element={
          <LoginProtectedRoute>
            <CashierProtectedRoute> <CashierShiftTransactionsPage /></CashierProtectedRoute>
          </LoginProtectedRoute>
        } />

        

        {/* Cashier routes area ends here */}


        {/* Visitor routes area starts here */}
        <Route path="/visitor/pos-main" element={
          <LoginProtectedRoute>
            <VisitorProtectedRoute> <VisitorPosMainPage /></VisitorProtectedRoute>
          </LoginProtectedRoute>
        } />

        {/* Cashier routes area ends here */}

        {/* Kitchen routes area starts here */}
        <Route path="/kitchen/dashboard" element={
          <LoginProtectedRoute>

            <KitchenDashboardPage />
          </LoginProtectedRoute>
        } />
        <Route path="/kitchen/orders-list" element={
          <LoginProtectedRoute>
            <KitchenOrdersPage />
          </LoginProtectedRoute>
        } />
        <Route path="/kitchen/order-detail/:orderId" element={
          <LoginProtectedRoute>
            <KitchenOrderDetailPage />
          </LoginProtectedRoute>
        } />

        <Route path="/kitchen/notifications-list" element={
          <LoginProtectedRoute>
            <KitchenNotificationsListPage />
          </LoginProtectedRoute>
        } />

        {/* Kitchen routes area ends here */}


        {/* Common routes area starts here */}
        <Route path="*" element={<HomePage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/app/error/404" element={<Error404Page />} />
        {/* Common routes area starts here */}

      </Routes>



      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        rtl={false}
        pauseOnFocusLoss
        draggable={true}
        pauseOnHover={true}
        closeOnClick={true}
        theme="colored"
      />




    </>
  )
}
