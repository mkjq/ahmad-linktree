<p align="center"><img src=".github/assets/logo.svg" width="96" alt="LinkTree Studio logo"></p>

<h1 align="center">LinkTree Studio</h1>

<p align="center">
  A link-in-bio page with its own admin dashboard, live phone preview and one-click themes — no backend, no build step.<br>
  <sub>صفحة روابط شخصية بلوحة تحكم ومعاينة حية وثيمات جاهزة — بلا خادم</sub>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/HTML-CSS-e34f26?logo=html5&logoColor=white" alt="HTML and CSS">
  <img src="https://img.shields.io/badge/JavaScript-vanilla-f7df1e?logo=javascript&logoColor=black" alt="Vanilla JavaScript">
  <img src="https://img.shields.io/badge/build-none-7c3aed" alt="No build step">
</p>

## Features

- **Public page** (`index.html`) — profile, links, photo gallery and videos, with particles and scroll animations.
- **Dashboard** (`ganeral/index.html`) — edit everything with a live phone preview.
- **Styling** — one-click preset themes, custom backgrounds and colours, animated name effects (gradient, neon, gold, ice, galaxy, blood…), and custom CSS.
- **Backup** — export and import all settings as JSON.

## How it works

Everything is plain HTML, CSS and JavaScript. Content and settings are saved in the browser's `localStorage`, so the dashboard edits the copy in the browser you use — export the JSON to move it to another device.

The first time you open the dashboard you choose its password; only a salted SHA-256 hash of it is stored.

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

---

<p align="center"><sub>A hobby project by <a href="https://github.com/mkjq">@mkjq</a></sub></p>
