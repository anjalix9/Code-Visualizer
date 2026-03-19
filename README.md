🧠 Code Visualizer

An interactive code visualizer built with React and Vite, inspired by PythonTutor.com. This tool helps you understand how your code runs by showing stack frames, heap memory, and variable references in real time.

👥 Team Contribution

This project was collaboratively developed as a team effort.
Team Members:

Anjali Goswami

Ashutosh Kumar Singh

🚀 Features

🧮 Paste Java/Python/C++ code and visualize execution step-by-step
🧠 Stack & Heap memory visualization
🎯 Variable tracking and reference arrows
⏩ Step forward/backward through execution
💡 Test input support
🌙 Dark/light mode toggle

🛠️ Tech Stack

Frontend: React, Tailwind CSS, Konva.js
Backend (optional): Node.js / Flask (for code execution engine)
Build Tool: Vite

📦 Installation
git clone https://github.com/your-username/code-visualizer.git
cd code-visualizer
npm install
npm run dev
📁 Project Structure
code-visualizer/
├── public/             # Static assets
├── src/
│   ├── components/     # React UI components
│   ├── visualizer/     # Stack/Heap render logic
│   ├── editor/         # Code editor & language input
│   └── App.jsx         # Main entry point
├── package.json
└── vite.config.js
⚙️ Usage

Select language (Java/Python/C++)

Paste your code in the editor

Click "Visualize"

Use ⏮️ ⏭️ buttons to step through execution

See stack/heap change in real time

📈 Future Plans

✅ Code execution sandbox (Docker-based)
✅ Save & share visualization sessions
✅ Support for function call tree
✅ Drag & zoom canvas

🤝 Contributing

Pull requests are welcome! For major changes, open an issue first.

📝 License

This project is under the GPL-3.0 license.
