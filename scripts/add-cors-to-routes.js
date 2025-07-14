#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to recursively find all route.ts files
function findRouteFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      findRouteFiles(fullPath, files);
    } else if (item === 'route.ts') {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Function to check if a file already has CORS headers
function hasCorsHeaders(content) {
  return content.includes('Access-Control-Allow-Origin') || 
         content.includes('addCorsHeaders') ||
         content.includes('@/lib/cors');
}

// Function to add CORS imports and headers to a file
function addCorsToFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (hasCorsHeaders(content)) {
    console.log(`✅ ${filePath} - Already has CORS headers`);
    return;
  }
  
  // Add import for addCorsHeaders
  if (!content.includes('@/lib/cors')) {
    const importMatch = content.match(/import.*from.*['"]next\/server['"]/);
    if (importMatch) {
      content = content.replace(
        importMatch[0],
        importMatch[0].replace('NextResponse', 'NextResponse, NextRequest') + '\nimport { addCorsHeaders } from "@/lib/cors"'
      );
    }
  }
  
  // Add OPTIONS handler if it doesn't exist
  if (!content.includes('export async function OPTIONS')) {
    const firstExportMatch = content.match(/export (async function|const) /);
    if (firstExportMatch) {
      const optionsHandler = `\nexport async function OPTIONS(request: NextRequest) {
  return addCorsHeaders(new NextResponse(null, { status: 200 }), request);
}\n\n`;
      content = content.replace(firstExportMatch[0], optionsHandler + firstExportMatch[0]);
    }
  }
  
  // Update function parameters to use NextRequest
  content = content.replace(/export (async function|const) \w+\(request: Request\)/g, 
                           'export $1 $2(request: NextRequest)');
  
  // Add CORS headers to all NextResponse.json calls
  content = content.replace(
    /return NextResponse\.json\(([^)]+)\)/g,
    (match, args) => {
      return `const response = NextResponse.json(${args});\n    return addCorsHeaders(response, request);`;
    }
  );
  
  fs.writeFileSync(filePath, content);
  console.log(`✅ ${filePath} - Added CORS headers`);
}

// Main execution
const apiDir = path.join(__dirname, '..', 'app', 'api');
const routeFiles = findRouteFiles(apiDir);

console.log('🔍 Found API route files:');
routeFiles.forEach(file => console.log(`  - ${file}`));

console.log('\n🛠️  Adding CORS headers to routes...');
routeFiles.forEach(addCorsToFile);

console.log('\n✅ CORS headers added to all API routes!');
console.log('\n📝 Next steps:');
console.log('1. Update the domain in lib/cors.ts with your actual domain');
console.log('2. Update the domain in next.config.ts with your actual domain');
console.log('3. Test your application on different browsers'); 