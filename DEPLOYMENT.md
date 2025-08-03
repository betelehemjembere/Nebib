# Deployment Guide

## Railway Deployment

### Required Environment Variables

You need to set the following environment variables in your Railway project:

#### 1. Better Auth Secret (Required)
```
BETTER_AUTH_SECRET=your-super-secret-key-here-at-least-32-characters-long
```

**Important**: 
- This must be a strong, random secret key
- Minimum 32 characters recommended
- Never commit this to version control
- Use a different secret for each environment (development, staging, production)

#### 2. Database URL (Auto-configured by Railway)
```
DATABASE_URL=postgresql://postgres:password@host:port/database
```

Railway automatically provides this when you add a PostgreSQL database to your project.

#### 3. Node Environment
```
NODE_ENV=production
```

### How to Set Environment Variables in Railway

1. **Go to your Railway project dashboard**
2. **Navigate to the "Variables" tab**
3. **Add the following variables:**

```
BETTER_AUTH_SECRET=your-actual-secret-key-here
NODE_ENV=production
```

### Generating a Secure Secret

You can generate a secure secret using one of these methods:

#### Method 1: Using Node.js
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Method 2: Using OpenSSL
```bash
openssl rand -hex 32
```

#### Method 3: Online Generator
Use a secure online random string generator (make sure it's from a trusted source).

### Example Environment Variables

Here's what your Railway environment variables should look like:

```
BETTER_AUTH_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
NODE_ENV=production
DATABASE_URL=postgresql://postgres:password@host:port/database
```

### Troubleshooting

#### Error: "You are using the default secret"
This means `BETTER_AUTH_SECRET` is not set or is using the default value.

**Solution:**
1. Check your Railway environment variables
2. Make sure `BETTER_AUTH_SECRET` is set to a unique, secure value
3. Redeploy your application

#### Error: "Database connection failed"
This means the `DATABASE_URL` is incorrect or the database is not accessible.

**Solution:**
1. Verify your PostgreSQL database is running in Railway
2. Check that the `DATABASE_URL` is correctly set
3. Ensure your database is in the same Railway project

### Security Best Practices

1. **Never commit secrets to version control**
2. **Use different secrets for different environments**
3. **Rotate secrets regularly**
4. **Use strong, random secrets**
5. **Limit access to environment variables**

### After Setting Environment Variables

1. **Redeploy your application** in Railway
2. **Check the logs** to ensure no more secret-related errors
3. **Test authentication** to make sure everything works
4. **Monitor the application** for any other issues 