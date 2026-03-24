"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type UserItem = {
  id: string;
  fullName: string;
  email: string;
  role: "USER" | "ADMIN" | "SUPERADMIN";
  isActive: boolean;
};

type UsersResponse = {
  success: boolean;
  users: UserItem[];
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadUsers() {
    try {
      const response = await apiFetch<UsersResponse>("/users", {
        method: "GET",
        auth: true,
      });
      setUsers(response.users || []);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function changeRole(userId: string, role: "USER" | "ADMIN" | "SUPERADMIN") {
    try {
      await apiFetch(`/users/${userId}/role`, {
        method: "PATCH",
        auth: true,
        body: JSON.stringify({ role }),
      });
      loadUsers();
    } catch (error) {
      console.error("Failed to update role:", error);
    }
  }

  return (
    <main className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-neutral-950">Manage Users</h1>
      <p className="mt-2 text-sm text-neutral-500">
        View users and update roles.
      </p>

      <div className="mt-6 space-y-4">
        {loading ? (
          <p className="text-sm text-neutral-500">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-sm text-neutral-500">No users found.</p>
        ) : (
          users.map((item) => (
            <div
              key={item.id}
              className="rounded-[1.5rem] border border-black/5 bg-neutral-50 p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-base font-semibold text-neutral-950">
                    {item.fullName}
                  </p>
                  <p className="mt-1 text-sm text-neutral-600">{item.email}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.12em] text-neutral-500">
                    {item.role} {item.isActive ? "• Active" : "• Inactive"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {["USER", "ADMIN", "SUPERADMIN"].map((role) => (
                    <button
                      key={role}
                      onClick={() =>
                        changeRole(item.id, role as "USER" | "ADMIN" | "SUPERADMIN")
                      }
                      className={`rounded-full px-4 py-2 text-xs font-medium ${
                        item.role === role
                          ? "bg-neutral-950 text-white"
                          : "border border-black/10 bg-white text-neutral-700"
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}