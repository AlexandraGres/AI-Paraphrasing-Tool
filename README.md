# 📝 AI Paraphrasing Tool

Transform your text in seconds with our advanced AI

---

## 🚀 Running the Project Locally

This guide will help you set up and run the project on your local machine.

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18.x or later is recommended)  
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)  

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/AlexandraGres/AI-Paraphrasing-Tool.git
```

### 2. Navigate to the Project Directory

```bash
cd AI-Paraphrasing-Tool
```

### 3. Install Dependencies
Choose your preferred package manager:

Using npm:

```bash
npm install
```
Or using yarn:
```bash
yarn install
```

### 4. Set Up Environment Variables

API keys are required to connect to the AI providers.

First, create a copy of the .env.example file and name it .env.local:

```bash
cp .env.example .env.local
```

Next, open the newly created .env.local file in your code editor and add your API keys:

```bash
OPENAI_API_KEY=sk-your-openai-api-key-here
GEMINI_API_KEY=your-google-ai-studio-api-key-here
```

### 5. Start the Development Server

Using npm:

```bash
npm run dev
```

Or using yarn:

```bash
yarn dev
```

### 6. Open the Project in Your Browser

Once the server is running, you can access the application at:

👉 http://localhost:3001

🎉 You're All Set!

The project is now running locally. Start paraphrasing your text with AI!



