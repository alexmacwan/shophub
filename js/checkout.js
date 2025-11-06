// Checkout logic: steps, validation, totals, promo codes, and order placement

let checkoutCart = [];
let shippingData = null;
let paymentData = null;
let promo = { code: null, discount: 0 };

const TAX_RATE = 0.08; // 8%

// DOM refs
const formShipping = document.getElementById('form-shipping');
const formPayment = document.getElementById('form-payment');
const formReview = document.getElementById('form-review');

const stepPaymentInd = document.getElementById('step-payment-ind');
const stepReviewInd = document.getElementById('step-review-ind');

const backToShipping = document.getElementById('backToShipping');
const backToPayment = document.getElementById('backToPayment');
const btnPlaceOrder = document.getElementById('btnPlaceOrder');
const orderIdEl = document.getElementById('orderId');
const orderSuccess = document.getElementById('orderSuccess');

// Summary refs
const summaryItems = document.getElementById('summaryItems');
const sumSubtotal = document.getElementById('sumSubtotal');
const sumShipping = document.getElementById('sumShipping');
const sumTax = document.getElementById('sumTax');
const sumPromo = document.getElementById('sumPromo');
const sumTotal = document.getElementById('sumTotal');
const promoRow = document.getElementById('promoRow');
const promoInput = document.getElementById('promoInput');
const applyPromoBtn = document.getElementById('applyPromo');
const promoMsg = document.getElementById('promoMsg');

// Review refs
const reviewShipping = document.getElementById('reviewShipping');
const reviewPayment = document.getElementById('reviewPayment');

document.addEventListener('DOMContentLoaded', () => {
  // Load cart
  const savedCart = localStorage.getItem('shopHubCart');
  checkoutCart = savedCart ? JSON.parse(savedCart) : [];
  renderSummary();

  // Shipping submit
  if (formShipping) {
    formShipping.addEventListener('submit', (e) => {
      e.preventDefault();
      shippingData = collectShipping();
      if (!shippingData) return;
      formShipping.classList.add('hidden');
      formPayment.classList.remove('hidden');
      stepPaymentInd.classList.remove('opacity-60');
      updateSummary();
    });
  }

  // Payment submit
  if (formPayment) {
    formPayment.addEventListener('submit', (e) => {
      e.preventDefault();
      paymentData = collectPayment();
      if (!paymentData) return;
      populateReview();
      formPayment.classList.add('hidden');
      formReview.classList.remove('hidden');
      stepReviewInd.classList.remove('opacity-60');
      btnPlaceOrder.disabled = !document.getElementById('acceptTerms').checked;
    });
  }

  if (backToShipping) {
    backToShipping.addEventListener('click', () => {
      formPayment.classList.add('hidden');
      formShipping.classList.remove('hidden');
    });
  }

  if (backToPayment) {
    backToPayment.addEventListener('click', () => {
      formReview.classList.add('hidden');
      formPayment.classList.remove('hidden');
    });
  }

  const acceptTerms = document.getElementById('acceptTerms');
  if (acceptTerms) {
    acceptTerms.addEventListener('change', () => {
      btnPlaceOrder.disabled = !acceptTerms.checked;
    });
  }

  if (formReview) {
    formReview.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!shippingData || !paymentData) return;
      const id = 'ORD-' + Math.random().toString(36).slice(2, 10).toUpperCase();
      orderIdEl.textContent = id;
      orderSuccess.classList.remove('hidden');
      // Clear cart
      localStorage.removeItem('shopHubCart');
      checkoutCart = [];
      renderSummary();
    });
  }

  if (applyPromoBtn) {
    applyPromoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const code = (promoInput.value || '').trim().toUpperCase();
      // Simple demo codes
      // SAVE10 -> 10% off, FREESHIP -> free standard shipping, WELCOME15 -> 15% off
      const codes = {
        'SAVE10': { type: 'percent', value: 0.10 },
        'WELCOME15': { type: 'percent', value: 0.15 },
        'FREESHIP': { type: 'ship', value: 0 }
      };
      if (codes[code]) {
        promo.code = code;
        promo.discount = codes[code].type === 'percent' ? codes[code].value : 0;
        promoMsg.textContent = code === 'FREESHIP' ? 'Free standard shipping applied.' : `${Math.round(promo.discount*100)}% discount applied.`;
        promoMsg.className = 'mt-2 text-sm text-success';
      } else if (code) {
        promo = { code: null, discount: 0 };
        promoMsg.textContent = 'Invalid promo code.';
        promoMsg.className = 'mt-2 text-sm text-error';
      } else {
        promo = { code: null, discount: 0 };
        promoMsg.textContent = '';
      }
      updateSummary();
    });
  }
});

