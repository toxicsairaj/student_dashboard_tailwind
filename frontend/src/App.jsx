import React, { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });
  const [editId, setEditId] = useState(null);

  // Load students
  async function load() {
    const r = await axios.get(API + "/students");
    setStudents(r.data);
  }

  // Add or Update
  async function save() {
    if (!form.name || !form.email) return;

    if (editId) {
      // UPDATE
      await axios.put(API + "/students/" + editId, form);
    } else {
      // ADD
      await axios.post(API + "/students", form);
    }

    setForm({ name: "", email: "" });
    setEditId(null);
    load();
  }

  // Edit button clicked
  function startEdit(st) {
    setForm({ name: st.name, email: st.email });
    setEditId(st._id);
  }

  // Delete student
  async function remove(id) {
    await axios.delete(API + "/students/" + id);
    load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">
        Student Dashboard
      </h1>

      {/* Form */}
      <div className="bg-white shadow p-6 rounded mb-6">
        <h2 className="text-xl font-semibold mb-3">
          {editId ? "Edit Student" : "Add Student"}
        </h2>

        <div className="flex gap-3">
          <input
            className="input input-bordered w-full"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="input input-bordered w-full"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <button className="btn btn-primary" onClick={save}>
            {editId ? "Update" : "Add"}
          </button>

          {editId && (
            <button
              className="btn btn-outline"
              onClick={() => {
                setEditId(null);
                setForm({ name: "", email: "" });
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white shadow p-6 rounded">
        <h2 className="text-xl font-semibold mb-3">Students List</h2>

        <table className="table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s) => (
              <tr key={s._id}>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td className="flex gap-2 justify-center">
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => startEdit(s)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => remove(s._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
