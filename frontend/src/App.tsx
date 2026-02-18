import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from './components/DashboardLayout';
import CupboardGrid from './components/CupboardGrid';
import ZoneModal from './components/ZoneModal';
import { fetchProducts, fetchZoneProducts, fetchZones } from './api/inventory';
import { Product, Zone } from './api/types';
import ProductTable from './components/ProductTable';
import ProductManager from './components/ProductManager';
import { setAuthToken } from './api/client';

const mockZones: Zone[] = [
  { id: 'zone-1', name: 'Top A', position_x: 1, position_y: 1, created_at: '' },
  { id: 'zone-2', name: 'Top B', position_x: 2, position_y: 1, created_at: '' },
  { id: 'zone-3', name: 'Top C', position_x: 3, position_y: 1, created_at: '' },
  { id: 'zone-4', name: 'Top D', position_x: 4, position_y: 1, created_at: '' },
  { id: 'zone-5', name: 'Row2-1', position_x: 1, position_y: 2, created_at: '' },
  { id: 'zone-6', name: 'Row2-2', position_x: 2, position_y: 2, created_at: '' },
  { id: 'zone-7', name: 'Row2-3', position_x: 3, position_y: 2, created_at: '' },
  { id: 'zone-8', name: 'Row2-4', position_x: 4, position_y: 2, created_at: '' },
  { id: 'zone-9', name: 'Row2-5', position_x: 5, position_y: 2, created_at: '' },
  { id: 'zone-10', name: 'Row3-1', position_x: 1, position_y: 3, created_at: '' },
  { id: 'zone-11', name: 'Row3-2', position_x: 2, position_y: 3, created_at: '' },
  { id: 'zone-12', name: 'Row3-3', position_x: 3, position_y: 3, created_at: '' },
  { id: 'zone-13', name: 'Row3-4', position_x: 4, position_y: 3, created_at: '' },
  { id: 'zone-14', name: 'Row3-5', position_x: 5, position_y: 3, created_at: '' },
  { id: 'zone-15', name: 'Row4-1', position_x: 1, position_y: 4, created_at: '' },
  { id: 'zone-16', name: 'Row4-2', position_x: 2, position_y: 4, created_at: '' },
  { id: 'zone-17', name: 'Row4-3', position_x: 3, position_y: 4, created_at: '' },
  { id: 'zone-18', name: 'Row4-4', position_x: 4, position_y: 4, created_at: '' },
  { id: 'zone-19', name: 'Row4-5', position_x: 5, position_y: 4, created_at: '' },
  { id: 'zone-20', name: 'Row5-1', position_x: 1, position_y: 5, created_at: '' },
  { id: 'zone-21', name: 'Row5-2', position_x: 2, position_y: 5, created_at: '' },
  { id: 'zone-22', name: 'Row5-3', position_x: 3, position_y: 5, created_at: '' },
  { id: 'zone-23', name: 'Row5-4', position_x: 4, position_y: 5, created_at: '' },
  { id: 'zone-24', name: 'Row5-5', position_x: 5, position_y: 5, created_at: '' }
];

const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Basmati Rice 5kg',
    batch_number: 'BR-2025-01',
    quantity: 12,
    expiration_date: '2026-01-20',
    created_at: '2025-11-12T10:00:00Z',
    zone_id: 'zone-1'
  },
  {
    id: 'prod-2',
    name: 'Tomato Sauce 750ml',
    batch_number: 'TS-2025-11',
    quantity: 24,
    expiration_date: '2025-10-01',
    created_at: '2025-12-01T12:30:00Z',
    zone_id: 'zone-5'
  },
  {
    id: 'prod-3',
    name: 'Olive Oil 1L',
    batch_number: 'OO-2026-02',
    quantity: 8,
    expiration_date: '2026-08-15',
    created_at: '2026-01-05T09:00:00Z',
    zone_id: 'zone-2'
  }
];

const App = () => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [zoneProducts, setZoneProducts] = useState<Product[]>([]);
  const [alert, setAlert] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  useEffect(() => {
    const loadZones = async () => {
      try {
        const data = await fetchZones();
        setZones(data);
        setIsDemo(false);
      } catch (error) {
        setZones(mockZones);
        setProducts(mockProducts);
        setIsDemo(true);
        setAlert('Using demo data. Connect API to load live inventory.');
      }
    };

    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        if (!isDemo) {
          setProducts(mockProducts);
        }
      }
    };

    loadZones();
    loadProducts();
  }, [isDemo]);

  const stats = useMemo(() => {
    const totalQuantity = products.reduce((sum, product) => sum + product.quantity, 0);
    const expiringSoon = products.filter((product) => {
      if (!product.expiration_date) return false;
      const exp = new Date(product.expiration_date).getTime();
      const now = new Date().getTime();
      const thirtyDays = 1000 * 60 * 60 * 24 * 30;
      return exp - now < thirtyDays;
    }).length;
    return { totalProducts: products.length, totalQuantity, expiringSoon };
  }, [products]);

  const handleZoneSelect = async (zone: Zone) => {
    setSelectedZone(zone);
    try {
      const data = await fetchZoneProducts(zone.id);
      setZoneProducts(data);
    } catch (error) {
      setZoneProducts(products.filter((product) => product.zone_id === zone.id));
    }
  };

  return (
    <DashboardLayout
      title="Cupboard Inventory"
      subtitle="Track every product, batch, and expiry date across your cupboard zones with real-time visibility."
    >
      {alert ? (
        <div className="mb-6 rounded-xl border border-accent/20 bg-accentSoft/60 px-4 py-3 text-sm text-ink">
          {alert}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr,1fr]">
        <CupboardGrid zones={zones} selectedZoneId={selectedZone?.id} onSelect={handleZoneSelect} />

        <div className="flex flex-col gap-6">
          <div className="card p-6">
            <h2 className="font-display text-xl">Inventory Overview</h2>
            <p className="mt-2 text-sm text-slate">Live totals across all zones.</p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-surface p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate">Products</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{stats.totalProducts}</p>
              </div>
              <div className="rounded-2xl bg-surface p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate">Total Qty</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{stats.totalQuantity}</p>
              </div>
              <div className="rounded-2xl bg-surface p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate">Expiring Soon</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{stats.expiringSoon}</p>
              </div>
              <div className="rounded-2xl bg-surface p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate">Zones</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{zones.length}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl">Products</h2>
                <p className="text-sm text-slate">Latest inventory entries.</p>
              </div>
              <button className="rounded-full border border-slate/20 px-4 py-2 text-sm">Manage</button>
            </div>
            <div className="mt-4">
              {products.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate/30 p-6 text-center text-slate">
                  No products yet.
                </div>
              ) : (
                <ProductTable products={products.slice(0, 5)} />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <ProductManager zones={zones} products={products} onChange={setProducts} />
      </div>

      {selectedZone ? (
        <ZoneModal zone={selectedZone} products={zoneProducts} onClose={() => setSelectedZone(null)} />
      ) : null}
    </DashboardLayout>
  );
};

export default App;
