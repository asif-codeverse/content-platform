"use client";

import { useEffect, useState } from "react";

import {
  Shield,
  UserCog,
  UserMinus,
} from "lucide-react";

import {
  getUsers,
  updateUserRole,
} from "@/services/user.service";

import { useAuth } from "@/context/AuthContext";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const { user: currentUser } = useAuth();

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await getUsers();

      setUsers(response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (
    userId: string,
    role: string
  ) => {
    const confirmed = window.confirm(
      `Change role to ${role}?`
    );

    if (!confirmed) return;

    await updateUserRole(userId, role);

    fetchUsers();
  };

  if (loading) {
    return (
      <LoadingSpinner text="Loading users..." />
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Manage Users"
        description="Manage user roles and platform permissions."
      />

      {users.length === 0 ? (
        <EmptyState
          title="No Users Found"
          description="There are no registered users."
        />
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th className="text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="font-medium">
                  {user.name}
                </td>

                <td>{user.email}</td>

                <td>
                  <StatusBadge
                    status={user.role}
                  />
                </td>

                <td className="text-right">
                  {currentUser?._id ===
                    user._id ? (
                    <span
                      className="
                        text-sm
                        font-medium
                        text-[var(--muted)]
                      "
                    >
                      Your Account
                    </span>
                  ) : user.role === "USER" ? (
                    <Button
                      variant="success"
                      onClick={() =>
                        handleRoleChange(
                          user._id,
                          "EDITOR"
                        )
                      }
                    >
                      <span className="flex items-center gap-2">
                        <UserCog size={16} />
                        Make Editor
                      </span>
                    </Button>
                  ) : user.role ===
                    "EDITOR" ? (
                    <Button
                      variant="danger"
                      onClick={() =>
                        handleRoleChange(
                          user._id,
                          "USER"
                        )
                      }
                    >
                      <span className="flex items-center gap-2">
                        <UserMinus size={16} />
                        Remove Editor
                      </span>
                    </Button>
                  ) : (
                    <span
                      className="
                        inline-flex
                        items-center
                        gap-2
                        text-sm
                        font-medium
                      "
                    >
                      <Shield size={16} />
                      System Admin
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}