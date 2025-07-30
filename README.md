# Jeevan Baabu's Portfolio V2

A modern, responsive portfolio website built with Next.js 15, TypeScript, and Framer Motion. Features smooth animations, interactive sections, and a beautiful UI design.

## 🚀 Features

- **Modern Design**: Clean, minimalist design with gradient text effects and smooth animations
- **Responsive**: Fully responsive across all devices and screen sizes
- **Interactive Sections**:
  - Hero section with animated text
  - About section with detailed information
  - Tech Stack showcase with animated cards
  - Projects section with interactive project cards
  - Contact form with Formspree integration
- **Smooth Animations**: Powered by Framer Motion with custom easing functions
- **Performance Optimized**: Built with Next.js 15 and optimized for production
- **TypeScript**: Full TypeScript support for better development experience

## 🛠️ Tech Stack

- **Framework**: Next.js 15.4.2
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Fonts**: Inter, Lexend Tera
- **Deployment**: Vercel Ready

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd portfolio-v2
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
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment (Vercel)

This project is optimized for Vercel deployment:

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Connect your GitHub repository to Vercel
   - Vercel will automatically detect Next.js and build the project
   - No additional configuration needed

### Build Commands

- **Build**: `npm run build`
- **Start**: `npm start`
- **Lint**: `npm run lint`

## 📁 Project Structure

```
portfolio-v2/
├── src/
│   └── app/
│       ├── components/
│       │   ├── about.tsx          # About section
│       │   ├── contact.tsx        # Contact form
│       │   ├── electric-cursor.tsx # Custom cursor
│       │   ├── Hero_Page.tsx      # Hero section
│       │   ├── navbar.tsx         # Navigation
│       │   ├── project.tsx        # Projects showcase
│       │   ├── spotlight-card.tsx # Tech stack cards
│       │   └── tech-stack.tsx     # Tech stack section
│       ├── globals.css            # Global styles
│       ├── layout.tsx             # Root layout
│       └── page.tsx               # Main page
├── public/                        # Static assets
├── package.json                   # Dependencies
├── next.config.ts                 # Next.js config
├── tsconfig.json                  # TypeScript config
└── README.md                      # This file
```

## 🎨 Key Features

### Navigation

- Smooth scroll navigation
- Active section detection
- Responsive navbar with animations

### Sections

- **Hero**: Animated introduction with gradient text
- **About**: Detailed personal information with typewriter effect
- **Tech Stack**: Interactive cards showcasing skills and technologies
- **Projects**: Portfolio projects with hover effects and links
- **Contact**: Functional contact form with Formspree integration

### Animations

- Framer Motion animations throughout
- Custom easing functions
- Intersection Observer for scroll-triggered animations
- Hover effects and micro-interactions

## 🔧 Configuration

### Environment Variables

No environment variables required for basic functionality.

### Formspree Integration

The contact form uses Formspree for email handling. Update the endpoint in `contact.tsx` if needed:

```typescript
const res = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(formData),
});
```

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Optimized for all screen sizes

## 🚀 Performance

- Next.js 15 optimizations
- Static generation where possible
- Optimized images and assets
- Minimal bundle size

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Jeevan Baabu Murugan**

- Computer Science Engineering (AI & ML)
- Full-Stack Developer
- ML Engineer

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
