// components/Header.tsx
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white border-b shadow-sm ml-0 md:ml-64">
      <div className="text-lg font-semibold text-gray-700">Unified Social Insights</div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">{user?.email || 'Logged in'}</span>
{/* <img src={user?.picture || '/default-avatar.png'} alt="Avatar" className="w-8 h-8 rounded-full" /> */}
</div>
    </header>
  );
}
