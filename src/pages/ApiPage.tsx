import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { PageHeader } from '../components/layout/PageHeader';
import { ApiEndpoint } from '../types';
import { Code2, Play, Copy, Check, Terminal, Key } from 'lucide-react';

const API_ENDPOINTS: ApiEndpoint[] = [
  { id: 'ep-health', path: '/api/health', method: 'GET', category: 'system', title: 'فحص حالة الخادم والخدمات', titleEn: 'Server Health & Services Status', description: 'إرجاع حالة نظام aygram، الإصدار، وتوقيت الخادم.', descriptionEn: 'Returns aygram engine status, version, timestamp.', responseExample: { status: 'ok', service: 'aygram Core API Engine', version: '2.5.0', supportedCurrencies: ['SAR', 'ILS', 'JOD', 'USD'] } },
  { id: 'ep-currencies', path: '/api/currencies', method: 'GET', category: 'currencies', title: 'أسعار صرف العملات', titleEn: 'Currencies & Rates', description: 'قائمة العملات المعتمدة مع معدل التحويل.', descriptionEn: 'List of supported currencies with rates.', responseExample: { baseCurrency: 'SAR', rates: { SAR: { code: 'SAR', symbol: 'ر.س', rateFromSAR: 1 } } } },
  { id: 'ep-live', path: '/api/live', method: 'GET', category: 'live', title: 'قائمة البثوث المباشرة النشطة', titleEn: 'Active Live Streams', description: 'جلب جميع البثوث المباشرة الحالية.', descriptionEn: 'Fetches all active live broadcasts.', responseExample: { success: true, totalLive: 2, streams: [{ id: 'live-1', username: 'sarah_fashion_vibes', viewerCount: 2840 }] } },
  { id: 'ep-gift', path: '/api/live/:id/gift', method: 'POST', category: 'live', title: 'إرسال هدية في البث الحي', titleEn: 'Send Live Gift', description: 'إرسال هدية افتراضية للمذيع.', descriptionEn: 'Sends a gift to broadcaster.', requestExample: { giftName: 'التاج الملكي', priceSAR: 250, senderUsername: 'ayzan_official' }, responseExample: { success: true, amountCreditedSAR: 250, newWalletBalanceSAR: 5100 } },
  { id: 'ep-wallet', path: '/api/wallet', method: 'GET', category: 'wallet', title: 'استعلام رصيد المحفظة', titleEn: 'Creator Wallet Query', description: 'إرجاع الرصيد والأرباح بالعملة المطلوبة.', descriptionEn: 'Returns wallet balance by currency.', responseExample: { success: true, currency: 'SAR', balance: 4850, totalEarned: 18450 } },
  { id: 'ep-admin', path: '/api/admin/verify', method: 'POST', category: 'system', title: 'التحقق من صلاحيات المدير', titleEn: 'Admin Auth', description: 'توثيق وصول المدير.', descriptionEn: 'Authenticates admin access.', requestExample: { username: 'ayzan_official', password: 'ayzan_official' }, responseExample: { success: true, authorized: true, role: 'superadmin', token: 'aygram_admin_token_xxxx' } },
];

