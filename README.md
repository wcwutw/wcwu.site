# Personal Website

A clean, researcher-style personal website built with TypeScript, HTML, CSS, and JavaScript.

## 🎉 Quick Start

Your website is ready to use! If the development server is running, open:

**http://localhost:8080**

### First Time Setup

```bash
# 1. Install dependencies
npm install

# 2. Build TypeScript
npm run build

# 3. Start development server
npm run dev
```

## ✨ Features

- 📱 **Responsive design** - Works on all devices
- 🌓 **Dark/Light theme toggle** - Automatic preference saving
- 📝 **Markdown blog posts** - Write in markdown with frontmatter
- 🎨 **Clean, minimalist UI** - Academic/researcher style
- 🚀 **Fast and lightweight** - Loads in <500ms
- 💻 **Syntax highlighting** - Beautiful code blocks
- 📂 **Simple content management** - Just add markdown files

## 📁 Project Structure

```
personal-site/
├── index.html              # Main HTML file
├── package.json           # Dependencies & scripts
├── styles/
│   └── main.css          # All styling (light + dark themes)
├── src/                  # TypeScript source files
│   ├── main.ts          # Entry point
│   ├── theme.ts         # Theme management
│   ├── router.ts        # Client-side routing
│   ├── markdown.ts      # Markdown parsing
│   ├── posts.ts         # Posts management
│   └── pages/           # Page components
│       ├── home.ts
│       ├── blog.ts
│       ├── about.ts
│       └── archive.ts
├── content/
│   └── posts/           # Your markdown blog posts
│       ├── getting-started.md
│       ├── example-post.md
│       └── ...
├── dist/                # Compiled JavaScript (generated)
├── scripts/
│   ├── build.js        # Build script
│   └── new-post.js     # Helper to create posts
└── doc/                # Documentation
    ├── DEPLOYMENT.md   # Deployment guide
    └── MIGRATION.md    # Hexo migration guide
```

## ✏️ Writing Blog Posts

### Method 1: Using Helper Script (Recommended)

```bash
npm run new-post
```

This interactive script creates a new post with proper frontmatter.

### Method 2: Manual Creation

1. **Create markdown file** in `content/posts/`, e.g., `my-first-post.md`:

```markdown
---
title: My First Post
date: 2026-01-17
category: general
tags: [tag1, tag2]
description: Brief description of your post
---

# My First Post

Your content here...
```

2. **Register the post** in `src/posts.ts`:

```typescript
const POST_FILES = [
    'example-post.md',
    'my-first-post.md',  // Add this line
];
```

3. **Rebuild**:

```bash
npm run build
```

4. Refresh browser to see your new post!

### Markdown Features

Your posts support:
- **Headers** (H1-H6)
- **Bold**, *italic*, `inline code`
- Code blocks with syntax highlighting
- Links and images
- Lists (ordered and unordered)
- Tables
- Blockquotes

Example code block:
````markdown
```python
def hello():
    print("Hello, World!")
```
````

## 🎨 Customization

### Update Your Information

1. **Site Title** - Edit `index.html`:
```html
<title>Your Name - Personal Website</title>
```

2. **Home Page** - Edit `src/pages/home.ts`:
```typescript
mainContent.innerHTML = `
    <h1>Your Name</h1>
    <p class="subtitle">Your Title @ University</p>
    <p>Your bio...</p>
`;
```

3. **About Page** - Edit `src/pages/about.ts`:
   - Add your background
   - Update education
   - Change contact information

4. **Rebuild after changes**:
```bash
npm run build
```

### Customize Theme Colors

Edit `styles/main.css`:

```css
:root {
    --bg-primary: #ffffff;
    --text-primary: #1a1a1a;
    --link-color: #0066cc;  /* Change this! */
}

[data-theme="dark"] {
    --bg-primary: #1a1a1a;
    --text-primary: #e0e0e0;
    --link-color: #66b3ff;  /* And this! */
}
```

## 🛠️ Development

### Available Commands

```bash
npm run build      # Compile TypeScript
npm run dev        # Build and start server
npm run watch      # Auto-compile on changes
npm run new-post   # Create new blog post
```

### Development Workflow

For continuous development:

**Terminal 1:**
```bash
npm run watch
```

**Terminal 2:**
```bash
npx http-server -p 8080
```

Now TypeScript auto-compiles when you save files!

## 🌐 Deployment

When you're ready to deploy online, see **[doc/DEPLOYMENT.md](doc/DEPLOYMENT.md)** for detailed instructions on:

- GitHub Pages (free)
- Netlify (free, easy drag-and-drop)
- Vercel (free)
- Traditional hosting
- Custom domains

**Quick Deploy (Netlify):**
1. Go to [netlify.com/drop](https://app.netlify.com/drop)
2. Drag the `personal-site` folder
3. Your site is live!

## 📦 Content Organization

### Categories

Suggested categories for your posts:
- `general` - Personal updates, reflections
- `code` - Programming, algorithms, projects
- `baseball` - Sports, games, travel
- (Create your own!)

### Tags

Tag your posts for better organization:
- Technical: `javascript`, `python`, `algorithm`, `tutorial`
- Academic: `university`, `courses`, `semester-review`
- Personal: `travel`, `sports`, `hobbies`

## 🔄 Migrating from Hexo

If you're migrating from an existing Hexo blog, see **[doc/MIGRATION.md](doc/MIGRATION.md)** for:
- Frontmatter conversion guide
- Content structure changes
- Step-by-step migration process

## 🚀 Performance

- **Initial Load**: ~50-100ms
- **Total Size**: ~75KB (excluding images)
- **Time to Interactive**: <500ms
- **Browser Support**: Chrome/Edge/Firefox/Safari (latest)

## 📝 Sample Posts

Four example posts are included to demonstrate features:

1. **getting-started.md** - Complete usage guide
2. **example-post.md** - Features overview
3. **sample-baseball.md** - Travel/sports post example
4. **sample-semester.md** - Academic post with code

Feel free to delete or customize these examples!

## 🐛 Troubleshooting

**Posts not showing?**
- Verify filename is added to `src/posts.ts`
- Check frontmatter format is correct
- Rebuild: `npm run build`

**Dark mode not saving?**
- Ensure browser localStorage is enabled
- Try clearing cache

**Page not loading?**
- Check browser console for errors
- Verify all TypeScript compiled successfully
- Check file paths are correct

## 📚 Technology Stack

- **HTML5/CSS3** - Structure and styling
- **TypeScript** - Type-safe JavaScript
- **Marked.js** (v11.1.1) - Markdown parsing
- **Highlight.js** (v11.9.0) - Code syntax highlighting
- **CSS Custom Properties** - Theming system
- **LocalStorage** - Preference persistence

## ✅ Next Steps

1. ⬜ Browse your site at http://localhost:8080
2. ⬜ Update `src/pages/home.ts` with your info
3. ⬜ Update `src/pages/about.ts` with your background
4. ⬜ Write your first blog post
5. ⬜ Test on mobile device
6. ⬜ Deploy online (see `doc/DEPLOYMENT.md`)

## 📄 License

MIT License - Feel free to use this template for your own website!

## 🙏 Credits

Built with:
- [Marked.js](https://marked.js.org/) - Markdown parser
- [Highlight.js](https://highlightjs.org/) - Syntax highlighting
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript

---

**Enjoy your new website! 🎉**
