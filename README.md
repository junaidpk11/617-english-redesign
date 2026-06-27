# 617 English Coaching 4 Egypt — Redesigned Static Website

This is a complete local static redesign based on the live 617englishcoach4egypt.ca content.

## Pages included

- `index.html` — homepage
- `services.html` — all coaching services: private, small group, medium group, specialized, Coffee Time, cursive writing, and after-school support
- `about.html` — Mahdi background and approach
- `fees.html` — fee cards for private, small group, and medium group sessions
- `booking.html` — local demo booking form
- `contact.html` — contact and WhatsApp page
- `styles.css` — responsive visual design
- `script.js` — mobile menu, sticky header, and demo form success message

## Run locally on macOS

From inside this folder, use:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

If port 8000 is busy:

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

## Before publishing

1. Confirm the correct WhatsApp number. The live site shows multiple number formats, so this redesign uses `+1 506 261 2555` as the clean default.
2. Replace placeholder learner testimonials with real testimonials.
3. Replace the Mahdi initials card with a real portrait if available.
4. Add exact prices or connect Pay Now buttons to your payment provider.
5. Connect the booking/contact forms to GoDaddy Bookings, Calendly, Formspree, Netlify Forms, or your preferred backend.
6. Add a real email address if you want email contact displayed.

## Cart / checkout drawer

This version includes a front-end demo cart similar to the live booking/cart panel:

- Cart icon in the header on every page
- “Add to cart” buttons on Services, Fees, Booking, and the homepage
- Slide-out checkout drawer
- Coupon code field. Demo code: `WELCOME`
- Subtotal, total, and due-now display in Canadian dollars
- Customer details form
- Cart persistence using browser `localStorage`

The cart is for local preview only. Before publishing, connect the final checkout button to GoDaddy Bookings, Stripe, PayPal, Calendly, or another booking/payment provider.


## Images

The site now includes local SVG illustrations inside the `assets/` folder. They work offline and on GitHub Pages. Replace `assets/about-mahdi-placeholder.svg` with a real photo when available. Keep the same filename or update the `<img src="...">` paths in the HTML files.


## Live site images

This version uses image URLs from the existing live website at 617englishcoach4egypt.ca, including the official logo and online coaching illustration hosted on GoDaddy/WSImg. Keep those URLs active or download the images into the `assets/` folder before final production.
