import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';

import { openModal, closeModal } from '../../redux/modalSlice';
import GetDiscountButton from '../Buttons/GetDiscountButton/GetDiscountButton';
import styles from './DiscountForm.module.css';
import discountImage from '../../assets/images/pets.png';
import API_URL from '../../utils/api';

function DiscountForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // State to track if the input field has been touched (needed to display tooltips).
  const [touchedFields, setTouchedFields] = useState({
    name: false,
    phone: false,
    email: false,
  });

  const dispatch = useDispatch(); // Hook for dispatching actions in Redux.

  // A function that is called when a form is submitted.
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the standard behavior of the form.

    if (!isFormValid() || isSubmitting) { // If the form is not valid or is already being sent, we stop executing the function.
      return;
    }

    setIsSubmitting(true); // Set the form submission state.

    try {
      const response = await axios.post(`${API_URL}/sale/send`, {
        name,
        phone,
        email,
      });

      if (response.status === 200) { 
        dispatch(openModal({ 
          title: 'Success',
          content: ['Your request has been submitted successfully!'],
        }));
        setIsSubmitted(true); // Set the send state to true.
        clearForm(); // Clean the form.
      }
    } catch (error) {
      dispatch(openModal({ 
        title: 'Error',
        content: 'There was an error submitting your request. Please try again later.',
      }));
    } finally {
      setIsSubmitting(false); // In any case, regardless of the result, we remove the form submission state.
    }
  };

  // Functions to check the validity of each input field.
  const isNameValid = () => /^[A-Za-z\s]+$/.test(name);
  const isPhoneValid = () => /^\d{10,15}$/.test(phone);
  const isEmailValid = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // A function that checks the validity of the entire form.
  const isFormValid = () => isNameValid() && isPhoneValid() && isEmailValid();

  // Function to clear the form and reset the state of the hints.
  const clearForm = () => {
    setName(''); // Clearing the field "Name".
    setPhone(''); // Clearing the field "Phone".
    setEmail(''); // Clearing the field "Email".
    setTouchedFields({ // Resetting the hint states for all fields.
      name: false,
      phone: false,
      email: false,
    });
  };

  // Function to close the modal window and clear the form.
  const handleCloseModal = () => {
    dispatch(closeModal()); // Close the modal window.
    clearForm(); // We clean the form.
  };

  // Function for handling changes in input fields.
  const handleInputChange = (field, value) => {
    // We update the value of the corresponding field.
    if (field === 'name') setName(value);
    if (field === 'phone') setPhone(value.replace(/\D/g, '')); // We process the "Phone" field.
    if (field === 'email') setEmail(value);

    // We mark the field as affected so that we can display a hint in the future if it is invalid.
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
                    onChange={(e) => handleInputChange('name', e.target.value)}
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
                    onChange={(e) => handleInputChange('phone', e.target.value)}
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
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    aria-invalid={!isEmailValid()}
                  />
                  {touchedFields.email && !isEmailValid() && (
                    <div className={styles.tooltip}>Please enter a valid email address with the @ symbol.</div>
                  )}
                </label>
              </div>
              <GetDiscountButton
                onClick={handleSubmit}
                disabled={!isFormValid() || isSubmitting || isSubmitted} // We block the button if the form is invalid, is being sent, or has already been sent.
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiscountForm;
