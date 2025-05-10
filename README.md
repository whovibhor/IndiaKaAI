# 🇮🇳 India ka AI - Community Website

**India ka AI** is a static, fast, and community-driven web platform created to empower Indian developers, students, and enthusiasts in the field of Artificial Intelligence. It provides learning paths, blog posts, startup features, and showcases real projects by the Indian AI community.

---

## 📁 Project Structure

```
indiakaai-website/
│
├── index.html               # Homepage
├── learn.html              # Learning hub page
├── blog.html               # Blog listing page
├── blog-single.html        # Single blog post template
├── community.html          # Projects & Startups showcase
├── about.html              # About the initiative
├── contact.html            # Contact form page
├── newsletter.html         # Newsletter archive
│
├── assets/
│   ├── css/
│   │   └── style.css        # Main stylesheet (or Tailwind build output)
│   │
│   ├── js/
│   │   └── main.js          # All scripts (menu toggle, filtering, etc.)
│   │
│   ├── img/
│   │   └── logo.svg         # Site logo and other images
│   │   └── hero-banner.jpg  # Homepage hero images
│   │   └── team.jpg         # About/team photos
│
├── blog/
│   └── post-1.html          # Example blog post (copy blog-single.html)
│   └── post-2.html          # Another post
│
├── data/
│   ├── resources.json       # AI learning resources list
│   ├── posts.json           # List of blog metadata (optional)
│   └── community.json       # User-submitted startups/projects
│
├── forms/
│   └── submit-project.html  # (Optional) Submit a project form
│   └── submit-blog.html     # (Optional) Contributor blog submission
│
└── README.md                # Project overview and instructions
```

---

## 📌 Pages Description

### `index.html`
Landing page with:
- Hero banner
- Introduction to the platform
- Quick access to blogs, learning, and community sections
- Newsletter signup

### `learn.html`
Learning hub with:
- Free AI learning paths
- Curated YouTube playlists
- Resources from Indian creators

### `blog.html` and `blog-single.html`
- List of blog posts on Indian AI trends, news, and opinions
- Each blog has its own `blog-single.html` copy

### `community.html`
- Directory of startups, student projects, and open AI tools
- Cards with details and GitHub/project links

### `about.html`
- Background and vision of "India ka AI"
- Team and story

### `contact.html`
- Basic contact form (can use Formspree or similar)
- Social links

### `newsletter.html`
- Past newsletters archive (optional)
- Option to subscribe via email

---

## 🛠️ Tech Stack

- **HTML5** – Structure
- **CSS3 / Tailwind CSS** – Styling
- **JavaScript** – Interactivity (Vanilla JS)
- **JSON files** – To power blog/resource lists (optional)
- **Hosting** – Netlify / GitHub Pages / Vercel

---

## 🚀 Setup Instructions

1. Clone the repo or download ZIP
2. Edit HTML files in any code editor (VS Code recommended)
3. Add your images in `/assets/img`
4. Customize your styles in `/assets/css/style.css`
5. Link JavaScript functions in `/assets/js/main.js`
6. Create content using copies of `blog-single.html`
7. Add new resources/blogs in `/data/*.json`
8. Deploy using GitHub Pages or Netlify (drag and drop folder)

---

## ✅ To-Do Features

- [ ] Add filters to Learn and Blog pages
- [ ] Create JSON loaders for content (optional JS enhancement)
- [ ] Mobile responsive and accessibility checks
- [ ] Add animations or transitions with Alpine.js (optional)

---

## 🤝 Contribution Guide (Optional)
If planning to open-source:
- Fork → Edit → Pull Request
- Keep naming clean and consistent

---

## 📧 Contact & Credits
- Twitter: [@IndiaKaAI](#)
- Instagram: [@IndiaKaAI](#)
- Email: contact@indiakaai.in

---

Proudly built by the Indian AI community 🇮🇳
