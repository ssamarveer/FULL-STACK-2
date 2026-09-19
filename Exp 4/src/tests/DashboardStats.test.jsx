import React from "react";
import { render, screen } from "@testing-library/react";
import DashboardStats from "../components/DashboardStats";

test("shows correct dashboard statistics", () => {
  const posts = [
    {id:"1",status:"Scheduled"}, {id:"2",status:"Scheduled"},
    {id:"3",status:"Published"}, {id:"4",status:"Draft"}
  ];
  render(<DashboardStats posts={posts} />);
  expect(screen.getByText("Total Posts")).toBeInTheDocument();
  expect(screen.getByText("4")).toBeInTheDocument();
  expect(screen.getByText("Scheduled")).toBeInTheDocument();
  expect(screen.getByText("2")).toBeInTheDocument();
  expect(screen.getByText("Published")).toBeInTheDocument();
  expect(screen.getByText("Drafts")).toBeInTheDocument();
  expect(screen.getAllByText("1")).toHaveLength(2);
});