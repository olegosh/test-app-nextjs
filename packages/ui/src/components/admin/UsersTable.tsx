import { cacheLife, cacheTag } from 'next/cache';
import { DUMMYJSON_USERS_URL } from '@product-portal/constants';

interface DummyUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  role: string;
}

interface UsersResponse {
  users: DummyUser[];
}

export async function UsersTable() {
  'use cache';
  cacheLife('minutes');
  cacheTag('admin-users');

  const res = await fetch(DUMMYJSON_USERS_URL);
  const data: UsersResponse = await res.json();

  console.log(`[PPR] UsersTable fetched at ${new Date().toISOString()} — cache: minutes`);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-900">Users</h2>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
          cache: minutes
        </span>
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs">
            <tr>
              <th className="text-left px-4 py-2.5 font-medium">User</th>
              <th className="text-left px-4 py-2.5 font-medium">Email</th>
              <th className="text-left px-4 py-2.5 font-medium">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={user.image}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-7 h-7 rounded-full"
                    />
                    <span className="font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-gray-500">{user.email}</td>
                <td className="px-4 py-2.5">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 capitalize">
                    {user.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
