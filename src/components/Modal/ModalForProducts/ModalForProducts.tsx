import styles from "./Modal.module.scss";
import { Product } from "@/utils/products";
import Image from "next/image";

interface ModalProps {
  onClose: () => void;
  product: Product;
}

const ModalForProducts = ({ onClose, product }: ModalProps) => {
  return (
    <>
      <div className={styles.overlay} onClick={onClose}></div>
      <div className={styles.modal}>
        {/* <h2 className={styles.title}>{product.title}</h2> */}
        <div className={styles.content}>
          <Image src={product.image} width={110} height={110} alt="img" />
          <div className={styles.about}>
            <p className={styles.category}>{product.category}</p>
            <p className={styles.rating}>Rating: {product.rating.rate}</p>
            <p className={styles.count}>Count: {product.rating.count}</p>
          </div>
        </div>
        <p className={styles.description}>{product.description}</p>
        <p className={styles.price}>Price: ${product.price}</p>
        <button className={styles.button} onClick={onClose}>
          Close
        </button>
      </div>
    </>
  );
};

export default ModalForProducts;
