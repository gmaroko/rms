### RMS – Room Booking System

### Overview
This project is a browser-based application built with HTML5, CSS3, and modern JavaScript (ES6+). It demonstrates:

- Accessibility (WCAG compliance)
- Responsive design
- Modular architecture
- Asynchronous API integration
- Client-side data persistence
- Security and performance best practices
- Testing and CI/CD pipeline

### Project Structure
```bash

rms/
├─ .github/workflows/lint.yml      # CI for linting
├─ evidence/                       # Accessibility & code evidence
│   ├─ lighthouse-accessibility.html
│   ├─ lighthouse-accessibility-screenshot.png
│   └─ html-snippets.md
├─ wireframes/                     # Low-fidelity wireframes
│   ├─ home.png
│   ├─ data.png
│   └─ form.png
├─ public/                         # Static assets
│   ├─ index.html
│   ├─ views/data.html
│   ├─ views/form.html
│   ├─ css/tokens.css
│   ├─ css/base.css
│   ├─ js/a11y.js
│   └─ img/placeholders.svg
├─ Dockerfile                      # Nginx container
├─ docker-compose.yml              # Local dev setup
├─ package.json                    # Dev scripts
└─ README.md

```

### Setup Instructions

#### 1. Run Locally
``` bash
# Install dependencies
npm install

# Start server
npm run dev
```

#### 2. Run with Docker
```bash
docker-compose up -d

# Or with npm
npm run local
```

Access the webapp at: http://localhost:8080


#### Project Progress

#### Upload 1 Checklist
- Wireframes
- Semantic HTML skeleton for 3 views
- Base CSS layout (Grid/Flex + breakpoints)
- Keyboard navigation
- Color contrast validated
- Lighthouse Accessibility
