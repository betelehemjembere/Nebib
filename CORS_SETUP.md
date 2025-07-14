# CORS Setup Guide for Deployment

## Problem
Your application was experiencing CORS (Cross-Origin Resource Sharing) issues on deployment, where it worked on some browsers but failed on others. This was due to inconsistent CORS header configuration across API routes.

## Solution Implemented

### 1. Global CORS Configuration
- **File**: `next.config.ts`
- **Purpose**: Sets global CORS headers for all routes
- **Configuration**: Allows specific domains in production, all origins in development

### 2. CORS Utility Function
- **File**: `lib/cors.ts`
- **Purpose**: Centralized CORS header management
- **Features**: 
  - Dynamic origin validation
  - Production vs development environment handling
  - Consistent header application

### 3. API Route Updates
- **Status**: ✅ All API routes now have CORS headers
- **Method**: Automated script updated 22 API routes
- **Features**: 
  - OPTIONS handlers for preflight requests
  - Consistent CORS header application
  - Proper request type handling (NextRequest)

## Deployment Steps

### 1. Update Domain Configuration

**In `lib/cors.ts`:**
```typescript
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [
      'https://yourdomain.com', // ← Replace with your actual domain
      'https://www.yourdomain.com', // ← Replace with your actual domain
      'http://localhost:3000',
      'http://localhost:3001',
    ]
  : ['*'];
```

**In `next.config.ts`:**
```typescript
{
  key: "Access-Control-Allow-Origin",
  value: process.env.NODE_ENV === 'production' 
    ? "https://yourdomain.com" // ← Replace with your actual domain
    : "*",
}
```

### 2. Environment Variables (Optional)
Add to your `.env.local` or deployment environment:
```bash
NEXT_PUBLIC_API_URL=https://yourdomain.com
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### 3. Build and Deploy
```bash
npm run build
npm start
```

## Testing CORS

### 1. Browser Testing
Test on different browsers:
- Chrome
- Firefox
- Safari
- Edge

### 2. Cross-Origin Testing
If your frontend and backend are on different domains:
```javascript
// Test API call
fetch('https://yourdomain.com/api/test-connection', {
  method: 'GET',
  credentials: 'include', // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  }
})
.then(response => response.json())
.then(data => console.log('Success:', data))
.catch(error => console.error('CORS Error:', error));
```

### 3. Preflight Request Testing
Test OPTIONS requests:
```bash
curl -X OPTIONS https://yourdomain.com/api/forms \
  -H "Origin: https://yourdomain.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v
```

## Common CORS Issues and Solutions

### 1. "No 'Access-Control-Allow-Origin' header"
- **Cause**: Missing CORS headers on API routes
- **Solution**: ✅ Fixed - All routes now have CORS headers

### 2. "Request header field Authorization is not allowed"
- **Cause**: Missing Authorization in allowed headers
- **Solution**: ✅ Fixed - Added to CORS utility

### 3. "Credentials flag is 'true', but the 'Access-Control-Allow-Credentials' header is 'false'"
- **Cause**: Missing credentials support
- **Solution**: ✅ Fixed - Added to CORS configuration

### 4. Browser-specific issues
- **Safari**: Stricter CORS enforcement
- **Chrome**: More permissive in development
- **Firefox**: Moderate enforcement

## Monitoring and Debugging

### 1. Check CORS Headers
```bash
curl -I https://yourdomain.com/api/test-connection
```

Expected headers:
```
Access-Control-Allow-Origin: https://yourdomain.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With
Access-Control-Allow-Credentials: true
```

### 2. Browser Developer Tools
- Open Network tab
- Look for failed requests (red)
- Check Response headers for CORS headers
- Review Console for CORS error messages

### 3. Server Logs
Monitor your deployment logs for:
- CORS-related errors
- Missing headers
- Origin validation issues

## Security Considerations

### 1. Production vs Development
- **Development**: Allows all origins (`*`)
- **Production**: Restricts to specific domains

### 2. Credentials
- **Enabled**: For authenticated requests
- **Required**: When using cookies/sessions

### 3. Headers
- **Minimal**: Only allow necessary headers
- **Secure**: Don't expose sensitive information

## Troubleshooting

### If CORS issues persist:

1. **Check domain configuration**
   - Verify exact domain names (including www/non-www)
   - Check for typos in allowed origins

2. **Verify deployment**
   - Ensure new code is deployed
   - Clear browser cache
   - Test in incognito mode

3. **Check middleware**
   - Ensure middleware doesn't interfere with CORS
   - Verify OPTIONS requests are handled

4. **Environment variables**
   - Confirm NODE_ENV is set correctly
   - Check for conflicting configurations

## Support

If you continue to experience CORS issues:
1. Check browser console for specific error messages
2. Verify the exact domain being used
3. Test with the provided curl commands
4. Review server logs for additional details

---

**Last Updated**: $(date)
**Status**: ✅ CORS headers added to all API routes 