import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "resvill_cart_v1";
const COUPONS = {
  WELCOME10: { code: "WELCOME10", label: "10% welcome discount", type: "percent", value: 10 },
};

const readCart = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const itemKey = (item) => [item.foodId, item.size?.name || "", ...(item.extras || []).map((extra) => extra.name).sort()].join("::");

export function CartProvider({ children }) {
  const [items, setItems] = useState(readCart);
  const [coupon, setCoupon] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (item) => {
    const normalized = {
      ...item,
      quantity: Math.max(1, Number(item.quantity) || 1),
      unitPrice: Number(item.basePrice ?? item.price ?? 0) + Number(item.size?.price || 0) + (item.extras || []).reduce((sum, extra) => sum + Number(extra.price || 0), 0),
      specialInstructions: item.specialInstructions || "",
    };
    const key = itemKey(normalized);
    setItems((current) => {
      const existing = current.find((entry) => itemKey(entry) === key);
      if (existing) return current.map((entry) => itemKey(entry) === key ? { ...entry, quantity: entry.quantity + normalized.quantity } : entry);
      return [...current, { ...normalized, id: `${normalized.foodId}-${Date.now()}` }];
    });
  };

  const updateQuantity = (id, quantity) => setItems((current) => quantity <= 0 ? current.filter((item) => item.id !== id) : current.map((item) => item.id === id ? { ...item, quantity } : item));
  const removeItem = (id) => setItems((current) => current.filter((item) => item.id !== id));
  const clearCart = () => { setItems([]); setCoupon(null); };
  const applyCoupon = (code) => {
    const next = COUPONS[String(code || "").trim().toUpperCase()];
    if (!next) return { ok: false, message: "That coupon is not available." };
    setCoupon(next);
    return { ok: true, message: `${next.code} applied.` };
  };

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0), [items]);
  const discount = coupon?.type === "percent" ? Math.round(subtotal * (coupon.value / 100)) : 0;
  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const totals = (deliveryMethod = "delivery") => {
    const deliveryFee = deliveryMethod === "delivery" && items.length ? 1500 : 0;
    const taxable = Math.max(0, subtotal - discount);
    const tax = Math.round(taxable * 0.075);
    return { subtotal, discount, deliveryFee, tax, total: taxable + deliveryFee + tax };
  };

  return <CartContext.Provider value={{ items, itemCount, subtotal, coupon, addItem, updateQuantity, removeItem, clearCart, applyCoupon, totals }}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider");
  return value;
};

export default CartContext;

export const formatNaira = (amount) => `₦${Number(amount || 0).toLocaleString()}`;
