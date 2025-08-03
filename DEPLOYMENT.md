# AWS Free Tier Deployment Guide

## Option 1: AWS Amplify (Recommended - Easiest)

### Prerequisites
- AWS Account with free tier
- GitHub repository with your code
- Railway PostgreSQL database (already set up)

### Step 1: Prepare Your Repository
1. Ensure your code is pushed to GitHub
2. Verify these files exist in your repo:
   - `amplify.yml`
   - `next.config.js`
   - `package.json`

-- to be
### Step 2: Deploy with AWS Amplify
1. **Login to AWS Console**
   - Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
   - Sign in to your AWS account

2. **Create New App**
   - Click "New app" → "Host web app"
   - Choose "GitHub" as your repository service
   - Connect your GitHub account
   - Select your repository and branch (main/master)

3. **Configure Build Settings**
   - Amplify will auto-detect Next.js
   - Use the `amplify.yml` file we created
   - Click "Save and deploy"

4. **Set Environment Variables**
   - Go to App settings → Environment variables
   - Add these variables:
   ```
   DATABASE_URL=your_railway_postgresql_url
   AUTH_SECRET=your_auth_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

5. **Deploy**
   - Amplify will automatically build and deploy
   - Your app will be available at: `https://your-app-id.amplifyapp.com`

### Step 3: Run Database Migration
1. **Connect to your Railway database**
2. **Run Prisma migration**:
   ```bash
   npx prisma migrate deploy
   ```

---

## Option 2: AWS Lightsail (More Control)

### Step 1: Create Lightsail Instance
1. Go to [AWS Lightsail Console](https://console.aws.amazon.com/lightsail/)
2. Click "Create instance"
3. Choose:
   - **Platform**: Linux/Unix
   - **Blueprint**: Node.js
   - **Instance plan**: $3.50/month (free tier eligible)
   - **Name**: `nebib-attendance`

### Step 2: Connect and Setup
1. **Connect via SSH** (use the browser terminal)
2. **Update system**:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

3. **Install Docker**:
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker $USER
   ```

4. **Install Docker Compose**:
   ```bash
   sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

### Step 3: Deploy Application
1. **Clone your repository**:
   ```bash
   git clone https://github.com/yourusername/your-repo.git
   cd your-repo
   ```

2. **Create environment file**:
   ```bash
   nano .env
   ```
   Add your environment variables

3. **Build and run with Docker**:
   ```bash
   docker build -t nebib-app .
   docker run -d -p 80:3000 --env-file .env nebib-app
   ```

4. **Setup domain** (optional):
   - Go to Networking tab in Lightsail
   - Create a static IP
   - Point your domain to the static IP

---

## Option 3: Vercel (Not AWS but Very Easy)

### Step 1: Deploy to Vercel
1. Go to [Vercel](https://vercel.com)
2. Sign up with GitHub
3. Import your repository
4. Add environment variables
5. Deploy (takes 2 minutes)

### Step 2: Custom Domain (Optional)
- Add your custom domain in Vercel dashboard
- Point DNS to Vercel nameservers

---

## Environment Variables Setup

### Required Variables
```bash
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Authentication
AUTH_SECRET=your-super-secret-key-here

# Google OAuth (if using)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# App URL
NEXTAUTH_URL=https://your-domain.com
```

### Generate Auth Secret
```bash
openssl rand -base64 32
```

---

## Database Migration

### Run Migrations
```bash
# Generate Prisma client
npx prisma generate

# Deploy migrations
npx prisma migrate deploy
```

### Verify Database
```bash
# Open Prisma Studio
npx prisma studio
```

---

## Monitoring and Maintenance

### AWS Amplify
- **Auto-scaling**: Built-in
- **SSL**: Automatic
- **CDN**: Global edge locations
- **Monitoring**: Built-in metrics

### AWS Lightsail
- **Monitoring**: Basic metrics included
- **Backups**: $1/month for automated backups
- **SSL**: Use Let's Encrypt (free)

### Cost Optimization
- **Free Tier Limits**:
  - Amplify: 1000 build minutes/month
  - Lightsail: 750 hours/month
  - Data transfer: 1GB/month

---

## Troubleshooting

### Common Issues
1. **Build Failures**: Check `amplify.yml` configuration
2. **Database Connection**: Verify `DATABASE_URL` format
3. **Environment Variables**: Ensure all required vars are set
4. **Prisma Issues**: Run `npx prisma generate` before build

### Support
- AWS Amplify: [Documentation](https://docs.aws.amazon.com/amplify/)
- AWS Lightsail: [Documentation](https://lightsail.aws.amazon.com/ls/docs/)
- Vercel: [Documentation](https://vercel.com/docs)

---

## Recommended: AWS Amplify

**Why Amplify is best for your project:**
- ✅ Zero configuration for Next.js
- ✅ Automatic HTTPS and CDN
- ✅ Free tier includes 1000 build minutes
- ✅ Easy environment variable management
- ✅ Automatic deployments from GitHub
- ✅ Built-in monitoring and logs
- ✅ No server management required

**Estimated Monthly Cost**: $0 (within free tier limits) 