function renderSummary() {
  if (!summaryItems) return;
  if (!checkoutCart.length) {
    summaryItems.innerHTML = '<p class="text-gray-500">Your cart is empty</p>';
  } else {
    summaryItems.innerHTML = checkoutCart.map(item => `
      <div class="flex items-center gap-3">
        <img src="${item.image}" alt="${item.name}" class="w-14 h-14 object-cover rounded" />
        <div class="flex-1">
          <div class="text-sm font-medium text-gray-900">${item.name}</div>
          <div class="text-xs text-gray-600">Qty: ${item.quantity}</div>
        </div>
        <div class="text-sm font-semibold text-gray-900">$${(item.price * item.quantity).toFixed(2)}</div>
      </div>
    `).join('');
  }
  updateSummary();
}

function computeTotals() {
  const subtotal = checkoutCart.reduce((s, i) => s + i.price * i.quantity, 0);
  let shipping = 0;
  const method = document.getElementById('shipMethod')?.value || 'standard';
  if (method === 'standard') shipping = 5;
  if (method === 'express') shipping = 15;
  if (method === 'pickup') shipping = 0;
  if (promo.code === 'FREESHIP' && (method === 'standard' || method === 'pickup')) shipping = 0;
  const tax = subtotal * TAX_RATE;
  const promoDiscount = promo.discount ? subtotal * promo.discount : 0;
  const total = Math.max(0, subtotal - promoDiscount) + shipping + tax;
  return { subtotal, shipping, tax, promoDiscount, total };
}

function updateSummary() {
  const { subtotal, shipping, tax, promoDiscount, total } = computeTotals();
  sumSubtotal.textContent = `$${subtotal.toFixed(2)}`;
  sumShipping.textContent = `$${shipping.toFixed(2)}`;
  sumTax.textContent = `$${tax.toFixed(2)}`;
  if (promoDiscount > 0) {
    promoRow.style.display = '';
    sumPromo.textContent = `-$${promoDiscount.toFixed(2)}`;
  } else {
    promoRow.style.display = 'none';
  }
  sumTotal.textContent = `$${total.toFixed(2)}`;
}

function collectShipping() {
  const data = {
    first: valueOf('shipFirst'),
    last: valueOf('shipLast'),
    email: valueOf('shipEmail'),
    phone: valueOf('shipPhone'),
    address: valueOf('shipAddress'),
    city: valueOf('shipCity'),
    state: valueOf('shipState'),
    zip: valueOf('shipZip'),
    country: valueOf('shipCountry'),
    method: valueOf('shipMethod')
  };
  if (Object.values(data).some(v => !v)) return null;
  localStorage.setItem('shopHubShipping', JSON.stringify(data));
  return data;
}

function collectPayment() {
  const data = {
    name: valueOf('payName'),
    number: valueOf('payNumber'),
    expiry: valueOf('payExpiry'),
    cvc: valueOf('payCvc')
  };
  if (!data.name || !/^\d{4}\s?\d{4}\s?\d{4}\s?\d{3,4}$/.test(data.number) || !/^\d{2}\/\d{2}$/.test(data.expiry) || !/^\d{3,4}$/.test(data.cvc)) {
    alert('Please enter valid payment details.');
    return null;
  }
  localStorage.setItem('shopHubPayment', JSON.stringify({ name: data.name, last4: data.number.slice(-4) }));
  return data;
}

function populateReview() {
  const ship = shippingData || JSON.parse(localStorage.getItem('shopHubShipping') || '{}');
  const pay = paymentData || JSON.parse(localStorage.getItem('shopHubPayment') || '{}');
  reviewShipping.innerHTML = `
    <h3 class="font-semibold mb-1">Shipping</h3>
    <p class="text-sm">${ship.first} ${ship.last}, ${ship.address}, ${ship.city}, ${ship.state} ${ship.zip}, ${ship.country}</p>
    <p class="text-sm text-gray-600">Email: ${ship.email} • Phone: ${ship.phone}</p>
  `;
  reviewPayment.innerHTML = `
    <h3 class="font-semibold mb-1">Payment</h3>
    <p class="text-sm">${pay.name || paymentData?.name} • Card ending in ${pay.last4 || (paymentData?.number || '').slice(-4)}</p>
  `;
}

function valueOf(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}


