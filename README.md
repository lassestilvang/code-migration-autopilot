<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

View app in AI Studio: https://ai.studio/apps/drive/1aH5ohH0-C_BCPN5VBbyM_D5lXCTzJlXn

---

# Code Migration Autopilot 🚀

An intelligent, AI-powered tool designed to automate the migration of legacy codebases to modern frameworks (specifically Next.js + TypeScript). Built for the Gemini 3 Hackathon.

## Features ✨

- **Deep Repository Analysis**: Scans GitHub repositories to understand structure, dependencies, and architecture.
- **Architecture Visualization**: Generates visual diagrams of legacy system architecture using Gemini 2.0 Flash.
- **Automated Migration**: Converts legacy code (PHP, Vue, old React, etc.) into modern Next.js 16 (App Router) + TypeScript components.
- **Project Scaffolding**: Automatically generates a full project structure including configuration files.
- **Detailed Reports**: Provides a migration summary with modernization scores, test coverage estimates, and key improvements.
- **Zip Download**: Download the fully migrated project as a zip file, ready to run.

## Tech Stack 🛠️

- **Frontend**: React 19, Vite, Tailwind CSS
- **AI Models**: Google Gemini 2.0 Flash (Analysis & Code Gen)
- **Visualization**: Mermaid.js (via Gemini)
- **State Management**: React Context / Hooks

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A Google Gemini API Key (Get one [here](https://aistudio.google.com/))

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/lassestilvang/code-migration-autopilot.git
   cd code-migration-autopilot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:5173`.

## How to Use

1. Enter the GitHub URL of the repository you want to migrate.
2. Click "Analyze Repo" to start the scanning process.
3. Review the generated architecture diagram and analysis summary.
4. Click "Build Next.js App" to start the code generation.
5. Watch as files are generated in real-time in the file explorer.
6. Once complete, click "Download Project" to get your migrated codebase.

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for more details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
