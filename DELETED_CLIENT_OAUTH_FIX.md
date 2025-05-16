# Resolving "Error 401: deleted_client" in Google OAuth

## What This Error Means

The "Error 401: deleted_client" occurs when the Google OAuth client ID you're trying to use has been deleted from the Google Cloud Console or is no longer valid. This means Google no longer recognizes the client ID that your application is sending during the authentication flow.

## How to Fix It

### 1. Create a New OAuth Client ID

1. **Go to the Google Cloud Console**
   - Visit [https://console.cloud.google.com/](https://console.cloud.google.com/)
   - Select the appropriate project

2. **Create a new OAuth Client ID**
   - Navigate to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Select "Web application" for Application type
   - Add a name for your client, e.g., "SharkSenz Web Client"
   - Under "Authorized redirect URIs", add:
     ```
     https://zxqlogakbyekgeekgexh.supabase.co/auth/v1/callback
     ```
   - Click "Create"
   - **Save your Client ID and Client Secret** - you'll need these in the next step

### 2. Update Supabase Configuration

1. **Go to Supabase Dashboard**
   - Visit [https://app.supabase.io/](https://app.supabase.io/)
   - Select your SharkSenz project

2. **Update Google OAuth Provider**
   - Navigate to Authentication > Providers
   - Find Google in the list of providers
   - Update the Client ID and Client Secret with the new values from Google Cloud Console
   - Save changes

### 3. Testing the Fix

To verify your fix:

1. Visit [http://localhost:5173/auth/debug](http://localhost:5173/auth/debug) (when running locally)
2. Check that the environment variables and OAuth configuration look correct
3. Try the "Test Google Sign In" button
4. If successful, you should be able to sign in with Google without the "deleted_client" error

### Still Having Issues?

If you continue to experience problems:

1. Verify that your Google client ID is active and properly configured
2. Check that the OAuth consent screen is properly set up
3. Make sure all required APIs are enabled in your Google Cloud project
4. Verify that your application is sending the correct client ID during authentication
5. Check the browser console for any additional error details
