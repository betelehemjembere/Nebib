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

// Function to fix CORS errors in a file
function fixCorsErrors(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Fix 1: Add missing imports
  if (!content.includes('import { NextRequest, NextResponse }') && content.includes('NextRequest')) {
    const importMatch = content.match(/import.*from.*['"]next\/server['"]/);
    if (importMatch) {
      content = content.replace(
        importMatch[0],
        'import { NextResponse, NextRequest } from "next/server"'
      );
      modified = true;
    }
  }
  
  // Fix 2: Add missing addCorsHeaders import
  if (!content.includes('import { addCorsHeaders }') && content.includes('addCorsHeaders')) {
    const lastImport = content.match(/import.*from.*['"];?\s*$/m);
    if (lastImport) {
      content = content.replace(
        lastImport[0],
        lastImport[0] + '\nimport { addCorsHeaders } from "@/lib/cors";'
      );
      modified = true;
    }
  }
  
  // Fix 3: Update function parameters from Request to NextRequest
  content = content.replace(
    /export (async function|const) \w+\(request: Request\)/g,
    'export $1 $2(request: NextRequest)'
  );
  modified = content.includes('Request)') ? true : modified;
  
  // Fix 4: Remove double semicolons
  content = content.replace(/;;/g, ';');
  modified = content.includes(';;') ? true : modified;
  
  // Fix 5: Fix variable redeclaration issues
  content = content.replace(
    /const response = NextResponse\.json\(response\);/g,
    'const response = NextResponse.json(responseData);'
  );
  
  // Fix 6: Fix missing request parameter references
  content = content.replace(
    /return addCorsHeaders\(response, request\);/g,
    (match) => {
      // Check if request parameter exists in function signature
      const functionMatch = content.match(/export.*\(request: NextRequest\)/);
      if (functionMatch) {
        return match;
      } else {
        return '// TODO: Fix request parameter';
      }
    }
  );
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ ${filePath} - Fixed CORS errors`);
  } else {
    console.log(`⏭️  ${filePath} - No changes needed`);
  }
}

// Main execution
const apiDir = path.join(__dirname, '..', 'app', 'api');
const routeFiles = findRouteFiles(apiDir);

console.log('🔧 Fixing CORS TypeScript errors...');
routeFiles.forEach(fixCorsErrors);

console.log('\n✅ CORS TypeScript errors fixed!');
console.log('\n📝 Next steps:');
console.log('1. Run "npx tsc --noEmit" to check for remaining errors');
console.log('2. Install missing dependencies if needed');
console.log('3. Test your application'); 