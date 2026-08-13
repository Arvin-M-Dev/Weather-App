# 🌤️ اپلیکیشن آب و هوا

<div align="center">

![Project Banner](public/assets/images/desktop-design.jpg)

یک اپلیکیشن آب و هوایی مدرن با پیش‌بینی بلادرنگ و پشتیبانی موقعیت‌یابی

[![Live Demo](https://img.shields.io/badge/Live_Demo-مشاهده%20سایت-brightgreen?style=for-the-badge)](https://arvin-m-dev.github.io/Weather-App/)
[![Frontend Mentor](https://img.shields.io/badge/Frontend_Mentor-چالش-blue?style=for-the-badge)](https://www.frontendmentor.io/challenges/weather-app-K1FhddVm49)

</div>

---

### 📸 اسکرین‌شات‌ها

<div align="center">
  <img src="public/assets/images/desktop-design.jpg" alt="اپلیکیشن آب و هوا" width="100%" />
</div>

---

### ✨ ویژگی‌ها

- ✅ داده‌های آب و هوایی بلادرنگ از Open-Meteo
- ✅ تشخیص خودکار موقعیت‌یابی با جایگزین
- ✅ جستجوی شهر با پیشنهادات خودکمل
- ✅ نمایش آب و هوای فعلی با معیارهای دقیق
- ✅ پیش‌بینی هر ساعت (قابل اسکرول)
- ✅ پیش‌بینی 7 روزه روزانه
- ✅ تبدیل واحد دما (سلسیوس/فارنهایت)
- ✅ طراحی واکنش‌پذیر (موبایل، تبلت، دسکتاپ)
- ✅ انیمیشن skeleton loading
- ✅ مدیریت خطا با اعلان‌های toast
- ✅ validation ورودی با regex برای کاراکترهای خاص

---

### 🛠️ تکنولوژی‌های استفاده‌شده

- HTML5 
- CSS3 (Tailwind CSS v4.3، انیمیشن‌های سفارشی)
- Vanilla JavaScript (ES6+)
- Anime.js Library
- Geolocation API
- Open-Meteo Weather API
- Nominatim Reverse Geocoding API
- GitHub Pages 

---

### 🎯 پیاده‌سازی کلیدی

**خدمات موقعیت‌یابی و محل:**
- موقعیت‌یابی مرورگر با جایگزین خودکار به شهر پیش‌فرض
- Reverse geocoding برای دریافت نام شهر از مختصات
- جستجوی شهر بدون مشکل با پیشنهادات API

**مدیریت داده‌های آب و هوا:**
- واکشی بلادرنگ از Open-Meteo
- تجزیه پیش‌بینی هر ساعت و روزانه
- تبدیل واحد دما (سلسیوس ↔ فارنهایت)
- تفسیر کد آب و هوا برای آیکون‌ها

**بهبودهای UI/UX:**
- بارگذاری skeleton حین دریافت داده
- انیمیشن‌ها و transitions نرم
- Validation ورودی با regex (از کاراکترهای تلفظی حمایت می‌کند)
- اعلان‌های toast برای مدیریت خطا
- طرح‌بندی Grid پاسخگو برای پیش‌بینی‌ها

**تکامل API:**
```javascript
// Open-Meteo API
https://api.open-meteo.com/v1/forecast?
  latitude=COORD&longitude=COORD&
  daily=temperature_2m_max,weather_code&
  hourly=temperature_2m,weather_code&
  current=temperature_2m,precipitation...

// Nominatim Reverse Geocoding
https://nominatim.openstreetmap.org/reverse?
  format=jsonv2&lat=COORD&lon=COORD

// Geocoding API
https://geocoding-api.open-meteo.com/v1/search?
  name=CITY&count=5&format=json
```

---

### 🙏 قدردانی‌ها

- چالش توسط [Frontend Mentor](https://www.frontendmentor.io?ref=challenge)
- داده‌های آب و هوایی توسط [Open-Meteo](https://open-meteo.com)
- Geocoding توسط [Nominatim](https://nominatim.org)

---

ساخته شده با 💙 توسط [Arvin Dev](https://github.com/Arvin-M-Dev)
