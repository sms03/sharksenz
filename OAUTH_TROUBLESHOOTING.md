# Troubleshooting OAuth Errors

## Error: `redirect_uri_mismatch`

### The Problem
This error occurs when the redirect URI specified in your authentication request doesn't exactly match any of the authorized redirect URIs configured in your Google Cloud Console.

### How to Fix It

1. **Check your Google Cloud Console configuration**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Navigate to "APIs & Services" > "Credentials"
   - Find and edit your OAuth client ID
   - Under "Authorized redirect URIs", ensure you have this exact URL:
     ```
     https://zxqlogakbyekgeekgexh.supabase.co/auth/v1/callback
     ```
   - Make sure there are no extra spaces, slashes, or other characters

2. **Verify your Supabase configuration**
   - Go to your [Supabase Dashboard](https://app.supabase.com/)
   - Navigate to Authentication > URL Configuration
   - Check the "Site URL" and "Redirect URLs"
   - Make sure they match what's configured in Google Cloud Console

3. **Check your application code**
   - Ensure the redirect URL in your code exactly matches the one in your Google Cloud Console
   - In SharkSenz, the main place to check is in `src/components/AuthProvider.tsx`

### Example Correct Configuration

In your Google Cloud Console:
- Authorized redirect URI: `https://zxqlogakbyekgeekgexh.supabase.co/auth/v1/callback`

In your AuthProvider.tsx:
```typescript
const signInWithOAuth = async (provider: Provider) => {
  await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: 'https://zxqlogakbyekgeekgexh.supabase.co/auth/v1/callback',
    },
  });
};
```

### Common Mistakes

- Using a different URL structure than what's registered
- Having trailing slashes in one place but not the other
- Using HTTP instead of HTTPS (or vice versa)
- Having different capitalization
- Missing or extra parameters in the URL

### If the Error Persists

1. Clear your browser cache and cookies
2. Wait a few minutes (Google's systems sometimes take time to propagate changes)
3. Check that you're not being redirected through any intermediary pages
4. Verify that your Google API project has the necessary APIs enabled
