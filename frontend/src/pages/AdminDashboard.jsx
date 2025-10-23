import { useEffect, useState } from 'react';
import api from '../lib/api';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/v1/admin/users', { params: { verified: false } });
      const raw = res?.data?.data;
      const list = Array.isArray(raw) ? raw : [];
      setUsers(list);
    } catch (e) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const verifyUser = async (id) => {
    try {
      await api.post(`/v1/admin/users/${id}/verify`);
      await fetchUsers();
      alert('User verified');
    } catch (e) {
      alert('Failed to verify user');
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto bg-white border rounded-xl p-4">
        <h1 className="text-xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-sm text-gray-600 mb-4">Unverified users</p>
        {loading && (<div>Loading...</div>)}
        {error && (<div className="text-red-600">{error}</div>)}
        <div className="divide-y">
          {Array.isArray(users) && users.map(u => (
            <div key={u._id} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">{u.fullName}</div>
                <div className="text-sm text-gray-600">{u.email}</div>
              </div>
              <button onClick={() => verifyUser(u._id)} className="px-3 py-1.5 bg-emerald-600 text-white rounded-md hover:bg-emerald-700">Verify</button>
            </div>
          ))}
          {!loading && Array.isArray(users) && users.length === 0 && (
            <div className="py-6 text-gray-600 text-sm">No unverified users</div>
          )}
        </div>
      </div>
    </main>
  );
}
