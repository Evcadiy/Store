"use client";

import { Product } from "@/utils/products";
import getProducts from "@/utils/products";
import { useState, useEffect } from "react";
import Image from "next/image";

import styles from "./Store.module.scss";

import ModalForProducts from "@/components/Modal/ModalForProducts/ModalForProducts";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { addItem } from "@/redux/features/cart-slice";
import { useAppSelector } from "@/redux/store";

const StorePage = () => {
  const [data, setData] = useState<Product[] | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useAppSelector((state) => state.cartReducer.items);

  useEffect(() => {
    getProducts().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setModalOpen(false);
    document.body.style.overflow = "auto";
  };
  // useEffect(() => {
  //   console.log("existingItems updated:", cartItems);
  // }, []);

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
  };

  return (
    <>
      {modalOpen && selectedProduct && (
        <ModalForProducts onClose={closeModal} product={selectedProduct} />
      )}
      {loading ? (
        <div className={styles.loading}></div>
      ) : (
        data && (
          <div className={styles.cards}>
            {data.map((product) => (
              <div key={product.id} className={styles.card}>
                <Image
                  priority
                  src={product.image}
                  width={100}
                  height={100}
                  alt="img"
                />
                <h2 className={styles.title}>{product.title}</h2>
                <p className={styles.price}> ${product.price}</p>
                <button
                  onClick={() => openModal(product)}
                  className={styles.button}
                >
                  See more
                </button>
                <button
                  onClick={() =>
                    addToCartHandler(
                      product.id,
                      product.title,
                      product.price,
                      1
                    )
                  }
                >
                  AddToCart
                </button>
              </div>
            ))}
          </div>
        )
      )}
    </>
  );
};

export default StorePage;
