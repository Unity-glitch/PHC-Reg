// ─────────────────────────────────────────
//  ✅ Replace with your Vercel backend URL
// ─────────────────────────────────────────
const SERVER_URL = "https://phc-reg-wqfa.vercel.app";

// ─────────────────────────────────────────
//  Toast Styles
// ─────────────────────────────────────────
const toastStyles = document.createElement("style");
toastStyles.textContent = `
  #toast-wrapper {
    position: fixed;
    top: 30px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    pointer-events: none;
  }
  .toast {
    display: flex;
    align-items: center;
    gap: 14px;
    background: #ffffff;
    border-left: 5px solid #22c55e;
    border-radius: 12px;
    padding: 16px 24px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.15);
    min-width: 320px;
    max-width: 420px;
    pointer-events: all;
    animation: slideDown 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }
  .toast.error { border-left-color: #ef4444; }
  .toast.error .toast-icon { background: #fee2e2; }
  .toast.error .toast-icon svg { stroke: #dc2626; }
  .toast.hide { animation: slideUp 0.35s ease-in forwards; }
  .toast-icon {
    width: 38px;
    height: 38px;
    background: #dcfce7;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .toast-icon svg {
    width: 20px;
    height: 20px;
    stroke: #16a34a;
    fill: none;
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .toast-body { display: flex; flex-direction: column; gap: 2px; }
  .toast-title {
    font-family: 'Segoe UI', sans-serif;
    font-weight: 700;
    font-size: 15px;
    color: #111827;
  }
  .toast-message {
    font-family: 'Segoe UI', sans-serif;
    font-size: 13px;
    color: #6b7280;
  }
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideUp {
    from { opacity: 1; transform: translateY(0); }
    to   { opacity: 0; transform: translateY(-20px); }
  }
`;
document.head.appendChild(toastStyles);

// ─────────────────────────────────────────
//  Toast Container
// ─────────────────────────────────────────
const toastWrapper = document.createElement("div");
toastWrapper.id = "toast-wrapper";
document.body.appendChild(toastWrapper);

// ─────────────────────────────────────────
//  Show Toast Function
// ─────────────────────────────────────────
function showToast(title, message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type === "error" ? "error" : ""}`;
  const icon =
    type === "error"
      ? `<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>`
      : `<polyline points="20 6 9 17 4 12"/>`;
  toast.innerHTML = `
    <div class="toast-icon">
      <svg viewBox="0 0 24 24">${icon}</svg>
    </div>
    <div class="toast-body">
      <span class="toast-title">${title}</span>
      <span class="toast-message">${message}</span>
    </div>
  `;
  toastWrapper.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("hide");
    setTimeout(() => toast.remove(), 350);
  }, 4000);
}

// ─────────────────────────────────────────
//  Form Submission
// ─────────────────────────────────────────
const form = document.getElementById("registrationForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = {
    fullName: form.fullName.value,
    email: form.email.value,
    phoneNumber: form.phoneNumber.value,
    whatsAppNumber: form.whatsAppNumber.value,
    gender: form.gender.value,
    maritalStatus: form.maritalStatus.value,
    address: form.address.value,
    occupation: form.occupation.value,
    weddingAnniversary: form.weddingAnniversary.value,
    dob: form.dob.value,
    community: form.community.value,
    waterBaptism: form.waterBaptism.value,
  };

  try {
    const res = await fetch(`${SERVER_URL}/phc-form`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (data.success) {
      // ✅ Show success toast
      showToast(
        "Registration Successful! 🎉",
        "Welcome to Potter's House Church.",
      );
      // ✅ Clear all form fields
      form.reset();
    } else {
      showToast("Submission Failed", "Please try again.", "error");
    }
  } catch (err) {
    console.error("❌ Fetch error:", err);
    showToast("Connection Error", "Could not reach the server.", "error");
  }
});
