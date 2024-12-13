import { createSlice } from "@reduxjs/toolkit";

// Function to load cart from localStorage
const loadCartFromLocalStorage = () => {
  try {
    const serializedCart = localStorage.getItem("cart");  // Getting cart data from localStorage
    if (serializedCart) {
      return JSON.parse(serializedCart);  // Parse a JSON string and return an object
    }
  } catch (err) {
    console.error("Failed to load cart from localStorage", err);  // Log an error if parsing or access to localStorage fails
  }
  return { items: [] };  // Returns an empty cart by default if there is no data or an error occurs
};

// Create a Slice for Cart with Redux Toolkit
export const cartSlice = createSlice({
  name: "cart",  // Slice name
  initialState: loadCartFromLocalStorage(),  // The initial state of the cart is loaded from localStorage
  reducers: {
    // Reducer for adding product to cart
    addToCart: (state, action) => {
      const { id, title, image, price, discont_price, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      if (existingItem) {
        existingItem.quantity += quantity;  // Increase quantity if the product is already in the cart
      } else {
        state.items.push({
          id,
          quantity,
          title,
          image,
          price,
          discont_price,
        });  // Adding a new product to the cart
      }
      saveCartToLocalStorage(state);  // Save the updated cart to localStorage
    },
    // Reducer to reduce the quantity of goods in the basket
    decrementFromCart: (state, action) => {
      const { id } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      if (existingItem.quantity === 1) {
        state.items = state.items.filter((item) => item.id !== id);  // Remove the product from the cart if its quantity is 1
      } else {
        existingItem.quantity--;  // Reduce the quantity of goods by 1
      }
      saveCartToLocalStorage(state);  // Save the updated cart to localStorage
    },
    // Reducer for updating the quantity of goods in the basket
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      if (existingItem) {
        existingItem.quantity = quantity;  // Updating the quantity of goods
      }
      saveCartToLocalStorage(state);  // Save the updated cart to localStorage
    },
    // Reducer for removing items from the cart
    removeItem: (state, action) => {
      const { id } = action.payload;
      state.items = state.items.filter((item) => item.id !== id);  // Remove product from cart by id
      saveCartToLocalStorage(state);  // Save the updated cart to localStorage
    },
    // Reducer for cleaning the entire cart
    clearCart: (state) => {
      state.items = [];  // Emptying the cart
      saveCartToLocalStorage(state);  // Save empty cart to localStorage
    },
  },
});

// Function to save the cart to localStorage
const saveCartToLocalStorage = (cartState) => {
  try {
    const serializedCart = JSON.stringify(cartState);  // Serialize the cart state into a JSON string
    localStorage.setItem("cart", serializedCart);  // Save a JSON string to localStorage
  } catch (err) {
    console.error("Failed to save cart to localStorage", err); 
  }
};

// Exporting Reducer Actions
export const {
  addToCart,
  decrementFromCart,
  updateQuantity,
  removeItem,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
