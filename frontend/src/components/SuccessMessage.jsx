import React, { useState, useEffect } from "react";

const SuccessMessage = ({ show, message, onHide }) => {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);
  }, [show]);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onHide();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onHide]);

  return isVisible ? (
    <div className="alert alert-success mt-3" role="alert">
      {message}
    </div>
  ) : null;
};

export default SuccessMessage;
