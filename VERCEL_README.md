# Deploying File Sender to Vercel

This guide explains how to deploy the File Sender application to Vercel.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup)
2. [Node.js](https://nodejs.org/) installed on your local machine
3. [Vercel CLI](https://vercel.com/cli) (optional, for command-line deployment)

## Deployment Steps

### Method 1: Using Vercel Dashboard

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Log in to your Vercel account
3. Click "New Project"
4. Import your repository
5. Configure project settings:
   - Framework Preset: Other
   - Build Command: `npm run vercel-build`
   - Output Directory: Leave empty
   - Install Command: `npm install`
   - Development Command: `npm run dev`
6. Click "Deploy"

### Method 2: Using Vercel CLI

1. Install Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Log in to Vercel:
   ```
   vercel login
   ```

3. Navigate to your project directory and deploy:
   ```
   cd /path/to/file-sender
   vercel
   ```

4. Follow the prompts to configure your project

## Important Notes

1. **File Storage**: This app is configured to use Vercel's ephemeral serverless environment. Uploaded files will be stored temporarily and may be cleared on redeployments. For production use, consider using external storage like AWS S3.

2. **Memory Storage**: The direct links feature uses in-memory storage, which may not be reliable in a serverless environment. Consider using a database or external cache for this feature.

3. **Environment Variables**: You can configure environment variables in the Vercel dashboard if needed.

## Local Development

To run the application locally:

```
npm install
npm run dev
```

The application will be available at http://localhost:3000.