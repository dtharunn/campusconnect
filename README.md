# CampusConnect — College Event Registration Portal

CampusConnect is a responsive web application that allows college students to explore upcoming events, view event details, register for events, and manage their registrations through a simple, user-friendly interface.

## 🌐 Live Demo

**Live Website:** https://campusconnect-e.vercel.app/

## ✨ Features

- **Event Discovery:** Browse upcoming college events.
- **Search and Filters:** Find events by name, category, and date.
- **Event Details:** View event descriptions, dates, times, venues, and seat availability.
- **Student Registration:** Register for events using student details.
- **Form Validation:** Validate required fields and email addresses.
- **Duplicate Prevention:** Prevent multiple registrations for the same event by the same student.
- **My Registrations:** View registered events and their details.
- **Cancellation:** Cancel existing registrations.
- **Seat Management:** Display registered attendees, remaining seats, and event capacity.
- **Local Storage:** Preserve event and registration data across page refreshes in the same browser.
- **Responsive Interface:** Access the application on desktop and mobile screens.

## 🛠️ Technologies Used

- React.js
- JavaScript
- HTML5
- CSS3
- Vite
- Lucide React
- Browser Local Storage

## 📁 Project Structure

```text
campusconnect-react/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   └── ...
├── index.html
├── package.json
├── package-lock.json
└── README.md
```

*Note: The contents of the `src` folder may vary depending on the final project structure.*

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm
- Git (optional, for version control)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/dtharunn/campusconnect.git
   ```

2. Navigate to the project directory:

   ```bash
   cd campusconnect
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL displayed in your terminal, usually `http://localhost:5173/`.

### Production Build

To create a production build, run:

```bash
npm run build
```

To preview the production build locally, run:

```bash
npm run preview
```

## 💾 Data Storage

CampusConnect uses browser Local Storage to save event and registration information.

**Current limitation:** Data is stored separately in each browser. Registrations are not shared between students or devices, and clearing browser storage may remove saved data.

## ☁️ Deployment

The application is deployed using Vercel.

**Live URL:** https://campusconnect-e.vercel.app/

## 🔮 Future Enhancements

- Database integration for centralized event and registration management.
- Student authentication and profile management.
- Admin dashboard for creating and managing events.
- Email confirmations and event reminders.
- QR-code-based event entry passes.
- Real-time registration and seat availability updates.
- Event feedback and reviews.

## 🎯 Project Objective

The objective of CampusConnect is to simplify college event discovery and registration by providing an accessible digital platform for students to explore events and manage their participation.

## 👨‍💻 Author

**Tharun / CampusConnect Project Team**

GitHub Repository: https://github.com/dtharunn/campusconnect

---

*Developed as a college hackathon project.*
