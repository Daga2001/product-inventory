import { useEffect, useMemo, useState, type FormEvent } from 'react';
import DashboardLayout from './components/DashboardLayout';
import CupboardGrid from './components/CupboardGrid';
import ZoneModal from './components/ZoneModal';
import { fetchProducts, fetchZoneProducts, fetchZones, updateZone } from './api/inventory';
import { Product, Zone } from './api/types';
import ProductTable from './components/ProductTable';
import ProductManager from './components/ProductManager';
import { setAuthToken } from './api/client';
import { fetchMe, login, type AuthUser } from './api/auth';

const describeError = () => 'Unable to load data. Please try again later.';

const templateZones: Zone[] = [
  { id: 'template-top-a', name: 'Top A', position_x: 1, position_y: 1, created_at: '' },
  { id: 'template-top-b', name: 'Top B', position_x: 2, position_y: 1, created_at: '' },
  { id: 'template-top-c', name: 'Top C', position_x: 3, position_y: 1, created_at: '' },
  { id: 'template-top-d', name: 'Top D', position_x: 4, position_y: 1, created_at: '' },
  { id: 'template-row2-1', name: 'Row2-1', position_x: 1, position_y: 2, created_at: '' },
  { id: 'template-row2-2', name: 'Row2-2', position_x: 2, position_y: 2, created_at: '' },
  { id: 'template-row2-3', name: 'Row2-3', position_x: 3, position_y: 2, created_at: '' },
  { id: 'template-row2-4', name: 'Row2-4', position_x: 4, position_y: 2, created_at: '' },
  { id: 'template-row2-5', name: 'Row2-5', position_x: 5, position_y: 2, created_at: '' },
  { id: 'template-row3-1', name: 'Row3-1', position_x: 1, position_y: 3, created_at: '' },
  { id: 'template-row3-2', name: 'Row3-2', position_x: 2, position_y: 3, created_at: '' },
  { id: 'template-row3-3', name: 'Row3-3', position_x: 3, position_y: 3, created_at: '' },
  { id: 'template-row3-4', name: 'Row3-4', position_x: 4, position_y: 3, created_at: '' },
  { id: 'template-row3-5', name: 'Row3-5', position_x: 5, position_y: 3, created_at: '' },
  { id: 'template-row4-1', name: 'Row4-1', position_x: 1, position_y: 4, created_at: '' },
  { id: 'template-row4-2', name: 'Row4-2', position_x: 2, position_y: 4, created_at: '' },
  { id: 'template-row4-3', name: 'Row4-3', position_x: 3, position_y: 4, created_at: '' },
  { id: 'template-row4-4', name: 'Row4-4', position_x: 4, position_y: 4, created_at: '' },
  { id: 'template-row4-5', name: 'Row4-5', position_x: 5, position_y: 4, created_at: '' },
  { id: 'template-row5-1', name: 'Row5-1', position_x: 1, position_y: 5, created_at: '' },
  { id: 'template-row5-2', name: 'Row5-2', position_x: 2, position_y: 5, created_at: '' },
  { id: 'template-row5-3', name: 'Row5-3', position_x: 3, position_y: 5, created_at: '' },
  { id: 'template-row5-4', name: 'Row5-4', position_x: 4, position_y: 5, created_at: '' },
  { id: 'template-row5-5', name: 'Row5-5', position_x: 5, position_y: 5, created_at: '' }
];

