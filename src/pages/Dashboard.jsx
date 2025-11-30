import { useState, useEffect } from "react";


export default function DealerDashboard() {
  const [dealers, setDealers] = useState([
    { id: 1, name: "Rohan", location: "Delhi", contact: "9876543210", status: "Active" },
    { id: 2, name: "CarPoint", location: "Noida", contact: "9123456780", status: "Inactive" },
    { id: 3, name: "Bobby", location: "Gurgaon", contact: "9988776655", status: "Active" }
  ]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalData, setModalData] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const itemsPerPage = 10;

  // Derived filtered + sorted dealers
  const filteredDealers = dealers
    .filter((d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.location.toLowerCase().includes(search.toLowerCase())
    )
    .filter((d) => (statusFilter === "All" ? true : d.status === statusFilter))
    .sort((a, b) =>
      sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );

  const totalPages = Math.ceil(filteredDealers.length / itemsPerPage);
  const paginatedDealers = filteredDealers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const openModal = (dealer, mode) => {
    setModalData(dealer);
    setModalMode(mode);
  };

  const closeModal = () => {
    setModalData(null);
    setModalMode(null);
  };

  const updateDealer = (updated) => {
    setDealers((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    closeModal();
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white p-6 hidden md:block">
        <h2 className="text-xl font-bold mb-6">Dealer Dashboard</h2>
        <ul className="space-y-4">
          <li className="cursor-pointer">Dashboard</li>
          <li className="cursor-pointer">Dealers</li>
          <li className="cursor-pointer">Settings</li>
        </ul>
      </aside>

      <main className="flex-1 p-6">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Dealers</h1>
        </header>

        {/* Search + Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <input
            placeholder="Search by name or location..."
            className="p-2 border rounded w-60"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="p-2 border rounded"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>

          <button
            onClick={toggleSort}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Sort by Name ({sortOrder})
          </button>
        </div>

        {/* Dealer Table */}
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="w-full border-collapse">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Location</th>
                <th className="p-3 border">Contact</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedDealers.map((d) => (
                <tr key={d.id} className="text-center border-b">
                  <td className="p-2">{d.name}</td>
                  <td className="p-2">{d.location}</td>
                  <td className="p-2">{d.contact}</td>
                  <td className="p-2">{d.status}</td>
                  <td className="p-2 space-x-2 space-y-2">
                    <button
                      className="px-3 py-1 bg-green-600 text-white rounded "
                      onClick={() => openModal(d, "view")}
                    >
                      View
                    </button>
                    <button
                      className="px-3 py-1 bg-yellow-500 text-white rounded"
                      onClick={() => openModal(d, "edit")}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-3 mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* Modal */}
        {modalData && (
          <Modal mode={modalMode} data={modalData} onClose={closeModal} onSave={updateDealer} />
        )}
      </main>
    </div>
  );
}



// --------------------------------------------
function Modal({ mode, data, onClose, onSave }) {
  const [form, setForm] = useState({ ...data });

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitEdit = () => {
    if (!form.name.trim() || !form.location.trim() || !form.contact.trim()) {
      alert("All fields are required");
      return;
    }
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {mode === "view" ? "Dealer Details" : "Edit Dealer"}
        </h2>

        {/* VIEW MODE */}
        {mode === "view" && (
          <div className="space-y-2">
            <p><strong>Name:</strong> {data.name}</p>
            <p><strong>Location:</strong> {data.location}</p>
            <p><strong>Contact:</strong> {data.contact}</p>
            <p><strong>Status:</strong> {data.status}</p>
          </div>
        )}

        {/* EDIT MODE */}
        {mode === "edit" && (
          <div className="space-y-3">
            <input
              className="w-full border p-2 rounded"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Dealer Name"
            />

            <input
              className="w-full border p-2 rounded"
              value={form.location}
              onChange={(e) => updateField("location", e.target.value)}
              placeholder="Location"
            />

            <input
              className="w-full border p-2 rounded"
              value={form.contact}
              onChange={(e) => updateField("contact", e.target.value)}
              placeholder="Contact"
            />

            <select
              className="w-full border p-2 rounded"
              value={form.status}
              onChange={(e) => updateField("status", e.target.value)}
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>

            <button
              onClick={submitEdit}
              className="w-full py-2 bg-blue-600 text-white rounded mt-2"
            >
              Save Changes
            </button>
          </div>
        )}

        <button
          className="w-full py-2 bg-gray-300 rounded mt-4"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
