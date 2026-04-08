# 🔔 BEEP

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-24.x-339933?logo=nodedotjs\&logoColor=white)

> **BEEP** = *Budget Early-warning & Expense Protector*

---

## 📖 What is BEEP?

**BEEP** is a simple CLI-based **expense tracker app** built with **TypeScript** and **Node.js**.

> 🧠 *This is where I learn TypeScript basics*

This project is intentionally small, but still **useful in real life** — helping me understand TypeScript better, one line of code at a time.

So yeah, BEEP is:

* 🔔 A reminder for my expenses (because I forget things)
* 📚 A notebook for learning TypeScript (because reading docs isn't enough)
* 💪 A small step toward becoming better at programming

> *Features are simple. Code will evolve. That's the point — learning by doing.*

---

## ✨ Current Features

* Add new expense
* View all expenses
* View expenses by id
* View expenses by filter
* Delete expense
* Calculate total expense

### 📂 Categories

* food
* shopping
* transport
* bills
* savings
* other

### 📂 Payment Method
* cash
* qris
* credit
* virtual_account
* bank_transfer
* debit_card
* e_wallet
* other;

---

## 🛠️ Tech Stack

* TypeScript
* Node.js
* ts-node
* express

---

## 🧱 Project Structure

```txt
beep-app/
├── src/
│   ├── controllers
│   │   └──expense_controller.ts
│   ├── models/
│   │   └── expense.ts             # Type definitions
│   ├── routes
│   │   └──expense_routes.ts
│   ├── services/
│   │   └── expenseService.ts      # Business logic
│   ├── utils/
|   |   ├── function               # general function for help application
|   |   |      └── formatDate.ts   # function for formating date
│   │   └── storage.ts             # setup for save data to json file
│   └── index.ts                   # CLI entry point
│   └── server.ts
├── dist/                          # Compiled JavaScript (ignored by git)
├── tsconfig.json                  # TypeScript configuration
├── package.json
└── README.md
```

---

## ▶️ Running the App

Install dependencies:

```bash
npm install
```

Run the app:

```bash
npm run dev
```

---

## 🖥️ Usage

```txt
=== EXPENSE TRACKER ===
1. Add Expense
2. List Expenses
3. Delete Expense
4. Total Expense
5. Get Expense By Id
6. Get Expense By Category
7. Get Expense By Date
8. Get Expense By Range Date
9. Get Average Expense
10. Save Data to JSON file
11. CRUD Expense
```

---

## 📚 What I Learn Here

This project covers:

* Basic TypeScript types (`string`, `number`, `boolean`)
* Custom types & union types
* Function typing
* Array manipulation
* CLI interaction with Node.js
* Basic input validation
* REST API using express
