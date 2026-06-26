const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', event => {
    if (event.target.matches('a')) {
      nav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

const header = document.querySelector('[data-header]');
if (header) {
  const setShadow = () => {
    header.style.boxShadow = window.scrollY > 8 ? '0 8px 24px rgba(18,60,105,.08)' : 'none';
  };
  setShadow();
  window.addEventListener('scroll', setShadow, { passive: true });
}

document.querySelectorAll('[data-demo-submit]').forEach(button => {
  button.addEventListener('click', () => {
    const form = button.closest('form');
    const success = form?.querySelector('.form-success');
    if (success) success.hidden = false;
  });
});

// Demo cart and checkout drawer. This is front-end only for local preview.
// Connect the checkout action to GoDaddy Bookings, Stripe, PayPal, or your booking service before going live.
const CART_STORAGE_KEY = '617englishCart';
const CART_COUPON_KEY = '617englishCoupon';

const serviceCatalog = {
  intro: { id: 'intro', name: 'Free Introductory Session', type: 'One on One', duration: '1 hr', price: 0, coach: 'Mahdi B.', schedule: 'Choose a time after checkout' },
  private: { id: 'private', name: 'Private Coaching Intro', type: 'One on One', duration: '1 hr', price: 0, coach: 'Mahdi B.', schedule: 'Choose a time after checkout' },
  small: { id: 'small', name: 'Small Group Conversation Intro', type: '1–3 Learners', duration: '1 hr', price: 0, coach: 'Mahdi B.', schedule: 'Choose a time after checkout' },
  medium: { id: 'medium', name: 'Medium Group Discussion Intro', type: '6–8 Learners', duration: '1 hr', price: 0, coach: 'Mahdi B.', schedule: 'Choose a time after checkout' },
  specialized: { id: 'specialized', name: 'Specialized English Session Intro', type: 'Targeted Support', duration: '1 hr', price: 0, coach: 'Mahdi B.', schedule: 'Choose a time after checkout' },
  coffee: { id: 'coffee', name: 'Coffee Time Intro', type: 'Relaxed Conversation', duration: '1 hr', price: 0, coach: 'Mahdi B.', schedule: 'Choose a time after checkout' },
  cursive: { id: 'cursive', name: 'Cursive Writing Intro', type: 'Writing Skills', duration: '1 hr', price: 0, coach: 'Mahdi B.', schedule: 'Choose a time after checkout' },
  afterschool: { id: 'afterschool', name: 'After-School Program Intro', type: 'Younger Learners', duration: '1 hr', price: 0, coach: 'Mahdi B.', schedule: 'Choose a time after checkout' }
};

const money = value => new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(value || 0);

function readCart() {
  try { return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || []; }
  catch { return []; }
}

function writeCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  renderCart();
}

function addToCart(serviceId) {
  const service = serviceCatalog[serviceId] || serviceCatalog.intro;
  const cart = readCart();
  const existing = cart.find(item => item.id === service.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...service, quantity: 1 });
  }
  writeCart(cart);
  openCart();
}

function removeFromCart(serviceId) {
  writeCart(readCart().filter(item => item.id !== serviceId));
}

function updateQuantity(serviceId, quantity) {
  const cart = readCart();
  const item = cart.find(entry => entry.id === serviceId);
  if (!item) return;
  item.quantity = Math.max(1, Number(quantity) || 1);
  writeCart(cart);
}

