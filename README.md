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
.
├── docker-compose.yml
├── Dockerfile
├── evidence
│   ├── html-snippets.md
│   └── lighthouse-accessibility.html
├── jest.config.js
├── package.json
├── public
│   ├── css
│   │   ├── base.css
│   │   └── tokens.css
│   ├── index.html
│   ├── js
│   │   ├── a11y.js
│   │   ├── app.js
│   │   └── modules
│   │       ├── bookings.js
│   │       ├── rooms.js
│   │       ├── router.js
│   │       ├── state.js
│   │       ├── __tests__
│   │       │   └── utils.test.js
│   │       └── utils.js
│   └── views
│       ├── data.html
│       └── form.html
├── README.md
└── wireframes
    ├── data.png
    ├── form.png
    └── home.png

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
