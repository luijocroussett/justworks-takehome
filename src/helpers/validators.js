import constants from "./constants";

export default {
  numbersValidator: (value) => {
    const isValid = value.match(/^\d*(\.\d+)?$/gi);
    return {
      isValid,
      error: isValid ? "" : constants.errorMessages.NUMERIC_VALUES_ONLY
    };
  }
};
