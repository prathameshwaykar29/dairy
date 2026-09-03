import { Download, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { getMonthlyBills, monthOptions } from "./monthly-bill-details";

const MonthlyBillPage = () => {
    const [selectedMonth, setSelectedMonth] = useState(monthOptions[0].value);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBillId, setSelectedBillId] = useState(null);
    const [printBills, setPrintBills] = useState([]);

    const monthlyBills = useMemo(() => getMonthlyBills(selectedMonth), [selectedMonth]);

    const filteredBills = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        if (!query) {
            return monthlyBills;
        }

        return monthlyBills.filter((bill) =>
            [bill.customerName, bill.address, ...bill.records.flatMap((record) => record.items)].some((value) => value.toLowerCase().includes(query)),
        );
    }, [monthlyBills, searchQuery]);

    const selectedBill = useMemo(() => {
        return filteredBills.find((bill) => bill.customerId === selectedBillId) || filteredBills[0];
    }, [filteredBills, selectedBillId]);

    const totalMilkItemsAmount = filteredBills.reduce((total, bill) => total + bill.itemsAmount, 0);
    const totalDeliveryCharges = filteredBills.reduce((total, bill) => total + bill.deliveryCharges, 0);
    const totalBillAmount = totalMilkItemsAmount + totalDeliveryCharges;
    const selectedMonthLabel = monthOptions.find((month) => month.value === selectedMonth)?.label;
    const handlePrintBill = (bills) => {
        setPrintBills(bills);
        setTimeout(() => window.print(), 0);
    };

    const renderReceipt = (bill) => {
        return (
            <div
                key={bill.customerId}
                className="monthly-bill-receipt bg-white p-2 text-black"
            >
                <div className="h-full border-2 border-black">
                    <div className="border-b border-black p-3 text-center">
                        <h2 className="text-2xl font-bold">Maharashtra Dairy</h2>
                        <p className="mt-1 text-xs font-semibold">06, Siddhivinayak Housing Society, Station Road, Thane (W)</p>
                        <p className="mt-1 text-sm font-bold">8108140076 / 7710893263</p>
                    </div>

                    <div className="grid grid-cols-[82px_minmax(0,1fr)] border-b border-black text-sm font-bold">
                        <div className="border-r border-black px-2 py-1">Name</div>
                        <div className="px-2 py-1">{bill.customerName}</div>
                        <div className="border-r border-t border-black px-2 py-1">Address</div>
                        <div className="border-t border-black px-2 py-1">{bill.address}</div>
                    </div>

                    <div className="grid grid-cols-[82px_1fr_82px_1fr] border-b border-black text-sm font-bold">
                        <div className="border-r border-black px-2 py-1">Date</div>
                        <div className="border-r border-black px-2 py-1">{selectedMonthLabel}</div>
                        <div className="border-r border-black px-2 py-1">Bill No.</div>
                        <div className="px-2 py-1">#{bill.customerId}-0826</div>
                    </div>

                    <table className="w-full border-b border-black text-sm">
                        <thead>
                            <tr>
                                <th className="border-b border-r border-black px-2 py-2 text-left">Month Of {selectedMonthLabel} Bill</th>
                                <th className="w-32 border-b border-black px-2 py-2 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(bill.milkSummary).map(([milkType, liters]) => (
                                <tr key={milkType}>
                                    <td className="border-b border-r border-black px-2 py-1 font-semibold">
                                        {milkType} - {liters} L
                                    </td>
                                    <td className="border-b border-black px-2 py-1 text-right font-semibold">
                                        Rs. {bill.milkAmountSummary[milkType].toLocaleString("en-IN")}
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td className="border-b border-r border-black px-2 py-1 font-semibold">Other Amount</td>
                                <td className="border-b border-black px-2 py-1 text-right font-semibold">Rs. {bill.otherItemsAmount.toLocaleString("en-IN")}</td>
                            </tr>
                            <tr>
                                <td className="border-b border-r border-black px-2 py-1 font-semibold">Delivery Charges</td>
                                <td className="border-b border-black px-2 py-1 text-right font-semibold">Rs. {bill.deliveryCharges.toLocaleString("en-IN")}</td>
                            </tr>
                            <tr>
                                <td className="border-b border-r border-black px-2 py-1 font-semibold">Amount</td>
                                <td className="border-b border-black px-2 py-1 text-right font-semibold">Rs. {bill.totalAmount.toLocaleString("en-IN")}</td>
                            </tr>
                            <tr>
                                <td className="border-b border-r border-black px-2 py-1 font-semibold">Advance</td>
                                <td className="border-b border-black px-2 py-1 text-right font-semibold">Rs. {bill.advance.toLocaleString("en-IN")}</td>
                            </tr>
                            <tr>
                                <td className="border-r border-black px-2 py-2 text-lg font-bold">Total Bill :</td>
                                <td className="px-2 py-2 text-right text-lg font-bold">Rs. {bill.balanceAmount.toLocaleString("en-IN")}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="p-3 text-sm font-semibold">
                        <p>Payment: GPay</p>
                        <p>G.pay no. : 8108140076</p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-y-4">
            <div className="monthly-bill-actions flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="title">Monthly Bill</h1>
                    <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                        Customer-wise monthly bill for milk, daily items, and delivery charges.
                    </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <select
                        value={selectedMonth}
                        onChange={(event) => setSelectedMonth(event.target.value)}
                        className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 outline-none transition-colors focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
                    >
                        {monthOptions.map((month) => (
                            <option
                                key={month.value}
                                value={month.value}
                            >
                                {month.label}
                            </option>
                        ))}
                    </select>
                    <label className="flex h-10 w-full items-center gap-x-2 rounded-lg border border-slate-300 bg-white px-3 text-slate-500 transition-colors focus-within:border-blue-500 sm:w-72 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                        <Search size={18} />
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            placeholder="Search customer bill"
                            className="h-full w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-50"
                        />
                    </label>
                    <button
                        type="button"
                        onClick={() => handlePrintBill(selectedBill ? [selectedBill] : [])}
                        disabled={!selectedBill}
                        className="flex h-10 items-center justify-center gap-x-2 rounded-lg bg-blue-500 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300 dark:bg-blue-600 dark:hover:bg-blue-500 dark:disabled:bg-slate-700"
                    >
                        <Download size={18} />
                        PDF
                    </button>
                    <button
                        type="button"
                        onClick={() => handlePrintBill(filteredBills.slice(0, 100))}
                        disabled={filteredBills.length === 0}
                        className="flex h-10 items-center justify-center gap-x-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:bg-emerald-600 dark:hover:bg-emerald-500 dark:disabled:bg-slate-700"
                    >
                        <Download size={18} />
                        PDF All
                    </button>
                </div>
            </div>

            <div className="monthly-bill-actions grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="rounded-lg border border-slate-300 bg-white p-4 transition-colors dark:border-slate-700 dark:bg-slate-900">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Customer Bills</p>
                    <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-50">{filteredBills.length}</p>
                </div>
                <div className="rounded-lg border border-slate-300 bg-white p-4 transition-colors dark:border-slate-700 dark:bg-slate-900">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Milk / Items Amount</p>
                    <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-50">Rs. {totalMilkItemsAmount.toLocaleString("en-IN")}</p>
                </div>
                <div className="rounded-lg border border-slate-300 bg-white p-4 transition-colors dark:border-slate-700 dark:bg-slate-900">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Delivery Charges</p>
                    <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-50">Rs. {totalDeliveryCharges.toLocaleString("en-IN")}</p>
                </div>
                <div className="rounded-lg border border-slate-300 bg-white p-4 transition-colors dark:border-slate-700 dark:bg-slate-900">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Amount</p>
                    <p className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">Rs. {totalBillAmount.toLocaleString("en-IN")}</p>
                </div>
            </div>

            <div className="monthly-bill-layout grid grid-cols-1 gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
                <div className="monthly-bill-actions overflow-hidden rounded-lg border border-slate-300 bg-white transition-colors dark:border-slate-700 dark:bg-slate-900">
                    <div className="border-b border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
                        <p className="font-semibold text-slate-900 dark:text-slate-50">Customers</p>
                    </div>
                    <div className="max-h-[540px] overflow-y-auto p-2">
                        {filteredBills.map((bill) => (
                            <button
                                key={bill.customerId}
                                type="button"
                                onClick={() => setSelectedBillId(bill.customerId)}
                                className={`w-full rounded-lg p-3 text-left transition-colors ${
                                    selectedBill?.customerId === bill.customerId
                                        ? "bg-blue-500 text-white"
                                        : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                                }`}
                            >
                                <span className="block text-sm font-semibold">{bill.customerName}</span>
                                <span className={`mt-1 block text-xs font-medium ${selectedBill?.customerId === bill.customerId ? "text-blue-50" : "text-slate-500"}`}>
                                    Rs. {bill.totalAmount.toLocaleString("en-IN")}
                                </span>
                                <span className={`mt-1 block text-xs font-medium ${selectedBill?.customerId === bill.customerId ? "text-blue-50" : "text-slate-500"}`}>
                                    Balance Rs. {bill.balanceAmount.toLocaleString("en-IN")}
                                </span>
                            </button>
                        ))}
                        {filteredBills.length === 0 && <p className="p-6 text-center text-sm font-medium text-slate-500">No bills found.</p>}
                    </div>
                </div>

                {selectedBill && (
                    <div className="monthly-bill-preview mx-auto w-full max-w-[430px] bg-white p-2 text-black">
                        <div className="border-2 border-black">
                            <div className="border-b border-black p-3 text-center">
                                <h2 className="text-2xl font-bold">महाराष्ट्र डेअरी</h2>
                                <p className="mt-1 text-xs font-semibold">06, Siddhivinayak Housing Society, Station Road, Thane (W)</p>
                                <p className="mt-1 text-sm font-bold">8108140076 / 7710893263</p>
                            </div>

                            <div className="grid grid-cols-[82px_minmax(0,1fr)] border-b border-black text-sm font-bold">
                                <div className="border-r border-black px-2 py-1">Name</div>
                                <div className="px-2 py-1">{selectedBill.customerName}</div>
                                <div className="border-r border-t border-black px-2 py-1">Address</div>
                                <div className="border-t border-black px-2 py-1">{selectedBill.address}</div>
                            </div>

                            <div className="grid grid-cols-[82px_1fr_82px_1fr] border-b border-black text-sm font-bold">
                                <div className="border-r border-black px-2 py-1">Date</div>
                                <div className="border-r border-black px-2 py-1">{selectedMonthLabel}</div>
                                <div className="border-r border-black px-2 py-1">Bill No.</div>
                                <div className="px-2 py-1">#{selectedBill.customerId}-0826</div>
                            </div>

                            <table className="w-full border-b border-black text-sm">
                                <thead>
                                    <tr>
                                        <th className="border-b border-r border-black px-2 py-2 text-left">Month Of {selectedMonthLabel} Bill</th>
                                        <th className="w-32 border-b border-black px-2 py-2 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(selectedBill.milkSummary).map(([milkType, liters]) => (
                                        <tr key={milkType}>
                                            <td className="border-b border-r border-black px-2 py-1 font-semibold">
                                                {milkType} - {liters} L
                                            </td>
                                            <td className="border-b border-black px-2 py-1 text-right font-semibold">
                                                Rs. {selectedBill.milkAmountSummary[milkType].toLocaleString("en-IN")}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td className="border-b border-r border-black px-2 py-1 font-semibold">Other Amount</td>
                                        <td className="border-b border-black px-2 py-1 text-right font-semibold">
                                            Rs. {selectedBill.otherItemsAmount.toLocaleString("en-IN")}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border-b border-r border-black px-2 py-1 font-semibold">Delivery Charges</td>
                                        <td className="border-b border-black px-2 py-1 text-right font-semibold">
                                            Rs. {selectedBill.deliveryCharges.toLocaleString("en-IN")}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border-b border-r border-black px-2 py-1 font-semibold">Amount</td>
                                        <td className="border-b border-black px-2 py-1 text-right font-semibold">
                                            Rs. {selectedBill.totalAmount.toLocaleString("en-IN")}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border-b border-r border-black px-2 py-1 font-semibold">Advance</td>
                                        <td className="border-b border-black px-2 py-1 text-right font-semibold">
                                            Rs. {selectedBill.advance.toLocaleString("en-IN")}
                                        </td>
                                    </tr>
                                    {/* <tr>
                                        <td className="border-b border-r border-black px-2 py-1 font-semibold">Other</td>
                                        <td className="border-b border-black px-2 py-1 text-right font-semibold">-</td>
                                    </tr> */}
                                    <tr>
                                        <td className="border-r border-black px-2 py-2 text-lg font-bold">Total Bill :</td>
                                        <td className="px-2 py-2 text-right text-lg font-bold">Rs. {selectedBill.balanceAmount.toLocaleString("en-IN")}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className="p-3 text-sm font-semibold">
                                <p>Payment: GPay</p>
                                <p>G.pay no. : 8108140076</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="monthly-bill-print hidden">
                {printBills.map((bill) => renderReceipt(bill))}
            </div>
        </div>
    );
};

export default MonthlyBillPage;
