const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      if (file !== 'node_modules' && file !== '.next') {
        arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
      }
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });

  return arrayOfFiles;
}

const files = getAllFiles(directoryPath);

const replacements = [
  { regex: /bg-\[\#000000\]/g, replacement: 'bg-[#1E2430]' },
  { regex: /bg-\[\#050505\]/g, replacement: 'bg-[#1E2430]' },
  { regex: /bg-\[\#111111\]/g, replacement: 'bg-[#322D40]' },
  { regex: /bg-\[\#0A0A0A\]/g, replacement: 'bg-[#1E2430]' },
  { regex: /bg-\[\#0B0B0F\]/g, replacement: 'bg-[#1E2430]' },
  { regex: /bg-\[\#1A1A24\]/g, replacement: 'bg-[#322D40]' },
  { regex: /border-gray-800/g, replacement: 'border-[#1E2430]' },
  { regex: /border-gray-700/g, replacement: 'border-[#322D40]' },
  { regex: /text-gray-400/g, replacement: 'text-[#C8C5C7]' },
  { regex: /text-gray-500/g, replacement: 'text-[#C8C5C7]/70' },
  { regex: /text-gray-600/g, replacement: 'text-[#C8C5C7]/50' },
  { regex: /text-gray-200/g, replacement: 'text-white' },
  { regex: /text-gray-300/g, replacement: 'text-[#C8C5C7]' },
  { regex: /bg-gray-800/g, replacement: 'bg-[#322D40]' },
  { regex: /bg-gray-900/g, replacement: 'bg-[#1E2430]' },
  { regex: /text-orange-500/g, replacement: 'text-[#563F7C]' },
  { regex: /text-orange-400/g, replacement: 'text-[#B3A1C9]' },
  { regex: /text-orange-200/g, replacement: 'text-[#B3A1C9]' },
  { regex: /bg-orange-500/g, replacement: 'bg-[#563F7C]' },
  { regex: /bg-orange-600/g, replacement: 'bg-[#4A356A]' },
  { regex: /border-t-orange-500/g, replacement: 'border-t-[#563F7C]' },
  { regex: /border-orange-500/g, replacement: 'border-[#563F7C]' },
  { regex: /shadow-orange-500/g, replacement: 'shadow-[#563F7C]' },
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  replacements.forEach(({ regex, replacement }) => {
    if (regex.test(content)) {
      content = content.replace(regex, replacement);
      changed = true;
    }
  });
  
  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated:', file);
  }
});
