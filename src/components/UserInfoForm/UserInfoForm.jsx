import React, { useState } from "react";
import styles from "./UserInfoForm.module.css";
import { FaMale, FaFemale } from "react-icons/fa";

const UserInfoForm = () => {
  // آرایه‌های مورد نیاز برای تاریخ تولد (تقویم شمسی)
  const daysArray = Array.from({ length: 31 }, (_, i) => i + 1);
  const persianMonths = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
  ];
  const currentYear = 1402;
  const startYear = 1300;
  const yearsArray = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => currentYear - i
  );

  const provinces = [
    "تهران",
    "اصفهان",
    "خراسان رضوی",
    "فارس",
    "آذربایجان شرقی",
    "آذربایجان غربی",
    "کرمان",
    "گلستان",
    "همدان",
    "مرکزی",
    "کردستان",
    "یزد",
    "سیستان و بلوچستان",
    "مازندران",
  ];
  
  const cities = [
    "تهران",
    "اصفهان",
    "مشهد",
    "شیراز",
    "تبریز",
    "کرمانشاه",
    "رشت",
    "اهواز",
    "قزوین",
  ];

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    nationalCode: "",
    phoneNumber: "",
    birthDay: "",
    birthMonth: "",
    birthYear: "",
    gender: "",
    province: "",
    city: "",
    postalCode: "",
    address: "",
  });

  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    nationalCode: false,
    phoneNumber: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // اعتبارسنجی قبل از ارسال
    if (!formData.firstName || !formData.lastName || !formData.nationalCode || !formData.phoneNumber) {
      alert("لطفا فیلدهای الزامی را تکمیل کنید!");
      return;
    }
    
    console.log("اطلاعات ثبت شد:", formData);
    alert("اطلاعات شما با موفقیت ثبت شد!");
  };

  return (
    <div className={styles.formContainer}>
      <form className={styles.formWrapper} onSubmit={handleSubmit}>
        <h2 className={styles.title}>ویرایش اطلاعات کاربر</h2>

        <div className={styles.formGrid}>
          {/* نام */}
          <div className={styles.inputGroup}>
            <label>نام <span className={styles.required}>*</span></label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="نام"
              required
              className={touched.firstName && !formData.firstName ? styles.error : ""}
            />
            {touched.firstName && !formData.firstName && (
              <span className={styles.errorMessage}>این فیلد الزامی است</span>
            )}
          </div>

          {/* نام خانوادگی */}
          <div className={styles.inputGroup}>
            <label>نام خانوادگی <span className={styles.required}>*</span></label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="نام خانوادگی"
              required
              className={touched.lastName && !formData.lastName ? styles.error : ""}
            />
            {touched.lastName && !formData.lastName && (
              <span className={styles.errorMessage}>این فیلد الزامی است</span>
            )}
          </div>

          {/* کد ملی */}
          <div className={styles.inputGroup}>
            <label>کد ملی <span className={styles.required}>*</span></label>
            <input
              type="text"
              name="nationalCode"
              value={formData.nationalCode}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="کد ملی"
              required
              maxLength="10"
              className={touched.nationalCode && !formData.nationalCode ? styles.error : ""}
            />
            {touched.nationalCode && !formData.nationalCode && (
              <span className={styles.errorMessage}>این فیلد الزامی است</span>
            )}
          </div>

          {/* شماره تماس */}
          <div className={styles.inputGroup}>
            <label>شماره تماس <span className={styles.required}>*</span></label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="شماره تماس"
              required
              className={touched.phoneNumber && !formData.phoneNumber ? styles.error : ""}
            />
            {touched.phoneNumber && !formData.phoneNumber && (
              <span className={styles.errorMessage}>این فیلد الزامی است</span>
            )}
          </div>

          {/* تاریخ تولد */}
          <div className={styles.inputGroup}>
            <label>تاریخ تولد</label>
            <div className={styles.dateFields}>
              <select
                name="birthDay"
                value={formData.birthDay}
                onChange={handleChange}
                className={styles.dateSelect}
              >
                <option value="">روز</option>
                {daysArray.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
              <select
                name="birthMonth"
                value={formData.birthMonth}
                onChange={handleChange}
                className={styles.dateSelect}
              >
                <option value="">ماه</option>
                {persianMonths.map((month, index) => (
                  <option key={index} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                name="birthYear"
                value={formData.birthYear}
                onChange={handleChange}
                className={styles.dateSelect}
              >
                <option value="">سال</option>
                {yearsArray.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* جنسیت */}
          <div className={`${styles.inputGroup} ${styles.genderGroup}`}>
            <label>جنسیت</label>
            <div className={styles.genderFields}>
              <label className={styles.genderLabel}>
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  onChange={handleChange}
                  checked={formData.gender === "male"}
                  className={styles.genderInput}
                />
                <div className={`${styles.genderOption} ${formData.gender === "male" ? styles.selected : ""}`}>
                  <FaMale className={styles.genderIcon} />
                  <span>مرد</span>
                </div>
              </label>
              <label className={styles.genderLabel}>
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  onChange={handleChange}
                  checked={formData.gender === "female"}
                  className={styles.genderInput}
                />
                <div className={`${styles.genderOption} ${formData.gender === "female" ? styles.selected : ""}`}>
                  <FaFemale className={styles.genderIcon} />
                  <span>زن</span>
                </div>
              </label>
            </div>
          </div>

          {/* استان */}
          <div className={styles.inputGroup}>
            <label>استان</label>
            <select
              name="province"
              value={formData.province}
              onChange={handleChange}
              className={styles.selectField}
            >
              <option value="">انتخاب استان</option>
              {provinces.map((prov, index) => (
                <option key={index} value={prov}>
                  {prov}
                </option>
              ))}
            </select>
          </div>

          {/* شهر */}
          <div className={styles.inputGroup}>
            <label>شهر</label>
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={styles.selectField}
            >
              <option value="">انتخاب شهر</option>
              {cities.map((city, index) => (
                <option key={index} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* کد پستی */}
          <div className={styles.inputGroup}>
            <label>کد پستی<span className={styles.required}>*</span></label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="کد پستی"
              maxLength="10"
            />
          </div>
        </div>

        {/* آدرس کامل */}
        <div className={`${styles.inputGroup} ${styles.addressField}`}>
          <label>آدرس کامل</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="آدرس کامل"
            rows="4"
            className={styles.addressTextarea}
          ></textarea>
        </div>

        {/* دکمه ثبت */}
        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.submitButton}>
            ثبت اطلاعات
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserInfoForm;