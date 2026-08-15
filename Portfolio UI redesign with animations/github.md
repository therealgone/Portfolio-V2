repo: therealgone/Portfolio-V2
branch: main

## Last sync

date: 2026-08-15T05:21:21Z

### Updated in this project

- Read the repo's build config, layout and global styles to write a Claude Code handoff spec.
- Recorded the cleanup required to port the V3 design: remove the three.js/GSAP stack, add hls.js.
- Mapped every V3 section to the repo files it replaces.
- No repo files were modified — the port happens in the repo via Claude Code.

## Screen map

| Project screen | Repo files |
| --- | --- |
| Portfolio V3.dc.html (whole page) | src/app/page.tsx, src/app/layout.tsx, src/app/globals.css |
| Nav island + overlay | src/app/components/navbar.tsx (replaced) |
| Hero | src/app/components/Hero_Page.tsx, components/three/* (replaced, 3D removed) |
| About + Rabbit Hole | src/app/components/about.tsx (replaced) |
| Tech field | src/app/components/tech-stack.tsx (replaced) |
| Projects | src/app/components/project.tsx (replaced) |
| Academics | new — no repo equivalent |
| Contact | src/app/components/contact.tsx (replaced) |
| Tech icons | public/*.svg (reused as-is) |
