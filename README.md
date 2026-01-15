# 🐦 Basey Bird

<!-- Add your game screenshot here -->
![Basey Bird Game Screenshot](./public/screenshot.png)

> **A fun, interactive Farcaster Frame v2 (Miniapp) featuring the iconic Base blockchain logo!**

Basey Bird is a Flappy Bird-inspired game built specifically for the Base community. Control the Base logo (the iconic blue circle) as you navigate through challenging obstacles. Built as a Farcaster Frame v2 miniapp, it brings onchain gaming directly into your Farcaster feed with smooth HTML5 Canvas physics and Base-themed visuals.

---

## ✨ Features

- 🎮 **Smooth HTML5 Canvas Physics** - Responsive, fluid gameplay with optimized canvas rendering
- 📱 **Mobile-First Design** - Built specifically for Farcaster's mobile experience
- 🔵 **Base-Themed Visuals** - Features Base's iconic blue branding and logo
- 👆 **Simple Tap-to-Jump Mechanics** - Intuitive one-touch controls perfect for mobile
- 🚀 **Frame v2 Integration** - Native Farcaster miniapp with seamless in-feed gameplay
- ⚡ **Fast & Lightweight** - Optimized for quick loading and smooth performance

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| [Next.js 15](https://nextjs.org) | App Router, Server Components, and optimal performance |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe development |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first styling |
| [OnchainKit](https://docs.base.org/onchainkit) | Ready for future onchain integrations |
| HTML5 Canvas | Game rendering and physics |
| [React 19](https://react.dev/) | Component architecture |

---

## 🚀 Getting Started

### Prerequisites

Before you begin, make sure you have:
- **Node.js 22.11.0 or higher** (LTS version recommended)
  - Check your version: `node --version`
  - Download from [nodejs.org](https://nodejs.org/)
- A package manager (npm, pnpm, or yarn)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/basey-bird.git
cd basey-bird
```

2. **Install dependencies**

```bash
npm install
```

3. **Run the development server**

```bash
npm run dev
```

4. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000) to see your game in action!

The page will auto-reload as you make changes to the code.

---

## 🌐 Deployment

### Deploy to Vercel

The easiest way to deploy Basey Bird is using [Vercel](https://vercel.com), the platform from the creators of Next.js.

#### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/basey-bird)

#### Manual Deployment

1. **Install Vercel CLI**

```bash
npm install -g vercel
```

2. **Deploy**

```bash
vercel
```

3. **Follow the prompts** to link your project and deploy

Your app will be live at `https://your-project-name.vercel.app`

### Testing as a Farcaster Frame v2 Miniapp

Once deployed, you can test your miniapp in Farcaster:

1. **Enable Developer Mode**
   - Log in to [Farcaster](https://farcaster.xyz/)
   - Navigate to [Settings > Developer Tools](https://farcaster.xyz/~/settings/developer-tools)
   - Toggle on "Developer Mode"

2. **Test Your Miniapp**
   - Use the [Farcaster Developer Playground](https://farcaster.xyz/~/developers)
   - Enter your deployed URL
   - Preview how your game appears in the Farcaster feed

3. **Create Your Manifest**
   - Follow the [Farcaster Miniapps documentation](https://miniapps.farcaster.xyz/docs/getting-started) to create a proper manifest
   - Publish your app information (title, description, icon)
   - Make it shareable in Farcaster feeds

For more details on deployment and Frame v2 integration, see:
- [Base Build App Guide](https://docs.base.org/get-started/build-app)
- [Farcaster Miniapps Getting Started](https://miniapps.farcaster.xyz/docs/getting-started)

---

## 🗺️ Roadmap

We're just getting started! Here's what's coming next:

- [ ] **🏆 Onchain High Scores** - Store top scores on Base blockchain
- [ ] **🎨 Mintable NFT Rewards** - Mint achievement NFTs for reaching milestones
- [ ] **👥 Multiplayer Mode** - Compete against other players in real-time
- [ ] **💎 Base Name Integration** - Display player identities with Base Names
- [ ] **🎵 Sound Effects** - Add immersive audio feedback
- [ ] **📊 Leaderboards** - Track and display top players
- [ ] **🎁 Daily Challenges** - Special missions for extra rewards

Have ideas? Open an issue or submit a pull request!

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows the existing style and includes appropriate tests.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🔗 Resources

### Learn More

- [OnchainKit Documentation](https://docs.base.org/onchainkit) - Learn about Base's React component library
- [Next.js Documentation](https://nextjs.org/docs) - Explore Next.js features and API
- [Base Documentation](https://docs.base.org/) - Everything about building on Base
- [Farcaster Miniapps Docs](https://miniapps.farcaster.xyz/) - Complete Frame v2 development guide

### Community

- [Base Discord](https://discord.gg/buildonbase)
- [Farcaster](https://farcaster.xyz/)
- [Base Twitter](https://twitter.com/base)

---

## 🙏 Acknowledgments

Built with ❤️ for the Base community. Special thanks to:
- The Base team for creating an amazing L2 platform
- The Farcaster team for Frame v2 and miniapp infrastructure
- The OnchainKit team for developer-friendly components
- All contributors and players!

---

**Ready to play? Deploy your own Basey Bird and start building onchain!** 🚀
