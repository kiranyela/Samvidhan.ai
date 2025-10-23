import { useEffect, useState } from 'react';
import api from '../lib/api';

export default function AdminDashboard() {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchNgos = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/v1/admin/ngos', { params: { verified: false } });
      const raw = res?.data?.data;
      const list = Array.isArray(raw) ? raw : [];
      setNgos(list);
    } catch (e) {
      setError('Failed to load NGOs');
    } finally {
      setLoading(false);
    }
  };

  const verifyNgo = async (id) => {
    try {
      await api.post(`/v1/admin/ngos/${id}/verify`);
      await fetchNgos();
      alert('NGO verified');
    } catch (e) {
      alert('Failed to verify NGO');
    }
  };

  useEffect(() => { fetchNgos(); }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto bg-white border rounded-xl p-4">
        <h1 className="text-xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-sm text-gray-600 mb-4">Unverified NGOs</p>
        {loading && (<div>Loading...</div>)}
        {error && (<div className="text-red-600">{error}</div>)}
        <div className="divide-y">
          {Array.isArray(ngos) && ngos.map(n => (
            <div key={n._id} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">{n.ngoName}</div>
                <div className="text-sm text-gray-600">{n.email}</div>
                <div className="text-xs text-gray-500">Reg#: {n.registrationNumber}</div>
              </div>
              <button onClick={() => verifyNgo(n._id)} className="px-3 py-1.5 bg-emerald-600 text-white rounded-md hover:bg-emerald-700">Verify</button>
            </div>
          ))}
          {!loading && Array.isArray(ngos) && ngos.length === 0 && (
            <div className="py-6 text-gray-600 text-sm">No unverified NGOs</div>
          )}
        </div>
      </div>
    </main>
  );
}