function createCartShell() {
  const headerInner = document.querySelector('.header-inner');
  if (headerInner && !document.querySelector('[data-cart-open]')) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'cart-button';
    button.setAttribute('data-cart-open', '');
    button.setAttribute('aria-label', 'Open cart');
    button.innerHTML = '<span aria-hidden="true">🛒</span><span class="cart-count" data-cart-count>0</span>';
    const cta = headerInner.querySelector('.header-cta');
    headerInner.insertBefore(button, cta || null);
  }

  if (!document.querySelector('[data-cart-drawer]')) {
    const shell = document.createElement('div');
    shell.className = 'cart-shell';
    shell.innerHTML = `
      <div class="cart-backdrop" data-cart-close></div>
      <aside class="cart-drawer" data-cart-drawer aria-hidden="true" aria-label="Shopping cart">
        <div class="cart-drawer-head">
          <div class="cart-title"><span aria-hidden="true">🛒</span><span data-cart-count>0</span></div>
          <button class="cart-close" type="button" data-cart-close aria-label="Close cart">×</button>
        </div>
        <div class="cart-body">
          <div data-cart-items></div>
          <section class="coupon-box">
            <h3>Have a coupon code?</h3>
            <div class="coupon-row">
              <input type="text" data-coupon-input placeholder="Enter Code" aria-label="Coupon code">
              <button type="button" data-apply-coupon>Apply</button>
            </div>
            <p class="coupon-message" data-coupon-message></p>
          </section>
          <section class="cart-totals">
            <div><span>Subtotal</span><strong data-cart-subtotal>C$0.00</strong></div>
            <div><span>Total</span><strong data-cart-total>C$0.00</strong></div>
            <div class="due-now"><span>Due now</span><strong data-cart-due>C$0.00</strong></div>
          </section>
          <form class="checkout-form" data-checkout-form>
            <h3>Add your details</h3>
            <p>Already have an account? <a href="#">Sign In</a></p>
            <div class="two-fields">
              <label>First Name <span>*</span><input name="firstName" required></label>
              <label>Last Name <span>*</span><input name="lastName" required></label>
            </div>
            <label>Email <span>*</span><input type="email" name="email" required></label>
            <label>Phone Number<input type="tel" name="phone"></label>
            <label>Message<textarea name="message" rows="3" placeholder="Tell Mahdi what you want help with."></textarea></label>
            <button class="btn btn-primary checkout-button" type="submit">Complete booking request</button>
            <p class="form-note">Local demo only. The live version should connect to your booking/payment provider.</p>
            <div class="form-success" data-checkout-success hidden>Thanks — your demo booking request was created.</div>
          </form>
        </div>
      </aside>`;
    document.body.appendChild(shell);
  }
}

function openCart() {
  document.body.classList.add('cart-open');
  const drawer = document.querySelector('[data-cart-drawer]');
  drawer?.setAttribute('aria-hidden', 'false');
}

function closeCart() {
  document.body.classList.remove('cart-open');
  const drawer = document.querySelector('[data-cart-drawer]');
  drawer?.setAttribute('aria-hidden', 'true');
}

