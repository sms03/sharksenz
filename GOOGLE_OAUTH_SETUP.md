# Google OAuth Setup Guide

To5. Add authorized redirect URIs:
   - `https://zxqlogakbyekgeekgexh.supabase.co/auth/v1/callback` (Your Supabase project's callback URL)
   - Your production callback URL if applicable
   
   **Important**: This must match exactly with the URL in your Supabase configurationble Google authentication in SharkSenz, follow these steps:

## 1. Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"

## 2. Configure OAuth Consent Screen

1. Click on "OAuth consent screen" in the left sidebar
2. Choose "External" user type (or "Internal" if this is just for your organization)
3. Fill in the required app information:
   - App name: "SharkSenz"
   - User support email: Your email
   - Developer contact information: Your email
4. Add the necessary scopes:
   - `email`
   - `profile`
5. Add any test users if you're in testing mode

## 3. Create OAuth Credentials

1. Go to "Credentials" in the left sidebar
2. Click "Create Credentials" > "OAuth client ID"
3. Select "Web application" as the application type
4. Add a name, such as "SharkSenz Web Client"
5. Add authorized JavaScript origins:
   - `http://localhost:5173` (for local development)
   - Your production domain if applicable
6. Add authorized redirect URIs:
   - `http://localhost:5173/auth/redirect`
   - `https://zxqlogakbyekgeekgexh.supabase.co/auth/v1/callback` (Your Supabase project's callback URL)
   - Your production callback URL if applicable
7. Click "Create"

## 4. Configure Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Navigate to Authentication > Providers
4. Find Google in the list of providers and enable it
5. Enter the Client ID and Client Secret from the Google Cloud Console
6. Save changes

## 5. Configure Environment Variables

Create or update your `.env.local` file with the Google Client ID:

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

## 6. Testing

1. Run your application
2. Navigate to the login page
3. Click "Sign in with Google"
4. You should be redirected to Google's consent screen
5. After authentication, you should be redirected back to your application and logged in

## Troubleshooting

- If you see CORS errors, check that your authorized JavaScript origins are correct
- If you see redirect errors, verify that your authorized redirect URIs are correct
- For "Error: redirect_uri_mismatch", ensure the callback URL in Supabase matches the one in your Google OAuth configuration
