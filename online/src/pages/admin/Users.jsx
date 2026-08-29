// import Table from "../../components/Table";
// import StatusBadge from "../../components/StatusBadge";

// const Users = () => {

//   const users = [
//     {
//       id: "U001",
//       name: "Rahul Sharma",
//       email: "rahul@example.com",
//       role: "applicant",
//       status: "VERIFIED",
//     },
//     {
//       id: "U002",
//       name: "Amit Patel",
//       email: "amit@example.com",
//       role: "inspector",
//       status: "VERIFIED",
//     },
//   ];

//   const columns = [
//     { key: "id", label: "ID" },
//     { key: "name", label: "Name" },
//     { key: "email", label: "Email" },
//     { key: "role", label: "Role" },
//     { key: "status", label: "Status" },
//   ];

//   return (
//     <div className="p-6">

//       <h1 className="text-2xl font-bold">
//         Users
//       </h1>

//       <p className="text-gray-500 mb-6">
//         Manage registered users.
//       </p>

//       <Table
//         columns={columns}
//         data={users}
//         renderRow={(user) => (

//           <tr key={user.id} className="border-b">

//             <td className="px-5 py-4">
//               {user.id}
//             </td>

//             <td className="px-5 py-4 font-medium">
//               {user.name}
//             </td>

//             <td className="px-5 py-4">
//               {user.email}
//             </td>

//             <td className="px-5 py-4 capitalize">
//               {user.role}
//             </td>

//             <td className="px-5 py-4">
//               <StatusBadge status={user.status} />
//             </td>

//           </tr>

//         )}
//       />

//     </div>
//   );
// };

// export default Users;

import { useEffect, useState } from "react";

import Table from "../../components/Table";
import StatusBadge from "../../components/StatusBadge";

import { TableSkeleton } from "../../components/Skeleton";
import { createAdminUser, getAdminUsers } from "../../services/adminApi";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", phone: "", password: "" });

  // ============================================
  // GET ALL USERS
  // ============================================
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminUsers();
      setUsers(Array.isArray(data) ? data : data?.users || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (event) => {
    event.preventDefault();
    try {
      setCreating(true);
      setError("");
      await createAdminUser({ ...newUser, role: "APPLICANT" });
      setNewUser({ name: "", email: "", phone: "", password: "" });
      setShowCreateForm(false);
      await fetchUsers();
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Unable to create applicant");
    } finally {
      setCreating(false);
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "role", label: "Role" },
    { key: "status", label: "Status" },
  ];

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <h1 className="text-2xl font-bold">Applicants</h1>
        {/* <button type="button" onClick={() => setShowCreateForm((current) => !current)} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          {showCreateForm ? "Close" : "Create applicant"}
        </button> */}
      </div>

      <p className="text-gray-500 mb-6">
        Manage applicants and create applicant accounts.
      </p>

      {showCreateForm && (
        <form onSubmit={handleCreateUser} className="mb-6 grid grid-cols-1 gap-4 rounded-xl border bg-white p-5 md:grid-cols-2">
          {[["name", "Name"], ["email", "Email"], ["phone", "Phone"], ["password", "Password"]].map(([name, label]) => (
            <input key={name} name={name} type={name === "password" ? "password" : "text"} placeholder={label} value={newUser[name]} onChange={(event) => setNewUser((current) => ({ ...current, [name]: event.target.value }))} required={name !== "phone"} className="rounded-lg border px-4 py-3" />
          ))}
          <select value={newUser.role} onChange={(event) => setNewUser((current) => ({ ...current, role: event.target.value }))} className="rounded-lg border px-4 py-3">
            <option value="APPLICANT">Applicant</option>
            <option value="INSPECTOR">Inspector</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button disabled={creating} className="rounded-lg bg-emerald-600 px-4 py-3 font-medium text-white disabled:opacity-60">
            {creating ? "Creating..." : "Create applicant"}
          </button>
        </form>
      )}

      {/* LOADING */}
      {loading && <TableSkeleton columns={6} />}

      {/* ERROR */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
          <p>{error}</p>

          <button
            onClick={fetchUsers}
            className="mt-2 text-blue-600 underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* EMPTY */}
      {!loading &&
        !error &&
        users.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">
              No applicants found.
            </p>
          </div>
        )}

      {/* TABLE */}
      {!loading &&
        !error &&
        users.length > 0 && (
          <Table
            columns={columns}
            data={users}
            renderRow={(user) => (
              <tr
                key={user.id}
                className="border-b hover:bg-gray-50"
              >
                <td className="px-5 py-4">
                  {user.id}
                </td>

                <td className="px-5 py-4 font-medium">
                  {user.name}
                </td>

                <td className="px-5 py-4">
                  {user.email}
                </td>

                <td className="px-5 py-4">
                  {user.phone || "-"}
                </td>

                <td className="px-5 py-4 capitalize">
                  {user.role?.toLowerCase() || "-"}
                </td>

                <td className="px-5 py-4">
                  <StatusBadge
                    status={
                      user.active
                        ? "ACTIVE"
                        : "INACTIVE"
                    }
                  />
                </td>
              </tr>
            )}
          />
        )}

    </div>
  );
};

export default Users;