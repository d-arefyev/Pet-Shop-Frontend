import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';

import { openModal, closeModal } from '../../redux/modalSlice';
import GetDiscountButton from '../Buttons/GetDiscountButton/GetDiscountButton';
import styles from './DiscountForm.module.css';
import discountImage from '../../assets/images/pets.png';
import API_URL from '../../utils/api';

function DiscountForm() {
  // Состояния для хранения значений полей ввода.
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Состояние, чтобы отслеживать, происходит ли отправка формы.
  const [isSubmitted, setIsSubmitted] = useState(false); // Состояние, чтобы отслеживать, была ли форма отправлена.

  // Состояние для отслеживания, было ли поле ввода затронуто (необходимо для отображения подсказок).
  const [touchedFields, setTouchedFields] = useState({
    name: false,
    phone: false,
    email: false,
  });

  const dispatch = useDispatch(); // Хук для отправки действий в Redux.

  // Функция, которая вызывается при отправке формы.
  const handleSubmit = async (event) => {
    event.preventDefault(); // Предотвращаем стандартное поведение формы.

    if (!isFormValid() || isSubmitting) { // Если форма не валидна или уже происходит отправка, прекращаем выполнение функции.
      return;
    }

    setIsSubmitting(true); // Устанавливаем состояние отправки формы.

    try {
      const response = await axios.post(`${API_URL}/sale/send`, {
        name,
        phone,
        email,
      });

      if (response.status === 200) { // Если запрос успешен...
        dispatch(openModal({ // ...открываем модальное окно с сообщением об успехе.
          title: 'Success',
          content: ['Your request has been submitted successfully!'],
        }));
        setIsSubmitted(true); // Устанавливаем состояние отправки в true.
        clearForm(); // Очищаем форму.
      }
    } catch (error) {
      dispatch(openModal({ // Если запрос не удался, показываем сообщение об ошибке.
        title: 'Error',
        content: 'There was an error submitting your request. Please try again later.',
      }));
    } finally {
      setIsSubmitting(false); // В любом случае, независимо от результата, снимаем состояние отправки формы.
    }
  };

  // Функции для проверки валидности каждого поля ввода.
  const isNameValid = () => /^[A-Za-z\s]+$/.test(name);
  const isPhoneValid = () => /^\d{10,15}$/.test(phone);
  const isEmailValid = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Функция, которая проверяет валидность всей формы.
  const isFormValid = () => isNameValid() && isPhoneValid() && isEmailValid();

  // Функция для очистки формы и сброса состояния подсказок.
  const clearForm = () => {
    setName(''); // Очищаем поле "Name".
    setPhone(''); // Очищаем поле "Phone".
    setEmail(''); // Очищаем поле "Email".
    setTouchedFields({ // Сбрасываем состояния подсказок для всех полей.
      name: false,
      phone: false,
      email: false,
    });
  };

  // Функция для закрытия модального окна и очистки формы.
  const handleCloseModal = () => {
    dispatch(closeModal()); // Закрываем модальное окно.
    clearForm(); // Очищаем форму.
  };

  // Функция для обработки изменений в полях ввода.
  const handleInputChange = (field, value) => {
    // Обновляем значение соответствующего поля.
    if (field === 'name') setName(value);
    if (field === 'phone') setPhone(value.replace(/\D/g, '')); // Обрабатываем поле "Phone".
    if (field === 'email') setEmail(value);

    // Отмечаем поле как затронутое, чтобы в дальнейшем отобразить подсказку, если оно невалидно.
    setTouchedFields((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  return (
    <div className="globalContainer">
      <div className={styles.discountFormContainer}>
        <h2>5% off on the first order</h2>
        <div className={styles.formContainer}>
          <div className={styles.imageContainer}>
            <img src={discountImage} alt="Discount" className={styles.discountImage} />
          </div>
          <div className={styles.formContent}>
            <form onSubmit={handleSubmit} className={styles.formGroupBox}>
              <div className={styles.formGroup}>
                <label>
                  <input
                    type="text"
                    value={name}
                    placeholder="Name"
                    onChange={(e) => handleInputChange('name', e.target.value)} // Обрабатываем изменение поля "Name".
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
                    value={phone}
                    placeholder="Phone number"
                    onChange={(e) => handleInputChange('phone', e.target.value)} // Обрабатываем изменение поля "Phone".
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
                    value={email}
                    placeholder="Email"
                    onChange={(e) => handleInputChange('email', e.target.value)} // Обрабатываем изменение поля "Email".
                    required
                    aria-invalid={!isEmailValid()}
                  />
                  {touchedFields.email && !isEmailValid() && (
                    <div className={styles.tooltip}>Please enter a valid email address with the @ symbol.</div>
                  )}
                </label>
              </div>
              <GetDiscountButton
                onClick={handleSubmit} // Отправка формы.
                disabled={!isFormValid() || isSubmitting || isSubmitted} // Блокируем кнопку, если форма невалидна, идет отправка или форма уже отправлена.
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiscountForm;
