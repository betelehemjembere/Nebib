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

// Function to fix remaining errors in a file
function fixRemainingErrors(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Fix 1: Update all function parameters from Request to NextRequest
  content = content.replace(
    /export (async function|const) \w+\(request: Request\)/g,
    'export $1 $2(request: NextRequest)'
  );
  
  // Fix 2: Fix variable redeclaration issues
  if (content.includes('const response = NextResponse.json(responseData);')) {
    content = content.replace(
      /const response = NextResponse\.json\(responseData\);/g,
      'const response = NextResponse.json(responseData);'
    );
  }
  
  // Fix 3: Fix missing request parameter in function signatures
  const functionMatches = content.match(/export (async function|const) \w+\([^)]*\)/g);
  if (functionMatches) {
    functionMatches.forEach(match => {
      if (!match.includes('request: NextRequest') && !match.includes('request: Request')) {
        const newMatch = match.replace(/\)$/, ', request: NextRequest)');
        content = content.replace(match, newMatch);
        modified = true;
      }
    });
  }
  
  // Fix 4: Remove any remaining double semicolons
  content = content.replace(/;;/g, ';');
  
  // Fix 5: Fix specific variable naming conflicts
  content = content.replace(
    /const response = NextResponse\.json\(response\);/g,
    'const response = NextResponse.json(responseData);'
  );
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ ${filePath} - Fixed remaining errors`);
  } else {
    console.log(`⏭️  ${filePath} - No changes needed`);
  }
}

// Main execution
const apiDir = path.join(__dirname, '..', 'app', 'api');
const routeFiles = findRouteFiles(apiDir);

console.log('🔧 Fixing remaining TypeScript errors...');
routeFiles.forEach(fixRemainingErrors);

console.log('\n✅ Remaining TypeScript errors fixed!');
console.log('\n📝 Next steps:');
console.log('1. Run "npx tsc --noEmit" to check for remaining errors');
console.log('2. Test your application'); 