const App = () => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [zoneProducts, setZoneProducts] = useState<Product[]>([]);
  const [alert, setAlert] = useState<string | null>(null);
  const [authToken, setAuthTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userLoading, setUserLoading] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [zonesLoading, setZonesLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [zoneProductsLoading, setZoneProductsLoading] = useState(false);
  const [zonesError, setZonesError] = useState<string | null>(null);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [zoneProductsError, setZoneProductsError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthTokenState(token);
      setAuthToken(token);
    }
  }, []);

  const loadZones = async () => {
    setZonesLoading(true);
    setZonesError(null);
    try {
      const data = await fetchZones();
      setZones(data);
      return false;
    } catch {
      const message = describeError();
      setZones([]);
      setZonesError(message);
      return true;
    } finally {
      setZonesLoading(false);
    }
  };

  const loadProducts = async () => {
    setProductsLoading(true);
    setProductsError(null);
    try {
      const data = await fetchProducts();
      setProducts(data);
      return false;
    } catch {
      const message = describeError();
      setProducts([]);
      setProductsError(message);
      return true;
    } finally {
      setProductsLoading(false);
    }
  };

  const loadAll = async () => {
    setAlert(null);
    const [zonesFailed, productsFailed] = await Promise.all([loadZones(), loadProducts()]);
    if (zonesFailed || productsFailed) {
      setAlert('Unable to load data. Please try again later.');
    }
  };

  const loadUser = async () => {
    setUserLoading(true);
    try {
      const data = await fetchMe();
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setUserLoading(false);
    }
  };

  useEffect(() => {
    if (!authToken) {
      setZones([]);
      setProducts([]);
      setSelectedZone(null);
      setZoneProducts([]);
      setUser(null);
      setAlert(null);
      setZonesError(null);
      setProductsError(null);
      setZoneProductsError(null);
      setZonesLoading(false);
      setProductsLoading(false);
      setUserLoading(false);
      return;
    }

    void Promise.all([loadAll(), loadUser()]);
  }, [authToken]);

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
    setZoneProducts([]);
    setZoneProductsError(null);
    setZoneProductsLoading(true);
    try {
      const data = await fetchZoneProducts(zone.id);
      setZoneProducts(data);
    } catch {
      setZoneProducts([]);
      setZoneProductsError(describeError());
      setAlert((prev) => (prev ? `${prev} Unable to load zone details.` : 'Unable to load zone details.'));
    } finally {
      setZoneProductsLoading(false);
    }
  };

  const handleZoneRename = async (zoneId: string, nextName: string) => {
    const trimmed = nextName.trim();
    const current = zones.find((zone) => zone.id === zoneId);
    if (!current || trimmed.length === 0 || trimmed === current.name) {
      return;
    }

    const previousName = current.name;
    setZones((prev) => prev.map((zone) => (zone.id === zoneId ? { ...zone, name: trimmed } : zone)));
    setSelectedZone((prev) => (prev && prev.id === zoneId ? { ...prev, name: trimmed } : prev));

    try {
      const updated = await updateZone(zoneId, { name: trimmed });
      setZones((prev) => prev.map((zone) => (zone.id === zoneId ? updated : zone)));
      setSelectedZone((prev) => (prev && prev.id === zoneId ? updated : prev));
    } catch {
      setZones((prev) => prev.map((zone) => (zone.id === zoneId ? { ...zone, name: previousName } : zone)));
      setSelectedZone((prev) => (prev && prev.id === zoneId ? { ...prev, name: previousName } : prev));
      setAlert('Unable to update the zone name. Please try again later.');
    }
  };

  const handleLoginSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      const email = loginForm.email.trim();
      const password = loginForm.password;
      if (!email || !password) {
        setLoginError('Please enter your email and password.');
        return;
      }
      const response = await login(email, password);
      localStorage.setItem('token', response.token);
      setAuthToken(response.token);
      setAuthTokenState(response.token);
      setLoginForm({ email: '', password: '' });
      setIsLoginOpen(false);
    } catch {
      setLoginError('Login failed. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setAuthTokenState(null);
  };

  const handleCloseLogin = () => {
    setIsLoginOpen(false);
    setLoginError(null);
    setLoginForm((prev) => ({ ...prev, password: '' }));
  };

  const headerActions = (
    <>
      <span className="badge">
        {authToken
          ? userLoading
            ? 'Loading profile...'
            : user
              ? `${user.name} · ${user.role}`
              : 'Signed in'
          : 'Please sign in to continue'}
      </span>
      {authToken ? (
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-full ghost-pill px-5 py-2 text-sm font-medium"
        >
          Log Out
        </button>
      ) : (
        <button
          type="button"
          onClick={() => {
            setLoginError(null);
            setIsLoginOpen(true);
          }}
          className="rounded-full bg-ink text-white px-5 py-2 text-sm font-medium"
        >
          Log In
        </button>
      )}
    </>
  );

  const placeholderZones =
    authToken && !zonesLoading && !zonesError && zones.length === 0 ? templateZones : undefined;

  return (
    <DashboardLayout
      title="Cupboard Inventory"
      subtitle="Track every product, batch, and expiry date across your cupboard zones with real-time visibility."
      actions={headerActions}
    >
      {alert ? (
        <div className="mb-6 rounded-xl border border-accent/20 bg-accentSoft/60 px-4 py-3 text-sm text-ink">
          {alert}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr,1fr] xl:items-start">
        <CupboardGrid
          zones={zones}
          selectedZoneId={selectedZone?.id}
          onSelect={handleZoneSelect}
          isLoading={zonesLoading}
          error={zonesError}
          placeholderZones={placeholderZones}
          onRenameZone={handleZoneRename}
        />

        <div className="flex flex-col gap-6 xl:self-start xl:pt-16">
          <div className="card p-6">
            <h2 className="font-display text-xl">Inventory Overview</h2>
            <p className="mt-2 text-sm text-slate">Live totals across all zones.</p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="stat-tile">
                <p className="text-xs uppercase tracking-[0.2em] text-slate">Products</p>
                <p className="mt-2 text-2xl font-semibold text-ink">
                  {productsLoading ? '—' : stats.totalProducts}
                </p>
              </div>
              <div className="stat-tile">
                <p className="text-xs uppercase tracking-[0.2em] text-slate">Total Qty</p>
                <p className="mt-2 text-2xl font-semibold text-ink">
                  {productsLoading ? '—' : stats.totalQuantity}
                </p>
              </div>
              <div className="stat-tile">
                <p className="text-xs uppercase tracking-[0.2em] text-slate">Expiring Soon</p>
                <p className="mt-2 text-2xl font-semibold text-ink">
                  {productsLoading ? '—' : stats.expiringSoon}
                </p>
              </div>
              <div className="stat-tile">
                <p className="text-xs uppercase tracking-[0.2em] text-slate">Zones</p>
                <p className="mt-2 text-2xl font-semibold text-ink">
                  {zonesLoading ? '—' : zones.length}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl">Products</h2>
                <p className="text-sm text-slate">Latest inventory entries.</p>
              </div>
              <button className="rounded-full ghost-pill px-4 py-2 text-sm">Manage</button>
            </div>
            <div className="mt-4">
              {productsLoading ? (
                <div className="empty-state">Loading products...</div>
              ) : products.length === 0 ? (
                <div className="empty-state">No products yet.</div>
              ) : (
                <ProductTable products={products.slice(0, 5)} />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <ProductManager
          zones={zones}
          products={products}
          onChange={setProducts}
          isLoading={productsLoading}
          zonesLoading={zonesLoading}
          error={productsError}
        />
      </div>

      {selectedZone ? (
        <ZoneModal
          zone={selectedZone}
          products={zoneProducts}
          onClose={() => setSelectedZone(null)}
          isLoading={zoneProductsLoading}
          error={zoneProductsError}
        />
      ) : null}

      {isLoginOpen ? (
        <div className="modal-backdrop">
          <div className="modal-panel p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate">Access</p>
                <h3 className="font-display text-2xl text-ink">Sign in</h3>
                <p className="mt-2 text-sm text-slate">Enter your credentials to continue.</p>
              </div>
              <button
                type="button"
                onClick={handleCloseLogin}
                className="rounded-full ghost-pill px-3 py-1 text-sm"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} className="mt-6 grid gap-4">
              <input
                className="rounded-xl border border-slate/20 px-4 py-2"
                type="email"
                autoComplete="email"
                placeholder="Email address"
                value={loginForm.email}
                onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })}
                required
              />
              <input
                className="rounded-xl border border-slate/20 px-4 py-2"
                type="password"
                autoComplete="current-password"
                placeholder="Password"
                value={loginForm.password}
                onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
                required
              />
              <button
                type="submit"
                disabled={loginLoading}
                className="rounded-xl bg-ink text-white px-4 py-2 text-sm font-medium"
              >
                {loginLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            {loginError ? <p className="mt-3 text-sm text-warning">{loginError}</p> : null}
          </div>
        </div>
      ) : null}
    </DashboardLayout>
  );
};

export default App;
