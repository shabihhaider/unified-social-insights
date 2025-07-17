// src/pages/ManageAccounts.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';
import { Loader2, Trash } from 'lucide-react';

interface LinkedAccount {
  id: string;
  page_id: string;
  page_name: string;
  instagram_account_id: string;
  created_at: string;
}

const ManageAccounts = () => {
  const { token } = useAuth();
  const [accounts, setAccounts] = useState<LinkedAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await axios.get<{ accounts: LinkedAccount[] }>('/api/auth/linked-accounts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAccounts(res.data.accounts);
      } catch (err) {
        console.error('Failed to load linked accounts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [token]);

  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold mb-4">📌 Linked Instagram Accounts</h1>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="animate-spin" />
          Loading accounts...
        </div>
      ) : accounts.length === 0 ? (
        <p className="text-gray-500">No accounts linked yet.</p>
      ) : (
        <ul className="space-y-4">
          {accounts.map((acc) => (
            <li
              key={acc.id}
              className="p-4 border dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {acc.page_name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Instagram ID: {acc.instagram_account_id}
                  </p>
                </div>

                <button className="text-red-500 hover:text-red-600">
                  <Trash size={18} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default ManageAccounts;
