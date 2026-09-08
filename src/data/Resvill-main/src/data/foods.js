const foods = [
  {
    id: 1,
    name: "Jollof Rice & Chicken",
    slug: "jollof-rice-chicken",
    description:
      "Flavorful Nigerian jollof rice served with perfectly grilled chicken.",
    price: 4500,
    oldPrice: 5000,
    image:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=85",
    category: "Rice",
    categoryId: "rice",
    rating: 4.9,
    reviews: 128,
    available: true,
    popular: true,
    bestSeller: true,
    preparationTime: "20-30 min",
    tags: ["Popular", "Best Seller"],
    options: {
      sizes: [
        { name: "Regular", price: 0 },
        { name: "Large", price: 1500 },
      ],
      extras: [
        { name: "Extra Chicken", price: 2000 },
        { name: "Fried Plantain", price: 1000 },
        { name: "Coleslaw", price: 800 },
      ],
    },
  },

  {
    id: 2,
    name: "Classic Beef Burger",
    slug: "classic-beef-burger",
    description:
      "Juicy beef patty with fresh vegetables, cheese and our signature sauce.",
    price: 5500,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85",
    category: "Burgers",
    categoryId: "burgers",
    rating: 4.8,
    reviews: 96,
    available: true,
    popular: true,
    bestSeller: true,
    preparationTime: "15-25 min",
    tags: ["Popular"],
    options: {
      sizes: [
        { name: "Regular", price: 0 },
        { name: "Double", price: 2000 },
      ],
      extras: [
        { name: "Extra Cheese", price: 700 },
        { name: "Extra Patty", price: 1800 },
        { name: "French Fries", price: 1500 },
      ],
    },
  },

  {
    id: 3,
    name: "Chicken Shawarma",
    slug: "chicken-shawarma",
    description:
      "Tender seasoned chicken wrapped with fresh vegetables and creamy sauce.",
    price: 3500,
    image:
      "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=900&q=85",
    category: "Shawarma",
    categoryId: "shawarma",
    rating: 4.9,
    reviews: 114,
    available: true,
    popular: true,
    bestSeller: true,
    preparationTime: "10-20 min",
    tags: ["Popular", "Best Seller"],
    options: {
      sizes: [
        { name: "Regular", price: 0 },
        { name: "Large", price: 1200 },
      ],
      extras: [
        { name: "Extra Chicken", price: 1500 },
        { name: "Extra Cheese", price: 700 },
        { name: "Extra Sauce", price: 300 },
      ],
    },
  },

  {
    id: 4,
    name: "Pepperoni Pizza",
    slug: "pepperoni-pizza",
    description:
      "Crispy crust topped with rich tomato sauce, mozzarella and pepperoni.",
    price: 7500,
    oldPrice: 8500,
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=900&q=85",
    category: "Pizza",
    categoryId: "pizza",
    rating: 4.7,
    reviews: 87,
    available: true,
    popular: true,
    bestSeller: false,
    preparationTime: "25-35 min",
    tags: ["Popular"],
    options: {
      sizes: [
        { name: "Small", price: 0 },
        { name: "Medium", price: 2000 },
        { name: "Large", price: 4000 },
      ],
      extras: [
        { name: "Extra Cheese", price: 1000 },
        { name: "Extra Pepperoni", price: 1200 },
      ],
    },
  },

  {
    id: 5,
    name: "Grilled Chicken & Chips",
    slug: "grilled-chicken-chips",
    description:
      "Juicy grilled chicken served with crispy golden fries and sauce.",
    price: 6000,
    image:
      "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&q=85",
    category: "Chicken",
    categoryId: "chicken",
    rating: 4.8,
    reviews: 73,
    available: true,
    popular: false,
    bestSeller: true,
    preparationTime: "25-30 min",
    tags: ["Best Seller"],
    options: {
      sizes: [
        { name: "Regular", price: 0 },
        { name: "Large", price: 1500 },
      ],
      extras: [
        { name: "Extra Chicken", price: 2000 },
        { name: "Extra Chips", price: 1000 },
        { name: "Coleslaw", price: 800 },
      ],
    },
  },

  {
    id: 6,
    name: "Pancake Stack",
    slug: "pancake-stack",
    description:
      "Fluffy pancakes served with fresh fruits, syrup and butter.",
    price: 4000,
    image:
      "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=900&q=85",
    category: "Breakfast",
    categoryId: "breakfast",
    rating: 4.6,
    reviews: 52,
    available: true,
    popular: false,
    bestSeller: false,
    preparationTime: "15-20 min",
    tags: [],
    options: {
      sizes: [
        { name: "Regular", price: 0 },
        { name: "Large", price: 1200 },
      ],
      extras: [
        { name: "Extra Fruits", price: 800 },
        { name: "Chocolate Syrup", price: 500 },
      ],
    },
  },

  {
    id: 7,
    name: "Fresh Fruit Smoothie",
    slug: "fresh-fruit-smoothie",
    description:
      "Refreshing blend of fresh fruits made to order.",
    price: 2500,
    image:
      "https://images.unsplash.com/photo-1502741224143-90386d7f8c82?auto=format&fit=crop&w=900&q=85",
    category: "Drinks",
    categoryId: "drinks",
    rating: 4.7,
    reviews: 41,
    available: true,
    popular: false,
    bestSeller: false,
    preparationTime: "5-10 min",
    tags: [],
    options: {
      sizes: [
        { name: "Regular", price: 0 },
        { name: "Large", price: 800 },
      ],
      extras: [],
    },
  },

  {
    id: 8,
    name: "Chocolate Cake",
    slug: "chocolate-cake",
    description:
      "Rich and moist chocolate cake finished with smooth chocolate frosting.",
    price: 3500,
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85",
    category: "Desserts",
    categoryId: "desserts",
    rating: 4.9,
    reviews: 65,
    available: true,
    popular: false,
    bestSeller: true,
    preparationTime: "5-10 min",
    tags: ["Best Seller"],
    options: {
      sizes: [
        { name: "Slice", price: 0 },
        { name: "Large Slice", price: 1000 },
      ],
      extras: [
        { name: "Ice Cream", price: 1000 },
      ],
    },
  },

  {
    id: 9,
    name: "Fried Rice & Chicken",
    slug: "fried-rice-chicken",
    description:
      "Special fried rice loaded with vegetables and served with grilled chicken.",
    price: 5000,
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=85",
    category: "Rice",
    categoryId: "rice",
    rating: 4.8,
    reviews: 102,
    available: true,
    popular: true,
    bestSeller: true,
    preparationTime: "20-30 min",
    tags: ["Popular", "Best Seller"],
    options: {
      sizes: [
        { name: "Regular", price: 0 },
        { name: "Large", price: 1500 },
      ],
      extras: [
        { name: "Extra Chicken", price: 2000 },
        { name: "Fried Plantain", price: 1000 },
      ],
    },
  },

  {
    id: 10,
    name: "BBQ Chicken Pizza",
    slug: "bbq-chicken-pizza",
    description:
      "Smoky BBQ chicken, mozzarella and vegetables on a crispy pizza base.",
    price: 8000,
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=85",
    category: "Pizza",
    categoryId: "pizza",
    rating: 4.8,
    reviews: 79,
    available: true,
    popular: false,
    bestSeller: true,
    preparationTime: "25-35 min",
    tags: ["Best Seller"],
    options: {
      sizes: [
        { name: "Small", price: 0 },
        { name: "Medium", price: 2000 },
        { name: "Large", price: 4000 },
      ],
      extras: [
        { name: "Extra Cheese", price: 1000 },
        { name: "Extra Chicken", price: 1500 },
      ],
    },
  },
];

export default foods;

