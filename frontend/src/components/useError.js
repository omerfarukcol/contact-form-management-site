import { useState } from "react";

const useError = () => {
  const [errors, setErrors] = useState([]);

  const addError = (error) => {
    if (!errors.includes(error)) {
      setErrors((prevErrors) => [...prevErrors, error]);
    }
  };

  const removeError = (index) => {
    setErrors((prevErrors) => prevErrors.filter((_, i) => i !== index));
  };

  const clearErrors = () => {
    setErrors([]);
  };

  return {
    errors,
    addError,
    removeError,
    clearErrors,
  };
};

export default useError;
