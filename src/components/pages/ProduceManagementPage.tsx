import React, { useState } from 'react';
import { Apple, Plus, Trash2, Search, Filter, X } from 'lucide-react';
import { useSystem } from '../../context/SystemContext';

export const ProduceManagementPage: React.FC = () => {
  const { produceList, addProduce, deleteProduce } = useSystem();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Good' | 'Attention Needed'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Add Produce Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Vegetable');
  const [quantity, setQuantity] = useState<number | ''>(20);
  const [storageDate] = useState('08 Sep 2026');
  const [tempRange, setTempRange] = useState('4°C - 8°C');
  const [humidityRange, setHumidityRange] = useState('85% - 90%');
  const [notes, setNotes] = useState('');

  const filteredProduce = produceList.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalQuantity = produceList.reduce((acc, curr) => acc + Number(curr.quantity), 0);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !quantity) return;

    addProduce({
      name,
      category,
      quantity: Number(quantity),
      storageDate: storageDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      expectedTempRange: tempRange,
      expectedHumidityRange: humidityRange,
      status: 'Good',
      notes: notes || 'Stored in insulated chamber with thermal buffer.',
    });

    // Reset Form
    setName('');
    setQuantity(20);
    setNotes('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Header */}
      <div className="card-3d p-6 bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-200 text-xs font-bold uppercase tracking-wider mb-1">
            <Apple className="w-4 h-4 text-emerald-300" />
            <span>Post-Harvest Quality Preservation</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Fresh Produce Inventory Management
          </h1>
          <p className="text-xs text-emerald-100/90 mt-1">
            Register and monitor vegetable batches stored inside the cold storage chamber
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-3d btn-3d-success text-xs py-2.5 px-4 font-bold flex items-center space-x-2 shrink-0 shadow-lg"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Add New Produce Batch</span>
        </button>
      </div>

      {/* Stats Quick Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-3d p-5 bg-white">
          <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Total Stored Produce</span>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">{totalQuantity}</span>
            <span className="text-sm font-semibold text-slate-500">kg</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">Across {produceList.length} distinct batches</span>
        </div>

        <div className="card-3d p-5 bg-white">
          <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Optimal Status Batches</span>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-3xl font-extrabold text-emerald-600 font-mono">
              {produceList.filter(p => p.status === 'Good').length}
            </span>
            <span className="text-sm font-semibold text-slate-500">/ {produceList.length}</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-1">Preserved at target temperature</span>
        </div>

        <div className="card-3d p-5 bg-white">
          <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">NER Regional Crops</span>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-3xl font-extrabold text-blue-600 font-mono">5</span>
            <span className="text-sm font-semibold text-slate-500">crop types</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">Includes King Chilli & Native Greens</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card-3d p-4 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search produce name or category..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-500">Status:</span>
          {(['All', 'Good', 'Attention Needed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 text-xs rounded-lg font-bold transition-all ${
                statusFilter === st
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Produce Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProduce.map((item) => (
          <div key={item.id} className="card-3d p-5 bg-white flex flex-col justify-between space-y-4 hover:shadow-lg transition-all">
            
            {/* Top row */}
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 uppercase tracking-wider">
                  {item.category}
                </span>
                <h3 className="font-extrabold text-base text-slate-900 mt-1">
                  {item.name}
                </h3>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                item.status === 'Good'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border-amber-300'
              }`}>
                {item.status}
              </span>
            </div>

            {/* Middle Quantity & Storage Date */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Quantity Stored:</span>
                <span className="font-mono font-extrabold text-slate-900 text-sm">{item.quantity} kg</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Storage Date:</span>
                <span className="font-mono text-slate-700">{item.storageDate}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Ideal Condition:</span>
                <span className="font-mono text-blue-700 font-semibold">{item.expectedTempRange} • {item.expectedHumidityRange}</span>
              </div>
            </div>

            {/* Notes */}
            <p className="text-xs text-slate-600 italic bg-blue-50/50 p-2.5 rounded-lg border border-blue-100">
              "{item.notes}"
            </p>

            {/* Action Footer */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">ID: {item.id}</span>
              <button
                onClick={() => deleteProduce(item.id)}
                className="text-slate-400 hover:text-red-600 transition-colors p-1 rounded"
                title="Remove produce item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Add Produce Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="bg-slate-900 p-5 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Apple className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-base">Add New Produce Batch</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Produce Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. King Chilli, Tomatoes, Cabbage"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Nightshades">Nightshades (Tomatoes, Chilli)</option>
                    <option value="Brassica">Brassica (Cabbage, Broccoli)</option>
                    <option value="Legumes">Legumes (Beans, Peas)</option>
                    <option value="Leafy Vegetables">Leafy Vegetables</option>
                    <option value="Roots & Tubers">Roots & Tubers</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Quantity (kg)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium font-mono focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Target Temp Range</label>
                  <input
                    type="text"
                    value={tempRange}
                    onChange={(e) => setTempRange(e.target.value)}
                    placeholder="e.g. 7°C - 10°C"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Target Humidity</label>
                  <input
                    type="text"
                    value={humidityRange}
                    onChange={(e) => setHumidityRange(e.target.value)}
                    placeholder="e.g. 85% - 90%"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Notes / Origin</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Harvest cluster info, moisture sensitivity, packaging notes..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-3d btn-3d-secondary py-2 px-4 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-3d btn-3d-success py-2 px-4 text-white font-bold"
                >
                  Save to Registry
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
