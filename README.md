# Resume Editor

A modern, full-featured resume builder built with Next.js and Supabase. Create, edit, and share professional resumes with an intuitive drag-and-drop interface.

## Features

- 🔐 **Authentication** - Secure sign-up/sign-in with Supabase Auth (email/password + Google OAuth)
- 📝 **Resume Management** - Create, edit, and manage multiple resumes
- 🎨 **Drag & Drop Editor** - Intuitive section reordering with @dnd-kit
- 👁️ **Live Preview** - Real-time preview as you edit
- 💾 **Auto-save** - Automatic saving with debouncing
- 📄 **PDF Export** - Export resumes to PDF using browser print
- 🔗 **Public Sharing** - Share resumes with public links
- 🎯 **Form-driven Inputs** - Easy-to-use forms for all resume sections
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Supabase (Database + Auth)
- **Drag & Drop**: @dnd-kit
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- A Supabase account

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd resume-editor
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Copy `env.example` to `.env.local`:

```bash
cp env.example .env.local
```

4. Update `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. Set up Database

Run the SQL commands in `database-schema.sql` in your Supabase SQL editor to create the required tables and RLS policies.

### 4. Configure Authentication

In your Supabase dashboard:
1. Go to Authentication > Settings
2. Add your site URL to "Site URL" (e.g., `http://localhost:3000`)
3. Add `http://localhost:3000/dashboard` to "Redirect URLs"
4. Enable Google OAuth if desired (optional)

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Database Schema

The application uses a single `resumes` table with the following structure:

```sql
CREATE TABLE resumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   ├── editor/[id]/       # Resume editor
│   ├── view/[id]/         # Public resume view
│   └── page.js            # Landing page
├── components/            # React components
│   ├── AuthForm.js        # Sign in/up form
│   ├── ResumeCard.js      # Resume card in dashboard
│   ├── DraggableSection.js # Drag & drop section
│   ├── SectionForm.js     # Section editing form
│   └── ResumePreview.js   # Resume preview component
└── lib/                   # Utilities
    ├── supabase.js        # Client-side Supabase
    └── supabase-server.js # Server-side Supabase
```

## Features in Detail

### Authentication
- Email/password authentication
- Google OAuth integration
- Protected routes with automatic redirects
- User session management

### Resume Editor
- Drag-and-drop section reordering
- Form-based editing for all sections
- Live preview panel
- Auto-save with 2-second debouncing
- Support for experience, education, skills, and custom sections

### Sharing & Export
- Public/private resume visibility
- Shareable public links
- PDF export using browser print functionality
- Print-optimized CSS styles

### Data Structure
Resumes are stored as JSONB with this structure:

```json
{
  "personalInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "(555) 123-4567",
    "location": "San Francisco, CA",
    "summary": "Experienced software engineer..."
  },
  "sections": [
    {
      "id": "experience",
      "title": "Experience",
      "type": "experience",
      "items": [
        {
          "id": "1",
          "title": "Senior Software Engineer",
          "subtitle": "Tech Company",
          "description": "Led development of...",
          "startDate": "2020-01",
          "endDate": "2023-12",
          "current": false
        }
      ]
    }
  ]
}
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For support, please open an issue on GitHub or contact the development team.