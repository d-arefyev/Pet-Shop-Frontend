import React from 'react';
import styles from './Counter.module.css';

const Counter = ({ quantity, setQuantity }) => {
  const handleIncrement = () => setQuantity(quantity + 1);
  const handleDecrement = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  return (
    <div className={styles.counterContainer}>
      <button className={styles.button} onClick={handleDecrement}></button>
      <span className={styles.quantity}>{quantity}</span>
      <button className={styles.button} onClick={handleIncrement}></button>
    </div>
  );
};

export default Counter;
