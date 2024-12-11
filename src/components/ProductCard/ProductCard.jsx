import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { addToCart } from '../../redux/cartSlice';
import AddBlueButton from '../Buttons/AddBlueButton/AddBlueButton';
import styles from './ProductCard.module.css';
import API_URL from '../../utils/api';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  // Обработчик добавления товара в корзину
  const handleAddToCart = (event) => {
    event.stopPropagation(); // Останавливаем распространение события клика
    event.preventDefault(); // Дополнительно предотвращаем переход по ссылке
    dispatch(addToCart({ ...product, quantity: 1 })); // Добавляем товар с количеством 1
  };

  const calculateDiscountPercentage = (price, discountPrice) => {
    if (price && discountPrice) {
      const discount = ((price - discountPrice) / price) * 100;
      return Math.round(discount);
    }
    return 0;
  };

  return (
    <li className={styles.productCard}>
      <Link to={`/products/${product.id}`} className={styles.productLink}>
        <div className={styles.productImageContainer}>
          <img src={`${API_URL}${product.image}`} alt={product.title} className={styles.productImage} />
          {product.discont_price && (
            <div className={styles.discountFlag}>
              -{calculateDiscountPercentage(product.price, product.discont_price)}%
            </div>
          )}
          <div className={styles.addButtonContainer}>
            <AddBlueButton onClick={handleAddToCart} />
          </div>
        </div>
        <div className={styles.productInfo}>
          <h3 className={styles.productTitle}>{product.title}</h3>
          <div className={styles.priceContainer}>
            {product.discont_price ? (
              <>
                <span className={styles.currentPrice}>${product.discont_price}</span>
                <span className={styles.originalPrice}>${product.price}</span>
              </>
            ) : (
              <span className={styles.currentPrice}>${product.price}</span>
            )}
          </div>
        </div>
      </Link>
    </li>
  );
};

export default ProductCard;