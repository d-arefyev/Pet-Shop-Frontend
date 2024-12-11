import { createSlice } from "@reduxjs/toolkit";

// Создаём срез состояния (slice) для управления состоянием модального окна.
export const modalSlice = createSlice({
  // Имя среза, используется для отладки и идентификации в Redux DevTools.
  name: "modal",

  // Начальное состояние среза.
  initialState: {
    isOpen: false, // Показывает, открыто ли модальное окно.
    title: null, // Заголовок модального окна.
    content: null, // Содержимое модального окна.
  },

  // Определяем редьюсеры для обработки действий.
  reducers: {
    // Действие для открытия модального окна.
    openModal: (state, action) => {
      state.isOpen = true; // Устанавливаем состояние модального окна как открытое.
      state.title = action.payload.title; // Устанавливаем заголовок из действия.
      state.content = action.payload.content; // Устанавливаем содержимое из действия.
    },
    
    // Действие для закрытия модального окна.
    closeModal: (state) => {
      state.isOpen = false; // Устанавливаем состояние модального окна как закрытое.
      state.title = null; // Очищаем заголовок.
      state.content = null; // Очищаем содержимое.
    },
  },
});

// Экспортируем действия, чтобы их можно было использовать в других частях приложения.
export const { openModal, closeModal } = modalSlice.actions;

// Экспортируем редьюсер, чтобы его можно было использовать в Redux store.
export default modalSlice.reducer;



// import { createSlice } from "@reduxjs/toolkit";

// export const modalSlice = createSlice({
//   name: "modal",
//   initialState: {
//     isOpen: false,
//     title: null,
//     content: null,
//   },
//   reducers: {
//     openModal: (state, action) => {
//       state.isOpen = true;
//       state.title = action.payload.title;
//       state.content = action.payload.content;
//     },
//     closeModal: (state) => {
//       state.isOpen = false;
//       state.title = null;
//       state.content = null;
//     },
//   },
// });

// export const { openModal, closeModal } = modalSlice.actions;
// export default modalSlice.reducer;
