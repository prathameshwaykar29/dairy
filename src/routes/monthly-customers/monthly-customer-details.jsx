export const dailyDeliveryTableColumns = [
    {
        key: "srNo",
        label: "Sr No",
    },
    {
        key: "date",
        label: "Date",
    },
    {
        key: "customerName",
        label: "Customer",
    },
    {
        key: "items",
        label: "Delivered Items",
    },
    {
        key: "quantity",
        label: "Milk Liter",
    },
    {
        key: "deliveryCharge",
        label: "Delivery Charges",
    },
    {
        key: "dailyAmount",
        label: "Daily Amount",
    },
];

export const monthlyCustomers = Array.from({ length: 500 }, (_, index) => {
    const customerNumber = index + 1;
    const areas = ["Andheri West", "Navrangpura", "Saket", "Indiranagar", "Baner"];
    const city = ["Mumbai", "Ahmedabad", "Delhi", "Bengaluru", "Pune"][index % 5];

    return {
        id: customerNumber,
        name: `Milk Customer ${String(customerNumber).padStart(3, "0")}`,
        phone: `+91 9${String(800000000 + customerNumber).slice(0, 9)}`,
        address: `${10 + customerNumber}, ${areas[index % areas.length]}, ${city}`,
    };
});

const lastMonthPlans = [
    {
        customerId: 1,
        milkItems: [
            { name: "Cow Milk", liters: 2, rate: 60 },
            { name: "Buffalo Milk", liters: 1, rate: 75 },
        ],
        otherItems: [
            { day: 1, name: "Curd", amount: 40 },
            { day: 8, name: "Paneer", amount: 120 },
            { day: 15, name: "Ghee", amount: 250 },
            { day: 22, name: "Curd", amount: 40 },
        ],
    },
    {
        customerId: 2,
        milkItems: [{ name: "Buffalo Milk", liters: 1.5, rate: 75 }],
        otherItems: [
            { day: 2, name: "Paneer", amount: 120 },
            { day: 9, name: "Curd", amount: 40 },
            { day: 16, name: "Butter", amount: 90 },
            { day: 23, name: "Cheese", amount: 110 },
        ],
    },
    {
        customerId: 3,
        milkItems: [
            { name: "Gokul Milk", liters: 1, rate: 65 },
            { name: "Cow Milk", liters: 0.5, rate: 60 },
        ],
        otherItems: [
            { day: 3, name: "Butter", amount: 90 },
            { day: 10, name: "Curd", amount: 40 },
            { day: 17, name: "Paneer", amount: 120 },
            { day: 24, name: "Ghee", amount: 250 },
        ],
    },
];

const getLastMonthDeliveryRecords = () => {
    return lastMonthPlans.flatMap((plan) => {
        const customer = monthlyCustomers[plan.customerId - 1];
        const milkLiters = plan.milkItems.reduce((total, milk) => total + milk.liters, 0);
        const milkAmount = plan.milkItems.reduce((total, milk) => total + milk.liters * milk.rate, 0);
        const deliveryCharge = milkLiters * 2;

        return Array.from({ length: 30 }, (_, index) => {
            const day = index + 1;
            const otherItems = plan.otherItems.filter((item) => item.day === day);
            const otherItemsAmount = otherItems.reduce((total, item) => total + item.amount, 0);
            const dailyAmount = milkAmount + otherItemsAmount + deliveryCharge;

            return {
                id: Number(`8${plan.customerId}${String(day).padStart(2, "0")}`),
                customerId: customer.id,
                isoDate: `2026-08-${String(day).padStart(2, "0")}`,
                date: `${String(day).padStart(2, "0")} Aug 2026`,
                customerName: customer.name,
                phone: customer.phone,
                address: customer.address,
                items: [...plan.milkItems.map((milk) => `${milk.name} - ${milk.liters} L`), ...otherItems.map((item) => item.name)],
                quantity: `${milkLiters} L`,
                deliveryCharge: `Rs. ${deliveryCharge}`,
                dailyAmount: `Rs. ${dailyAmount}`,
                deliveryStatus: "Delivered",
            };
        });
    });
};

const currentMonthDeliveryRecords = [
    {
        id: 1,
        customerId: 1,
        isoDate: "2026-09-03",
        date: "03 Sep 2026",
        customerName: monthlyCustomers[0].name,
        phone: monthlyCustomers[0].phone,
        address: monthlyCustomers[0].address,
        items: ["Cow Milk - 2 L", "Curd - 500 g"],
        quantity: "2 L",
        deliveryCharge: "Rs. 4",
        dailyAmount: "Rs. 164",
        monthlyBalance: "Rs. 1,555",
        deliveryStatus: "Delivered",
    },
    {
        id: 2,
        customerId: 2,
        isoDate: "2026-09-03",
        date: "03 Sep 2026",
        customerName: monthlyCustomers[1].name,
        phone: monthlyCustomers[1].phone,
        address: monthlyCustomers[1].address,
        items: ["Buffalo Milk - 1.5 L", "Paneer - 250 g"],
        quantity: "1.5 L",
        deliveryCharge: "Rs. 3",
        dailyAmount: "Rs. 235.5",
        monthlyBalance: "Rs. 670",
        deliveryStatus: "Delivered",
    },
    {
        id: 3,
        customerId: 3,
        isoDate: "2026-09-03",
        date: "03 Sep 2026",
        customerName: monthlyCustomers[2].name,
        phone: monthlyCustomers[2].phone,
        address: monthlyCustomers[2].address,
        items: ["Cow Milk - 1 L"],
        quantity: "1 L",
        deliveryCharge: "Rs. 2",
        dailyAmount: "Rs. 62",
        monthlyBalance: "Rs. 890",
        deliveryStatus: "Pending",
    },
    {
        id: 4,
        customerId: 4,
        isoDate: "2026-09-02",
        date: "02 Sep 2026",
        customerName: monthlyCustomers[3].name,
        phone: monthlyCustomers[3].phone,
        address: monthlyCustomers[3].address,
        items: ["Buffalo Milk - 3 L", "Curd - 1 kg"],
        quantity: "3 L",
        deliveryCharge: "Rs. 6",
        dailyAmount: "Rs. 271",
        monthlyBalance: "Rs. 0",
        deliveryStatus: "Delivered",
    },
    {
        id: 5,
        customerId: 1,
        isoDate: "2026-09-02",
        date: "02 Sep 2026",
        customerName: monthlyCustomers[0].name,
        phone: monthlyCustomers[0].phone,
        address: monthlyCustomers[0].address,
        items: ["Cow Milk - 2 L"],
        quantity: "2 L",
        deliveryCharge: "Rs. 4",
        dailyAmount: "Rs. 124",
        monthlyBalance: "Rs. 1,700",
        deliveryStatus: "Delivered",
    },
];

export const dailyDeliveryRecords = [...currentMonthDeliveryRecords, ...getLastMonthDeliveryRecords()];
