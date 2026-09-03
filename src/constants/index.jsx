import { CalendarDays, FileText, Home, IndianRupee, Users } from "lucide-react";

import ProductImage from "@/assets/product-image.jpg";

export const navbarLinks = [
    {
        title: "Menu",
        links: [
            {
                label: "Dashboard",
                icon: Home,
                path: "/",
            },
            {
                label: "Customer Details",
                icon: Users,
                path: "/customers",
            },
            {
                label: "Monthly Customers",
                icon: CalendarDays,
                path: "/monthly-customers",
            },
            {
                label: "Monthly Bill",
                icon: FileText,
                path: "/monthly-bill",
            },
            {
                label: "Rates",
                icon: IndianRupee,
                path: "/rates",
            },
        ],
    },
];

export const overviewData = [
    { name: "Jan", total: 1200 },
    { name: "Feb", total: 1900 },
    { name: "Mar", total: 1500 },
    { name: "Apr", total: 2400 },
    { name: "May", total: 2100 },
    { name: "Jun", total: 3200 },
];

export const recentSalesData = [];

export const topProducts = [
    {
        id: 1,
        name: "Cow Milk",
        image: ProductImage,
        price: "$1.20/L",
        sales: 340,
    },
    {
        id: 2,
        name: "Buffalo Milk",
        image: ProductImage,
        price: "$1.50/L",
        sales: 290,
    },
    {
        id: 3,
        name: "Organic Cow Milk",
        image: ProductImage,
        price: "$1.80/L",
        sales: 210,
    },
];
