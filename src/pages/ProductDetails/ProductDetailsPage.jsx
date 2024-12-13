import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';

import AddBlueButton from '../../components/Buttons/AddBlueButton/AddBlueButton';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import Counter from '../../components/Counter/Counter';
import styles from './ProductDetailsPage.module.css';
import { addToCart } from '../../redux/cartSlice';

import API_URL from '../../utils/api';

function ProductDetailsPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();  // Function for dispatching actions to the Redux store
  const [isExpanded, setIsExpanded] = useState(false);  // State to control display of full product description

  useEffect(() => {
    const fetchProductAndCategories = async () => {  // Function to get product and category data
      setIsLoading(true);
      setError(null);
      try {
        const productResponse = await axios.get(`${API_URL}/products/${productId}`);  // Request product data
        if (productResponse.data && productResponse.data.length > 0) {
          setProduct(productResponse.data[0]);  // Set product data to state
        } else {
          setProduct(null);
          setError("Product not found.");
        }

        const categoriesResponse = await axios.get(`${API_URL}/categories/all`);  // Request for category data
        setCategories(categoriesResponse.data);  // Set the category list to state
      } catch (error) {
        setError("An error occurred while fetching product details. Please try again later."); 
      } finally {
        setIsLoading(false);  // Set loading state to false after requests complete
      }
    };

    fetchProductAndCategories();  // Call the function to get the data
  }, [productId]);  // useEffect is triggered when productId changes

  const getCategoryName = (categoryId) => {  // Function to get category name by its ID
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.title : 'Unknown Category';
  };

  const handleAddToCart = () => {  // Function for adding a product to the cart
    if (product) {
      dispatch(addToCart({ ...product, quantity }));  // Sending an action to add a product to the cart
    }
  };

  // Отображаем сообщение об ошибке
  if (error) return (
    <div className="errorMessage">{error}</div>
  );

  if (!product) return <p>Product not found.</p>;

  return (
    <div className="globalContainer">
      <div className={styles.productDetailsPage}>
        <Breadcrumbs
          items={[
            { path: '/', label: 'Main page' },
            { path: '/categories', label: 'Categories' },
            { path: `/categories/${product.categoryId}`, label: getCategoryName(product.categoryId) },
            { path: `/products/${productId}`, label: product.title, isActive: true }
          ]}
        />
        <div className={styles.productContainer}>
          <div className={styles.productImageContainer}>
            <img src={`${API_URL}${product.image}`} alt={product.title} className={styles.productImage} />
          </div>
          <div className={styles.productInfo}>
            <h2 className={styles.productTitle}>{product.title}</h2>
            <div className={styles.productPrice}>
              <span className={styles.currentPrice}>${product.discont_price || product.price}</span>
              {product.discont_price && (
                <>
                  <span className={styles.originalPrice}>${product.price}</span>
                  <span className={styles.discountFlag}>
                    -{Math.round(((product.price - product.discont_price) / product.price) * 100)}%
                  </span>
                </>
              )}
            </div>
            <div className={styles.counterAndButton}>
              <Counter quantity={quantity} setQuantity={setQuantity} />
              <AddBlueButton onClick={handleAddToCart} />
            </div>
            <div className={styles.productDescription}>
              <h3>Description</h3>
              <p 
                className={`${styles.productDescriptionText} ${isExpanded ? styles.expanded : styles.collapsed}`}
              >
                {product.description}
              </p>
              <button 
                className={styles.readMoreButton} 
                onClick={() => setIsExpanded(!isExpanded)}
                style={{ display: product.description ? 'block' : 'none' }}
              >
                {isExpanded ? 'Show less' : 'Show more'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsPage;
