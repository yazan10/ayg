import React, { useState, useRef } from 'react';
import './TermsModal.css';

interface TermsModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onAccept, onDecline, onClose }) => {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const bodyRef = useRef<HTMLElement>(null);

  const handleScroll = () => {
    const el = bodyRef.current;
    if (!el) return;
    const isBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 20;
    if (isBottom) setHasScrolledToBottom(true);
  };

  if (!isOpen) return null;

  return (
    <div className="terms-modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <article className="modal-container">
          <header className="modal-container-header">
            <span className="modal-container-title">
              <svg aria-hidden="true" height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0h24v24H0z" fill="none"></path>
                <path d="M14 9V4H5v16h6.056c.328.417.724.785 1.18 1.085l1.39.915H3.993A.993.993 0 0 1 3 21.008V2.992C3 2.455 3.449 2 4.002 2h10.995L21 8v1h-7zm-2 2h9v5.949c0 .99-.501 1.916-1.336 2.465L16.5 21.498l-3.164-2.084A2.953 2.953 0 0 1 12 16.95V11zm2 5.949c0 .316.162.614.436.795l2.064 1.36 2.064-1.36a.954.954 0 0 0 .436-.795V13h-5v3.949z" fill="currentColor"></path>
              </svg>
              سياسة الخصوصية وشروط المجتمع
            </span>

            <button className="icon-button" onClick={onClose} aria-label="إغلاق">
              <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0h24v24H0z" fill="none"></path>
                <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" fill="currentColor"></path>
              </svg>
            </button>
          </header>

          <section ref={bodyRef} onScroll={handleScroll} className="modal-container-body rtf">
            <p style={{ fontSize: '0.8rem', color: '#750550', fontWeight: 700, textAlign: 'center', background: '#fdf2f8', padding: '8px', borderRadius: '8px', border: '1px solid #fbcfe8' }}>
              آخر تحديث: 10 سبتمبر 2026 — يرجى قراءة الشروط كاملة قبل إنشاء حسابك في aygram
            </p>

            <h2>1. مقدمة وترحيب</h2>
            <p>
              مرحباً بك في <strong>aygram</strong> — منصة التواصل الاجتماعي والمتاجر المتكاملة. باستخدامك للمنصة فأنت توافق على سياسة الخصوصية وشروط المجتمع التالية. هدفنا توفير بيئة آمنة، محترمة، ومتوافقة مع قيمنا.
            </p>

            <h2>2. سياسة الخصوصية</h2>
            <h3>2.1 البيانات التي نجمعها</h3>
            <ul>
              <li><strong>معلومات الحساب:</strong> الاسم، اسم المستخدم، البريد الإلكتروني، كلمة المرور المشفرة، وصورة الملف الشخصي (اختيارية).</li>
              <li><strong>بيانات الاستخدام:</strong> المنشورات، الرسائل، الطلبات، وسجل النشاط لتحسين الخدمة.</li>
              <li><strong>بيانات الدفع:</strong> لا نحتفظ ببيانات البطاقات — تتم المعالجة عبر بوابات دفع آمنة فقط.</li>
            </ul>

            <h3>2.2 كيف نستخدم بياناتك</h3>
            <ul>
              <li>تشغيل حسابك وتمكين التواصل والبيع.</li>
              <li>إرسال رموز التحقق OTP والتنبيهات الهامة.</li>
              <li>تحسين الخوارزمية وعرض المحتوى المناسب.</li>
              <li>لن نبيع بياناتك لأي طرف ثالث أبداً.</li>
            </ul>

            <div className="highlight-box">
              <strong>🔒 التزام الخصوصية:</strong> بياناتك مشفرة ومحمية. يمكنك طلب حذف حسابك وبياناتك نهائياً في أي وقت من <strong>الإعدادات &gt; إعدادات الحساب</strong> وسيتم الحذف خلال 24 ساعة.
            </div>

            <h2>3. شروط المجتمع</h2>
            <h3>3.1 السلوك المحترم</h3>
            <p>
              يُمنع منعاً باتاً نشر أو إرسال أي محتوى مسيء، عنصري، تحريضي، أو خادش للحياء. المنصة عائلية وتراعي الذوق العام.
            </p>

            <h3>3.2 المحتوى المحظور</h3>
            <ol>
              <li>الصور أو الفيديوهات الإباحية أو المثيرة.</li>
              <li>خطاب الكراهية، التنمر، أو التهديد.</li>
              <li>انتحال الهوية أو الحسابات الوهمية.</li>
              <li>الغش، الاحتيال، أو بيع منتجات مقلدة/محظورة.</li>
              <li>نشر معلومات شخصية لآخرين بدون إذن.</li>
            </ol>

            <div className="highlight-box red">
              <strong>⚠️ تنبيه هام — الصور المحرمة:</strong> يمنع رفع صور <strong>ذات الأرواح</strong> (البشر والحيوانات المرسومة/المجسمة بشكل كامل) أو <strong>الشخصيات المقتبسة</strong> المحمية بحقوق النشر (كرتون، أنمي، علامات تجارية) كصورة ملف شخصي أو في المتجر. يسمح بالصور الطبيعية، المنتجات، الخط العربي، والرموز التعبيرية. سيتم إزالة المخالف وحظر المتكرر.
            </div>

            <h3>3.3 حقوق النشر</h3>
            <p>
              أنت مسؤول عن كل محتوى تنشره. لا ترفع صوراً أو فيديوهات لا تملك حقوقها. aygram تحترم الملكية الفكرية وستزيل أي محتوى منتهك فور الإبلاغ.
            </p>

            <h2>4. المتاجر والاشتراكات</h2>
            <p>
              تفعيل المتجر <strong>30₪ شهرياً</strong>، توثيق الحساب <strong>25₪</strong>، والعلامة الذهبية <strong>50₪</strong>. جميعها اشتراكات شهرية قابلة للإلغاء. المتاجر غير المفعّلة لا تظهر للشراء.
            </p>

            <h2>5. إخلاء المسؤولية</h2>
            <p>
              المنصة وسيط تقني فقط. المعاملات بين البائع والمشتري مسؤوليتهما. ننصح بالتحقق قبل الدفع والاحتفاظ بإثباتات الطلب.
            </p>

            <h2>6. الموافقة</h2>
            <p>
              بالضغط على <strong>"موافق"</strong> فأنت تقر بأنك قرأت وفهمت ووافقت على سياسة الخصوصية وشروط المجتمع كاملة، وتتعهد بالالتزام بها. في حال عدم الموافقة، اختر <strong>"رفض"</strong> ولن يتم إنشاء حسابك.
            </p>

            <p style={{ textAlign: 'center', fontWeight: 700, color: '#750550', marginTop: '16px' }}>
              شكراً لانضمامك لمجتمع aygram — معاً نبني مساحة راقية وآمنة 🌟
            </p>

            {!hasScrolledToBottom && (
              <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#f59e0b', fontWeight: 600, marginTop: '12px' }}>
                ⬇️ يرجى التمرير لأسفل لقراءة كامل الشروط لتفعيل زر الموافقة
              </p>
            )}
          </section>

          <footer className="modal-container-footer">
            <button className="button is-ghost" onClick={onDecline}>
              رفض
            </button>
            <button
              className="button is-primary"
              onClick={onAccept}
              disabled={!hasScrolledToBottom}
              title={!hasScrolledToBottom ? 'يرجى قراءة الشروط كاملة أولاً' : ''}
            >
              موافق
            </button>
          </footer>
        </article>
      </div>
    </div>
  );
};
