import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import styles from './Header.module.css';
import mainLogo from '../../assets/icons/main-logo.svg';
import cartIcon from '../../assets/icons/cart.svg';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
  const cartItems = useSelector((state) => state.cart.items);
  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={styles.Header}>
      <div className="globalContainer">
        <div className={styles.headerContent}>
          <Link to="/">
            <img src={mainLogo} alt="Main Logo" className={styles.mainLogo}/>
          </Link>
          <nav className={`${styles.navBlock} ${isMenuOpen ? styles.hideMenu : ''}`}>
            <ul>
              <li>
                <Link to="/" className={styles.navLink}>Main Page</Link>
              </li>
              <li>
                <Link to="/categories" className={styles.navLink}>Categories</Link>
              </li>
              <li>
                <Link to="/products" className={styles.navLink}>All Products</Link>
              </li>
              <li>
                <Link to="/discounted-products" className={styles.navLink}>All Sales</Link>
              </li>
            </ul>
          </nav>
          <Link to="/cart" className={styles.cartLink}>
            <img src={cartIcon} alt="Cart" />
            {cartItemsCount > 0 && (
              <span className={styles.cartBadge}>{cartItemsCount}</span>
            )}
          </Link>
          {isMobile && (
            <button className={styles.burgerButton} onClick={handleMenuToggle}>
              <svg width="36" height="28" viewBox="0 0 36 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 2H34" stroke="none" strokeWidth="3.67" strokeLinecap="round"/>
                <path d="M2 14H34" stroke="none" strokeWidth="3.67" strokeLinecap="round"/>
                <path d="M2 26H34" stroke="none" strokeWidth="3.67" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>
      </div>
      {isMobile && (
        <div className={`${styles.mobileOverlay} ${isMenuOpen ? styles.visible : ''}`}>
          <button className={styles.closeButton} onClick={handleMenuToggle}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M34 2L2 34" stroke="none" strokeWidth="3.67" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 2L34 34" stroke="none" strokeWidth="3.67" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className={styles.mobileMenuBody}>
            <ul className={styles.mobileMenuList}>
              <li className={styles.mobileMenuItem}>
                <Link to="/" className={styles.navLink} onClick={handleMenuToggle}>Main Page</Link>
              </li>
              <li className={styles.mobileMenuItem}>
                <Link to="/categories" className={styles.navLink} onClick={handleMenuToggle}>Categories</Link>
              </li>
              <li className={styles.mobileMenuItem}>
                <Link to="/products" className={styles.navLink} onClick={handleMenuToggle}>All Products</Link>
              </li>
              <li className={styles.mobileMenuItem}>
                <Link to="/discounted-products" className={styles.navLink} onClick={handleMenuToggle}>All Sales</Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