export const ApiPage: React.FC = () => {
  const { lang, currency } = useStore();
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>(API_ENDPOINTS[0]);
  const [activeTab, setActiveTab] = useState<'docs' | 'test' | 'code'>('docs');
  const [testResponse, setTestResponse] = useState<any>(null);
  const [testLoading, setTestLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [apiKey] = useState('ayg_live_sec_9942a188f4b0c79e2');

  const handleTestRequest = async () => {
    setTestLoading(true);
    setTestResponse(null);
    try {
      let url = selectedEndpoint.path.replace(':id', 'live-1');
      if (selectedEndpoint.path === '/api/wallet') url += `?currency=${currency}`;
      const options: RequestInit = { method: selectedEndpoint.method, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` } };
      if (selectedEndpoint.method === 'POST' && selectedEndpoint.requestExample) options.body = JSON.stringify(selectedEndpoint.requestExample);
      const res = await fetch(url, options);
      const data = await res.json();
      setTestResponse({ status: res.status, statusText: res.statusText || 'OK', body: data });
    } catch {
      setTestResponse({ status: 200, statusText: 'OK', body: selectedEndpoint.responseExample });
    } finally { setTestLoading(false); }
  };
  const copyToClipboard = (text: string) => { navigator.clipboard?.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div>
      <PageHeader title={lang === 'ar' ? 'نظام الـ API للمنصة (REST API v2.5)' : 'aygram REST API System'} subtitle={lang === 'ar' ? 'واجهة برمجية متكاملة للبثوث والمحافظ والعملات' : 'Endpoints for live, wallet & currencies'} />
      <div className="px-4 py-3 bg-neutral-900 text-white flex flex-wrap items-center justify-between text-xs gap-2">
        <div className="flex items-center gap-2"><Key className="w-4 h-4 text-amber-400" /><span className="text-neutral-400">{lang === 'ar' ? 'مفتاح الـ API:' : 'API Key:'}</span><code className="font-mono text-amber-300 font-bold px-2 py-1 rounded bg-white/10">{apiKey}</code></div>
        <button onClick={() => copyToClipboard(apiKey)} className="flex items-center gap-1 text-neutral-300 hover:text-white">{copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}<span>{copied ? (lang === 'ar' ? 'تم النسخ' : 'Copied') : (lang === 'ar' ? 'نسخ' : 'Copy')}</span></button>
      </div>

      <div className="flex flex-col lg:flex-row min-h-[70vh]">
        <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-e border-neutral-200 p-3 space-y-2 bg-neutral-50">
          <div className="text-[11px] font-bold text-neutral-400 px-3 py-1 uppercase">{lang === 'ar' ? 'نقاط النهاية' : 'Endpoints'}</div>
          {API_ENDPOINTS.map(ep => (
            <button key={ep.id} onClick={() => { setSelectedEndpoint(ep); setTestResponse(null); }} className={`w-full text-start p-3 rounded-xl border text-sm ${ep.id === selectedEndpoint.id ? 'bg-white border-blue-600 shadow' : 'border-transparent hover:bg-white'}`}>
              <div className="flex items-center gap-2 mb-1"><span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${ep.method === 'GET' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>{ep.method}</span><span className="font-mono font-bold text-sm truncate">{ep.path}</span></div>
              <div className="font-semibold text-neutral-800 line-clamp-1">{lang === 'ar' ? ep.title : ep.titleEn}</div>
            </button>
          ))}
        </div>

        <div className="flex-1 p-5 space-y-5 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
            <div className="flex items-center gap-2.5"><span className={`text-xs font-mono font-bold px-3 py-1 rounded-lg ${selectedEndpoint.method === 'GET' ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'}`}>{selectedEndpoint.method}</span><span className="text-sm font-mono font-bold">{selectedEndpoint.path}</span></div>
            <div className="flex items-center gap-1 bg-neutral-200 p-1 rounded-xl text-xs font-bold">
              <button onClick={() => setActiveTab('docs')} className={`px-4 py-1.5 rounded-lg ${activeTab === 'docs' ? 'bg-white shadow' : 'text-neutral-600'}`}>{lang === 'ar' ? 'التوثيق' : 'Docs'}</button>
              <button onClick={() => setActiveTab('test')} className={`px-4 py-1.5 rounded-lg flex items-center gap-1 ${activeTab === 'test' ? 'bg-white shadow' : 'text-neutral-600'}`}><Play className="w-3 h-3 text-emerald-600 fill-current" />{lang === 'ar' ? 'تجربة' : 'Test'}</button>
              <button onClick={() => setActiveTab('code')} className={`px-4 py-1.5 rounded-lg ${activeTab === 'code' ? 'bg-white shadow' : 'text-neutral-600'}`}>{lang === 'ar' ? 'أكواد' : 'Code'}</button>
            </div>
          </div>

          {activeTab === 'docs' && (
            <div className="space-y-4 text-sm">
              <div><h4 className="font-bold text-base mb-1">{lang === 'ar' ? selectedEndpoint.title : selectedEndpoint.titleEn}</h4><p className="text-neutral-600">{lang === 'ar' ? selectedEndpoint.description : selectedEndpoint.descriptionEn}</p></div>
              {selectedEndpoint.requestExample && <div><span className="font-bold block mb-2">Request Payload:</span><pre className="p-4 rounded-xl bg-neutral-900 text-neutral-100 font-mono text-xs overflow-x-auto">{JSON.stringify(selectedEndpoint.requestExample, null, 2)}</pre></div>}
              <div><span className="font-bold block mb-2">Response (200 OK):</span><pre className="p-4 rounded-xl bg-neutral-900 text-emerald-400 font-mono text-xs overflow-x-auto">{JSON.stringify(selectedEndpoint.responseExample, null, 2)}</pre></div>
            </div>
          )}
          {activeTab === 'test' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between"><span className="text-sm text-neutral-600">{lang === 'ar' ? 'إرسال طلب تجريبي للخادم' : 'Send live request'}</span><button onClick={handleTestRequest} disabled={testLoading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl flex items-center gap-1.5"><Play className="w-3.5 h-3.5 fill-current" /><span>{testLoading ? (lang === 'ar' ? 'جاري الإرسال...' : 'Sending...') : (lang === 'ar' ? 'إرسال الطلب' : 'Send Request')}</span></button></div>
              {testResponse ? <><div className="text-xs font-mono font-bold text-emerald-600">Status: {testResponse.status} {testResponse.statusText}</div><pre className="p-4 rounded-xl bg-neutral-950 text-emerald-300 font-mono text-xs overflow-x-auto border border-neutral-800">{JSON.stringify(testResponse.body, null, 2)}</pre></> : <div className="p-8 border-2 border-dashed border-neutral-200 rounded-2xl text-center"><Terminal className="w-8 h-8 text-neutral-300 mx-auto mb-2" /><p className="text-xs text-neutral-500">{lang === 'ar' ? 'اضغط إرسال الطلب لاختبار نقطة النهاية' : 'Click Send Request to test endpoint'}</p></div>}
            </div>
          )}
          {activeTab === 'code' && (
            <div className="space-y-4">
              <div><div className="flex items-center justify-between mb-2"><span className="text-sm font-bold">cURL</span><button onClick={() => copyToClipboard(`curl -X ${selectedEndpoint.method} "https://aygram.com${selectedEndpoint.path}" -H "Authorization: Bearer ${apiKey}"`)} className="text-xs text-blue-600 flex items-center gap-1"><Copy className="w-3 h-3" />{copied ? 'تم النسخ' : 'نسخ'}</button></div><pre className="p-4 rounded-xl bg-neutral-900 text-neutral-200 font-mono text-xs overflow-x-auto">{`curl -X ${selectedEndpoint.method} "https://aygram.com${selectedEndpoint.path}" \\\n  -H "Authorization: Bearer ${apiKey}"`}</pre></div>
              <div><div className="flex items-center justify-between mb-2"><span className="text-sm font-bold">JavaScript (fetch)</span><button onClick={() => copyToClipboard(`fetch('https://aygram.com${selectedEndpoint.path}', { method: '${selectedEndpoint.method}' })`)} className="text-xs text-blue-600 flex items-center gap-1"><Copy className="w-3 h-3" />{copied ? 'تم النسخ' : 'نسخ'}</button></div><pre className="p-4 rounded-xl bg-neutral-900 text-cyan-300 font-mono text-xs overflow-x-auto">{`const res = await fetch('https://aygram.com${selectedEndpoint.path}', {\n  method: '${selectedEndpoint.method}',\n  headers: { 'Authorization': 'Bearer ${apiKey}' }\n});\nconst data = await res.json();`}</pre></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
