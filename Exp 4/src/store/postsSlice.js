import { createSlice } from "@reduxjs/toolkit";
import { samplePosts } from "../data/samplePosts";

const postsSlice = createSlice({
  name: "posts",
  initialState: { items: samplePosts },
  reducers: {
    addPost: (state, action) => {
      state.items.push(action.payload);
    },
    updatePost: (state, action) => {
      const index = state.items.findIndex(p => p.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
    },
    deletePost: (state, action) => {
      state.items = state.items.filter(p => p.id !== action.payload);
    },
    reschedulePost: (state, action) => {
      const post = state.items.find(p => p.id === action.payload.id);
      if (post) {
        post.start = action.payload.start;
        post.end = action.payload.end || post.end;
      }
    }
  }
});

export const { addPost, updatePost, deletePost, reschedulePost } = postsSlice.actions;
export default postsSlice.reducer;