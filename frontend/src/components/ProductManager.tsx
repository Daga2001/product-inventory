import { useState, type FormEvent } from 'react';
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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setStatus(null);

    try {
      const payload = {
        name: form.name,
        batch_number: form.batch_number,
        quantity: Number(form.quantity),
        expiration_date: form.expiration_date || null,
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
      setStatus('Action failed. Please try again.');
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
      setStatus('Delete failed. Please try again.');
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
          className="rounded-full border border-slate/20 px-4 py-2 text-sm"
        >
          Reset Form
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <input
          className="rounded-xl border border-slate/20 px-4 py-2"
          placeholder="Product name"
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          required
        />
        <input
          className="rounded-xl border border-slate/20 px-4 py-2"
          placeholder="Batch number"
          value={form.batch_number}
          onChange={(event) => setForm({ ...form, batch_number: event.target.value })}
          required
        />
        <input
          className="rounded-xl border border-slate/20 px-4 py-2"
          type="number"
          min={0}
          placeholder="Quantity"
          value={form.quantity}
          onChange={(event) => setForm({ ...form, quantity: Number(event.target.value) })}
          required
        />
        <input
          className="rounded-xl border border-slate/20 px-4 py-2"
          type="date"
          value={form.expiration_date}
          onChange={(event) => setForm({ ...form, expiration_date: event.target.value })}
        />
        <select
          className="rounded-xl border border-slate/20 px-4 py-2"
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
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-ink text-white px-4 py-2 text-sm font-medium"
        >
          {form.id ? 'Update Product' : 'Create Product'}
        </button>
      </form>

      {status ? <p className="mt-3 text-sm text-slate">{status}</p> : null}
      {!status && error ? <p className="mt-3 text-sm text-warning">{error}</p> : null}

      <div className="mt-6">
        {isLoading ? (
          <div className="rounded-2xl border border-dashed border-slate/30 p-6 text-center text-slate">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate/30 p-6 text-center text-slate">
            No products yet.
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((product) => (
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
                    className="rounded-full border border-slate/20 px-4 py-1 text-xs"
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
