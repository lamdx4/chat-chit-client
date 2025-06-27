# Chat Chit Client

A modern, real-time chat application built with React, TypeScript, and Socket.IO. This is the frontend client for the Chat Chit messaging system.

## 🚀 Features

- **Real-time Messaging**: Instant messaging with Socket.IO
- **Group Chats**: Create and manage group conversations
- **File Sharing**: Support for images, documents, and media files
- **User Authentication**: Secure login and registration
- **Friend System**: Add friends and manage relationships
- **Polls**: Create and participate in group polls
- **Story Sharing**: Share temporary stories with friends
- **Responsive Design**: Mobile-first responsive UI
- **Dark/Light Mode**: Theme switching support
- **Audio Recording**: Voice message support
- **Emoji & GIF Support**: Rich messaging experience
- **Push Notifications**: Real-time notification system

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS with shadcn/ui components
- **State Management**: TanStack Query (React Query)
- **Real-time Communication**: Socket.IO Client
- **HTTP Client**: Axios
- **Routing**: React Router v7
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React & Heroicons
- **Date Handling**: date-fns
- **Notifications**: Sonner
- **Deployment**: Docker with Nginx

## 📋 Prerequisites

- Node.js 18+
- Yarn package manager
- Docker (for containerized deployment)

## 🚀 Getting Started

### Development Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd chat-chit-client
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Environment Configuration**
   
   Copy the environment file and configure it:

   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your backend URL:

   ```env
   VITE_URL_BACKEND=http://localhost:36363
   VITE_APP_NAME=Chat Chit
   ```

4. **Start the development server**

   ```bash
   yarn dev
   ```

   The application will be available at `http://localhost:5173`

### Production Build

1. **Build the application**

   ```bash
   yarn build
   ```

2. **Preview the production build**

   ```bash
   yarn preview
   ```

## 🐳 Docker Deployment

### Build and Run with Docker

1. **Build the Docker image**

   ```bash
   docker build -t chat-chit-client .
   ```

2. **Run the container**

   ```bash
   docker run -p 80:80 chat-chit-client
   ```

The application will be available at `http://localhost:80`

### Docker Compose (Recommended)

If you have the complete Chat Chit system, use docker-compose:

```bash
docker-compose up -d
```

## 📁 Project Structure

```text
src/
├── components/          # Reusable UI components
│   ├── elements/       # Specific feature components
│   ├── layouts/        # Layout components
│   ├── pages/          # Page components
│   ├── providers/      # Context providers
│   └── ui/             # shadcn/ui components
├── config/             # Configuration files
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── routes/             # Routing configuration
├── services/           # API services
├── socketio/           # Socket.IO configuration
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## 🔧 Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn preview` - Preview production build
- `yarn lint` - Run ESLint

## 🌐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_URL_BACKEND` | Backend API URL | `http://localhost:36363` |
| `VITE_APP_NAME` | Application name | `Chat Chit` |

## 📱 Key Features Implementation

### Real-time Communication

- Socket.IO integration for instant messaging
- Automatic reconnection handling
- Real-time typing indicators
- Online/offline status tracking

### Message Types

- Text messages with emoji support
- Image and file attachments
- Voice recordings
- GIF integration
- Poll creation and voting

### User Experience

- Infinite scroll for message history
- Message search functionality
- Push notifications
- Responsive design for all devices
- Dark/light theme support

## 🔐 Security Features

- JWT token authentication
- Secure file upload handling
- XSS protection
- CSRF protection via proper headers
- Content Security Policy

## 🚀 Performance Optimizations

- Code splitting with Vite
- Image optimization
- Lazy loading for components
- Efficient state management with React Query
- Service worker for caching (if implemented)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Support

For support, email [support@chatchit.fun](mailto:support@chatchit.fun) or join our community chat.

## 🔗 Related Projects

- [Chat Chit Server](../chat-chit-server) - Backend API server
- [Chat Chit Mobile](../chat-chit-mobile) - Mobile application (if available)

---

Made with ❤️ by the Chat Chit Team