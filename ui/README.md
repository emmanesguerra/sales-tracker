# Sales Tracker UI

## Description
Sales Tracker UI is the user-friendly frontend for managing sales and products, seamlessly integrating with a Laravel-based backend. It streamlines sales tracking, product organization, and QR code generation to enhance efficiency and accuracy.

## Features
- **QR Generator** – Generate QR codes for efficient sales tracking.
- **Product Management** – Add, edit, and remove products from the system.
- **Sales Report** – View and analyze sales data.

## Tech Stack
- **Vue 3** – Progressive JavaScript framework
- **Vuetify** – Material Design component framework
- **Pinia** – State management
- **Vue Router** – Navigation handling
- **Day.js** – Lightweight JavaScript date library

## Folder Structure
```
src/
├── assets/                # Static assets (images, styles)
├── components/            # Reusable Vue components
├── core/
│   ├── services/          # API handlers and core services
├── modules/
│   ├── auth/              # Authentication module
│   │   ├── pages/         # Authentication-related pages (e.g., Login.vue)
│   ├── dashboard/         # Dashboard module
│   │   ├── pages/         # Dashboard-related pages (e.g., Dashboard.vue)
│   ├── sales/             # Sales tracking module
│   │   ├── pages/         # Sales-related pages
├── router/                # Vue Router configurations
├── store/                 # Global Pinia stores for state management
├── App.vue                # Root Vue component
├── main.ts                # Application entry point
.tests/
├── unit/                  # Unit tests
.env                       # Environment variables configuration
package.json               # Project dependencies and scripts
```

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/emmanesguerra/sales-tracker-ui.git
   cd sales-tracker-ui
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```

## Build for Production
To create a production-ready build:
```sh
npm run build
```

## Running Tests
To run unit tests:
```sh
npm run test:unit
```
