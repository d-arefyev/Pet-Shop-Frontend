import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import { openModal, closeModal } from '../../redux/modalSlice';
import { removeItem, clearCart, updateQuantity } from '../../redux/cartSlice';
import Counter from '../../components/Counter/Counter';
import OrderButton from '../../components/Buttons/OrderButton/OrderButton';
import styles from './CartPage.module.css';
import API_URL from '../../utils/api';

function CartPage() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  // Состояния для полей ввода и состояния формы
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Состояние отправки формы
  const [isSubmitted, setIsSubmitted] = useState(false); // Состояние успешной отправки
  const [error, setError] = useState(null); // Состояние для ошибки

  // Состояния для отслеживания, было ли поле затронуто
  const [touchedFields, setTouchedFields] = useState({
    name: false,
    phone: false,
    email: false,
  });

  // Очистка формы после успешной отправки
  useEffect(() => {
    if (isSubmitted) {
      clearForm(); // Очищаем форму
      setIsSubmitted(false); // Сбрасываем состояние отправки
    }
  }, [isSubmitted]);

  // Подсчет общего количества товаров и их стоимости
  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (total, item) => total + (item.discont_price || item.price) * item.quantity,
    0
  );
  const formatPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalPrice);

  // Обработка изменения количества товаров
  const handleQuantityChange = (id, newQuantity) => {
    dispatch(updateQuantity({ id, quantity: newQuantity }));
  };

  // Обработка изменений в полях ввода
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') setName(value);
    if (name === 'phone') setPhone(value.replace(/\D/g, ''));
    if (name === 'email') setEmail(value);

    // Отмечаем поле как затронутое
    setTouchedFields((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  // Отправка формы
  const handlePlaceOrder = async (e) => {
    e.preventDefault(); // Предотвращаем стандартное поведение формы

    // Проверка валидности формы и состояний отправки
    if (!isFormValid() || isSubmitting || isSubmitted) return;

    const orderData = {
      name,
      phone,
      email,
      products: cartItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        title: item.title,
        price: item.price,
        discont_price: item.discont_price || item.price,
        totalPrice: (item.discont_price || item.price) * item.quantity,
      })),
    };

    setIsSubmitting(true); // Устанавливаем состояние отправки
    setError(null); // Сбрасываем ошибку

    try {
      await axios.post(`${API_URL}/order/send`, orderData, { headers: { 'Content-Type': 'application/json' } });
      dispatch(openModal({
        title: 'Congratulations!',
        content: [
          'Your order has been successfully placed on the website.',
          'A manager will contact you shortly to confirm your order.'
        ],
      }));
      setIsSubmitted(true); // Устанавливаем состояние успешной отправки
    } catch (error) {
      console.error('Error placing order', error);
      setError("An error occurred while placing your order. Please try again later."); // Устанавливаем сообщение об ошибке
    } finally {
      setIsSubmitting(false); // В любом случае снимаем состояние отправки
    }
  };

  // Закрытие модального окна и очистка формы
  const handleCloseModal = () => {
    dispatch(closeModal());
    setIsSubmitted(true); // Очищаем форму
  };

  // Очистка формы
  const clearForm = () => {
    setName(''); // Очищаем поле "Name"
    setPhone(''); // Очищаем поле "Phone"
    setEmail(''); // Очищаем поле "Email"
    setTouchedFields({ // Сбрасываем состояния подсказок для всех полей
      name: false,
      phone: false,
      email: false,
    });
    dispatch(clearCart()); // Очищаем корзину
  };

  // Функции для проверки валидности полей
  const isNameValid = () => /^[A-Za-z\s]+$/.test(name); // Проверка валидности имени
  const isPhoneValid = () => /^\d{10,15}$/.test(phone); // Проверка валидности телефона
  const isEmailValid = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // Проверка валидности email

  // Проверка валидности всей формы
  const isFormValid = () => isNameValid() && isPhoneValid() && isEmailValid();

  // Отображаем сообщение об ошибке
  if (error) return (
    <div className="errorMessage">{error}</div>
  );

  // Проверка на пустую корзину
  if (cartItems.length === 0) return (
    <div className="globalContainer">
      <div className={styles.cartPageBlock}>
        <div className="titleBlock">
          <h2>Shopping cart</h2>
          <div className="titleBlockLine"></div>
          <Link to="/products" className="titleBlockButton">
            Back to the store
          </Link>
        </div>
        <div className={styles.emptyCart}>
          <p>Looks like you have no items in your basket currently.</p>
          <Link to="/products" className={styles.continueShoppingButton}>Continue Shopping</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="globalContainer">
      <div className={styles.cartPageBlock}>
        <div className="titleBlock">
          <h2>Shopping cart</h2>
          <div className="titleBlockLine"></div>
          <Link to="/products" className="titleBlockButton">
            Back to the store
          </Link>
        </div>

        <div className={styles.cartContent}>
          <div className={styles.cartDetails}>
            <div className={styles.cartItems}>
              {cartItems.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.productImageContainer}>
                    <img src={`${API_URL}${item.image}`} alt={item.title} className={styles.productImage} />
                  </div>
                  <div className={styles.cartItemDetails}>
                    <h3 className={styles.cartItemTitle} title={item.title}>{item.title}</h3>
                    <div className={styles.cartItemPrice}>
                      <div className={styles.cartItemCounter}>
                        <Counter
                          quantity={item.quantity}
                          setQuantity={(newQuantity) => handleQuantityChange(item.id, newQuantity)}
                        />
                      </div>
                      <div className={styles.priceBox}>
                        {item.discont_price ? (
                          <>
                            <p className={styles.discountPrice}>${(item.discont_price * item.quantity)}</p>
                            <p className={styles.originalPrice}>${(item.price * item.quantity)}</p>
                          </>
                        ) : (
                          <p className={styles.originalPriceLarge}>${(item.price * item.quantity)}</p>
                        )}
                      </div>
                    </div>
                    <button
                      className={styles.removeButton}
                      onClick={() => dispatch(removeItem({ id: item.id }))}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18" stroke="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M6 6L18 18" stroke="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.orderDetails}>
            <h3>Order details</h3>
            <p className={styles.itemsCount}>{totalQuantity} items</p>
            <div className={styles.totalPrice}>
              <span className={styles.totalPriceTitle}>Total</span>
              <span className={styles.totalPriceSumme}>
                {formatPrice}
              </span>
            </div>

            <div className={styles.formContent}>
              <form onSubmit={handlePlaceOrder} className={styles.formGroupBox}>
                <div className={styles.formGroup}>
                  <label>
                    <input
                      type="text"
                      name="name"
                      value={name}
                      placeholder="Name"
                      onChange={handleInputChange}
                      required
                      aria-invalid={!isNameValid()}
                    />
                    {touchedFields.name && !isNameValid() && (
                      <div className={styles.tooltip}>Only Latin letters are allowed.</div>
                    )}
                  </label>
                </div>
                <div className={styles.formGroup}>
                  <label>
                    <input
                      type="tel"
                      name="phone"
                      value={phone}
                      placeholder="Phone number"
                      onChange={handleInputChange}
                      required
                      aria-invalid={!isPhoneValid()}
                    />
                    {touchedFields.phone && !isPhoneValid() && (
                      <div className={styles.tooltip}>Only digits are allowed. Enter 10-15 digits.</div>
                    )}
                  </label>
                </div>
                <div className={styles.formGroup}>
                  <label>
                    <input
                      type="email"
                      name="email"
                      value={email}
                      placeholder="Email"
                      onChange={handleInputChange}
                      required
                      aria-invalid={!isEmailValid()}
                    />
                    {touchedFields.email && !isEmailValid() && (
                      <div className={styles.tooltip}>Please enter a valid email address with the @ symbol.</div>
                    )}
                  </label>
                </div>
                <OrderButton
                  type="submit"
                  disabled={!isFormValid() || isSubmitting || isSubmitted}
                />
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default CartPage;
