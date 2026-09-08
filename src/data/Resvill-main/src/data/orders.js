
const orders = [
  {
    id: "RSV-10284",
    customer: {
      name: "Michael Uzoh",
      email: "michael@example.com",
      phone: "+234 801 234 5678",
    },
    items: [
      {
        foodId: 1,
        name: "Jollof Rice & Chicken",
        quantity: 2,
        price: 4500,
      },
      {
        foodId: 3,
        name: "Chicken Shawarma",
        quantity: 1,
        price: 3500,
      },
    ],
    subtotal: 12500,
    deliveryFee: 1500,
    total: 14000,
    status: "preparing",
    paymentStatus: "paid",
    paymentMethod: "card",
    deliveryAddress: "12 Example Street, Abuja",
    estimatedDelivery: "25-35 min",
    createdAt: "2026-08-29T10:30:00",
  },

  {
    id: "RSV-10283",
    customer: {
      name: "Sarah Williams",
      email: "sarah@example.com",
      phone: "+234 802 345 6789",
    },
    items: [
      {
        foodId: 4,
        name: "Pepperoni Pizza",
        quantity: 1,
        price: 7500,
      },
    ],
    subtotal: 7500,
    deliveryFee: 1200,
    total: 8700,
    status: "delivered",
    paymentStatus: "paid",
    paymentMethod: "card",
    deliveryAddress: "25 Market Road, Abuja",
    estimatedDelivery: "Delivered",
    createdAt: "2026-08-28T15:20:00",
  },
];

export default orders;

