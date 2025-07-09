import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // اضافه شده
import styles from "./Login.module.css";
import logo from "../../assets/logo.png";
import { API_URL } from "../../config";
import axios from "axios";
import FooterMenu from "../../components/FooterMenu/FooterMenu";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(90);

  const navigate = useNavigate(); // استفاده از useNavigate

  useEffect(() => {
    let interval = null;
    if (isCodeSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isCodeSent, timer]);

  const handlePhoneChange = (e) => {
    setPhoneNumber(e.target.value);
    setError("");
  };

  const handleCodeChange = (e) => {
    setVerificationCode(e.target.value);
    setError("");
  };

  const handleLoginClick = async () => {
    if (!phoneNumber) {
      setError("لطفا شماره موبایل را وارد کنید");
      return;
    }
    if (phoneNumber.length !== 11 || !phoneNumber.startsWith("09")) {
      setError("شماره موبایل باید 11 رقمی و با 09 شروع شود");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}api/users/send-otp/`, {
        phone_number: phoneNumber,
      });
      console.log(response);

      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsCodeSent(true);
      setTimer(90);
      setError("");
    } catch (err) {
      setError("خطا در ارسال کد تأیید");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setError("لطفا کد تأیید را وارد کنید");
      return;
    }
    if (verificationCode.length !== 6) {
      setError("کد تأیید باید 6 رقمی باشد");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}api/users/verify-otp/`, {
        phone_number: phoneNumber,
        code: verificationCode,
      });
      console.log(response.data);
      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);

      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsVerified(true);
      setError("");
    } catch (err) {
      setError("کد تأیید نادرست است");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPhone = () => {
    setIsCodeSent(false);
    setVerificationCode("");
    setError("");
    setTimer(90);
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.logo} onClick={() => navigate("/")}>
          <img src={logo} alt="لوگو" className={styles.logoImage} />
        </div>

        <p className={styles.welcome}>
          سلام به{" "}
          <span className={styles.brand} onClick={() => navigate("/")}>
            کیمیا ترنج
          </span>{" "}
          خوش آمدید
        </p>

        {isVerified ? (
          <>
            <p className={styles.instruction}>ورود شما موفقیت‌آمیز بود</p>
            <button className={styles.button} onClick={() => navigate("/")}>
              ادامه خرید
            </button>
            <button
              className={styles.buttonSecondary}
              onClick={() => navigate("/user-panel")}
            >
              نمایش پنل کاربری
            </button>
          </>
        ) : (
          <>
            <p className={styles.instruction}>
              {!isCodeSent
                ? "لطفا شماره موبایل خود را وارد کنید"
                : "کد تأیید ارسال شده را وارد کنید"}
            </p>

            {error && <div className={styles.error}>{error}</div>}

            {!isCodeSent ? (
              <>
                <input
                  type="tel"
                  placeholder="مثال: 09123456789"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  className={styles.input}
                  maxLength="11"
                />
                <button
                  className={styles.button}
                  onClick={handleLoginClick}
                  disabled={isLoading}
                >
                  {isLoading ? "در حال ارسال..." : "دریافت کد تأیید"}
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="کد 6 رقمی"
                  value={verificationCode}
                  onChange={handleCodeChange}
                  className={styles.input}
                  maxLength="6"
                />
                <button
                  className={styles.button}
                  onClick={handleVerifyCode}
                  disabled={isLoading}
                >
                  {isLoading ? "در حال بررسی..." : "تایید و ورود"}
                </button>
                {timer > 0 ? (
                  <p className={styles.timer}>ارسال مجدد کد: {timer} ثانیه</p>
                ) : (
                  <button className={styles.button} onClick={handleLoginClick}>
                    ارسال مجدد کد
                  </button>
                )}
                <p className={styles.editPhone} onClick={handleEditPhone}>
                  ویرایش شماره موبایل
                </p>
              </>
            )}
          </>
        )}

        <p className={styles.terms}>
          ورود شما به معنای پذیرش{" "}
          <a href="/terms" className={styles.link}>
            شرایط و قوانین
          </a>{" "}
          کیمیا ترنج است
        </p>
      </div>
      <FooterMenu />
    </div>
  );
};

export default Login;
