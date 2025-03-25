# Khata Book - Secure & Shareable Ledger

## 🚀 Overview

**Khata Book** is a smart digital ledger that enables users to create, manage, and share their financial records securely. Users can maintain a **password-protected** or **public khata**, making it flexible for both personal and shared usage. The app supports **editing, deleting, updating, and viewing** khatas, while also allowing easy sharing through **WhatsApp and messages**.


## 🔥 Features

- 🔐 **Secure Mode:** Create **password-protected** khatas for private records or **public** khatas for open access.
- ✏️ **Manage Entries:** Edit, delete, and update khata records with ease.
- 📅 **Timestamps:** Each khata includes a **created-on date** for tracking.
- 📜 **Rich Description:** Add a **title** and **detailed description** to each khata entry.
- 📤 **Seamless Sharing:** Share khatas directly via **WhatsApp** and **messages**.

## 🛠️ Tech Stack

- **Frontend:** EJS, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Atlas)
- **Authentication & Security:** JWT, bcrypt

## 🎮 How It Works

1. **Create a New Khata** – Choose between a **password-protected** or **public** khata.
2. **Add Khata Details** – Provide a **title, description, and security mode**.
3. **Edit or Delete** – Modify or remove khatas as needed.
4. **View and Share** – Access khatas and share them via WhatsApp or messages.


## 🏗️ Installation & Setup

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/khata-book.git
   cd khata-book
   ```
2. **Install dependencies:**
   ```sh
   npm init
   npm i ejs nodemon --save-dev express mongoose body-parser bcrypt dotenv
   ```
3. **Start the server:**
   add something to scripts field in package.json
   ```sh
    "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
   }
  
   ```
   type this command in terminal to run the project:-
   npm run dev

## 🔐 Environment Variables

Create a `.env` file and add:

```
MONGO_URI=your_mongo_connection_string
SECRET_KEY=your_secret_key
PORT=3000
```

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.

## 📩 Contact

For queries, reach out to [**vaibhavsaxena599@gmail.com**](mailto:vaibhavsaxena599@gmail.com) or create an issue in the repository.

---

![homepage](https://github.com/user-attachments/assets/341a1ad3-0ce8-4653-8243-542732b78d4c)
![signup](https://github.com/user-attachments/assets/6283776b-0f93-4658-83a1-f94e69e6cdff)
![login](https://github.com/user-attachments/assets/7ab6fd76-263a-48b2-8187-770cdda4c3b0)
![public khata](https://github.com/user-attachments/assets/e8a514e5-9e91-4c8b-aee0-d2c2009c065b)
![passcode protected khata](https://github.com/user-attachments/assets/88da2dfe-f548-4304-8571-ade9769958d6)
![view khata](https://github.com/user-attachments/assets/0c01d945-3931-42bf-8893-7692c19f5bdd)
![edit the khata](https://github.com/user-attachments/assets/75394e20-f71f-4a6c-a409-0c53d60a6f6f)
![share on whatsapp](https://github.com/user-attachments/assets/066b6ecb-ab71-49d8-8f54-7e01867931cd)



Made with ❤️ by **Vaibhav Saxena** 🚀
