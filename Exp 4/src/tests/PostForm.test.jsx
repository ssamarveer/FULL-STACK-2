import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PostForm from "../components/PostForm";

test("renders post form and validates empty title", async () => {
  const user = userEvent.setup();
  render(<PostForm onSave={() => {}} onDelete={() => {}} onCancel={() => {}} />);
  await user.click(screen.getByRole("button", { name: "Create Post" }));
  expect(screen.getByText("Post title is required.")).toBeInTheDocument();
});

test("allows a valid post to be saved", async () => {
  const user = userEvent.setup();
  const onSave = vi.fn();
  render(<PostForm onSave={onSave} onDelete={() => {}} onCancel={() => {}} />);
  await user.type(screen.getByLabelText("Post title"), "Test Post");
  await user.type(screen.getByLabelText("Post content"), "Content");
  await user.type(screen.getByLabelText("Start"), "2026-08-31T10:00");
  await user.type(screen.getByLabelText("End"), "2026-08-31T11:00");
  await user.click(screen.getByRole("button", { name: "Create Post" }));
  expect(onSave).toHaveBeenCalledTimes(1);
  expect(onSave.mock.calls[0][0].title).toBe("Test Post");
});