import { useEffect, useMemo, useState, type FormEvent } from 'react';
import axios from 'axios';
import { Product, Zone } from '../api/types';
import { createProduct, deleteProduct, updateProduct } from '../api/inventory';

interface ProductManagerProps {
  zones: Zone[];
  products: Product[];
  onChange: (products: Product[]) => void;
  isLoading?: boolean;
  zonesLoading?: boolean;
  error?: string | null;
}

const emptyForm = {
  id: '',
  name: '',
  batch_number: '',
  quantity: 0,
  expiration_date: '',
  zone_id: ''
};

const normalizeDateInput = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  const slashMatch = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (slashMatch) {
    const part1 = Number(slashMatch[1]);
    const part2 = Number(slashMatch[2]);
    const year = slashMatch[3];
    if (part1 > 12 && part2 <= 12) {
      return `${year}-${String(part2).padStart(2, '0')}-${String(part1).padStart(2, '0')}`;
    }
    return `${year}-${String(part1).padStart(2, '0')}-${String(part2).padStart(2, '0')}`;
  }
  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }
  return trimmed;
};

const getFriendlyError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    if (!status) {
      return 'Unable to reach the server. Please try again.';
    }
    if (status === 400) {
      const details = error.response?.data?.details as
        | { fieldErrors?: { body?: string[] } }
        | undefined;
      const bodyErrors = details?.fieldErrors?.body;
      if (bodyErrors?.length) {
        return bodyErrors.join(' ');
      }
      return 'Please check your inputs and try again.';
    }
    if (status === 401) {
      return 'You are not signed in. Please sign in and try again.';
    }
    if (status === 403) {
      return 'You do not have permission to perform this action.';
    }
    if (status === 404) {
      return 'Item not found. It may have been removed.';
    }
    return 'Action failed. Please try again.';
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Action failed. Please try again.';
};

