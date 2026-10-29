import React, { useState, useEffect } from 'react';
import { InventoryItem, EquipmentType } from '../../types';
import { Boxes, X, Save, Tag } from 'lucide-react';

interface InventoryItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (itemData: Partial<InventoryItem>) => void;
  existingItem?: InventoryItem | null;
}

export const InventoryItemModal: React.FC<InventoryItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingItem,
}) => {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState<string>('cctv_camera');
  const [brand, setBrand] = useState('CP PLUS');
  const [model, setModel] = useState('');
  const [description, setDescription] = useState('');
  const [unit, setUnit] = useState<InventoryItem['unit']>('Nos');
  const [costPrice, setCostPrice] = useState('0');
  const [sellingPrice, setSellingPrice] = useState('0');
  const [taxPercent, setTaxPercent] = useState('18');
  const [hsnCode, setHsnCode] = useState('85258900');
  const [currentStock, setCurrentStock] = useState('0');
  const [minStockAlert, setMinStockAlert] = useState('5');
  const [location, setLocation] = useState('Warehouse Bay 1');

  useEffect(() => {
    if (existingItem) {
      setName(existingItem.name || '');
      setSku(existingItem.sku || '');
      setCategory(existingItem.category || 'cctv_camera');
      setBrand(existingItem.brand || '');
      setModel(existingItem.model || '');
      setDescription(existingItem.description || '');
      setUnit(existingItem.unit || 'Nos');
      setCostPrice((existingItem.costPrice || 0).toString());
      setSellingPrice((existingItem.sellingPrice || 0).toString());
      setTaxPercent((existingItem.taxPercent || 18).toString());
      setHsnCode(existingItem.hsnCode || '85258900');
      setCurrentStock((existingItem.currentStock || 0).toString());
      setMinStockAlert((existingItem.minStockAlert || 5).toString());
      setLocation(existingItem.location || '');
    } else {
      setName('');
      setSku('');
      setCategory('cctv_camera');
      setBrand('CP PLUS');
      setModel('');
      setDescription('');
      setUnit('Nos');
      setCostPrice('0');
      setSellingPrice('0');
      setTaxPercent('18');
      setHsnCode('85258900');
      setCurrentStock('10');
      setMinStockAlert('5');
      setLocation('Warehouse Bay 1');
    }
  }, [existingItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: name.trim(),
      sku: sku.trim().toUpperCase(),
      category,
      brand: brand.trim(),
      model: model.trim(),
      description: description.trim(),
      unit,
      costPrice: parseFloat(costPrice) || 0,
      sellingPrice: parseFloat(sellingPrice) || 0,
      taxPercent: parseFloat(taxPercent) || 18,
      hsnCode: hsnCode.trim(),
      currentStock: parseInt(currentStock, 10) || 0,
      minStockAlert: parseInt(minStockAlert, 10) || 5,
      location: location.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {existingItem ? 'Edit Product / SKU' : 'Add New Inventory SKU'}
              </h3>
              <p className="text-xs text-slate-400">Catalog items, camera models, routers &amp; consumables</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 my-4 text-xs font-sans">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Product Description / Title *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. CP PLUS 4MP IP Bullet Camera"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Unique SKU Code *</label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value.toUpperCase())}
                placeholder="e.g. CP-UNC-TA41L3"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
              >
                <option value="cctv_camera">CCTV Camera</option>
                <option value="nvr_dvr">NVR / DVR System</option>
                <option value="networking_switch">Network Switch</option>
                <option value="wifi_ap">Wi-Fi Access Point</option>
                <option value="server_rack">Server Rack / Cabinet</option>
                <option value="biometric_punch">Biometric Machine</option>
                <option value="desktop_pc">Desktop PC &amp; Spares</option>
                <option value="laptop">Laptop Components</option>
                <option value="epabx_system">EPABX / Intercom</option>
                <option value="cables">Cabling &amp; Patch Cords</option>
                <option value="general_hardware">General Hardware</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Brand / Manufacturer *</label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. CP PLUS / D-Link / Matrix"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Model Number</label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. CP-UNC-TA41L3-DPS"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Cost Price (₹) *</label>
              <input
                type="number"
                step="any"
                required
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                placeholder="2200"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Selling Price (₹) *</label>
              <input
                type="number"
                step="any"
                required
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                placeholder="3200"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-bold text-emerald-400 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">GST Tax Rate (%)</label>
              <select
                value={taxPercent}
                onChange={(e) => setTaxPercent(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none"
              >
                <option value="18">18% (Hardware/IT)</option>
                <option value="12">12%</option>
                <option value="28">28%</option>
                <option value="5">5%</option>
                <option value="0">0% (Exempt)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Unit of Measure</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
              >
                <option value="Nos">Numbers (Nos)</option>
                <option value="Pcs">Pieces (Pcs)</option>
                <option value="Boxes">Boxes / Rolls</option>
                <option value="Meters">Meters (Mtr)</option>
                <option value="Sets">Complete Sets</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Current Stock Qty</label>
              <input
                type="number"
                value={currentStock}
                onChange={(e) => setCurrentStock(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-bold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Min Stock Alert Level</label>
              <input
                type="number"
                value={minStockAlert}
                onChange={(e) => setMinStockAlert(e.target.value)}
                placeholder="5"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">HSN / SAC Code</label>
              <input
                type="text"
                value={hsnCode}
                onChange={(e) => setHsnCode(e.target.value)}
                placeholder="85258900"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Warehouse Storage Shelf / Bay</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Ground Floor Rack A-1"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-1.5 shadow-md shadow-cyan-500/25 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{existingItem ? 'Update Product' : 'Save to Inventory'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
