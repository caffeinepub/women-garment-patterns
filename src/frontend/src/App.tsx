import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calculator,
  ClipboardList,
  Factory,
  RefreshCw,
  Scissors,
  Settings,
  ShoppingBag,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { AdminPanel } from "./components/AdminPanel";
import { CostCalculator } from "./components/CostCalculator";
import { CustomerManager } from "./components/CustomerManager";
import { D2CCatalog } from "./components/D2CCatalog";
import { MadeToOrderQueue } from "./components/MadeToOrderQueue";
import { OrderManager } from "./components/OrderManager";
import { PatternGenerator } from "./components/PatternGenerator";
import { SubscriptionManager } from "./components/SubscriptionManager";

const THREAD_BARS = [
  { id: "bar-0", h: 13 },
  { id: "bar-1", h: 11 },
  { id: "bar-2", h: 8 },
  { id: "bar-3", h: 13 },
  { id: "bar-4", h: 10 },
  { id: "bar-5", h: 12 },
  { id: "bar-6", h: 8 },
  { id: "bar-7", h: 11 },
];

const HERO_GARMENTS = [
  { label: "Salwar", detail: "Traditional trousers" },
  { label: "Kameez", detail: "Long tunic" },
  { label: "Kurti", detail: "Short tunic" },
  { label: "Blouse", detail: "Fitted top" },
];

export default function App() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border/60 bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Scissors className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-lg font-semibold text-foreground leading-tight">
                Cutting Patterns
              </h1>
              <p className="text-xs text-muted-foreground -mt-0.5">
                Women&rsquo;s Garment Studio
              </p>
            </div>
          </motion.div>

          <div className="hidden md:flex items-center gap-1 opacity-30">
            {THREAD_BARS.map((bar) => (
              <div
                key={bar.id}
                className="w-0.5 rounded-full bg-primary"
                style={{ height: `${bar.h}px` }}
              />
            ))}
          </div>
        </div>
      </header>

      <div className="bg-secondary/40 border-b border-border/40 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-x-6 gap-y-1">
          {HERO_GARMENTS.map((g, i) => (
            <motion.span
              key={g.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="text-xs text-muted-foreground"
            >
              <span className="font-semibold text-foreground">{g.label}</span>
              {" · "}
              {g.detail}
            </motion.span>
          ))}
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        <Tabs defaultValue="generator" className="space-y-8">
          <TabsList className="h-auto bg-secondary/50 border border-border/60 rounded-xl p-1 flex flex-wrap gap-1">
            <TabsTrigger
              value="generator"
              data-ocid="nav.generator.tab"
              className="gap-2 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-xs"
            >
              <Scissors className="w-4 h-4" />
              <span className="hidden sm:inline">Pattern</span> Generator
            </TabsTrigger>
            <TabsTrigger
              value="calculator"
              data-ocid="nav.calculator.tab"
              className="gap-2 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-xs"
            >
              <Calculator className="w-4 h-4" />
              <span className="hidden sm:inline">Cost</span> Calculator
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              data-ocid="nav.orders.tab"
              className="gap-2 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-xs"
            >
              <ClipboardList className="w-4 h-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger
              value="customers"
              data-ocid="nav.customers.tab"
              className="gap-2 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-xs"
            >
              <Users className="w-4 h-4" />
              Customers
            </TabsTrigger>
            <TabsTrigger
              value="mto"
              data-ocid="nav.mto.tab"
              className="gap-2 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-xs"
            >
              <Factory className="w-4 h-4" />
              <span className="hidden sm:inline">Made-to-</span>Order
            </TabsTrigger>
            <TabsTrigger
              value="catalog"
              data-ocid="nav.catalog.tab"
              className="gap-2 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-xs"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">D2C </span>Catalog
            </TabsTrigger>
            <TabsTrigger
              value="subscriptions"
              data-ocid="nav.subscriptions.tab"
              className="gap-2 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-xs"
            >
              <RefreshCw className="w-4 h-4" />
              Subscriptions
            </TabsTrigger>
            <TabsTrigger
              value="admin"
              data-ocid="nav.admin.tab"
              className="gap-2 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-xs"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Admin</span> Panel
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="mt-0 animate-fade-in">
            <PatternGenerator />
          </TabsContent>

          <TabsContent value="calculator" className="mt-0 animate-fade-in">
            <CostCalculator />
          </TabsContent>

          <TabsContent value="orders" className="mt-0 animate-fade-in">
            <OrderManager />
          </TabsContent>

          <TabsContent value="customers" className="mt-0 animate-fade-in">
            <CustomerManager />
          </TabsContent>

          <TabsContent value="mto" className="mt-0 animate-fade-in">
            <MadeToOrderQueue />
          </TabsContent>

          <TabsContent value="catalog" className="mt-0 animate-fade-in">
            <D2CCatalog />
          </TabsContent>

          <TabsContent value="subscriptions" className="mt-0 animate-fade-in">
            <SubscriptionManager />
          </TabsContent>

          <TabsContent value="admin" className="mt-0 animate-fade-in">
            <AdminPanel />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-border/40 bg-secondary/20 px-4 sm:px-6 py-6 mt-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Scissors className="w-3.5 h-3.5" />
            <span>Women&rsquo;s Garment Cutting Patterns</span>
          </div>
          <p>
            &copy; {year}. Built with{" "}
            <span className="text-primary">&hearts;</span> using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      <Toaster richColors position="bottom-right" />
    </div>
  );
}
