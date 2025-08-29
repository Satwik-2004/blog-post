# Full-Stack Blog Application

A complete full-stack blog application built with Next.js, TypeScript, and shadcn/ui. Features authentication, CRUD operations, and modern UI with server-side rendering capabilities.

![Blog Application Demo](screenshots/demo.gif)

## 🚀 Features

- **Authentication System**: Secure user registration and login with JWT tokens
- **CRUD Operations**: Complete Create, Read, Update, Delete functionality for blog posts
- **Authorization**: Only post owners can edit/delete their posts
- **Search & Pagination**: Search posts by title/username with paginated results
- **Server-Side Rendering**: SEO-optimized with Next.js SSR/SSG
- **Modern UI**: Beautiful interface with shadcn/ui components
- **Type Safety**: Full TypeScript implementation across the stack
- **Form Validation**: Client and server-side validation with inline error messages
- **Security**: Password hashing, CORS protection, and secure JWT handling
- **User Experience**: Loading states, toasts, confirmation dialogs, and optimistic UI

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express.js (TypeScript)
- JWT Authentication
- MongoDB with mongoose
- bcrypt for password hashing
- Zod for runtime validation
- Express Validator for input validation

**Frontend:**
- Next.js 14+ (App Router)
- TypeScript
- shadcn/ui components
- Tailwind CSS
- React Hook Form with TypeScript
- Zod for form validation
- Axios/Fetch for API calls
- Next.js middleware for auth

**Development:**
- Concurrently for running both servers
- Nodemon with ts-node for backend
- ESLint + Prettier with TypeScript rules
- Husky for git hooks

## 📁 Project Structure

```
blog-post/
├── client/                     # Frontend Next.js application
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/           # Auth route group
│   │   │   ├── login/        
│   │   │   │   └── page.tsx
│   │   │   └── register/     
│   │   │       └── page.tsx
│   │   ├── posts/            
│   │   │   ├── [id]/         
│   │   │   │   ├── page.tsx  # Post detail
│   │   │   │   └── edit/     
│   │   │   │       └── page.tsx
│   │   │   └── create/       
│   │   │       └── page.tsx
│   │   ├── profile/          
│   │   │   └── page.tsx
│   │   ├── globals.css       # Global styles with Tailwind
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home page
│   │   └── loading.tsx       # Global loading UI
│   ├── components/           # Reusable components
│   │   ├── ui/              # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ...
│   │   ├── auth/            # Auth components
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── AuthGuard.tsx
│   │   ├── posts/           # Post components
│   │   │   ├── PostCard.tsx
│   │   │   ├── PostForm.tsx
│   │   │   ├── PostList.tsx
│   │   │   └── SearchBar.tsx
│   │   ├── layout/          # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Sidebar.tsx
│   │   └── common/          # Common components
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorBoundary.tsx
│   │       └── Pagination.tsx
│   ├── lib/                 # Utilities and configurations
│   │   ├── utils.ts         # Utility functions
│   │   ├── validations.ts   # Zod schemas
│   │   ├── api.ts           # API client
│   │   ├── auth.ts          # Auth utilities
│   │   └── types.ts         # TypeScript types
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── usePosts.ts
│   │   └── useDebounce.ts
│   ├── middleware.ts        # Next.js middleware for auth
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── components.json      # shadcn/ui config
│   ├── tsconfig.json
│   ├── package.json
│   └── .env.example
├── server/                  # Backend Express application
│   ├── src/
│   │   ├── controllers/     # Route controllers (TypeScript)
│   │   │   ├── authController.ts
│   │   │   └── postController.ts
│   │   ├── middleware/      # Middleware functions
│   │   │   ├── auth.ts
│   │   │   ├── validation.ts
│   │   │   └── errorHandler.ts
│   │   ├── models/          # Database models
│   │   │   ├── User.ts
│   │   │   └── Post.ts
│   │   ├── routes/          # API routes
│   │   │   ├── auth.ts
│   │   │   └── posts.ts
│   │   ├── utils/           # Helper functions
│   │   │   ├── jwt.ts
│   │   │   ├── password.ts
│   │   │   └── validation.ts
│   │   ├── types/           # TypeScript type definitions
│   │   │   ├── auth.ts
│   │   │   ├── post.ts
│   │   │   └── api.ts
│   │   ├── config/          # Configuration files
│   │   │   ├── database.ts
│   │   │   └── cors.ts
│   │   ├── app.ts           # Express app setup
│   │   └── server.ts        # Server entry point
│   ├── dist/                # Compiled JavaScript
│   ├── tsconfig.json
│   ├── package.json
│   └── .env.example
├── screenshots/             # Demo images/GIFs
├── postman/                # Postman collection
├── @types/                 # Shared TypeScript types
├── README.md
└── package.json            # Root package for scripts
```

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn or pnpm
- MongoDB/PostgreSQL database
- Git

