import React from "react";
import "whatwg-fetch";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import constants from "../src/helpers/constants";
import App from "../src/App";

const server = setupServer(
  rest.get("https://api.coinbase.com"),
  (req, res, ctx) => {
    return rest(
      ctx.status(200),
      ctx.json({ data: { data: { rates: { ETH: "0.5", BTC: "0.5" } } } })
    );
  }
);

beforeAll(() => server.listen());
beforeEach(() => server.resetHandlers());
afterAll(() => server.close());

test("<App/> Warning banner shows while awaiting fetching response", async () => {
  render(<App />);
  const banner = await screen.findByText("loading rates data");
  expect(banner).toBeInTheDocument();
});

test("<App/> Error banner shows when request fails and input fields are disable", async () => {
  render(<App />);

  // banner appears with proper error message
  const banner = await screen.findByText("unable to retrieve rates data");
  expect(banner).toBeInTheDocument();

  // Inputs are disabled
  const usdInput = await screen.getByTestId("usd-input");
  const btcInput = await screen.getByTestId("btc-input");
  const ethInput = await screen.getByTestId("eth-input");

  expect(usdInput).toHaveAttribute("disabled");
  expect(btcInput).toHaveAttribute("disabled");
  expect(ethInput).toHaveAttribute("disabled");
});

test("<App/> Success banner shows when request is successful", async () => {
  render(<App />);
  const banner = await screen.findByText("rates data retrieved successfully");
  expect(banner).toBeInTheDocument();

  // Inputs are not disabled
  const usdInput = await screen.getByTestId("usd-input");
  const btcInput = await screen.getByTestId("btc-input");
  const ethInput = await screen.getByTestId("eth-input");

  expect(usdInput).not.toBeDisabled();
  expect(btcInput).not.toBeDisabled();
  expect(ethInput).not.toBeDisabled();
});

test("<App/> Input boxes failed validation shows correctly and 'unable to calculate' message appears", async () => {
  const user = userEvent.setup();
  render(<App />);
  const usdInput = screen.getByTestId("usd-input");
  const btcInput = screen.getByTestId("btc-input");
  const ethInput = screen.getByTestId("eth-input");

  await user.type(usdInput, "a");

  const usdValidationDescription = await screen.findByTestId(
    "usd-validation-description"
  );
  console.log("typeof", typeof usdValidationDescription);
  expect(usdValidationDescription).toHaveTextContent(
    "This field can only contain numbers"
  );

  await user.type(btcInput, "a");

  const btcValidationDescription = await screen.findByTestId(
    "btc-validation-description"
  );
  expect(btcValidationDescription).toHaveTextContent(
    "This field can only contain numbers"
  );

  await user.type(ethInput, "a");

  const ethValidationDescription = await screen.findByTestId(
    "eth-validation-description"
  );
  expect(ethValidationDescription).toHaveTextContent(
    "This field can only contain numbers"
  );
});

test("<App/> Input boxes resets value when click on 'unable to calcular field'", async () => {
  render(<App />);
  const usdInput = await screen.getByTestId("usd-input");
  const btcInput = await screen.getByTestId("btc-input");
  const ethInput = await screen.getByTestId("eth-input");

  fireEvent.change(usdInput, {
    target: { value: "a" }
  });
  const usdValidationDescription = await screen.findByTestId(
    "usd-validation-description"
  );
  expect(usdValidationDescription).toHaveTextContent(
    constants.errorMessages.NUMERIC_VALUES_ONLY
  );
  expect(btcInput).toHaveValue("Unable to calculate");
  expect(ethInput).toHaveValue("Unable to calculate");

  fireEvent.click(btcInput);

  expect(usdInput).toHaveTextContent("");
  expect(btcInput).toHaveTextContent("");
  expect(ethInput).toHaveTextContent("");
});

test("<App/> BTC and ETH inputs update when USD input changes", async () => {
  render(<App />);
  const usdInput = screen.getByTestId("usd-input");
  const btcInput = screen.getByTestId("btc-input");
  const ethInput = screen.getByTestId("eth-input");

  userEvent.type(usdInput, "2");

  await waitFor(() => {
    expect(usdInput).toHaveValue("2");
    expect(btcInput).toHaveValue("0.7");
    expect(ethInput).toHaveValue("0.3");
  });
});

test("<App/> USD and ETH inputs update when BTC input changes", () => {});

test("<App/> USD and BTC inputs update when ETH input changes", () => {});
