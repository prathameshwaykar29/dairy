import { dailyDeliveryRecords } from "@/routes/monthly-customers/monthly-customer-details";

export const monthOptions = [
    {
        value: "2026-08",
        label: "August 2026",
    },
    {
        value: "2026-09",
        label: "September 2026",
    },
];

const augustCustomers = [
    {
        id: 1,
        name: "Milk Customer 001",
        address: "11, Andheri West, Mumbai",
        advance: 1500,
        dailyPlan: [
            { milkType: "Cow Milk", liters: 2, rate: 60 },
            { milkType: "Buffalo Milk", liters: 1, rate: 75 },
        ],
        otherItems: [
            { day: 1, name: "Curd", amount: 40 },
            { day: 8, name: "Paneer", amount: 120 },
            { day: 15, name: "Ghee", amount: 250 },
            { day: 22, name: "Curd", amount: 40 },
        ],
    },
    {
        id: 2,
        name: "Milk Customer 002",
        address: "12, Navrangpura, Ahmedabad",
        advance: 2000,
        dailyPlan: [{ milkType: "Buffalo Milk", liters: 1.5, rate: 75 }],
        otherItems: [
            { day: 2, name: "Paneer", amount: 120 },
            { day: 9, name: "Curd", amount: 40 },
            { day: 16, name: "Butter", amount: 90 },
            { day: 23, name: "Cheese", amount: 110 },
        ],
    },
    {
        id: 3,
        name: "Milk Customer 003",
        address: "13, Saket, Delhi",
        advance: 1000,
        dailyPlan: [
            { milkType: "Gokul Milk", liters: 1, rate: 65 },
            { milkType: "Cow Milk", liters: 0.5, rate: 60 },
        ],
        otherItems: [
            { day: 3, name: "Butter", amount: 90 },
            { day: 10, name: "Curd", amount: 40 },
            { day: 17, name: "Paneer", amount: 120 },
            { day: 24, name: "Ghee", amount: 250 },
        ],
    },
];

const formatAugustDate = (day) => {
    return `${String(day).padStart(2, "0")} Aug 2026`;
};

const getMilkItems = (dailyPlan) => {
    return dailyPlan.map((milk) => `${milk.milkType} - ${milk.liters} L`);
};

const getMilkAmount = (dailyPlan) => {
    return dailyPlan.reduce((total, milk) => total + milk.liters * milk.rate, 0);
};

const getMilkLiters = (dailyPlan) => {
    return dailyPlan.reduce((total, milk) => total + milk.liters, 0);
};

const getAugustBillRecords = () => {
    return augustCustomers.flatMap((customer) =>
        Array.from({ length: 30 }, (_, index) => {
            const day = index + 1;
            const otherItems = customer.otherItems.filter((item) => item.day === day);
            const milkAmount = getMilkAmount(customer.dailyPlan);
            const otherItemsAmount = otherItems.reduce((total, item) => total + item.amount, 0);
            const itemsAmount = milkAmount + otherItemsAmount;
            const deliveryCharge = getMilkLiters(customer.dailyPlan) * 2;
            const dailyAmount = itemsAmount + deliveryCharge;

            return {
                id: Number(`${customer.id}${String(day).padStart(2, "0")}`),
                customerId: customer.id,
                isoDate: `2026-08-${String(day).padStart(2, "0")}`,
                date: formatAugustDate(day),
                customerName: customer.name,
                address: customer.address,
                advance: customer.advance,
                milkPlan: customer.dailyPlan,
                milkAmountValue: milkAmount,
                otherItemsAmountValue: otherItemsAmount,
                items: [...getMilkItems(customer.dailyPlan), ...otherItems.map((item) => item.name)],
                itemsAmountValue: itemsAmount,
                itemsAmount: `Rs. ${itemsAmount}`,
                deliveryChargeValue: deliveryCharge,
                deliveryCharge: `Rs. ${deliveryCharge}`,
                dailyAmountValue: dailyAmount,
                dailyAmount: `Rs. ${dailyAmount}`,
            };
        }),
    );
};

export const getAmountValue = (amount) => {
    return Number(String(amount).replace(/[^\d.]/g, "")) || 0;
};

export const getMonthlyBills = (selectedMonth) => {
    const allBillRecords = selectedMonth === "2026-08" ? getAugustBillRecords() : [...getAugustBillRecords(), ...dailyDeliveryRecords];
    const monthlyRecords = allBillRecords.filter((record) => record.isoDate.startsWith(selectedMonth));

    return monthlyRecords.reduce((bills, record) => {
        const existingBill = bills.find((bill) => bill.customerId === record.customerId);
        const deliveryCharge = record.deliveryChargeValue ?? getAmountValue(record.deliveryCharge);
        const dailyAmount = record.dailyAmountValue ?? getAmountValue(record.dailyAmount);
        const itemsAmount = record.itemsAmountValue ?? (record.itemsAmount ? getAmountValue(record.itemsAmount) : dailyAmount - deliveryCharge);
        const otherItemsAmount = record.otherItemsAmountValue ?? 0;

        if (existingBill) {
            existingBill.records.push(record);
            existingBill.itemsAmount += itemsAmount;
            existingBill.otherItemsAmount += otherItemsAmount;
            existingBill.deliveryCharges += deliveryCharge;
            existingBill.totalAmount += dailyAmount;
            record.milkPlan?.forEach((milk) => {
                existingBill.milkSummary[milk.milkType] = (existingBill.milkSummary[milk.milkType] || 0) + milk.liters;
                existingBill.milkAmountSummary[milk.milkType] = (existingBill.milkAmountSummary[milk.milkType] || 0) + milk.liters * milk.rate;
            });

            return bills;
        }

        const milkSummary = {};
        const milkAmountSummary = {};
        record.milkPlan?.forEach((milk) => {
            milkSummary[milk.milkType] = (milkSummary[milk.milkType] || 0) + milk.liters;
            milkAmountSummary[milk.milkType] = (milkAmountSummary[milk.milkType] || 0) + milk.liters * milk.rate;
        });

        bills.push({
            customerId: record.customerId,
            customerName: record.customerName,
            address: record.address,
            advance: record.advance || 0,
            records: [record],
            milkSummary,
            milkAmountSummary,
            itemsAmount,
            otherItemsAmount,
            deliveryCharges: deliveryCharge,
            totalAmount: dailyAmount,
        });

        return bills;
    }, []).map((bill) => ({
        ...bill,
        balanceAmount: bill.totalAmount - bill.advance,
    }));
};
