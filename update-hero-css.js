const fs = require('fs');

function updateCSS() {
  let css = fs.readFileSync('style.css', 'utf8');

  // 1. Update hero-photo-wrapper
  css = css.replace(
    /\.hero-photo-wrapper \{[\s\S]*?justify-content: center;\r?\n\}/,
    `.hero-photo-wrapper {
  position: relative;
  width: 370px;
  height: 470px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  border-top-left-radius: 999px;
  border-top-right-radius: 999px;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  background: linear-gradient(to bottom, rgba(74,158,255,0.06) 0%, rgba(6,11,24,0) 80%);
  border-top: 1px solid rgba(255,255,255,0.08);
  border-left: 1px solid rgba(255,255,255,0.03);
  border-right: 1px solid rgba(255,255,255,0.03);
  overflow: hidden;
}`
  );

  // 2. Remove hero-photo-wrapper::after
  css = css.replace(
    /\.hero-photo-wrapper::after \{[\s\S]*?pointer-events: none;\r?\n\}/,
    `/* removed hero-photo-wrapper::after to let the arch container handle the bounds */`
  );

  // 3. Update code-card for Glassmorphism & Float
  css = css.replace(
    /\.code-card \{[\s\S]*?overflow: hidden;\r?\n\}/,
    `.code-card {
  background: rgba(13, 17, 23, 0.65);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(74,158,255,0.2);
  border-radius: 12px;
  width: 340px;
  box-shadow: 0 16px 40px rgba(0,0,0,0.6), 0 0 20px rgba(74,158,255,0.08);
  overflow: hidden;
  animation: code-float 4.5s ease-in-out infinite;
}
@keyframes code-float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-10px); }
}`
  );

  // 4. Update availability badge animation duration
  css = css.replace(
    /animation: badge-float 3\.2s ease-in-out infinite;/,
    `animation: badge-float 4s ease-in-out infinite;`
  );

  // 5. Update hero description typography
  css = css.replace(
    /\.hero-description \{[\s\S]*?margin-bottom: 32px;\r?\n\}/,
    `.hero-description {
  font-size: 16px;
  color: #A1A9BD;
  line-height: 1.75;
  margin-bottom: 36px;
  max-width: 90%;
}`
  );

  // 6. Update Button Hover (Scale feedback)
  css = css.replace(
    /\.btn-primary:hover \{[\s\S]*?box-shadow: 0 0 18px var\(--accent-glow\);\r?\n\}/,
    `.btn-primary:hover {
  background: var(--accent-light);
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 8px 24px rgba(74,158,255,0.25);
}`
  );

  css = css.replace(
    /\.btn-outlined:hover \{[\s\S]*?color: #fff;\r?\n\}/,
    `.btn-outlined:hover {
  background: rgba(74,158,255,0.08);
  border-color: var(--accent-light);
  color: var(--accent-light);
  transform: translateY(-2px) scale(1.02);
}`
  );

  // 7. Update hover for let's connect icon
  css = css.replace(
    /\.btn-outlined:hover i \{[\s\S]*?transform: translateX\(3px\);\r?\n\}/,
    `.btn-outlined:hover i {
  transform: translateX(4px);
}`
  );

  fs.writeFileSync('style.css', css);
  console.log('CSS updated');
}

updateCSS();
