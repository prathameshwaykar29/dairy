import { PencilLine, Plus, Save, Trash, X } from "lucide-react";
import PropTypes from "prop-types";
import { useState } from "react";

import { initialMilkRates, initialOtherItemRates } from "./rate-details";

const emptyForm = {
    name: "",
    unit: "Liter",
    rate: "",
};

const RateSection = ({ title, description, rates, form, editingId, onFormChange, onAdd, onEdit, onSave, onCancel, onDelete }) => {
    return (
        <section className="overflow-hidden rounded-lg border border-slate-300 bg-white transition-colors dark:border-slate-700 dark:bg-slate-900">
            <div className="border-b border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{title}</h2>
                <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">{description}</p>
            </div>

            <div className="grid grid-cols-1 gap-3 border-b border-slate-200 p-4 dark:border-slate-800 md:grid-cols-[minmax(0,1fr)_160px_140px_auto]">
                <label className="flex flex-col gap-y-2">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Item Name</span>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={onFormChange}
                        placeholder="Enter item name"
                        className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-900 outline-none transition-colors focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
                    />
                </label>
                <label className="flex flex-col gap-y-2">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Unit</span>
                    <input
                        type="text"
                        name="unit"
                        value={form.unit}
                        onChange={onFormChange}
                        placeholder="Liter"
                        className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-900 outline-none transition-colors focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
                    />
                </label>
                <label className="flex flex-col gap-y-2">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Rate</span>
                    <input
                        type="number"
                        name="rate"
                        value={form.rate}
                        onChange={onFormChange}
                        min="0"
                        placeholder="0"
                        className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-900 outline-none transition-colors focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
                    />
                </label>
                <div className="flex items-end gap-2">
                    {editingId ? (
                        <>
                            <button
                                type="button"
                                onClick={onSave}
                                className="flex h-10 items-center justify-center gap-x-2 rounded-lg bg-blue-500 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
                            >
                                <Save size={18} />
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={onCancel}
                                className="flex h-10 items-center justify-center rounded-lg border border-slate-300 px-3 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                                <X size={18} />
                            </button>
                        </>
                    ) : (
                        <button
                            type="button"
                            onClick={onAdd}
                            className="flex h-10 items-center justify-center gap-x-2 rounded-lg bg-blue-500 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
                        >
                            <Plus size={18} />
                            Add
                        </button>
                    )}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="table">
                    <thead className="bg-slate-100 text-xs uppercase text-slate-500 transition-colors dark:bg-slate-800 dark:text-slate-400">
                        <tr>
                            <th className="h-12 whitespace-nowrap px-4 text-left font-semibold">Sr No</th>
                            <th className="h-12 whitespace-nowrap px-4 text-left font-semibold">Item</th>
                            <th className="h-12 whitespace-nowrap px-4 text-left font-semibold">Unit</th>
                            <th className="h-12 whitespace-nowrap px-4 text-left font-semibold">Rate</th>
                            <th className="h-12 whitespace-nowrap px-4 text-right font-semibold">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rates.map((rate, index) => (
                            <tr
                                key={rate.id}
                                className="border-b border-slate-200 transition-colors last:border-none hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60"
                            >
                                <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">{index + 1}</td>
                                <td className="whitespace-nowrap px-4 py-4 font-semibold text-slate-900 dark:text-slate-50">{rate.name}</td>
                                <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-slate-700 dark:text-slate-200">{rate.unit}</td>
                                <td className="whitespace-nowrap px-4 py-4">
                                    <span className="rounded-md bg-emerald-500/10 px-3 py-1 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                        Rs. {Number(rate.rate).toLocaleString("en-IN")}
                                    </span>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() => onEdit(rate)}
                                            className="flex size-9 items-center justify-center rounded-lg text-blue-600 transition-colors hover:bg-blue-500/10 dark:text-blue-400"
                                            aria-label={`Edit ${rate.name}`}
                                        >
                                            <PencilLine size={18} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onDelete(rate.id)}
                                            className="flex size-9 items-center justify-center rounded-lg text-red-600 transition-colors hover:bg-red-500/10 dark:text-red-400"
                                            aria-label={`Delete ${rate.name}`}
                                        >
                                            <Trash size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {rates.length === 0 && <div className="p-6 text-center font-medium text-slate-500 dark:text-slate-400">No rates added.</div>}
            </div>
        </section>
    );
};

