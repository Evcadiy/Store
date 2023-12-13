"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

import styles from "./Header.module.scss";

const Header = () => {
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Store", href: "/store" },
  ];

  const pathname = usePathname();

  return (
    <div className={styles.main}>
      <ul>
        {navLinks.map((link) => {
          const isActive = pathname === link.href;

          return (
            <li key={link.name} className={isActive ? styles.active : ""}>
              <Link href={link?.href}>{link.name}</Link>
            </li>
          );
        })}
        <Link href="/cart" className={styles.cart}>
          <Image src="/icons/cart.svg" width={32} height={32} alt="cart" />
        </Link>
      </ul>
    </div>
  );
};

export default Header;