const ProductManager = ({
  zones,
  products,
  onChange,
  isLoading = false,
  zonesLoading = false,
  error
}: ProductManagerProps) => {
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [listPage, setListPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [expiryFilter, setExpiryFilter] = useState<'all' | 'expiring' | 'no-expiry'>('all');

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

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const pagedProducts = useMemo(() => {
    const start = (listPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, listPage, pageSize]);

  useEffect(() => {
    setListPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  useEffect(() => {
    setListPage(1);
  }, [searchTerm, expiryFilter]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setStatus(null);

    try {
      const normalizedExpiration = normalizeDateInput(form.expiration_date);
      if (normalizedExpiration && !/^\d{4}-\d{2}-\d{2}$/.test(normalizedExpiration)) {
        setStatus('Expiration date must be in YYYY-MM-DD format.');
        return;
      }
      const payload = {
        name: form.name,
        batch_number: form.batch_number,
        quantity: Number(form.quantity),
        expiration_date: normalizedExpiration,
        zone_id: form.zone_id || null
      };

      if (form.id) {
        const updated = await updateProduct(form.id, payload);
        onChange(products.map((product) => (product.id === form.id ? updated : product)));
        setStatus('Product updated.');
      } else {
        const created = await createProduct(payload);
        onChange([created, ...products]);
        setStatus('Product created.');
      }

      setForm(emptyForm);
    } catch (error) {
      setStatus(getFriendlyError(error));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product: Product) => {
    setForm({
      id: product.id,
      name: product.name,
      batch_number: product.batch_number,
      quantity: product.quantity,
      expiration_date: product.expiration_date ?? '',
      zone_id: product.zone_id ?? ''
    });
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Delete ${product.name}?`)) return;
    try {
      await deleteProduct(product.id);
      onChange(products.filter((item) => item.id !== product.id));
      setStatus('Product deleted.');
    } catch (error) {
      setStatus(getFriendlyError(error));
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-display text-xl">Product Management</h2>
          <p className="text-sm text-slate">Create, edit, and assign products to zones.</p>
        </div>
        <button
          type="button"
          onClick={() => setForm(emptyForm)}
          className="rounded-full ghost-pill px-4 py-2 text-sm"
        >
          Reset Form
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-slate" htmlFor="product-name">
          <span className="flex items-center gap-2 text-ink">
            Product name
            <button
              type="button"
              className="help-tip"
              data-tip="Enter the product name exactly as it appears on the package."
              aria-label="Enter the product name exactly as it appears on the package."
            >
              ?
            </button>
          </span>
          <input
            id="product-name"
            className="form-field"
            placeholder="Basmati Rice 5kg"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            required
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate" htmlFor="batch-number">
          <span className="flex items-center gap-2 text-ink">
            Batch number
            <button
              type="button"
              className="help-tip"
              data-tip="Use the batch or lot code printed on the package for traceability."
              aria-label="Use the batch or lot code printed on the package for traceability."
            >
              ?
            </button>
          </span>
          <input
            id="batch-number"
            className="form-field"
            placeholder="BR-2025-01"
            value={form.batch_number}
            onChange={(event) => setForm({ ...form, batch_number: event.target.value })}
            required
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate" htmlFor="product-quantity">
          <span className="flex items-center gap-2 text-ink">
            Quantity
            <button
              type="button"
              className="help-tip"
              data-tip="Enter how many units are currently in stock."
              aria-label="Enter how many units are currently in stock."
            >
              ?
            </button>
          </span>
          <input
            id="product-quantity"
            className="form-field"
            type="number"
            min={0}
            placeholder="0"
            value={form.quantity}
            onChange={(event) => setForm({ ...form, quantity: Number(event.target.value) })}
            required
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate" htmlFor="expiration-date">
          <span className="flex items-center gap-2 text-ink">
            Expiration date
            <button
              type="button"
              className="help-tip"
              data-tip="Optional. Use the best-before or expiration date on the package."
              aria-label="Optional. Use the best-before or expiration date on the package."
            >
              ?
            </button>
          </span>
          <input
            id="expiration-date"
            className="form-field"
            type="date"
            value={form.expiration_date}
            onChange={(event) => setForm({ ...form, expiration_date: event.target.value })}
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate" htmlFor="zone-select">
          <span className="flex items-center gap-2 text-ink">
            Zone assignment
            <button
              type="button"
              className="help-tip"
              data-tip="Pick the cupboard zone where this product is stored."
              aria-label="Pick the cupboard zone where this product is stored."
            >
              ?
            </button>
          </span>
          <select
            id="zone-select"
            className="form-field"
            value={form.zone_id}
            onChange={(event) => setForm({ ...form, zone_id: event.target.value })}
            disabled={zonesLoading}
          >
            <option value="">Unassigned</option>
            {zones.map((zone) => (
              <option key={zone.id} value={zone.id}>
                {zone.name}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-ink text-white px-4 py-2 text-sm font-medium"
        >
          {form.id ? 'Update Product' : 'Create Product'}
        </button>
      </form>

      {status ? <p className="mt-3 text-sm text-warning">{status}</p> : null}
      {!status && error ? <p className="mt-3 text-sm text-warning">{error}</p> : null}

      <div className="mt-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate">
          <div className="flex flex-wrap items-center gap-3">
            <input
              className="form-field min-w-[200px]"
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
            <label className="flex items-center gap-2">
              <span>Rows per page</span>
              <select
                className="form-field w-24"
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setListPage(1);
                }}
                disabled={isLoading}
              >
                {[5, 10, 15, 20].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {filteredProducts.length > pageSize ? (
            <div className="flex items-center gap-2">
              <span>
                Page {listPage} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setListPage((prev) => Math.max(1, prev - 1))}
                disabled={listPage === 1}
                className="rounded-full ghost-pill px-3 py-1 text-xs disabled:opacity-50"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => setListPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={listPage === totalPages}
                className="rounded-full ghost-pill px-3 py-1 text-xs disabled:opacity-50"
              >
                Next
              </button>
            </div>
          ) : null}
        </div>
        {isLoading ? (
          <div className="empty-state">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="empty-state">No products yet.</div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state">No matching products.</div>
        ) : (
          <div className="space-y-3">
            {pagedProducts.map((product) => (
              <div
                key={product.id}
                className="flex flex-col gap-2 rounded-2xl border border-slate/10 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-medium text-ink">{product.name}</p>
                  <p className="text-xs text-slate">
                    Batch {product.batch_number} · Qty {product.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(product)}
                    className="rounded-full ghost-pill px-4 py-1 text-xs"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(product)}
                    className="rounded-full border border-warning/40 px-4 py-1 text-xs text-warning"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManager;