RateSection.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    rates: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            unit: PropTypes.string.isRequired,
            rate: PropTypes.number.isRequired,
        }),
    ).isRequired,
    form: PropTypes.shape({
        name: PropTypes.string.isRequired,
        unit: PropTypes.string.isRequired,
        rate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    }).isRequired,
    editingId: PropTypes.number,
    onFormChange: PropTypes.func.isRequired,
    onAdd: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

const RatesPage = () => {
    const [milkRates, setMilkRates] = useState(initialMilkRates);
    const [otherItemRates, setOtherItemRates] = useState(initialOtherItemRates);
    const [milkForm, setMilkForm] = useState(emptyForm);
    const [otherItemForm, setOtherItemForm] = useState({
        ...emptyForm,
        unit: "Packet",
    });
    const [editingMilkId, setEditingMilkId] = useState(null);
    const [editingOtherItemId, setEditingOtherItemId] = useState(null);

    const handleFormChange = (setForm) => (event) => {
        const { name, value } = event.target;

        setForm((currentForm) => ({
            ...currentForm,
            [name]: value,
        }));
    };

    const addRate = (rates, setRates, form, setForm, defaultUnit) => {
        if (!form.name.trim() || !form.rate) {
            return;
        }

        setRates([
            ...rates,
            {
                id: Date.now(),
                name: form.name.trim(),
                unit: form.unit.trim() || defaultUnit,
                rate: Number(form.rate),
            },
        ]);
        setForm({
            ...emptyForm,
            unit: defaultUnit,
        });
    };

    const editRate = (rate, setForm, setEditingId) => {
        setForm({
            name: rate.name,
            unit: rate.unit,
            rate: String(rate.rate),
        });
        setEditingId(rate.id);
    };

    const saveRate = (setRates, form, setForm, editingId, setEditingId, defaultUnit) => {
        if (!form.name.trim() || !form.rate) {
            return;
        }

        setRates((currentRates) =>
            currentRates.map((rate) =>
                rate.id === editingId
                    ? {
                          ...rate,
                          name: form.name.trim(),
                          unit: form.unit.trim() || defaultUnit,
                          rate: Number(form.rate),
                      }
                    : rate,
            ),
        );
        setEditingId(null);
        setForm({
            ...emptyForm,
            unit: defaultUnit,
        });
    };

    const cancelEdit = (setForm, setEditingId, defaultUnit) => {
        setEditingId(null);
        setForm({
            ...emptyForm,
            unit: defaultUnit,
        });
    };

    return (
        <div className="flex flex-col gap-y-4">
            <div>
                <h1 className="title">Rates</h1>
                <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                    Add, edit, or delete milk and daily item rates used for delivery billing.
                </p>
            </div>

            <RateSection
                title="Milk Rates"
                description="Manage per-liter rates for milk types."
                rates={milkRates}
                form={milkForm}
                editingId={editingMilkId}
                onFormChange={handleFormChange(setMilkForm)}
                onAdd={() => addRate(milkRates, setMilkRates, milkForm, setMilkForm, "Liter")}
                onEdit={(rate) => editRate(rate, setMilkForm, setEditingMilkId)}
                onSave={() => saveRate(setMilkRates, milkForm, setMilkForm, editingMilkId, setEditingMilkId, "Liter")}
                onCancel={() => cancelEdit(setMilkForm, setEditingMilkId, "Liter")}
                onDelete={(id) => setMilkRates((currentRates) => currentRates.filter((rate) => rate.id !== id))}
            />

            <RateSection
                title="Other Item Rates"
                description="Manage rates for daily dairy items delivered with milk."
                rates={otherItemRates}
                form={otherItemForm}
                editingId={editingOtherItemId}
                onFormChange={handleFormChange(setOtherItemForm)}
                onAdd={() => addRate(otherItemRates, setOtherItemRates, otherItemForm, setOtherItemForm, "Packet")}
                onEdit={(rate) => editRate(rate, setOtherItemForm, setEditingOtherItemId)}
                onSave={() => saveRate(setOtherItemRates, otherItemForm, setOtherItemForm, editingOtherItemId, setEditingOtherItemId, "Packet")}
                onCancel={() => cancelEdit(setOtherItemForm, setEditingOtherItemId, "Packet")}
                onDelete={(id) => setOtherItemRates((currentRates) => currentRates.filter((rate) => rate.id !== id))}
            />
        </div>
    );
};

export default RatesPage;
