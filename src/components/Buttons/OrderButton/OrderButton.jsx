import React, { useState } from 'react';
import styles from './OrderButton.module.css';

function OrderButton({ onClick, disabled }) {
  const [state, setState] = useState('normal');

  const handleClick = (e) => {
    if (disabled) return;

    setState('order');
    if (onClick) {
      onClick(e);
    }
    setTimeout(() => setState('ordered'), 2000);
  };

  return (
    <button
      className={`${styles.orderButton} ${state === 'ordered' ? styles.orderedState : ''} ${disabled ? styles.disabled : ''}`}
      onClick={handleClick}
      disabled={disabled}
    >
      {state === 'ordered' ? 'The order is placed' : 'Place order'}
    </button>
  );
}

export default OrderButton;