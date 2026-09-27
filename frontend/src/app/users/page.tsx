"use client";

// --------------------------------------------------
// SMART TASK MANAGER - USERS PAGE
// --------------------------------------------------

import React, { useEffect, useState, useCallback } from "react";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { Navbar } from "../../components/Navbar";
import { Loading } from "../../components/Loading";
import { getUsers } from "../../services/api";
import { User } from "../../types";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getUsers();
      if (res.users) {
        setUsers(res.users);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load users";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Team Users</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Registered users available for task assignments.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center justify-between"
            >
              <span>{error}</span>
              <button
                type="button"
                onClick={fetchUsers}
                className="font-medium underline"
              >
                Retry
              </button>
            </div>
          )}

          {loading ? (
            <Loading message="Loading users list..." />
          ) : users.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
              <p className="text-slate-500 text-sm">No registered users found.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                    <tr>
                      <th scope="col" className="px-6 py-3.5">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3.5">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3.5">
                        User ID
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50 transition">
                        <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs flex items-center justify-center border border-blue-200">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <span>{u.name}</span>
                        </td>
                        <td className="px-6 py-4 text-slate-600 font-mono text-xs">
                          {u.email}
                        </td>
                        <td className="px-6 py-4 text-slate-400 font-mono text-xs">
                          #{u.id}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
