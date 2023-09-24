import React from "react";
import "whatwg-fetch";
import "@testing-library/jest-dom";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { render, fireEvent, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import constants from "../helpers/constants";
import App from "../App";

const server = setupServer(
  rest.get("https://api.coinbase.com/v2/exchange-rates",
  (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ data: { rates: { ETH: "0.5", BTC: "0.5" } } } )
    );
  }
));

describe("<App/>", () => {
  beforeAll(() => server.listen());
  beforeEach(() => server.resetHandlers());
  afterAll(() => server.close());
  
  describe ("Fetch status Banner: ", () => {

    test("Warning banner shows while awaiting fetching response", async () => {
      server.use(
        rest.get("https://api.coinbase.com/v2/exchange-rates", (req, res, ctx) => {
          return res(
            ctx.delay(2000), 
            ctx.status(200), 
            ctx.json({ data: { rates: { ETH: "0.5", BTC: "0.5" } } } )
            )
        })
      )
      render(<App />);
      const banner = await screen.findByText("loading rates data");
      expect(banner).toBeInTheDocument();
    });
    
    test("Error banner shows when request fails and input fields are disable", async () => {
      server.use(rest.get("https://api.coinbase.com/v2/exchange-rates", (req, res, ctx) => {
      return res(ctx.status(500))
      }))
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
    
    test("Success banner shows when request is successful", async () => {
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

  });

  describe("Input box validations", () => {

    test("Input boxes failed validation shows correctly and 'unable to calculate' message appears", async () => {
      const user = userEvent.setup();
      render(<App />);
      const usdInput = screen.getByTestId("usd-input");
      const btcInput = screen.getByTestId("btc-input");
      const ethInput = screen.getByTestId("eth-input");
    
      await user.type(usdInput, "a");
      await waitFor( async () => {
        const usdValidationDescription = await screen.findByTestId(
          "usd-validation-description"
        );
        expect(usdValidationDescription).toHaveTextContent(
          constants.errorMessages.NUMERIC_VALUES_ONLY
        );
      })
    
      await user.type(btcInput, "a");
      await waitFor( async () => {
        const btcValidationDescription = await screen.findByTestId(
          "btc-validation-description"
        );
        expect(btcValidationDescription).toHaveTextContent(
          constants.errorMessages.NUMERIC_VALUES_ONLY
        );
      })
    
    
      await user.type(ethInput, "a");
      await waitFor( async () => {
        const ethValidationDescription = await screen.findByTestId(
          "eth-validation-description"
        );
        expect(ethValidationDescription).toHaveTextContent(
          constants.errorMessages.NUMERIC_VALUES_ONLY
        );
      })
    
    });
    
    test("Input boxes resets value when click on 'unable to calcular field'", async () => {
      const user = userEvent.setup();
      render(<App />);
      const usdInput = await screen.getByTestId("usd-input");
      const btcInput = await screen.getByTestId("btc-input");
      const ethInput = await screen.getByTestId("eth-input");
    
      await user.type(usdInput, "a");
      await waitFor(async()=> {
        const usdValidationDescription = await screen.findByTestId(
          "usd-validation-description"
        );
        expect(usdValidationDescription).toHaveTextContent(
          constants.errorMessages.NUMERIC_VALUES_ONLY
        );
        expect(btcInput).toHaveValue(constants.errorMessages.CALCULATE_ERROR);
        expect(ethInput).toHaveValue(constants.errorMessages.CALCULATE_ERROR);
      })
    
      await user.click(btcInput);
      await waitFor(async() => {
        expect(usdInput).toHaveTextContent("");
        expect(btcInput).toHaveTextContent("");
        expect(ethInput).toHaveTextContent("");
      })
    });
  });

  describe("Rate calculation", () => {

    test("<App/> BTC and ETH inputs update when USD input changes", async () => {
      const user = userEvent.setup();
      render(<App />);
      const usdInput = screen.getByTestId("usd-input");
      const btcInput = screen.getByTestId("btc-input");
      const ethInput = screen.getByTestId("eth-input");
    
      await user.type(usdInput, "2");
    
      await waitFor(() => {
        expect(usdInput).toHaveValue("2");
        expect(btcInput).toHaveValue("0.7");
        expect(ethInput).toHaveValue("0.3");
      });
    });
    
    test("<App/> USD and ETH inputs update when BTC input changes", async () => {
      const user = userEvent.setup();
      render(<App />);
      const usdInput = screen.getByTestId("usd-input");
      const btcInput = screen.getByTestId("btc-input");
      const ethInput = screen.getByTestId("eth-input");
    
      await user.type(btcInput, "0.7");
    
      await waitFor(() => {
        expect(usdInput).toHaveValue("2");
        expect(btcInput).toHaveValue("0.7");
        expect(ethInput).toHaveValue("0.3");
      });});
    
    test("<App/> USD and BTC inputs update when ETH input changes", async () => {
      const user = userEvent.setup();
      render(<App />);
      const usdInput = screen.getByTestId("usd-input");
      const btcInput = screen.getByTestId("btc-input");
      const ethInput = screen.getByTestId("eth-input");
    
      await user.type(ethInput, "0.3");
    
      await waitFor(() => {
        expect(usdInput).toHaveValue("2");
        expect(btcInput).toHaveValue("0.7");
        expect(ethInput).toHaveValue("0.3");
      });});
  });

});