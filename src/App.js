import "./styles.css";
import { useReducer, useEffect } from "react";
import reducers from "./helpers/reducers";
import validator from "./helpers/validators";
import constants from "./helpers/constants";
// import axios from "axios";
import {
  Input,
  Text,
  Heading,
  Grid,
  GridItem,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from "@chakra-ui/react";

export default function App() {
  const [state, dispatch] = useReducer(reducers, {
    rates: { data: {}, status: { value: "", message: "" } },
    fields: {
      assets: {
        value: "",
        status: "",
        message: ""
      },
      btc: {
        value: "",
        status: "",
        message: ""
      },
      eth: {
        value: "",
        status: "",
        message: ""
      }
    }
  });

  const { COINBASE_API_URL } = constants.configs;

  const handleETHFieldChange = (event) => {
    const { value } = event.target;
    const { numbersValidator } = validator;
    dispatch({
      type: "SET_VALUE_ETH",
      payload: { validator: numbersValidator, value }
    });
  };
  const handleBTCFieldChange = (event) => {
    const { value } = event.target;
    const { numbersValidator } = validator;
    dispatch({
      type: "SET_VALUE_BTC",
      payload: { validator: numbersValidator, value }
    });
  };
  const handleAssetsFieldChange = (event) => {
    const { value } = event.target;
    const { numbersValidator } = validator;
    dispatch({
      type: "SET_VALUE_ASSETS",
      payload: { validator: numbersValidator, value }
    });
  };
  const handleInputOnFocus = (event) => {
    if (event.target.value === constants.errorMessages.CALCULATE_ERROR) {
      dispatch({
        type: "RESET_INPUTS"
      });
    }
  };

  useEffect(() => {
    (async () => {
      try {
        dispatch({
          type: "FETCHING_RATES_STARTED"
        });
        const response = await fetch(COINBASE_API_URL);
        if (!response.ok) throw new Error(response.status);
        const data = await response.json();
        // const { data } = await axios.get(COINBASE_API_URL);
        // console.log("response", data);
        dispatch({
          type: "FETCHING_RATES_SUCCESS",
          payload: {
            USDETH: data.data.rates.ETH,
            USDBTC: data.data.rates.BTC
          }
        });
      } catch (e) {
        console.log(e);
        dispatch({
          type: "FETCHING_RATES_ERROR"
        });
      }
    })();
  }, [COINBASE_API_URL]);

  useEffect(() => {
    if (state.rates.status.value === "success") {
      setTimeout(() => {
        dispatch({
          type: "CLEAR_FETCHING_ALERT"
        });
      }, 3000);
    }
  }, [state]);

  const { assets, eth, btc } = state.fields;

  return (
    <div className="App" style={{ padding: "50px" }}>
      {state.rates.status.message && (
        <Alert data-testid="alert-banner" status={state.rates.status.value}>
          <AlertIcon />
          <AlertDescription>{state.rates.status.message}</AlertDescription>
        </Alert>
      )}
      <br />
      <Heading as="h2" size="2xl">
        Asset Allocation Calculator
      </Heading>
      <br />
      <Grid
        h="150px"
        // w="800px"
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(7, 1fr)"
        gap={10}
      >
        <GridItem rowSpan={2} colSpan={3}>
          <Text htmlFor="usd-input"> Investable Assets </Text>
          <Input
            data-testid="usd-input"
            disabled={state.rates.status.value === "error"}
            style={{ textAlign: "center", height: "150px", fontSize: "50px" }}
            isInvalid={assets.status === "error"}
            errorBorderColor="red.300"
            focusBorderColor={assets.status === "error" ? "red.300" : null}
            value={assets.value}
            onChange={handleAssetsFieldChange}
            onFocus={handleInputOnFocus}
          />
          {assets.status === "error" && (
            <Alert status={assets.status}>
              <AlertIcon />
              <AlertTitle>Validation Error!</AlertTitle>
              <AlertDescription data-testid="usd-validation-description">
                {assets.message}
              </AlertDescription>
            </Alert>
          )}
        </GridItem>
        <GridItem colSpan={3} colStart={5} colEnd={8}>
          <Text htmlFor="btc-input"> {`${constants.configs.BTC_ALLOCATION.text} BTC allocation`} </Text>
          <Input
            data-testid="btc-input"
            disabled={state.rates.status.value === "error"}
            style={{ textAlign: "center" }}
            isInvalid={btc.status === "error"}
            errorBorderColor="red.300"
            focusBorderColor={btc.status === "error" ? "red.300" : null}
            value={btc.value}
            onChange={handleBTCFieldChange}
            onFocus={handleInputOnFocus}
          />
          {btc.status === "error" && (
            <Alert status={btc.status}>
              <AlertIcon />
              <AlertTitle>Validation Error!</AlertTitle>
              <AlertDescription data-testid="btc-validation-description">
                {btc.message}
              </AlertDescription>
            </Alert>
          )}
        </GridItem>
        <GridItem colSpan={3} colStart={5} colEnd={8}>
          <Text htmlFor="eth-input"> {`${constants.configs.ETH_ALLOCATION.text} ETH allocation `}</Text>
          <Input
            data-testid="eth-input"
            disabled={state.rates.status.value === "error"}
            style={{ textAlign: "center" }}
            isInvalid={eth.status === "error"}
            errorBorderColor="red.300"
            focusBorderColor={eth.status === "error" ? "red.300" : null}
            value={eth.value}
            onChange={handleETHFieldChange}
            onFocus={handleInputOnFocus}
          />
          {eth.status === "error" && (
            <Alert status={eth.status}>
              <AlertIcon />
              <AlertTitle>Validation Error!</AlertTitle>
              <AlertDescription data-testid="eth-validation-description">
                {eth.message}
              </AlertDescription>
            </Alert>
          )}
        </GridItem>
      </Grid>
    </div>
  );
}
