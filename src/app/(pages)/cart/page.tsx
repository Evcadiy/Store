"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";

import styles from "./Cart.module.scss";

import { useAppSelector } from "@/redux/store";
import {
  addItem,
  removeItem,
  updateCartFromStorage,
  updateTotalAmount,
} from "@/redux/features/cart-slice";

const Cart = () => {
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const totalAmount = useAppSelector((state) => state.cartReducer.totalAmount);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    loadItemsFromLocalStorage();
  }, []);

  const loadItemsFromLocalStorage = () => {
    const existingItemsString = localStorage.getItem("cartItems");
    const totalAmountString = localStorage.getItem("totalAmount");

    const existingItemsFromStorage: any[] = existingItemsString
      ? JSON.parse(existingItemsString)
      : [];

    const totalAmountFromStorage: any = totalAmountString
      ? JSON.parse(totalAmountString)
      : 0;

    dispatch(updateCartFromStorage(existingItemsFromStorage));
    dispatch(updateTotalAmount(totalAmountFromStorage));
  };

  const removeFromCartHandler = async (id: number) => {
    await removeFromLocalStorage(id);

    dispatch(removeItem(id));

    const removedItem = cartItems.find((item) => item.id === id);

    if (removedItem) {
      const updatedTotalAmount = totalAmount - removedItem.price;
      localStorage.setItem("totalAmount", JSON.stringify(updatedTotalAmount));
    }
  };

  const addToCartHandler = (
    productId: number,
    productName: string,
    productPrice: number,
    productQuantity: number
  ) => {
    const newItem = {
      id: productId,
      title: productName,
      price: productPrice,
      quantity: productQuantity,
    };
    dispatch(addItem(newItem));

    const updatedItems = [...cartItems, newItem];
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));

    const updatedTotalAmount = totalAmount + newItem.price * newItem.quantity;
    localStorage.setItem("totalAmount", JSON.stringify(updatedTotalAmount));
  };

  const removeFromLocalStorage = async (id: number) => {
    return new Promise<void>((resolve) => {
      const existingItemsString = localStorage.getItem("cartItems");

      const existingItems: any[] = existingItemsString
        ? JSON.parse(existingItemsString)
        : [];

      const updatedItems = existingItems.filter((item) => item.id !== id);

      localStorage.setItem("cartItems", JSON.stringify(updatedItems));

      resolve();
    });
  };

  return (
    <div className={styles.cart}>
      {cartItems.length === 0 ? (
        <p className={styles.emptyCart}>Nothing there...</p>
      ) : (
        cartItems.map((item) => (
          <div className={styles.card} key={item.id}>
            <div className={styles.about}>
              <p>Product</p>
              <p>Price</p>
              <p>Quantity</p>
            </div>
            <div className={styles.content}>
              <p className={styles.title}>{item.title}</p>
              <p className={styles.price}>${item.price}</p>
              <p className={styles.quantity}>{item.quantity}</p>
            </div>
            <div className={styles.buttons}>
              <button
                className={styles.addBtn}
                onClick={() => {
                  addToCartHandler(item.id, item.title, item.price, 1);
                }}
              >
                +
              </button>
              <button
                className={styles.removeBtn}
                onClick={() => {
                  removeFromCartHandler(item.id);
                }}
              >
                -
              </button>
            </div>
          </div>
        ))
      )}
      {cartItems.length !== 0 ? (
        <p className={styles.totalAmount}>{`Total Price: $${Math.max(
          0,
          totalAmount
        ).toFixed(2)}`}</p>
      ) : null}
    </div>
  );
};

export default Cart;
