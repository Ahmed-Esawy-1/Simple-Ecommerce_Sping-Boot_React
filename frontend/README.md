# Shopfront

A React + Tailwind CSS v4 storefront: catalog home page, product details, add/edit
product forms, and a client-side cart. Frontend only — talks to your Spring Boot
backend over REST.

## Run it

```bash
npm install
npm run dev
```

Opens at http://localhost:5173.

## Point it at your backend

Copy `.env.example` to `.env` and set your API URL:

```bash
cp .env.example .env
```

```
VITE_API_BASE_URL=http://localhost:8080
```

## Backend contract this assumes

Built for a Spring Boot `Product` entity shaped like the one you shared
(`id, name, description, price, brand, category, releaseDate, productAvailable,
stockQuantity, imageName, imageType, imageData`). The image is stored as a BLOB, so the
frontend uploads it as a file and reads it back from its own endpoint, rather than
sending base64 in the JSON body.

All of this lives in **`src/api/productApi.js`** — it's the only file you should need
to touch if your controller's paths differ:

| Method | Path                      | Notes                                       |
|--------|---------------------------|----------------------------------------------|
| GET    | `/api/products`           | List all products                            |
| GET    | `/api/product/{id}`       | One product                                  |
| GET    | `/api/product/{id}/image` | Raw image bytes, used as `<img src>`         |
| POST   | `/api/product`            | multipart: `imageFile` + `product` (JSON)    |
| PUT    | `/api/product/{id}`       | multipart: `imageFile` + `product` (JSON)    |
| DELETE | `/api/product/{id}`       | Remove a product                             |

`releaseDate` is sent/received as `dd-MM-yyyy` to match the `@JsonFormat` on your
entity — conversion to/from the HTML date input happens in `src/utils/format.js`.

If your backend uses different paths or a different upload shape (e.g. base64 image
in the JSON body instead of multipart), just edit the functions in `productApi.js` —
nothing else in the app needs to change.

## What's included

- **Home** (`/`) — full product grid, loading skeleton, empty and error states
- **Product details** (`/products/:id`) — back button, spec sheet, quantity + add to
  cart, Edit and Delete (delete asks for confirmation)
- **Add product** (`/products/new`) and **Edit product** (`/products/:id/edit`) —
  shared form with image drag-and-drop/preview
- **Cart** (`/cart`) — quantities, removal, running total. Cart state lives in
  `localStorage` on the client; there's no order/checkout endpoint on the backend
  described, so "Checkout" is a placeholder — wire it to a real endpoint when you add
  one
- **Light/dark mode** — toggle in the navbar, persisted in `localStorage`, defaults to
  system preference

## Stack

React 18, React Router 6, Tailwind CSS v4 (via `@tailwindcss/vite`, no separate config
file — theme tokens live in `src/index.css`), Axios, lucide-react icons, Vite.
