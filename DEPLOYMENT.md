# دليل نشر مشروع Mshkur على Hostinger

هذا الدليل الشامل لنشر تطبيق Next.js على Hostinger.

## المتطلبات الأساسية

- حساب Hostinger مع استضافة ويب
- Node.js مثبت على جهازك المحلي (v18 أو أحدث)
- Git مثبت على جهازك
- الوصول إلى لوحة تحكم Hostinger

## خطوات النشر

### 1. بناء المشروع محلياً

```bash
# استنساخ المشروع
git clone https://github.com/mshkuralwaleed-collab/mshkur.git
cd mshkur

# تثبيت المكتبات
npm install

# بناء المشروع للإنتاج
npm run build
```

هذا سينشئ مجلد `out` يحتوي على الملفات الثابتة.

### 2. رفع الملفات إلى Hostinger

#### الطريقة 1: عبر File Manager

1. سجل الدخول إلى لوحة تحكم Hostinger
2. اذهب إلى **Files** > **File Manager**
3. افتح مجلد `public_html`
4. احذف جميع الملفات الموجودة (اختياري)
5. ارفع جميع محتويات مجلد `out` إلى `public_html`
6. تأكد من رفع ملف `.htaccess` من `public/.htaccess`

#### الطريقة 2: عبر FTP

```bash
# استخدم برنامج FileZilla أو أي عميل FTP
# اتصل باستخدام بيانات FTP من Hostinger
# ارفع محتويات مجلد out إلى public_html
```

### 3. إعدادات مهمة

#### ملف .htaccess

تأكد من وجود ملف `.htaccess` في المجلد `public_html` بالمحتوى التالي:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

هذا الملف ضروري لجعل التوجيه (routing) يعمل بشكل صحيح.

### 4. إعداد النطاق (Domain)

1. اذهب إلى **Domains** في لوحة التحكم
2. إذا كنت تستخدم نطاق مخصص، أشر DNS إلى خوادم Hostinger
3. انتظر حتى ينتشر DNS (قد يستغرق حتى 48 ساعة)

### 5. تفعيل SSL (اختياري لكن موصى به)

1. اذهب إلى **SSL** في لوحة التحكم
2. اختر نطاقك
3. فعّل **Let's Encrypt SSL** مجاناً

## استكشاف الأخطاء

### مشكلة: صفحة 404 عند التنقل

**الحل**: تأكد من وجود ملف `.htaccess` في المجلد الجذر

### مشكلة: الصور لا تظهر

**الحل**: تأكد من أن `next.config.ts` يحتوي على:

```typescript
images: {
  unoptimized: true,
  remotePatterns: [...]
}
```

### مشكلة: الموقع يظهر صفحة بيضاء

**الحل**: 
- تحقق من ملفات console للأخطاء
- تأكد من رفع جميع الملفات من مجلد `out`
- تحقق من أذونات الملفات (يجب أن تكون 644 للملفات و 755 للمجلدات)

## التحديثات المستقبلية

لتحديث الموقع:

```bash
# على جهازك المحلي
git pull origin main
npm install
npm run build

# ارفع محتويات مجلد out الجديد إلى public_html
```

## ملاحظات مهمة

- هذا المشروع يستخدم **static export** من Next.js
- بعض ميزات Next.js لا تعمل في وضع التصدير الثابت (مثل API routes و ISR)
- للحصول على أداء أفضل، استخدم CDN مع Hostinger
- احتفظ بنسخة احتياطية من ملفاتك قبل أي تحديث

## الدعم

للمساعدة أو الإبلاغ عن مشاكل:
- افتح issue على GitHub
- راسل فريق دعم Hostinger

---

**تم التحديث**: نوفمبر 2025
