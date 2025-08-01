import React from "react";
import styles from "./OrderStatusTabs.module.css";
import { useEffect, useState, useCallback } from "react"; // اصلاح ایمپورت

const steps = [
  "در انتظار پرداخت",
  "در حال ارسال",
  "مرسوله ارسال شده",
  "تحویل داده شده",
];

const OrderStatusTabs = () => {
  const [activeStep, setActiveStep] = useState(0);

  const nextStep = () => {
    if (activeStep < steps.length - 1) setActiveStep(activeStep + 1);
  };

  const prevStep = () => {
    if (activeStep > 0) setActiveStep(activeStep - 1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.progressBar}>
        {steps.map((step, index) => (
          <div
            key={index}
            className={`${styles.step} ${
              index <= activeStep ? styles.active : ""
            }`}
          >
            {step}
          </div>
        ))}
      </div>
      <div className={styles.buttons}>
        <button onClick={prevStep} disabled={activeStep === 0}>
          قبلی
        </button>
        <button onClick={nextStep} disabled={activeStep === steps.length - 1}>
          بعدی
        </button>
      </div>
    </div>
  );
};

export default OrderStatusTabs;
