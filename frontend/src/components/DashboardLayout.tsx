import React from 'react';

interface DashboardLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

const DashboardLayout = ({ title, subtitle, children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen px-6 py-10 lg:px-16">
      <header className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate">Inventory System</p>
          <h1 className="font-display text-3xl lg:text-4xl text-ink">{title}</h1>
          <p className="mt-2 text-slate max-w-2xl">{subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="badge">Live Zones</span>
          <button className="rounded-full bg-ink text-white px-5 py-2 text-sm font-medium">Add Product</button>
        </div>
      </header>
      {children}
    </div>
  );
};

export default DashboardLayout;
