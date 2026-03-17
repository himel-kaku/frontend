# Student Academic Portal - React Frontend

A complete React 18 frontend application for a student academic portal that connects to an Express backend API.

## Features

- **Authentication**: JWT-based login system with secure token storage
- **Dashboard**: Quick overview of student information
- **Courses**: View all enrolled courses with details
- **Class Routine**: Interactive weekly schedule grid with material access
- **Exam Routine**: Timeline view of upcoming exams with materials
- **Class Resources**: Browse course materials organized by date
- **Exam Resources**: Access all exam-related materials
- **File Management**: Upload (for CRs) and download course materials
- **Role-based Access**: Different permissions for students and class representatives

## Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **React Router v6** - Client-side routing
- **Context API** - State management for authentication
- **Fetch API** - HTTP requests (no axios dependency)
- **CSS3** - Modern styling with gradients and animations

## Project Structure

```
student-portal/
├── src/
│   ├── components/
│   │   ├── Layout.jsx              # Main layout with sidebars
│   │   ├── ProtectedRoute.jsx      # Route protection wrapper
│   │   ├── RoutineGrid.jsx         # Class schedule grid component
│   │   ├── ExamCard.jsx            # Exam display card
│   │   ├── FileList.jsx            # File listing component
│   │   ├── ClassMaterialsModal.jsx # Modal for class materials
│   │   ├── ExamMaterialsModal.jsx  # Modal for exam materials
│   │   ├── UploadModal.jsx         # File upload modal
│   │   └── *.css                   # Component styles
│   ├── pages/
│   │   ├── Login.jsx               # Login page
│   │   ├── Dashboard.jsx           # Dashboard home
│   │   ├── Courses.jsx             # Courses listing
│   │   ├── ClassRoutine.jsx        # Class schedule
│   │   ├── ExamRoutine.jsx         # Exam schedule
│   │   ├── ClassResources.jsx      # Course materials browser
│   │   ├── ExamResources.jsx       # Exam materials browser
│   │   └── *.css                   # Page styles
│   ├── context/
│   │   └── AuthContext.jsx         # Authentication context
│   ├── utils/
│   │   └── api.js                  # API utility functions
│   ├── App.jsx                     # Main app component
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Global styles
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## Installation

1. **Clone or extract the project**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set your backend API URL:
   ```
   VITE_API_URL=http://localhost:5000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## API Integration

The application expects the following backend API endpoints:

### Authentication
- `POST /api/auth/login` - User login

### User Data
- `GET /api/user/my-courses` - Get enrolled courses
- `GET /api/user/class-routine` - Get class schedule
- `GET /api/user/exam-routine` - Get exam schedule
- `GET /api/user/class-materials/:classScheduleId` - Get class materials
- `GET /api/user/exam-materials/:examScheduleId` - Get exam materials
- `GET /api/user/course-materials/:courseId` - Get course materials
- `GET /api/user/exams-resource` - Get all exam resources

### File Operations
- `POST /api/upload/class-files` - Upload class files (CR only)
- `POST /api/upload/exam-files` - Upload exam files (all students)
- `GET /api/download/:fileId` - Download a file

## Key Features Implementation

### Authentication Flow
1. User enters ID and password on login page
2. Credentials sent to `/api/auth/login`
3. JWT token and user data stored in localStorage
4. AuthContext provides authentication state globally
5. ProtectedRoute component guards authenticated routes

### Class Routine
- Displays 7-day schedule in grid format
- Time slots on Y-axis, dates on X-axis
- Clicking a class opens a modal with materials
- CRs can upload files to class sessions

### Exam Routine
- Shows upcoming exams in timeline format
- Grouped by date for easy navigation
- All students can upload exam materials
- Click exam card to view details and files

### Resources Pages
- Class Resources: Browse materials by course and date
- Exam Resources: View all exam materials chronologically
- Download files with single click

### Role-Based Access
- **student role**: Can view and download materials
- **cr role**: Can upload class materials + all student permissions
- All students can upload exam materials

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

To preview the production build:
```bash
npm run preview
```

## Environment Variables

- `VITE_API_URL` - Backend API base URL (default: http://localhost:5000)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- JWT tokens are stored in localStorage
- File uploads use FormData with proper field names
- All API calls include Authorization header with Bearer token
- Loading and error states are handled for all async operations
- Responsive design adapts to different screen sizes

## License

MIT