function renderCart() {
  const cart = readCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('[data-cart-count]').forEach(el => { el.textContent = count; });

  const list = document.querySelector('[data-cart-items]');
  if (!list) return;

  if (!cart.length) {
    list.innerHTML = '<div class="empty-cart"><h3>Your cart is empty</h3><p>Add a free introductory session or coaching option to begin.</p></div>';
  } else {
    list.innerHTML = cart.map(item => `
      <article class="cart-item">
        <div class="cart-item-top">
          <div>
            <h3>${item.type}</h3>
            <p>${item.name}</p>
          </div>
          <strong>${money(item.price * item.quantity)}</strong>
        </div>
        <p class="cart-meta">${item.coach}<br>${item.schedule}<br>${item.duration}</p>
        <div class="cart-item-actions">
          <label>Qty <input type="number" min="1" value="${item.quantity}" data-cart-quantity="${item.id}"></label>
          <button type="button" data-cart-remove="${item.id}" aria-label="Remove ${item.name}">🗑</button>
        </div>
      </article>`).join('');
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const coupon = localStorage.getItem(CART_COUPON_KEY) || '';
  const total = coupon.toUpperCase() === 'WELCOME' ? Math.max(0, subtotal * 0.9) : subtotal;
  document.querySelector('[data-cart-subtotal]').textContent = money(subtotal);
  document.querySelector('[data-cart-total]').textContent = money(total);
  document.querySelector('[data-cart-due]').textContent = money(total);
}

createCartShell();
renderCart();

document.addEventListener('click', event => {
  const addButton = event.target.closest('[data-add-cart]');
  if (addButton) {
    event.preventDefault();
    addToCart(addButton.getAttribute('data-add-cart'));
    return;
  }

  if (event.target.closest('[data-cart-open]')) openCart();
  if (event.target.closest('[data-cart-close]')) closeCart();

  const removeButton = event.target.closest('[data-cart-remove]');
  if (removeButton) removeFromCart(removeButton.getAttribute('data-cart-remove'));

  if (event.target.closest('[data-apply-coupon]')) {
    const input = document.querySelector('[data-coupon-input]');
    const message = document.querySelector('[data-coupon-message]');
    const code = input?.value.trim() || '';
    localStorage.setItem(CART_COUPON_KEY, code);
    if (message) message.textContent = code.toUpperCase() === 'WELCOME' ? 'Coupon applied: 10% off.' : 'Demo coupon saved. Try WELCOME for 10% off.';
    renderCart();
  }
});

document.addEventListener('input', event => {
  const quantityInput = event.target.closest('[data-cart-quantity]');
  if (quantityInput) updateQuantity(quantityInput.getAttribute('data-cart-quantity'), quantityInput.value);
});

document.addEventListener('submit', event => {
  const form = event.target.closest('[data-checkout-form]');
  if (!form) return;
  event.preventDefault();
  const success = form.querySelector('[data-checkout-success]');
  if (success) success.hidden = false;
});

// Booking calendar and time-slot selection for the local preview.
// This is a front-end demo. For live bookings, connect these actions to a real scheduling backend.
const bookingServices = {
  intro: {
    cartId: 'intro',
    title: 'One on One',
    name: 'Free Introductory Session',
    duration: '1 hr',
    priceLabel: 'Free Introductory',
    price: 0,
    coach: 'Mahdi B.',
    description: 'Welcome to my English Coaching website. I am here to help you transform your communication with a plan tailored just for you. I will help you regain your confidence and build on the knowledge you already have.'
  },
  private: {
    cartId: 'private',
    title: 'Private Coaching',
    name: 'Private Coaching Intro',
    duration: '1 hr',
    priceLabel: 'Free Introductory',
    price: 0,
    coach: 'Mahdi B.',
    description: 'Personal one-on-one coaching focused on your speaking confidence, grammar, vocabulary, pronunciation, and communication goals.'
  },
  small: {
    cartId: 'small',
    title: 'Small Group Conversation',
    name: 'Small Group Conversation Intro',
    duration: '1 hr',
    priceLabel: 'Free Introductory',
    price: 0,
    coach: 'Mahdi B.',
    description: 'A relaxed small-group session for learners who want more speaking practice while still receiving personal guidance.'
  },
  medium: {
    cartId: 'medium',
    title: 'Medium Group Discussion',
    name: 'Medium Group Discussion Intro',
    duration: '1 hr',
    priceLabel: 'Free Introductory',
    price: 0,
    coach: 'Mahdi B.',
    description: 'A guided discussion session for building fluency, listening skills, vocabulary, and confidence in a supportive group.'
  },
  coffee: {
    cartId: 'coffee',
    title: 'Coffee Time',
    name: 'Coffee Time Intro',
    duration: '1 hr',
    priceLabel: 'Free Introductory',
    price: 0,
    coach: 'Mahdi B.',
    description: 'A casual conversation session designed to feel like a coffee meeting with friends in Canada.'
  },
  cursive: {
    cartId: 'cursive',
    title: 'Cursive Writing',
    name: 'Cursive Writing Intro',
    duration: '1 hr',
    priceLabel: 'Free Introductory',
    price: 0,
    coach: 'Mahdi B.',
    description: 'Explore English cursive writing and practice smooth, confident handwriting in a relaxed setting.'
  },
  afterschool: {
    cartId: 'afterschool',
    title: 'After School Program',
    name: 'After-School Program Intro',
    duration: '1 hr',
    priceLabel: 'Free',
    price: 0,
    coach: 'Mahdi B.',
    description: 'Support for younger learners who need after-school English help with homework, speaking, reading, or writing.'
  }
};

function initBookingScheduler() {
  const calendar = document.querySelector('[data-booking-calendar]');
  if (!calendar) return;

  const monthLabel = document.querySelector('[data-booking-month]');
  const serviceSelect = document.querySelector('[data-booking-service]');
  const staffSelect = document.querySelector('[data-staff-select]');
  const addButton = document.querySelector('[data-add-booking-cart]');
  const afternoon = document.querySelector('[data-time-group="afternoon"]');
  const evening = document.querySelector('[data-time-group="evening"]');

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const state = {
    visibleMonth: new Date(today.getFullYear(), today.getMonth(), 1),
    selectedDate: null,
    selectedTime: null,
    selectedService: serviceSelect?.value || 'intro'
  };

  const afternoonTimes = ['12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM'];
  const eveningTimes = ['6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM'];

  const dateKey = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const prettyDate = date => date.toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  const isAvailableDate = date => {
    const diffDays = Math.round((date - today) / 86400000);
    return diffDays >= 0 && diffDays <= 35 && date.getDay() !== 0;
  };

  function updateServicePanel() {
    const service = bookingServices[state.selectedService] || bookingServices.intro;
    document.querySelector('[data-service-title]').textContent = service.title;
    document.querySelector('[data-service-duration]').textContent = service.duration;
    document.querySelector('[data-service-price]').textContent = service.priceLabel;
    document.querySelector('[data-service-description]').textContent = service.description;
  }

  function updateSelectedSummary() {
    const service = bookingServices[state.selectedService] || bookingServices.intro;
    document.querySelector('[data-selected-coach]').textContent = staffSelect?.value === 'Any Available Staff' ? service.coach : staffSelect.value;
    document.querySelector('[data-selected-date]').textContent = state.selectedDate ? prettyDate(state.selectedDate) : 'Choose a date';
    document.querySelector('[data-selected-time]').textContent = state.selectedTime || 'Choose a time';
    if (addButton) addButton.disabled = !(state.selectedDate && state.selectedTime);
  }

  function renderTimeSlots() {
    const render = times => times.map(time => `<button type="button" class="time-slot${state.selectedTime === time ? ' is-selected' : ''}" data-booking-time="${time}">${time}</button>`).join('');
    if (afternoon) afternoon.innerHTML = render(afternoonTimes);
    if (evening) evening.innerHTML = render(eveningTimes);
  }

  function renderCalendar() {
    const year = state.visibleMonth.getFullYear();
    const month = state.visibleMonth.getMonth();
    if (monthLabel) monthLabel.textContent = state.visibleMonth.toLocaleDateString('en-CA', { month: 'long', year: 'numeric' });

    const first = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const blanks = first.getDay();
    const cells = [];

    for (let i = 0; i < blanks; i++) cells.push('<span class="calendar-empty"></span>');
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const available = isAvailableDate(date);
      const selected = state.selectedDate && dateKey(state.selectedDate) === dateKey(date);
      cells.push(`<button type="button" class="calendar-day${available ? ' is-available' : ''}${selected ? ' is-selected' : ''}" ${available ? '' : 'disabled'} data-booking-date="${dateKey(date)}">${day}</button>`);
    }
    calendar.innerHTML = cells.join('');
  }

  function renderAll() {
    updateServicePanel();
    renderCalendar();
    renderTimeSlots();
    updateSelectedSummary();
  }

  document.querySelector('[data-booking-prev]')?.addEventListener('click', () => {
    state.visibleMonth = new Date(state.visibleMonth.getFullYear(), state.visibleMonth.getMonth() - 1, 1);
    renderCalendar();
  });

  document.querySelector('[data-booking-next]')?.addEventListener('click', () => {
    state.visibleMonth = new Date(state.visibleMonth.getFullYear(), state.visibleMonth.getMonth() + 1, 1);
    renderCalendar();
  });

  serviceSelect?.addEventListener('change', () => {
    state.selectedService = serviceSelect.value;
    state.selectedTime = null;
    renderAll();
  });

  staffSelect?.addEventListener('change', updateSelectedSummary);

  calendar.addEventListener('click', event => {
    const button = event.target.closest('[data-booking-date]');
    if (!button || button.disabled) return;
    const [year, month, day] = button.dataset.bookingDate.split('-').map(Number);
    state.selectedDate = new Date(year, month - 1, day);
    state.selectedTime = null;
    renderAll();
  });

  document.addEventListener('click', event => {
    const timeButton = event.target.closest('[data-booking-time]');
    if (!timeButton) return;
    state.selectedTime = timeButton.dataset.bookingTime;
    renderTimeSlots();
    updateSelectedSummary();
  });

  addButton?.addEventListener('click', () => {
    const service = bookingServices[state.selectedService] || bookingServices.intro;
    const coach = staffSelect?.value === 'Any Available Staff' ? service.coach : staffSelect.value;
    const schedule = `${prettyDate(state.selectedDate)}, ${state.selectedTime}`;
    const customId = `${service.cartId}-${dateKey(state.selectedDate)}-${state.selectedTime.replace(/\W+/g, '')}`;
    const cart = readCart();
    const existing = cart.find(item => item.id === customId);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: customId,
        name: service.name,
        type: service.title,
        duration: service.duration,
        price: service.price,
        coach,
        schedule,
        quantity: 1
      });
    }
    writeCart(cart);
    openCart();
  });

  const firstAvailable = new Date(today);
  while (!isAvailableDate(firstAvailable)) firstAvailable.setDate(firstAvailable.getDate() + 1);
  state.selectedDate = firstAvailable;
  renderAll();
}

initBookingScheduler();
