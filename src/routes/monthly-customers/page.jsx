import { Plus, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import Select from "react-select";

import { dailyDeliveryRecords, monthlyCustomers } from "./monthly-customer-details";

const formatDate = (dateValue) => {
    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(dateValue));
};

const milkRates = {
    "Cow Milk": 60,
    "Buffalo Milk": 75,
    "Gokul Milk": 65,
};

const milkOptions = Object.entries(milkRates).map(([name, rate]) => ({
    name,
    rate,
}));

const dailyItemOptions = [
    {
        name: "Curd",
        amount: 40,
    },
    {
        name: "Paneer",
        amount: 120,
    },
    {
        name: "Ghee",
        amount: 250,
    },
    {
        name: "Butter",
        amount: 90,
    },
    {
        name: "Cheese",
        amount: 110,
    },
];

const MonthlyCustomersPage = () => {
    const [records, setRecords] = useState(dailyDeliveryRecords);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCustomerId, setSelectedCustomerId] = useState(monthlyCustomers[0].id);
    const [isAddRecordOpen, setIsAddRecordOpen] = useState(false);
    const [formData, setFormData] = useState({
        customerId: monthlyCustomers[0].id,
        isoDate: "2026-09-03",
        milkType: "Cow Milk",
        liters: "1",
        deliveryCharge: "2",
        otherItems: [],
    });

    const formSelectedCustomer = useMemo(() => {
        return monthlyCustomers.find((customer) => customer.id === formData.customerId);
    }, [formData.customerId]);

    const selectedCustomer = useMemo(() => {
        return monthlyCustomers.find((customer) => customer.id === selectedCustomerId);
    }, [selectedCustomerId]);

    const customerOptions = useMemo(() => {
        return monthlyCustomers.map((customer) => ({
            value: customer.id,
            label: customer.name,
        }));
    }, []);

    const selectedCustomerOption = useMemo(() => {
        return customerOptions.find((customer) => customer.value === formData.customerId);
    }, [customerOptions, formData.customerId]);

    const selectedOtherItems = useMemo(() => {
        return dailyItemOptions.filter((item) => formData.otherItems.includes(item.name));
    }, [formData.otherItems]);

    const milkAmount = (milkRates[formData.milkType] || 0) * Number(formData.liters || 0);
    const otherItemsAmount = selectedOtherItems.reduce((total, item) => total + item.amount, 0);
    const deliveryCharge = Number(formData.deliveryCharge || 0);
    const dailyAmount = milkAmount + otherItemsAmount + deliveryCharge;

    const selectedItems = [`${formData.milkType} - ${formData.liters || 0} L`, ...selectedOtherItems.map((item) => item.name)];

    const customerList = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        if (!query) {
            return monthlyCustomers.slice(0, 100);
        }

        return monthlyCustomers.filter((customer) => customer.name.toLowerCase().includes(query)).slice(0, 100);
    }, [searchQuery]);

    const selectedCustomerRecords = useMemo(() => {
        return records
            .filter((record) => record.customerId === selectedCustomerId)
            .sort((firstRecord, secondRecord) => secondRecord.isoDate.localeCompare(firstRecord.isoDate));
    }, [records, selectedCustomerId]);

    const selectedCustomerTotal = selectedCustomerRecords.reduce((total, record) => {
        return total + Number(record.dailyAmount.replace(/[^\d.]/g, ""));
    }, 0);

    const selectedCustomerDeliveryCharges = selectedCustomerRecords.reduce((total, record) => {
        return total + Number(record.deliveryCharge.replace(/[^\d.]/g, ""));
    }, 0);

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        setFormData((currentFormData) => {
            if (name === "otherItems") {
                const selectedItem = value;
                const isSelected = currentFormData.otherItems.includes(selectedItem);

                return {
                    ...currentFormData,
                    otherItems: isSelected
                        ? currentFormData.otherItems.filter((item) => item !== selectedItem)
                        : [...currentFormData.otherItems, selectedItem],
                };
            }

            if (name === "milkType") {
                return {
                    ...currentFormData,
                    milkType: value,
                };
            }

            if (name === "liters") {
                return {
                    ...currentFormData,
                    liters: value,
                    deliveryCharge: String(Number(value || 0) * 2),
                };
            }

            return {
                ...currentFormData,
                [name]: name === "customerId" ? Number(value) : value,
            };
        });
    };

    const handleAddRecord = (event) => {
        event.preventDefault();

        if (!formSelectedCustomer) {
            return;
        }

        const nextRecord = {
            id: Date.now(),
            customerId: formSelectedCustomer.id,
            isoDate: formData.isoDate,
            date: formatDate(formData.isoDate),
            customerName: formSelectedCustomer.name,
            address: formSelectedCustomer.address,
            items: selectedItems,
            quantity: `${formData.liters} L`,
            deliveryCharge: `Rs. ${deliveryCharge.toLocaleString("en-IN")}`,
            dailyAmount: `Rs. ${dailyAmount.toLocaleString("en-IN")}`,
        };

        setRecords((currentRecords) => [nextRecord, ...currentRecords]);
        setSelectedCustomerId(formSelectedCustomer.id);
        setIsAddRecordOpen(false);
    };

    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="title">Monthly Customer Daily Updates</h1>
                    <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                        Date-wise records of customers taking milk and other dairy items
                    </p>
                </div>
                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                    <label className="flex h-10 w-full items-center gap-x-2 rounded-lg border border-slate-300 bg-white px-3 text-slate-500 transition-colors focus-within:border-blue-500 sm:w-80 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                        <Search size={18} />
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            placeholder="Search daily records"
                            className="h-full w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-50"
                        />
                    </label>
                    <button
                        type="button"
                        onClick={() => setIsAddRecordOpen(true)}
                        className="flex h-10 items-center justify-center gap-x-2 rounded-lg bg-blue-500 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
                    >
                        <Plus size={18} />
                        Add Record
                    </button>
                </div>
            </div>

            {isAddRecordOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4">
                    <form
                        onSubmit={handleAddRecord}
                        className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-lg border border-slate-300 bg-white shadow-xl transition-colors dark:border-slate-700 dark:bg-slate-900"
                    >
                        <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-x-3">
                                <div className="rounded-lg bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400">
                                    <Plus size={18} />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900 dark:text-slate-50">Add Date-wise Delivery Record</p>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                        Select customer, milk, litre, extra items, and save the daily amount
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsAddRecordOpen(false)}
                                className="flex size-10 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                                aria-label="Close add record popup"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="max-h-[calc(90vh-145px)] overflow-y-auto">
                            <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_320px]">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                                    <div className="relative z-30 flex flex-col gap-y-2 md:col-span-2">
                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Customer</span>
                                        <Select
                                            value={selectedCustomerOption}
                                            onChange={(option) =>
                                                setFormData((currentFormData) => ({
                                                    ...currentFormData,
                                                    customerId: option.value,
                                                }))
                                            }
                                            options={customerOptions}
                                            placeholder="Search customer"
                                            menuPortalTarget={document.body}
                                            styles={{
                                                control: (base, state) => ({
                                                    ...base,
                                                    minHeight: "40px",
                                                    borderColor: state.isFocused ? "#3b82f6" : "#cbd5e1",
                                                    borderRadius: "0.5rem",
                                                    boxShadow: "none",
                                                }),
                                                menuPortal: (base) => ({
                                                    ...base,
                                                    zIndex: 9999,
                                                }),
                                                option: (base, state) => ({
                                                    ...base,
                                                    backgroundColor: state.isSelected ? "#3b82f6" : state.isFocused ? "#eff6ff" : "#ffffff",
                                                    color: state.isSelected ? "#ffffff" : "#0f172a",
                                                    fontSize: "0.875rem",
                                                    fontWeight: 600,
                                                }),
                                            }}
                                        />
                                    </div>

                                    <label className="flex flex-col gap-y-2">
                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Date</span>
                                        <input
                                            type="date"
                                            name="isoDate"
                                            value={formData.isoDate}
                                            onChange={handleInputChange}
                                            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-900 outline-none transition-colors focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
                                        />
                                    </label>

                                    <div className="flex flex-col gap-y-2 md:col-span-2">
                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Milk Type</span>
                                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                                            {milkOptions.map((milk) => (
                                                <label
                                                    key={milk.name}
                                                    className={`cursor-pointer rounded-lg border px-3 py-3 transition-colors ${
                                                        formData.milkType === milk.name
                                                            ? "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                                            : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
                                                    }`}
                                                >
                                                    <span className="block text-sm font-semibold">{milk.name}</span>
                                                    <span className="mt-1 block text-xs font-bold">Rs. {milk.rate}/L</span>
                                                    <input
                                                        type="radio"
                                                        name="milkType"
                                                        value={milk.name}
                                                        checked={formData.milkType === milk.name}
                                                        onChange={handleInputChange}
                                                        className="sr-only"
                                                    />
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <label className="flex flex-col gap-y-2">
                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Liter</span>
                                        <input
                                            type="number"
                                            name="liters"
                                            value={formData.liters}
                                            onChange={handleInputChange}
                                            min="0.5"
                                            step="0.5"
                                            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-900 outline-none transition-colors focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
                                        />
                                    </label>

                                    <label className="flex flex-col gap-y-2">
                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Delivery Charges</span>
                                        <input
                                            type="number"
                                            name="deliveryCharge"
                                            value={formData.deliveryCharge}
                                            onChange={handleInputChange}
                                            min="0"
                                            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-900 outline-none transition-colors focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
                                        />
                                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Auto: Rs. 2 per liter. You can edit it.</span>
                                    </label>

                                    <label className="flex flex-col gap-y-2 xl:col-span-2">
                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Other Daily Items</span>
                                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                            {dailyItemOptions.map((item) => (
                                                <label
                                                    key={item.name}
                                                    className={`flex cursor-pointer items-center justify-between rounded-lg border px-3 py-2 transition-colors ${
                                                        formData.otherItems.includes(item.name)
                                                            ? "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                                            : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
                                                    }`}
                                                >
                                                    <span className="text-sm font-semibold">{item.name}</span>
                                                    <span className="text-sm font-bold">Rs. {item.amount}</span>
                                                    <input
                                                        type="checkbox"
                                                        name="otherItems"
                                                        value={item.name}
                                                        checked={formData.otherItems.includes(item.name)}
                                                        onChange={handleInputChange}
                                                        className="sr-only"
                                                    />
                                                </label>
                                            ))}
                                        </div>
                                    </label>
                                </div>

                                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Delivery Summary</p>
                                    <div className="mt-3 space-y-3">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">{formSelectedCustomer?.name}</p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedItems.map((item) => (
                                                <span
                                                    key={item}
                                                    className="rounded-md bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400"
                                                >
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="space-y-2 border-t border-slate-200 pt-3 text-sm dark:border-slate-800">
                                            <div className="flex items-center justify-between font-medium text-slate-600 dark:text-slate-300">
                                                <span>Milk Amount</span>
                                                <span>Rs. {milkAmount.toLocaleString("en-IN")}</span>
                                            </div>
                                            <div className="flex items-center justify-between font-medium text-slate-600 dark:text-slate-300">
                                                <span>Other Items</span>
                                                <span>Rs. {otherItemsAmount.toLocaleString("en-IN")}</span>
                                            </div>
                                            <div className="flex items-center justify-between font-medium text-slate-600 dark:text-slate-300">
                                                <span>Delivery Charges</span>
                                                <span>Rs. {deliveryCharge.toLocaleString("en-IN")}</span>
                                            </div>
                                            <div className="flex items-center justify-between border-t border-slate-200 pt-2 text-base font-bold text-slate-900 dark:border-slate-800 dark:text-slate-50">
                                                <span>Total</span>
                                                <span>Rs. {dailyAmount.toLocaleString("en-IN")}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => setIsAddRecordOpen(false)}
                                className="h-10 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex h-10 items-center justify-center gap-x-2 rounded-lg bg-blue-500 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
                            >
                                <Plus size={18} />
                                Add Record
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
                <aside className="overflow-hidden rounded-lg border border-slate-300 bg-white transition-colors dark:border-slate-700 dark:bg-slate-900">
                    <div className="border-b border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
                        <p className="font-semibold text-slate-900 dark:text-slate-50">Customers</p>
                        <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">Click a customer to view date-wise delivery</p>
                    </div>
                    <div className="max-h-[560px] overflow-y-auto p-2">
                        {customerList.map((customer) => {
                            const customerRecords = records.filter((record) => record.customerId === customer.id);

                            return (
                                <button
                                    key={customer.id}
                                    type="button"
                                    onClick={() => setSelectedCustomerId(customer.id)}
                                    className={`w-full rounded-lg p-3 text-left transition-colors ${
                                        selectedCustomerId === customer.id
                                            ? "bg-blue-500 text-white"
                                            : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                                    }`}
                                >
                                    <span className="block text-sm font-semibold">{customer.name}</span>
                                    <span className={`mt-1 block text-xs font-medium ${selectedCustomerId === customer.id ? "text-blue-50" : "text-slate-500 dark:text-slate-400"}`}>
                                        {customerRecords.length} delivery records
                                    </span>
                                </button>
                            );
                        })}
                        {customerList.length === 0 && <p className="p-6 text-center text-sm font-medium text-slate-500 dark:text-slate-400">No customers found.</p>}
                    </div>
                </aside>

                <section className="overflow-hidden rounded-lg border border-slate-300 bg-white transition-colors dark:border-slate-700 dark:bg-slate-900">
                    <div className="border-b border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">{selectedCustomer?.name}</h2>
                                <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">{selectedCustomer?.address}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2 sm:min-w-72">
                                <div className="rounded-lg bg-blue-500/10 p-3">
                                    <p className="text-xs font-semibold uppercase text-blue-600 dark:text-blue-400">Charges</p>
                                    <p className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-50">Rs. {selectedCustomerDeliveryCharges.toLocaleString("en-IN")}</p>
                                </div>
                                <div className="rounded-lg bg-emerald-500/10 p-3">
                                    <p className="text-xs font-semibold uppercase text-emerald-600 dark:text-emerald-400">Amount</p>
                                    <p className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-50">Rs. {selectedCustomerTotal.toLocaleString("en-IN")}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 p-4">
                        {selectedCustomerRecords.map((record) => (
                            <article
                                key={record.id}
                                className="rounded-lg border border-slate-200 p-4 transition-colors dark:border-slate-800"
                            >
                                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-slate-50">{record.date}</p>
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {record.items.map((item) => (
                                                <span
                                                    key={item}
                                                    className="rounded-md bg-blue-500/10 px-2.5 py-1 text-sm font-semibold text-blue-600 dark:text-blue-400"
                                                >
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="grid min-w-64 grid-cols-3 gap-2 text-center">
                                        <div className="rounded-lg bg-slate-100 p-3 dark:bg-slate-950">
                                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Liter</p>
                                            <p className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-50">{record.quantity}</p>
                                        </div>
                                        <div className="rounded-lg bg-slate-100 p-3 dark:bg-slate-950">
                                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Charges</p>
                                            <p className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-50">{record.deliveryCharge}</p>
                                        </div>
                                        <div className="rounded-lg bg-slate-100 p-3 dark:bg-slate-950">
                                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Amount</p>
                                            <p className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-50">{record.dailyAmount}</p>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                        {selectedCustomerRecords.length === 0 && (
                            <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center font-medium text-slate-500 dark:border-slate-700 dark:text-slate-400">
                                No delivery records found for this customer.
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default MonthlyCustomersPage;