### 1. Clone Repository
```bash
git clone https://github.com/Satwik-2004/blog-post.git
cd blog-post
```

### 2. Backend Setup
```bash
cd server
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your database URL, JWT secret, etc.
```

### 3. Frontend Setup
```bash
cd ../client
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your API base URL

# Initialize shadcn/ui (if not already done)
npx shadcn-ui@latest init
```

### 4. Database Setup
```bash
# Start your MongoDB/PostgreSQL service
# Run any seed scripts if available
cd ../server
npm run seed  # (if seed script exists)
```

## 🚀 Running the Application

### Development Mode
```bash
# From root directory - runs both client and server
npm run dev

# Or run separately:
# Terminal 1 (Backend)
cd server && npm run dev

# Terminal 2 (Frontend) 
cd client && npm run dev
```

### Production Build
```bash
# Build frontend
cd client && npm run build

# Start production
npm run start

# Build and start backend
cd ../server
npm run build
npm run start
```

**Access Points:**
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

## 📋 API Documentation

### TypeScript Types

```typescript
// User Types
interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// Post Types
interface Post {
  id: string;
  title: string;        // 5-120 chars, required
  imageURL?: string;    // optional, valid URL
  content: string;      // min 50 chars, required
  username: string;     // author username
  userId: string;       // author ID
  createdAt: Date;
  updatedAt: Date;
}

// API Response Types
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": string,     // required, 3-20 chars
  "email": string,        // required, valid email
  "password": string      // required, min 6 chars
}

Response: 201 Created
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "jwt_token",
    "user": User
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": string,        // email or username
  "password": string
}

Response: 200 OK
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token",
    "user": User
  }
}
```

### Posts Endpoints

#### Get All Posts
```http
GET /api/posts?search=query&page=1&limit=10

Response: 200 OK
{
  "success": true,
  "message": "Posts retrieved successfully",
  "data": {
    "posts": Post[],
    "pagination": {
      "currentPage": number,
      "totalPages": number,
      "totalItems": number,
      "hasNext": boolean,
      "hasPrev": boolean
    }
  }
}
```

#### Get Single Post
```http
GET /api/posts/:id

Response: 200 OK
{
  "success": true,
  "message": "Post retrieved successfully",
  "data": {
    "post": Post
  }
}
```

#### Create Post (Auth Required)
```http
POST /api/posts
Authorization: Bearer jwt_token
Content-Type: application/json

{
  "title": string,        // 5-120 chars, required
  "imageURL"?: string,    // optional, valid URL
  "content": string       // min 50 chars, required
}

Response: 201 Created
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "post": Post
  }
}
```

#### Update Post (Auth Required, Owner Only)
```http
PUT /api/posts/:id
Authorization: Bearer jwt_token
Content-Type: application/json

{
  "title"?: string,
  "imageURL"?: string,
  "content"?: string
}

Response: 200 OK
{
  "success": true,
  "message": "Post updated successfully",
  "data": {
    "post": Post
  }
}
```

#### Delete Post (Auth Required, Owner Only)
```http
DELETE /api/posts/:id
Authorization: Bearer jwt_token

Response: 200 OK
{
  "success": true,
  "message": "Post deleted successfully"
}
```

### Error Responses
```typescript
interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
  details?: ValidationError[];
}

interface ValidationError {
  field: string;
  message: string;
  value?: any;
}
```

## 🎨 Frontend Implementation

### Next.js App Router Structure

**Authentication Pages:**
- `/login` - Login form with shadcn/ui components
- `/register` - Registration form with validation
- Protected routes using Next.js middleware

