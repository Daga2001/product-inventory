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
            className="rounded-full border border-slate/20 px-3 py-1 text-sm"
          >
            Close
          </button>
        </div>

        <div className="mt-6">
          {isLoading ? (
            <div className="rounded-2xl border border-dashed border-slate/30 p-6 text-center text-slate">
              Loading products...
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-dashed border-warning/40 p-6 text-center text-warning">
              Unable to load products for this zone. Please try again later.
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate/30 p-6 text-center text-slate">
              No products assigned.
            </div>
          ) : (
            <ProductTable products={products} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ZoneModal;
