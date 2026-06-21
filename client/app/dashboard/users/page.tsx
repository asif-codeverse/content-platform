"use client";

import { useEffect, useState } from "react";

import {
  getUsers,
  updateUserRole,
} from "@/services/user.service";

import { useAuth } from "@/context/AuthContext";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

export default function UsersPage() {

  const [users, setUsers] =
    useState<User[]>([]);

  const [loading, setLoading] =
    useState(true);

  const { user: currentUser } =
    useAuth();

  const fetchUsers =
    async () => {

      try {

        const response =
          await getUsers();

        setUsers(
          response.data
        );

      } finally {

        setLoading(false);

      }
    };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange =
    async (
      userId: string,
      role: string
    ) => {

      const confirmed =
        window.confirm(
          `Change role to ${role}?`
        );

      if (!confirmed) {
        return;
      }

      await updateUserRole(
        userId,
        role
      );

      fetchUsers();
    };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <main className="p-8">

      <h1 className="text-3xl font-bold mb-6">
        Manage Users
      </h1>

      <table className="w-full border">

        <thead>

          <tr className="border">

            <th className="text-left p-3">
              Name
            </th>

            <th className="text-left p-3">
              Email
            </th>

            <th className="text-left p-3">
              Current Role
            </th>

            <th className="text-left p-3">
              Role Management
            </th>

          </tr>

        </thead>

        <tbody>

          {users.map((user) => (

            <tr
              key={user._id}
              className="border"
            >

              <td className="p-3">{user.name}</td>

              <td className="p-3">{user.email}</td>

              <td className="p-3">

                {user.role === "ADMIN" && (
                  <span className="font-bold ">
                    ADMIN
                  </span>
                )}

                {user.role === "EDITOR" && (
                  <span>
                    EDITOR
                  </span>
                )}

                {user.role === "USER" && (
                  <span>
                    USER
                  </span>
                )}

              </td>

              <td className="p-3">

                {currentUser?._id === user._id ? (

                  <span>
                    Your Account
                  </span>

                ) : user.role === "USER" ? (

                  <button
                    onClick={() =>
                      handleRoleChange(
                        user._id,
                        "EDITOR"
                      )
                    }
                    className="border px-3 py-1 rounded"
                  >
                    Make Editor
                  </button>

                ) : user.role === "EDITOR" ? (

                  <button
                    onClick={() =>
                      handleRoleChange(
                        user._id,
                        "USER"
                      )
                    }
                    className="border px-3 py-1 rounded"
                  >
                    Remove Editor
                  </button>

                ) : (
                  user.role === "ADMIN" && (
                    <span>
                      System Admin
                    </span>
                  )
                )}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </main>
  );
}