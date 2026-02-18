import { Product, Zone } from '../api/types';
import ProductTable from './ProductTable';

interface ZoneModalProps {
  zone: Zone;
  products: Product[];
  onClose: () => void;
}

const ZoneModal = ({ zone, products, onClose }: ZoneModalProps) => {
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
          {products.length === 0 ? (
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
