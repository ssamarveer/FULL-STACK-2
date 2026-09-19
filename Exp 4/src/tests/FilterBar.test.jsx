import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FilterBar from "../components/FilterBar";

test("changes platform filter", async () => {
  const user = userEvent.setup();
  const setPlatform = vi.fn();
  render(<FilterBar platform="All" status="All" setPlatform={setPlatform} setStatus={() => {}} />);
  await user.selectOptions(screen.getByLabelText("Platform filter"), "Instagram");
  expect(setPlatform).toHaveBeenCalledWith("Instagram");
});