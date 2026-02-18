import React from 'react';

interface DashboardLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

const DashboardLayout = ({ title, subtitle, children, actions }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen px-6 py-10 lg:px-16">
      <header className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">Inventory System</p>
          <h1 className="font-display text-3xl lg:text-4xl text-white">{title}</h1>
          <p className="mt-2 text-white/70 max-w-2xl">{subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          {actions ?? (
            <>
              <span className="badge">Live Zones</span>
              <button className="rounded-full bg-ink text-white px-5 py-2 text-sm font-medium">Add Product</button>
            </>
          )}
        </div>
      </header>
      {children}
    </div>
  );
};

export default DashboardLayout;
