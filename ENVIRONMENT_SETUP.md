# Environment Variables Setup

This document explains how to properly configure API keys and other sensitive information for the Ayushmitra project.

## Frontend Setup (Next.js)

### 1. Create Environment File
Copy the example environment file and add your actual API keys:

```bash
cd Frontend
cp .env.example .env.local
```

### 2. Configure API Keys
Edit `.env.local` and add your actual API keys:

```env
# Groq API Configuration  
# Get your API key from: https://console.groq.com/keys
NEXT_PUBLIC_GROQ_API_KEY=your_actual_groq_api_key_here

# Add other API keys as needed
# NEXT_PUBLIC_OTHER_API_KEY=your_other_api_key_here
```

### 3. Security Notes
- **Never commit `.env.local` or `.env` files to git**
- Use `NEXT_PUBLIC_` prefix only for variables that need to be accessible in the browser
- Keep sensitive server-side variables without the `NEXT_PUBLIC_` prefix

## Backend Setup (Google Colab)

The backend notebook uses Google Colab's built-in secrets management:

### 1. In Google Colab:
1. Click the **key icon (🔑)** in the left sidebar
2. Create a secret named `GROQ_API_KEY` and paste your Groq API token
3. Create a secret named `NGROK_AUTHTOKEN` and paste your ngrok token
4. Ensure "Notebook access" is toggled on for both secrets

### 2. The notebook will automatically load these secrets using:
```python
from google.colab import userdata
GROQ_API_KEY = userdata.get('GROQ_API_KEY')
NGROK_AUTHTOKEN = userdata.get('NGROK_AUTHTOKEN')
```

## Getting API Keys

### Groq API Key
1. Go to [https://console.groq.com/keys](https://console.groq.com/keys)
2. Sign up or log in to your account
3. Create a new API key
4. Copy the key and add it to your environment variables

### Ngrok Auth Token (for backend)
1. Go to [https://dashboard.ngrok.com/auth](https://dashboard.ngrok.com/auth)
2. Sign up or log in to your account
3. Copy your auth token
4. Add it to Google Colab secrets

## Security Best Practices

1. **Never hardcode API keys** in your source code
2. **Use environment variables** for all sensitive information
3. **Add `.env*` files to `.gitignore`** (already configured)
4. **Rotate API keys regularly** for better security
5. **Use different API keys** for development and production
6. **Monitor API usage** to detect unauthorized access

## Troubleshooting

### Frontend Issues
- Make sure your `.env.local` file is in the `Frontend` directory
- Restart your Next.js development server after adding new environment variables
- Check that environment variable names start with `NEXT_PUBLIC_` for client-side usage

### Backend Issues
- Ensure secrets are properly configured in Google Colab
- Check that "Notebook access" is enabled for all secrets
- Verify the secret names match exactly: `GROQ_API_KEY` and `NGROK_AUTHTOKEN`

## Files to Never Commit

The following files should never be committed to version control:
- `.env`
- `.env.local`
- `.env.development.local`
- `.env.test.local`
- `.env.production.local`
- `kaggle.json`
- Any file containing API keys or secrets

These are already included in the `.gitignore` file.