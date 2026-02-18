import { useEffect, useMemo, useState } from 'react';
import { Product, Zone } from '../api/types';
import ProductTable from './ProductTable';

interface ZoneModalProps {
  zone: Zone;
  products: Product[];
  onClose: () => void;
  isLoading?: boolean;
  error?: string | null;
}

const ZoneModal = ({ zone, products, onClose, isLoading = false, error }: ZoneModalProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expiryFilter, setExpiryFilter] = useState<'all' | 'expiring' | 'no-expiry'>('all');
  const [page, setPage] = useState(1);

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const now = Date.now();
    const thirtyDays = 1000 * 60 * 60 * 24 * 30;

    return products.filter((product) => {
      if (term) {
        const haystack = `${product.name} ${product.batch_number}`.toLowerCase();
        if (!haystack.includes(term)) return false;
      }

      if (expiryFilter === 'expiring') {
        if (!product.expiration_date) return false;
        const exp = new Date(product.expiration_date).getTime();
        return exp - now <= thirtyDays;
      }

      if (expiryFilter === 'no-expiry') {
        return !product.expiration_date;
      }

      return true;
    });
  }, [products, searchTerm, expiryFilter]);

  const perPage = 5;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / perPage));
  const pagedProducts = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredProducts.slice(start, start + perPage);
  }, [filteredProducts, page]);

  useEffect(() => {
    setPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, expiryFilter, zone.id]);

  return (
    <div className="modal-backdrop">
      <div className="modal-panel p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate">Zone</p>
            <h3 className="font-display text-2xl text-ink">{zone.name}</h3>
            <p className="mt-2 text-sm text-slate">
              Position X{zone.position_x} · Y{zone.position_y}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full ghost-pill px-3 py-1 text-sm"
          >
            Close
          </button>
        </div>

        <div className="mt-6">
          {isLoading ? (
            <div className="empty-state">Loading products...</div>
          ) : error ? (
            <div className="empty-state warning">Unable to load products for this zone. Please try again later.</div>
          ) : products.length === 0 ? (
            <div className="empty-state">No products assigned.</div>
          ) : (
            <>
              <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-slate">
                <input
                  className="form-field flex-1 min-w-[200px]"
                  placeholder="Search by name or batch..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
                <select
                  className="form-field w-44"
                  value={expiryFilter}
                  onChange={(event) => setExpiryFilter(event.target.value as typeof expiryFilter)}
                >
                  <option value="all">All expirations</option>
                  <option value="expiring">Expiring soon</option>
                  <option value="no-expiry">No expiry</option>
                </select>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="empty-state">No matching products.</div>
              ) : (
                <>
                  <ProductTable products={pagedProducts} />
                  {filteredProducts.length > perPage ? (
                    <div className="mt-4 flex items-center justify-between text-sm text-slate">
                      <span>
                        Page {page} of {totalPages}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                          disabled={page === 1}
                          className="rounded-full ghost-pill px-3 py-1 text-xs disabled:opacity-50"
                        >
                          Prev
                        </button>
                        <button
                          type="button"
                          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                          disabled={page === totalPages}
                          className="rounded-full ghost-pill px-3 py-1 text-xs disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  ) : null}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ZoneModal;
