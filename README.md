# UN KioskConnect - Skills4Work Event Management System

A modern, multilingual event management and booking system built with Next.js, Firebase, and TypeScript. This application provides a comprehensive solution for managing events, bookings, and user administration with full support for Arabic and English languages.

## 🌟 Features

### Core Functionality
- **Event Management**: Create, edit, and manage events with detailed information
- **Booking System**: Users can browse and book available events
- **User Administration**: Admin panel for managing users and roles
- **Dashboard**: Personalized dashboard for users and administrators
- **Authentication**: Secure authentication using Firebase Auth (extensible to biometric)

### RFI-Compliant Features
- ✅ **Multilingual Interface**: Full Arabic/English support with RTL layout
- ✅ **Accessibility**: WCAG-compliant design with semantic HTML
- ✅ **Role-Based Access Control**: Admin and user role management
- ✅ **Scalable Architecture**: Ready for multi-kiosk deployment

### Internationalization (i18n)
- **Bilingual Support**: Full support for English and Arabic languages
- **RTL Support**: Complete right-to-left layout support for Arabic
- **Language Switcher**: Easy language switching with persistent preferences
- **Arabic Fonts**: Cairo font family for optimal Arabic text rendering

### Design & Styling
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **Responsive Design**: Fully responsive layout for all screen sizes
- **Theme System**: Custom color scheme with UN-inspired branding
- **Smooth Animations**: Subtle transitions and hover effects
- **Accessibility**: WCAG-compliant design with proper semantic HTML

## 🎨 Design System

### Color Palette
- **Primary**: Deep blue (#294C60) - Trust and stability
- **Background**: Light gray (#F0F4F8) - Clean interface
- **Accent**: Soft teal (#45B69C) - Highlight important actions
- **Dark Mode**: Full dark mode support

### Typography
- **English**: PT Sans - Modern and readable humanist sans-serif
- **Arabic**: Cairo - Optimized for Arabic text rendering
- **Headings**: Bold, clear hierarchy

## 🚀 Quick Start

### Deploy to Vercel (Recommended)

1. **Push to GitHub** (see [DEPLOYMENT.md](./DEPLOYMENT.md) for details):
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/UNKioskConnect.git
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com) and sign in with GitHub
   - Click "Add New Project" → Import your repository
   - Add Firebase environment variables in Vercel settings
   - Click "Deploy"

   See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js 18+ and npm
- Firebase project with Authentication and Firestore enabled
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kazoya/UNKioskConnect.git
   cd UNKioskConnect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
UNKioskConnect/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── dashboard/         # Dashboard pages
│   │   │   ├── admin/         # Admin pages
│   │   │   ├── bookings/      # User bookings
│   │   │   └── events/        # Event listings
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home/login page
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── ui/                # shadcn/ui components
│   │   ├── app-header.tsx    # Header component
│   │   ├── app-footer.tsx    # Footer component
│   │   ├── auth-form.tsx     # Authentication form
│   │   └── language-switcher.tsx # Language switcher
│   ├── firebase/              # Firebase configuration
│   │   ├── auth/              # Authentication logic
│   │   ├── firestore/         # Firestore hooks
│   │   └── config.ts          # Firebase config
│   ├── lib/                   # Utilities and helpers
│   │   ├── i18n.ts           # Internationalization
│   │   └── utils.ts          # Utility functions
│   └── hooks/                 # Custom React hooks
├── messages/                  # Translation files
│   ├── en.json               # English translations
│   └── ar.json               # Arabic translations
├── public/                    # Static assets
├── middleware.ts              # Next.js middleware
└── package.json               # Dependencies
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run genkit:dev` - Start Genkit development server
- `npm run genkit:watch` - Start Genkit with watch mode

## 🌍 Internationalization

The application supports two languages:
- **English (en)**: Default language
- **Arabic (ar)**: Full RTL support

### Adding Translations

Translations are stored in JSON files in the `messages/` directory. To add a new translation:

1. Add the key-value pair to both `messages/en.json` and `messages/ar.json`
2. Use the `useI18n()` hook in your component:
   ```tsx
   import { useI18n } from '@/lib/i18n';
   
   function MyComponent() {
     const { t } = useI18n();
     return <h1>{t('common.welcome')}</h1>;
   }
   ```

### Language Switching

The language preference is stored in localStorage and persists across sessions. Users can switch languages using the language switcher component in the header.

## 🔐 Authentication

The application uses Firebase Authentication with the following features:
- Email/password authentication
- User registration with display name
- Session persistence
- Protected routes
- Role-based access control (admin/user)

## 🗄️ Database

Firestore is used for data storage:
- **Users Collection**: User profiles and roles
- **Events Collection**: Event information
- **Bookings Collection**: User event bookings

## 🎯 Key Technologies

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Firebase**: Authentication and database
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality component library
- **React Hook Form**: Form management
- **Zod**: Schema validation

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels where appropriate
- Keyboard navigation support
- Screen reader friendly
- High contrast color scheme
- Focus indicators

## 🚢 Deployment

### Firebase Hosting

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy to Firebase:
   ```bash
   firebase deploy
   ```

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Vercel (recommended)
- Netlify
- AWS Amplify
- Docker containers

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Leaders International for Economic Development**
- **Skills4Work Initiative**

## 🙏 Acknowledgments

- UNHCR for inspiration and design guidelines
- The open-source community for amazing tools and libraries
- All contributors who help improve this project

## 📞 Support

For assistance, please contact support or open an issue on GitHub.

## 🔮 Future Enhancements

### High Priority (RFI Requirements)
- [ ] Biometric authentication (IRIS scanning)
- [ ] Document scanning and capture (ID, passport, supporting documents)
- [ ] Photo capture with AI validation (UNHCR compliant)
- [ ] Secure A4 document printing
- [ ] Offline mode with queue and sync
- [ ] UNHCR API integration
- [ ] Comprehensive audit logging
- [ ] Enhanced accessibility features (WCAG 2.1 AA)

### Medium Priority
- [ ] Additional language support
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] Calendar integration
- [ ] Consumables management (paper/toner monitoring)

### Low Priority
- [ ] Additional biometric modalities (fingerprint, face recognition)
- [ ] Self-upload document feature
- [ ] Advanced reporting and analytics

## 📋 RFI Compliance & Implementation

### Documentation
- **[RFI_COMPLIANCE.md](./RFI_COMPLIANCE.md)**: Detailed compliance checklist against RFI requirements
- **[IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md)**: Step-by-step implementation guide for remaining features

### Quick Status
- ✅ **Implemented**: Arabic/English support, Role-based access control, Scalable architecture
- 🟡 **Partially Implemented**: Accessibility, API integration, Encryption, Privacy features
- ❌ **Not Implemented**: Biometric auth, Document scanning, Photo capture, Printing, Offline mode

### RFI Requirements Coverage
| Category | Status | Details |
|----------|--------|---------|
| Multilingual Interface | ✅ Complete | Full Arabic/English with RTL |
| Accessibility | 🟡 Partial | Basic compliance, needs enhancement |
| Role-Based Access | ✅ Complete | Admin/User roles implemented |
| Biometric Auth | ❌ Not Started | IRIS scanning required |
| Document Scanning | ❌ Not Started | Hardware integration needed |
| Photo Capture | ❌ Not Started | Camera + AI validation needed |
| Secure Printing | ❌ Not Started | Printer integration needed |
| Offline Mode | ❌ Not Started | Queue system required |
| API Integration | 🟡 Partial | UNHCR API integration needed |
| Audit Logging | ❌ Not Started | Comprehensive logging required |

---

**Built with ❤️ for the UN community**
