# ⚡ PixLab AI — Turbo Edition

> أول منصة ذكاء اصطناعي مجانية تجمع بين السرعة الفائقة والتحليل العميق للصور — تعمل 100% على GitHub Pages

[![Live Demo](https://img.shields.io/badge/GitHub%20Pages-Live-00d4ff?style=flat)](https://YOUR-USERNAME.github.io/pixlab-ai)
[![Free](https://img.shields.io/badge/Cost-Free-00ff88?style=flat)](https://github.com)

---

## 🛠️ محركات الذكاء الاصطناعي المدمجة

| المحرك | الدور | المزود | التكلفة |
|--------|-------|--------|---------|
| ⚡ **Z Image Turbo** | توليد الصور (< 10 ثوانٍ) | HuggingFace FLUX.1-schnell | مجاني |
| 🧬 **Nano Banana 2** | تحليل الصور + كتابة الأوامر | Google Gemini 1.5 Flash | مجاني |
| 🤖 **GPT-4o-mini** | تحسين الأوامر النصية | OpenAI | اختياري |

---

## 🔑 مفاتيح API المطلوبة

### 1. Google Gemini API Key (مجاني — مطلوب للتحليل)
1. اذهب إلى [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. سجّل الدخول بحساب Google
3. اضغط **"Create API Key"**
4. انسخ المفتاح (يبدأ بـ `AIza...`)

### 2. HuggingFace Token (مجاني — مطلوب للتوليد)
1. سجّل على [huggingface.co/join](https://huggingface.co/join)
2. اذهب إلى [Settings → Access Tokens](https://huggingface.co/settings/tokens)
3. اضغط **"New token"** → اختر **Read** access
4. انسخ الرمز (يبدأ بـ `hf_...`)

### 3. OpenAI API Key (اختياري — لزر "تحسين بـ GPT")
- احصل عليه من [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- إذا لم يكن لديك، سيستخدم التطبيق Gemini بدلاً منه تلقائياً

---

## ✨ الميزات

### 🔍 التحليل التلقائي (Vision-to-Text)
- ارفع أي صورة → Nano Banana يفحصها فوراً
- يكتشف العناصر: الأشخاص، الملابس، الخلفية، الكائنات
- يكتب أمراً (Prompt) احترافياً تلقائياً في صندوق الأوامر

### 🎨 قائمة التعديل التفاعلية (Dynamic Editing List)
- يظهر قائمة بكل عنصر مكتشف في الصورة
- يمكنك تعديل كل عنصر: "بنطال أبيض" → "جينز أزرق"
- يطبّق التعديل تلقائياً في أمر التوليد

### ⚡ التوليد السريع بـ Z Image Turbo
- يولد صورة جديدة بناءً على الأمر في أقل من 10 ثوانٍ
- يدعم أحجام: 512×512, 768×768, 1024×1024, وغيرها
- مدعوم بنموذج FLUX.1-schnell الأحدث

### 🤖 تحسين الأوامر بـ GPT
- اكتب وصفاً بسيطاً → GPT يحوّله إلى أمر سينمائي احترافي
- إذا لم يكن لديك OpenAI، يستخدم Gemini بديلاً

---

## 🚀 نشر على GitHub Pages

```bash
# 1. أنشئ repository جديداً على GitHub
# 2. ارفع ملف index.html
git init
git add index.html README.md
git commit -m "feat: PixLab AI Turbo Edition"
git push origin main

# 3. Settings → Pages → Branch: main → /root → Save
# سيعمل الموقع على: https://USERNAME.github.io/REPO-NAME
```

---

## 🔒 الأمان

- ✅ جميع المفاتيح محفوظة في **localStorage** (على جهازك فقط)
- ✅ لا يتم إرسال المفاتيح لأي خادم
- ✅ الاتصال مباشرة من المتصفح إلى APIs الرسمية
- ⚠️ لا تشارك رابط موقعك مع مفاتيحك المُدخلة — هي خاصة بمتصفحك

---

## 🛠️ التقنيات

- **HTML5 + CSS3 + Vanilla JS** — بدون frameworks
- **Google Gemini 1.5 Flash** — Vision + Text generation
- **HuggingFace Inference API** — FLUX.1-schnell image generation
- **OpenAI API** — GPT-4o-mini prompt enhancement
- **GitHub Pages** — استضافة مجانية

---

**من تطوير: حسين علي** | [@gt_v8i](https://www.instagram.com/gt_v8i)
