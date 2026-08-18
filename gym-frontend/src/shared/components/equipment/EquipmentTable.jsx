import { useState } from "react";

import { Search } from "lucide-react";

import EquipmentStatusBadge from "./EquipmentStatusBadge";

const STATUS_TABS = [
    { label: "All", value: "all" },
    { label: "Available", value: "available" },
    { label: "Maintenance", value: "maintenance" },
    { label: "Broken", value: "broken" }
];

function EquipmentTable({ equipments }) {

    const [activeTab, setActiveTab] = useState("all");
    const [search, setSearch] = useState("");

    const filtered = equipments.filter((item) => {

        const matchesTab =
            activeTab === "all" || item.state === activeTab;

        const term = search.trim().toLowerCase();

        const matchesSearch =
            !term || item.name.toLowerCase().includes(term);

        return matchesTab && matchesSearch;

    });

    return (

        <div className="equipment-table-section">

            <div className="equipment-toolbar">

                <div className="equipment-tabs">

                    {STATUS_TABS.map((tab) => (

                        <button
                            key={tab.value}
                            className={
                                activeTab === tab.value
                                    ? "equipment-tab active"
                                    : "equipment-tab"
                            }
                            onClick={() => setActiveTab(tab.value)}
                        >
                            {tab.label}
                        </button>

                    ))}

                </div>

                <div className="equipment-search">

                    <Search size={17} />

                    <input
                        type="text"
                        value={search}
                        placeholder="Search equipment..."
                        onChange={(e) => setSearch(e.target.value)}
                    />

                </div>

            </div>

            {filtered.length === 0 ? (

                <div className="equipment-empty">
                    No equipment found.
                </div>

            ) : (

                <div className="equipment-table-card">

                    <table className="equipment-table">

                        <thead>

                            <tr>
                                <th>Name</th>
                                <th>Status</th>
                            </tr>

                        </thead>

                        <tbody>

                            {filtered.map((item) => (

                                <tr key={item.id}>

                                    <td>{item.name}</td>

                                    <td>
                                        <EquipmentStatusBadge status={item.state} />
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}

        </div>

    );

}

export default EquipmentTable;
