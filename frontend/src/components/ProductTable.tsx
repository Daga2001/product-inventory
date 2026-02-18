import { Product } from '../api/types';

interface ProductTableProps {
  products: Product[];
}

const ProductTable = ({ products }: ProductTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-slate">
            <th className="py-2">Product</th>
            <th className="py-2">Batch</th>
            <th className="py-2">Qty</th>
            <th className="py-2">Expiration</th>
            <th className="py-2">Date Added</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-t border-slate/10">
              <td className="py-3 font-medium text-ink">{product.name}</td>
              <td className="py-3 text-slate">{product.batch_number}</td>
              <td className="py-3 text-ink">{product.quantity}</td>
              <td className="py-3 text-slate">
                {product.expiration_date ? new Date(product.expiration_date).toLocaleDateString() : '—'}
              </td>
              <td className="py-3 text-slate">
                {new Date(product.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
