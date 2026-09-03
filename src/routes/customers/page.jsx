import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { customerDetails, customerTableColumns } from "./customer-details";

const CustomersPage = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredCustomers = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        if (!query) {
            return customerDetails;
        }

        return customerDetails.filter((customer) =>
            [customer.name, customer.phone, customer.address, customer.milkType, customer.dailyQuantity, customer.deliveryStatus].some((value) =>
                value.toLowerCase().includes(query),
            ),
        );
    }, [searchQuery]);

    const getDeliveryStatusClassName = (status) => {
        if (status === "Active") {
            return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
        }

        return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
    };

    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="title">Milk Delivery Customers</h1>

                </div>
                <label className="flex h-10 w-full items-center gap-x-2 rounded-lg border border-slate-300 bg-white px-3 text-slate-500 transition-colors focus-within:border-blue-500 sm:max-w-80 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                    <Search size={18} />
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="Search customers"
                        className="h-full w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-50"
                    />
                </label>
            </div>
            <div className="overflow-hidden rounded-lg border border-slate-300 bg-white transition-colors dark:border-slate-700 dark:bg-slate-900">
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead className="bg-blue-100 text-sm uppercase text-black transition-colors dark:bg-slate-800 dark:text-slate-400">
                            <tr>
                                {customerTableColumns.map((column) => (
                                    <th
                                        key={column.key}
                                        className="h-12 whitespace-nowrap px-2 text-left font-semibold"
                                    >
                                        {column.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.map((customer, index) => (
                                <tr
                                    key={customer.id}
                                    className="border-b border-slate-200 transition-colors last:border-none hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60"
                                >
                                    <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">{index + 1}</td>
                                    <td className="min-w-56 px-4 py-4">
                                        <p className="font-semibold text-slate-900 dark:text-slate-50">{customer.name}</p>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-slate-700 dark:text-slate-200">{customer.phone}</td>
                                    <td className="min-w-72 px-4 py-4">
                                        <span className="block max-w-80 whitespace-normal text-sm font-medium leading-6 text-slate-700 dark:text-slate-200">
                                            {customer.address}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-4">
                                        <span className="rounded-md bg-blue-500/10 px-2.5 py-1 text-sm font-semibold text-blue-600 dark:text-blue-400">
                                            {customer.milkType}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-4 text-base font-bold text-slate-900 dark:text-slate-50">
                                        {customer.advance}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-4">
                                        <span className={`rounded-md px-2.5 py-1 text-sm font-semibold ${getDeliveryStatusClassName(customer.deliveryStatus)}`}>
                                            {customer.deliveryStatus}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredCustomers.length === 0 && (
                        <div className="p-6 text-center font-medium text-slate-500 dark:text-slate-400">No customers found.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomersPage;
