import React, { useState } from 'react';
import { InventoryItem, StockMovement } from '../../types';
import {
  Boxes,
  Search,
  Plus,
  AlertTriangle,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  TrendingDown,
  History,
  X,
  Package,
  Layers,
  Edit2,
  DollarSign,
  Tag,
} from 'lucide-react';

interface InventoryViewProps {
  inventory: InventoryItem[];
  onAddItem: () => void;
  onEditItem: (item: InventoryItem) => void;
  onAdjustStock: (item: InventoryItem) => void;
  showToast: (msg: string) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  inventory,
  onAddItem,
  onEditItem,
  onAdjustStock,
  showToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockStatusFilter, setStockStatusFilter] = useState<'all' | 'low_stock' | 'out_of_stock'>('all');
  const [selectedItemForHistory, setSelectedItemForHistory] = useState<InventoryItem | null>(null);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const categories = Array.from(new Set(inventory.map((i) => i.category)));

  const filteredItems = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.model.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCat = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStock =
      stockStatusFilter === 'all' ||
      (stockStatusFilter === 'low_stock' && item.currentStock <= item.minStockAlert && item.currentStock > 0) ||
      (stockStatusFilter === 'out_of_stock' && item.currentStock <= 0);

    return matchesSearch && matchesCat && matchesStock;
  });

  const lowStockCount = inventory.filter((i) => i.currentStock <= i.minStockAlert && i.currentStock > 0).length;
  const outOfStockCount = inventory.filter((i) => i.currentStock <= 0).length;
  const totalStockValuation = inventory.reduce((sum, i) => sum + i.costPrice * i.currentStock, 0);

  return (
    <div className="flex flex-col gap-5 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Boxes className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              Warehouse &amp; Spares
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight mt-1">
            Product &amp; Equipment Inventory
          </h2>
          <p className="text-xs text-slate-400">
            Real-time stock valuation, SKU tracking, automated re-order thresholds, and movement audits
          </p>
        </div>

        <button
          onClick={onAddItem}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add SKU / Product</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 to-cyan-950/30 border border-cyan-500/20 shadow-md">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Total Inventory Value
          </span>
          <div className="text-xl font-extrabold text-cyan-300 font-mono mt-1">
            {formatCurrency(totalStockValuation)}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">At purchase cost price across {inventory.length} SKUs</p>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 to-amber-950/20 border border-amber-500/20 shadow-md">
          <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider">
            Low Stock Alerts
          </span>
          <div className="text-xl font-extrabold text-amber-300 font-mono mt-1 flex items-center gap-2">
            <span>{lowStockCount}</span>
            {lowStockCount > 0 && <span className="text-xs text-amber-400 font-sans font-medium">Re-order required</span>}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Below minimum emergency threshold</p>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 to-rose-950/20 border border-rose-500/20 shadow-md">
          <span className="text-[11px] font-mono text-rose-400 uppercase tracking-wider">
            Out of Stock Items
          </span>
          <div className="text-xl font-extrabold text-rose-400 font-mono mt-1">
            {outOfStockCount}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Cannot be dispatched until replenished</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search SKU code, brand, model..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto text-xs">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:border-cyan-400 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.replace(/_/g, ' ').toUpperCase()}
              </option>
            ))}
          </select>

          <button
            onClick={() => setStockStatusFilter(stockStatusFilter === 'low_stock' ? 'all' : 'low_stock')}
            className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
              stockStatusFilter === 'low_stock'
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Low Stock ({lowStockCount})
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
              <th className="py-3 px-4">Product / SKU</th>
              <th className="py-3 px-4">Brand &amp; Model</th>
              <th className="py-3 px-4 text-right">Cost Price</th>
              <th className="py-3 px-4 text-right">Selling Price</th>
              <th className="py-3 px-4 text-center">Tax (GST)</th>
              <th className="py-3 px-4 text-center">Stock Level</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-slate-500">
                  <Boxes className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                  <p className="text-sm font-semibold text-slate-400">No inventory products found</p>
                  <p className="text-xs text-slate-500 mt-0.5">Add equipment items, spare parts or cable rolls.</p>
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => {
                const isLow = item.currentStock <= item.minStockAlert && item.currentStock > 0;
                const isOut = item.currentStock <= 0;
                return (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white text-sm">{item.name}</div>
                      <div className="text-[11px] font-mono text-cyan-400 flex items-center gap-1.5 mt-0.5">
                        <span>{item.sku}</span>
                        {item.location && <span className="text-slate-500">· {item.location}</span>}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-300">
                      <div>{item.brand}</div>
                      <div className="text-slate-500 text-[11px] mt-0.5">{item.model}</div>
                    </td>

                    <td className="py-3 px-4 text-right font-mono text-slate-300">
                      {formatCurrency(item.costPrice)}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-400">
                      {formatCurrency(item.sellingPrice)}
                    </td>

                    <td className="py-3 px-4 text-center font-mono text-slate-400">
                      {item.taxPercent}%
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="font-mono text-sm font-bold text-white">
                        {item.currentStock} <span className="text-[10px] text-slate-400">{item.unit}</span>
                      </div>
                      <div className="text-[9px] font-mono text-slate-500 mt-0.5">
                        Min: {item.minStockAlert}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold font-mono ${
                          isOut
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : isLow
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onAdjustStock(item)}
                          title="Adjust Stock Level"
                          className="px-2.5 py-1 rounded-lg bg-cyan-600/20 text-cyan-300 hover:bg-cyan-600 hover:text-white border border-cyan-500/30 text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <ArrowUpDown className="w-3 h-3" />
                          <span>Adjust</span>
                        </button>

                        <button
                          onClick={() => setSelectedItemForHistory(item)}
                          title="Stock Movement Log"
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
                        >
                          <History className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onEditItem(item)}
                          title="Edit Product Details"
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Stock History Audit Modal */}
      {selectedItemForHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="font-mono text-xs text-cyan-400 font-bold">{selectedItemForHistory.sku}</span>
                <h3 className="text-base font-bold text-white mt-0.5">{selectedItemForHistory.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Current: <strong className="text-white">{selectedItemForHistory.currentStock} {selectedItemForHistory.unit}</strong> (Cost: {formatCurrency(selectedItemForHistory.costPrice)})
                </p>
              </div>
              <button
                onClick={() => setSelectedItemForHistory(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-4">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Movement Ledger</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {!selectedItemForHistory.stockHistory || selectedItemForHistory.stockHistory.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">No stock movements recorded yet</p>
                ) : (
                  selectedItemForHistory.stockHistory.map((mov) => (
                    <div
                      key={mov.id}
                      className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                              mov.type === 'in'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : mov.type === 'out'
                                ? 'bg-rose-500/20 text-rose-300'
                                : 'bg-blue-500/20 text-blue-300'
                            }`}
                          >
                            {mov.type}
                          </span>
                          <span className="font-bold text-white">
                            {mov.type === 'in' ? `+${mov.qty}` : mov.type === 'out' ? `-${mov.qty}` : mov.qty} {selectedItemForHistory.unit}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1">
                          Ref: {mov.reference} {mov.notes ? `· ${mov.notes}` : ''}
                        </div>
                      </div>
                      <div className="text-right text-[11px] text-slate-500">
                        <div>{mov.date}</div>
                        <div>{mov.recordedBy}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedItemForHistory(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
