# Khata Book - Secure & Shareable Ledger

## 🚀 Overview

**Khata Book** is a smart digital ledger that enables users to create, manage, and share their financial records securely. Users can maintain a **password-protected** or **public khata**, making it flexible for both personal and shared usage. The app supports **editing, deleting, updating, and viewing** khatas, while also allowing easy sharing through **WhatsApp and messages**.

![Overview](screenshots/overview.png)

## 🔥 Features

- 🔐 **Secure Mode:** Create **password-protected** khatas for private records or **public** khatas for open access.
- ✏️ **Manage Entries:** Edit, delete, and update khata records with ease.
- 📅 **Timestamps:** Each khata includes a **created-on date** for tracking.
- 📜 **Rich Description:** Add a **title** and **detailed description** to each khata entry.
- 📤 **Seamless Sharing:** Share khatas directly via **WhatsApp** and **messages**.

![Features](screenshots/features.png)

## 🛠️ Tech Stack

- **Frontend:** EJS, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Atlas)
- **Authentication & Security:** JWT, bcrypt

## 🎮 How It Works

1. **Create a New Khata** – Choose between a **password-protected** or **public** khata.
   ![Create Khata](screenshots/create-khata.png)
2. **Add Khata Details** – Provide a **title, description, and security mode**.
   ![Add Details](screenshots/add-details.png)
3. **Edit or Delete** – Modify or remove khatas as needed.
   ![Edit Delete](screenshots/edit-delete.png)
4. **View and Share** – Access khatas and share them via WhatsApp or messages.
   ![Share](screenshots/share.png)

## 🏗️ Installation & Setup

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/khata-book.git
   cd khata-book
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Start the server:**
   ```sh
   npm run dev
   ```

## 🔐 Environment Variables

Create a `.env` file and add:

```
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
PORT=3000
```

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.

## 📩 Contact

For queries, reach out to [**vaibhavsaxena599@gmail.com**](mailto:vaibhavsaxena599@gmail.com) or create an issue in the repository.

---

Made with ❤️ by **Vaibhav Saxena** 🚀
