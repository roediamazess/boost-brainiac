import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import Dashboard from "./pages/Dashboard";
import Academy from "./pages/Academy";
import Webstore from "./pages/Webstore";
import Agents from "./pages/Agents";
import LeadCRM from "./pages/LeadCRM";
import Referrals from "./pages/Referrals";
import Billing from "./pages/Billing";
import PublicStorefront from "./pages/PublicStorefront";
import Checkout from "./pages/Checkout";
import TrackOrder from "./pages/TrackOrder";
import Orders from "./pages/Orders";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/academy" element={<Academy />} />
            <Route path="/webstore" element={<Webstore />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/crm" element={<LeadCRM />} />
            <Route path="/referrals" element={<Referrals />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/orders" element={<Orders />} />
          </Route>
          <Route path="/store/:storeName" element={<PublicStorefront />} />
          <Route path="/store/:storeName/checkout" element={<Checkout />} />
          <Route path="/track" element={<TrackOrder />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
