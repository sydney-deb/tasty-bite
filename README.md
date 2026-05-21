# 🍓 Tasty Bite

A full-stack food ordering app with a **Python / Flask** backend and a **React** frontend.

## Project Structure

```
tasty-bite/
├── backend/
│   ├── app.py            # Flask API
│   └── requirements.txt
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js        # Single-file React app
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+

### 1. Start the Backend

```bash
cd backend
pip install -r requirements.txt
python app.py        # runs on http://localhost:3001
```

### 2. Start the Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm start            # runs on http://localhost:3000
```

The React app proxies API calls to `localhost:3001` automatically.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/menu` | Full menu list |
| GET | `/api/cart` | Cart with totals |
| POST | `/api/cart/add` | Add item `{ sku, quantity }` |
| PUT | `/api/cart/modify` | Change quantity `{ sku, quantity }` |
| DELETE | `/api/cart/<sku>` | Remove item |
| POST | `/api/checkout` | Place order & clear cart |
