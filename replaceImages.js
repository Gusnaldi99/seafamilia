const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx')) results.push(file);
    }
  });
  return results;
}

const files = walk('src');
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;

  if (content.includes('className="img-slot')) {
    newContent = newContent.replace(/<img/g, '<ImageSlot');
    
    // In TripGallery.tsx we have onError={(e) => { ... }}, we should remove it because ImageSlot doesn't support it
    newContent = newContent.replace(/onError=\{\(e\)\s*=>\s*\{[\s\S]*?\}\}/g, '');
    
    if (!newContent.includes('import { ImageSlot }')) {
       newContent = 'import { ImageSlot } from "@/components/ui/ImageSlot";\n' + newContent;
    }
    
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Updated ' + file);
  }
}