**Blog Pages:**
- `/` - Home feed with SSR for SEO
- `/posts/[id]` - Dynamic post detail page
- `/posts/create` - Create new post (protected)
- `/posts/[id]/edit` - Edit post (owner only)
- `/profile` - User's posts dashboard

### Key Components with TypeScript

```typescript
// Example: Post Card Component
interface PostCardProps {
  post: Post;
  showActions?: boolean;
  onEdit?: (post: Post) => void;
  onDelete?: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  showActions = false,
  onEdit,
  onDelete 
}) => {
  // Component implementation with shadcn/ui
}
```

### Form Validation with Zod

```typescript
// Validation Schemas
const postSchema = z.object({
  title: z.string()
    .min(5, "Title must be at least 5 characters")
    .max(120, "Title must be less than 120 characters"),
  imageURL: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  content: z.string()
    .min(50, "Content must be at least 50 characters")
});

type PostFormData = z.infer<typeof postSchema>;
```

### shadcn/ui Components Used

- **Form Components**: `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`
- **Input Components**: `Input`, `Textarea`, `Button`
- **Layout Components**: `Card`, `CardHeader`, `CardContent`, `CardFooter`
- **Feedback Components**: `Alert`, `AlertDescription`, `Toast`, `Dialog`
- **Navigation**: `NavigationMenu`, `Breadcrumb`
- **Data Display**: `Table`, `Badge`, `Avatar`, `Separator`

## 🔒 Security Features

- **Type-Safe Authentication**: Full TypeScript implementation
- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth with proper typing
- **CORS Protection**: Configured for frontend domain
- **Input Validation**: Zod schemas for runtime validation
- **Authorization Checks**: Owner-only operations with type safety
- **Next.js Middleware**: Route protection at the framework level

## ✨ Quality of Life Features

- **Loading States**: Next.js built-in loading.tsx and Suspense
- **Toast Notifications**: shadcn/ui toast system
- **Confirmation Dialogs**: shadcn/ui dialog components
- **Optimistic UI**: React transitions and loading states
- **Form Persistence**: React Hook Form state management
- **Responsive Design**: Tailwind CSS with mobile-first approach
- **Error Boundaries**: Next.js error handling


## 🧪 Testing & Development

### Available Scripts

**Root Level:**
```bash
npm run dev          # Run both client and server
npm run client       # Run only frontend
npm run server       # Run only backend
npm run build        # Build both applications
```

**Server:**
```bash
npm run dev          # Development with ts-node and nodemon
npm run build        # Compile TypeScript to JavaScript
npm run start        # Production server
npm run test         # Run tests
npm run type-check   # TypeScript type checking
```

**Client:**
```bash
npm run dev          # Next.js development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint checking
npm run type-check   # TypeScript type checking
```

### Environment Variables

**Server (.env)**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blogapp
# OR
DATABASE_URL=postgresql://user:pass@localhost:5432/blogapp
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
```

**Client (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_if_using_nextauth
NODE_ENV=development
```

### TypeScript Configuration

**Server (tsconfig.json)**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Client (tsconfig.json)**
```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## 📸 Screenshots

### Desktop Views
![Home Feed with shadcn/ui](screenshots/home-page.png)
![Post Form page](screenshots/post-form.png)
![Post Detail Page](screenshots/my-posts.png)




## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Follow TypeScript best practices
4. Ensure all types are properly defined
5. Test with both dev and production builds
6. Commit changes (`git commit -m 'Add amazing feature'`)
7. Push to branch (`git push origin feature/amazing-feature`)
8. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.

## 👨‍💻 Author

**Satwik**
- GitHub: [@Satwik-2004](https://github.com/Satwik-2004)
- Email: [satwik1714@gmail.com]

## 🙏 Acknowledgments

- Next.js team for the incredible React framework
- shadcn/ui for the beautiful component library
- Tailwind CSS for the utility-first CSS framework
- TypeScript team for type safety
- Zod for runtime validation
- Express.js team for the robust backend framework

---

⭐ **Star this repository if you find it helpful!**

> **Note**: This is a modern full-stack application built with Next.js 14+, TypeScript, and shadcn/ui. It demonstrates contemporary web development practices with type safety, server-side rendering, and beautiful UI components.
