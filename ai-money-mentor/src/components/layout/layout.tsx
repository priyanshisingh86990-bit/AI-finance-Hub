import { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { motion } from "framer-motion";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-background overflow-hidden selection:bg-secondary/30">
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative flex flex-col">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
