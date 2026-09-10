import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Search, Store as StoreIcon } from 'lucide-react';

export const ExploreView: React.FC = () => {
  const navigate = useNavigate();
  const { products, stores, lang, t } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: lang === 'ar' ? 'الكل' : 'All' },
    { id: 'عطور ومستحضرات', name: lang === 'ar' ? 'عطور وبخور' : 'Perfumes' },
    { id: 'أزياء وموضة', name: lang === 'ar' ? 'أزياء وموضة' : 'Fashion' },
    { id: 'أغذية ومشروبات', name: lang === 'ar' ? 'قهوة وأغذية' : 'Coffee' },
    { id: 'إلكترونيات وهواتف', name: lang === 'ar' ? 'إلكترونيات' : 'Tech' }
  ];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  const filteredStores = stores.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-4 py-3 space-y-5 pb-12 sm:pb-16">
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-neutral-400">
          <Search className="w-4 h-4" />
        </div>
        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder={t.searchPlaceholder} className="w-full ps-10 pe-4 py-2.5 text-xs bg-neutral-100 hover:bg-neutral-200/60 focus:bg-white border border-transparent focus:border-blue-600 rounded-xl outline-none transition-all text-black" />
      </div>
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map(cat => (
          <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${selectedCategory === cat.id ? 'bg-blue-600 text-white shadow-xs' : 'bg-neutral-100 text-black hover:bg-neutral-200'}`}>{cat.name}</button>
        ))}
      </div>
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xs text-black flex items-center gap-1.5"><StoreIcon className="w-4 h-4 text-blue-600" /><span>{lang === 'ar' ? 'المتاجر الموثقة' : 'Verified Stores'}</span></h3>
          <span className="text-[10px] text-neutral-500">{filteredStores.length} {lang === 'ar' ? 'متجر' : 'stores'}</span>
        </div>
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
          {filteredStores.map(store => (
            <div key={store.id} onClick={() => navigate(`/store/${store.id}`)} className="bg-white p-3 rounded-2xl border border-neutral-200/90 shadow-xs flex flex-col items-center text-center shrink-0 w-36 cursor-pointer hover:border-blue-300 transition-all hover:-translate-y-0.5">
              <div className="w-14 h-14 rounded-full p-[2px] story-ring mb-2"><img src={store.avatar} alt={store.name} className="w-full h-full rounded-full object-cover p-[1px] bg-white" /></div>
              <h4 className="text-xs font-bold text-black truncate w-full flex items-center justify-center gap-1"><span>{lang === 'ar' ? store.name : store.nameEn}</span>{store.verified && <span className="text-blue-500 text-[10px]">✓</span>}</h4>
              <p className="text-[10px] text-neutral-500 font-mono mt-0.5">@{store.username}</p>
              <span className="mt-2 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">{lang === 'ar' ? 'زيارة المتجر' : 'Visit'}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-2 pt-2">
        <h3 className="font-bold text-xs text-black">{lang === 'ar' ? 'أحدث المعروضات والمنتجات' : 'Explore Catalog Drops'}</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 sm:gap-2 rounded-2xl overflow-hidden">
          {filteredProducts.map(product => (
            <div key={product.id} onClick={() => navigate(`/product/${product.id}`)} className="relative aspect-square bg-neutral-100 cursor-pointer overflow-hidden group select-none">
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs p-1 text-center"><span>{product.price} {product.currency}</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
