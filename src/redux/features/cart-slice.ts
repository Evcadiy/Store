import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Item {
  id: number;
  title: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: Item[];
  totalAmount: number;
}

const initialState: CartState = {
  items: [],
  totalAmount: 0,
};

export const cart = createSlice({
  name: "cart",
  initialState,
  reducers: {
    updateTotalAmount: (state, action: PayloadAction<number>) => {
      state.totalAmount = Math.max(0, action.payload);
    },
    updateCartFromStorage: (state, action: PayloadAction<Item[]>) => {
      state.items = [];

      action.payload.forEach((item) => {
        const existingItem = state.items.find(
          (cartItem) => cartItem.id === item.id
        );
        if (!existingItem) {
          state.items.push(item);
        } else {
          existingItem.quantity += item.quantity;
        }
      });
    },
    addItem: (state, action: PayloadAction<Item>) => {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);

      if (!existingItem) {
        state.items.push(newItem);
      } else {
        existingItem.quantity++;
      }
      state.totalAmount += newItem.price * newItem.quantity;

      localStorage.setItem("totalAmount", JSON.stringify(state.totalAmount));
    },

    removeItem: (state, action: PayloadAction<number>) => {
      const itemIndex = state.items.findIndex(
        (item) => item.id === action.payload
      );

      if (itemIndex !== -1) {
        const item = state.items[itemIndex];
        if (item.quantity > 1) {
          item.quantity--;
          state.totalAmount -= item.price;
        } else {
          state.totalAmount -= item.price;
          state.items.splice(itemIndex, 1);
        }
      }
      localStorage.setItem("cartItems", JSON.stringify(state.items));
      localStorage.setItem("totalAmount", JSON.stringify(state.totalAmount));
    },
  },
});

export const { addItem, removeItem, updateCartFromStorage, updateTotalAmount } =
  cart.actions;
export default cart.reducer;
