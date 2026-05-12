# 🎮 PlayFlow - Endless Mini-Games Platform

منصة ترفيهية تفاعلية تعتمد على "التصفح اللانهائي" (Endless Scrolling) مثل تيك توك وريلز، ولكن بدلاً من مقاطع الفيديو، يتفاعل المستخدم مع ألعاب مصغرة (Mini-Games) فورية تعمل بتقنية HTML5 أو WebGL.

## ✨ الميزات الرئيسية

### 1. تجربة المستخدم (UX/UI)
- **واجهة التصفح**: واجهة رأسية تعتمد على السحب (Swipe Up/Down) للانتقال بين الألعاب
- **تشغيل فوري**: اللعبة تبدأ في العمل بمجرد ظهورها على الشاشة
- **لوحة التحكم الجانبية**:
  - زر الإعجاب (Heart)
  - زر الحفظ (Bookmark)
  - زر المشاركة

### 2. محرك الإنشاء والتطوير (Create Mode)
- **البرمجة السحابية**: محرر أكواد مدمج يدعم JavaScript/TypeScript
- **نشر فوري**: تظهر اللعبة فوراً في خوارزمية التصفح

### 3. المزايا التقنية
- **تسجيل الدخول**: Google OAuth 2.0
- **نظام التفاعل**: تعليقات أسفل كل لعبة
- **تخصيص الملف الشخصي**: ثيمات (Dark/Light Mode)، إنجازات، محفظة رقمية

## 🚀 التقنيات المستخدمة

### Backend
- Node.js & Express.js
- MongoDB & Mongoose
- Passport.js (Google OAuth 2.0)
- Socket.IO (للألعاب متعددة اللاعبين)
- JWT للمصادقة

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Vanilla JS (بدون أطر عمل)
- CSS Variables للثيمات

## 📁 هيكل المشروع

```
playflow-platform/
├── src/
│   ├── config/
│   │   ├── database.js      # اتصال MongoDB
│   │   └── passport.js      # إعدادات Google OAuth
│   ├── models/
│   │   ├── User.js          # نموذج المستخدم
│   │   ├── Game.js          # نموذج اللعبة
│   │   └── Badge.js         # نموذج الإنجازات
│   ├── routes/
│   │   ├── auth.js          # مسارات المصادقة
│   │   ├── games.js         # مسارات الألعاب
│   │   └── users.js         # مسارات المستخدمين
│   ├── middleware/
│   │   └── auth.js          # Middleware للمصادقة
│   ├── services/
│   │   └── socket.js        # إعدادات Socket.IO
│   └── server.js            # نقطة البداية
├── public/
│   ├── index.html           # الصفحة الرئيسية
│   ├── css/
│   │   └── style.css        # التنسيقات
│   └── js/
│       └── app.js           # كود الواجهة
├── .env.example             # مثال لملف البيئة
└── package.json
```

## 🔧 التثبيت والتشغيل

### المتطلبات المسبقة
- Node.js (v18 أو أحدث)
- MongoDB
- حساب Google Developer للحصول على OAuth credentials

### خطوات التثبيت

1. **استنساخ المشروع**
```bash
git clone <repository-url>
cd playflow-platform
```

2. **تثبيت المكتبات**
```bash
npm install
```

3. **إعداد متغيرات البيئة**
```bash
cp .env.example .env
```

4. **تعديل ملف `.env`**
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/playflow
JWT_SECRET=your-super-secret-jwt-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
FRONTEND_URL=http://localhost:3000
```

5. **تشغيل التطبيق**
```bash
# للتطوير
npm run dev

# للإنتاج
npm start
```

## 📡 API Endpoints

### المصادقة
- `GET /auth/google` - بدء تسجيل الدخول عبر Google
- `GET /auth/google/callback` - معالجة الرد من Google
- `GET /auth/me` - الحصول على بيانات المستخدم الحالي
- `GET /auth/logout` - تسجيل الخروج

### الألعاب
- `GET /api/games` - الحصول على قائمة الألعاب (مع pagination)
- `GET /api/games/:id` - الحصول على لعبة محددة
- `POST /api/games` - إنشاء لعبة جديدة
- `PUT /api/games/:id` - تحديث لعبة
- `DELETE /api/games/:id` - حذف لعبة
- `POST /api/games/:id/like` - إعجاب/إلغاء إعجاب
- `POST /api/games/:id/save` - حفظ/إزالة من المكتبة
- `POST /api/games/:id/comment` - إضافة تعليق
- `POST /api/games/:id/score` -提交 أعلى نتيجة

### المستخدمين
- `GET /api/users/:id` - الحصول على ملف مستخدم
- `PUT /api/users/profile` - تحديث الملف الشخصي
- `GET /api/users/me/library` - الحصول على المكتبة
- `GET /api/users/me/scores` - الحصول على النتائج
- `GET /api/users/me/games` - الحصول على ألعاب المستخدم

## 🎨 تصميم الواجهة

### الألوان والثيمات
- **الوضع الداكن** (الافتراضي): ألوان نيون عصرية
- **الوضع الفاتح**: ألوان هادئة ومريحة

### الخطوط
- Poppins من Google Fonts

### الأيقونات
- Emoji للأيقونات الأساسية
- يمكن استبدالها بـ FontAwesome أو أي مكتبة أخرى

## 🔮 ميزات مستقبلية مقترحة

1. **نظام Block Coding** للمبتدئين
2. **ألعاب متعددة اللاعبين** في الوقت الفعلي
3. **نظام تصنيف متقدم** للخوارزمية
4. **مكتبة أصول (Assets)** مجانية
5. **تحليلات للمطورين** (عدد اللعب، الإعجابات، إلخ)
6. **نظام المكافآت والإنجازات**
7. **دعم المحافظ الرقمية** و NFTs

## 📝 الترخيص

MIT License

## 👥 المساهمة

المساهمات مرحب بها! يرجى فتح Issue أو Pull Request.

---

**PlayFlow** - حيث يلتقي اللعب بالإبداع! 🎮✨
