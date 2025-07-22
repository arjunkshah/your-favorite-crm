# CRM Dashboard

A modern, responsive CRM dashboard built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui components.

## 🌐 Live Demo

**🎯 Visit the live application: [https://tweakcn.surge.sh](https://tweakcn.surge.sh)**

## 🚀 Features

- **Modern UI**: Clean, professional interface with Claymorphism theme
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Interactive Navigation**: Collapsible sidebar with smooth animations
- **Real-time Stats**: Revenue, customers, sales, and deals overview
- **Customer Management**: Full CRUD operations with search and filtering
- **Sales Analytics**: Interactive charts and performance metrics
- **Calendar Management**: Event scheduling and management
- **Messaging System**: Real-time conversations and message management
- **Report Generation**: Custom reports with data visualization
- **Settings Management**: User preferences and account configuration
- **Dark Mode**: Toggle between light and dark themes with system preference detection

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **State Management**: React hooks

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd crm-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
crm-dashboard/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   └── page.tsx          # Main dashboard page
│   ├── components/
│   │   ├── ui/               # shadcn/ui components
│   │   ├── dashboard-layout.tsx
│   │   └── dashboard-content.tsx
│   ├── hooks/
│   │   └── use-mobile.ts
│   └── lib/
│       └── utils.ts
├── public/
├── components.json            # shadcn/ui configuration
└── package.json
```

## 🎨 Components

### Dashboard Layout
- **Sidebar Navigation**: Collapsible navigation with icons
- **Header**: Search bar, notifications, and user avatar
- **Responsive Design**: Mobile-first approach

### Dashboard Content
- **Statistics Cards**: Revenue, customers, sales, deals
- **Customer List**: Recent customers with avatars and status
- **Sales Overview**: Progress bars for monthly performance
- **Activity Feed**: Recent interactions and updates

## 🎯 Key Features

### Navigation
- Dashboard overview
- Customer management
- Analytics and reports
- Calendar and scheduling
- Messages and communication
- Settings and configuration

### Data Visualization
- Revenue tracking with growth indicators
- Customer count and activity metrics
- Sales performance with progress bars
- Deal pipeline management

### User Experience
- Clean, modern interface
- Smooth animations and transitions
- Responsive design for all devices
- Intuitive navigation
- Dark/Light mode toggle with system preference detection

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Components

1. Install shadcn/ui components:
```bash
npx shadcn@latest add <component-name>
```

2. Import and use in your components:
```tsx
import { Button } from "@/components/ui/button"
```

## 🎨 Customization

### Colors and Themes
The dashboard uses CSS variables for easy customization. Modify the colors in `src/app/globals.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  /* ... more variables */
}
```

### Adding New Pages
1. Create new page components in `src/app/`
2. Add navigation links in `dashboard-layout.tsx`
3. Implement page-specific content

## 📱 Responsive Design

The dashboard is fully responsive with:
- **Desktop**: Full sidebar with expanded navigation
- **Tablet**: Collapsible sidebar with icons
- **Mobile**: Slide-out navigation with hamburger menu

## 🔮 Future Enhancements

- [ ] Customer detail pages
- [ ] Advanced analytics with charts
- [ ] Deal pipeline management
- [ ] Email integration
- [ ] Calendar integration
- [ ] User authentication
- [ ] Dark mode support
- [ ] Real-time updates
- [ ] API integration
- [ ] Data export functionality

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For questions or support, please open an issue on GitHub.

---

Built with ❤️ using Next.js, TypeScript, and shadcn/ui
