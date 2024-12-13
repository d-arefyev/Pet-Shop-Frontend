import { createSlice } from "@reduxjs/toolkit";

// Create a slice to manage the state of the modal window.
export const modalSlice = createSlice({
  // The name of the slice, used for debugging and identification in Redux DevTools.
  name: "modal",

  // Initial state of the cut.
  initialState: {
    isOpen: false,
    title: null,
    content: null,
  },

  // Define reducers to handle actions.
  reducers: {
    // Action to open a modal window.
    openModal: (state, action) => {
      state.isOpen = true;
      state.title = action.payload.title;
      state.content = action.payload.content;
    },
    
    // Action to close the modal window.
    closeModal: (state) => {
      state.isOpen = false;
      state.title = null;
      state.content = null; 
    },
  },
});

// We export actions so that they can be used in other parts of the application.
export const { openModal, closeModal } = modalSlice.actions;

// We export the reducer so that it can be used in the Redux store.
export default modalSlice.reducer;
