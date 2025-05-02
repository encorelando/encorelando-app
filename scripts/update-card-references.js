#!/usr/bin/env node

/**
 * Script to update references to card components throughout the application
 * This script will search for all files that import the old card components
 * and update them to use the new consolidated components.
 * 
 * Run with: node scripts/update-card-references.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define component mappings
const COMPONENT_MAPPINGS = {
  // Base Card component - BrandCard is now removed
  'import BrandCard from "../atoms/BrandCard"': 'import Card from "../atoms/Card"',
  'import BrandCard from "../../components/atoms/BrandCard"': 'import Card from "../../components/atoms/Card"',
  'import BrandCard from "../components/atoms/BrandCard"': 'import Card from "../components/atoms/Card"',
  
  // Performance card components - all are now consolidated
  'import VenuePerformanceCard from "../organisms/VenuePerformanceCard"': 'import PerformanceCard from "../organisms/PerformanceCard"',
  'import VenuePerformanceCard from "../../components/organisms/VenuePerformanceCard"': 'import PerformanceCard from "../../components/organisms/PerformanceCard"',
  'import VenuePerformanceCard from "../components/organisms/VenuePerformanceCard"': 'import PerformanceCard from "../components/organisms/PerformanceCard"',
  
  'import ArtistPerformanceCard from "../organisms/ArtistPerformanceCard"': 'import PerformanceCard from "../organisms/PerformanceCard"',
  'import ArtistPerformanceCard from "../../components/organisms/ArtistPerformanceCard"': 'import PerformanceCard from "../../components/organisms/PerformanceCard"',
  'import ArtistPerformanceCard from "../components/organisms/ArtistPerformanceCard"': 'import PerformanceCard from "../components/organisms/PerformanceCard"',
  
  // Entity card components - all are now consolidated
  'import ArtistCard from "../organisms/ArtistCard"': 'import EntityCard from "../organisms/EntityCard"',
  'import ArtistCard from "../../components/organisms/ArtistCard"': 'import EntityCard from "../../components/organisms/EntityCard"',
  'import ArtistCard from "../components/organisms/ArtistCard"': 'import EntityCard from "../components/organisms/EntityCard"',
  
  'import FestivalCard from "../organisms/FestivalCard"': 'import EntityCard from "../organisms/EntityCard"',
  'import FestivalCard from "../../components/organisms/FestivalCard"': 'import EntityCard from "../../components/organisms/EntityCard"',
  'import FestivalCard from "../components/organisms/FestivalCard"': 'import EntityCard from "../components/organisms/EntityCard"',
};

// Define usage replacements
const USAGE_REPLACEMENTS = [
  // BrandCard to Card
  { search: /<BrandCard/g, replace: '<Card' },
  { search: /<\/BrandCard>/g, replace: '</Card>' },
  
  // VenuePerformanceCard to PerformanceCard with context
  { 
    search: /<VenuePerformanceCard([^>]*)>/g, 
    replace: '<PerformanceCard$1 context="venue">' 
  },
  { search: /<\/VenuePerformanceCard>/g, replace: '</PerformanceCard>' },
  
  // ArtistPerformanceCard to PerformanceCard with context
  { 
    search: /<ArtistPerformanceCard([^>]*)>/g, 
    replace: '<PerformanceCard$1 context="artist">' 
  },
  { search: /<\/ArtistPerformanceCard>/g, replace: '</PerformanceCard>' },
  
  // ArtistCard to EntityCard with type
  { 
    search: /<ArtistCard([^>]*)>/g, 
    replace: '<EntityCard$1 type="artist">' 
  },
  { search: /<\/ArtistCard>/g, replace: '</EntityCard>' },
  
  // FestivalCard to EntityCard with type
  { 
    search: /<FestivalCard([^>]*)>/g, 
    replace: '<EntityCard$1 type="festival">' 
  },
  { search: /<\/FestivalCard>/g, replace: '</EntityCard>' },
];

// Files to remove after migration
const FILES_TO_REMOVE = [
  'src/components/atoms/BrandCard.jsx',
  'src/components/organisms/ArtistCard.jsx',
  'src/components/organisms/ArtistPerformanceCard.jsx',
  'src/components/organisms/FestivalCard.jsx',
  'src/components/organisms/VenuePerformanceCard.jsx',
];

// Helper to recursively find files
function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !filePath.includes('node_modules') && !filePath.includes('.git')) {
      findFiles(filePath, fileList);
    } else if (
      stat.isFile() && 
      (filePath.endsWith('.js') || filePath.endsWith('.jsx')) &&
      !filePath.includes('node_modules')
    ) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Main function
function updateCardReferences() {
  console.log('🔍 Searching for files to update...');
  
  // Find all JS/JSX files
  const srcDir = path.join(process.cwd(), 'src');
  const files = findFiles(srcDir);
  
  let totalUpdatedFiles = 0;
  
  // Process each file
  files.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf8');
    let fileModified = false;
    
    // Update import statements
    for (const [oldImport, newImport] of Object.entries(COMPONENT_MAPPINGS)) {
      if (content.includes(oldImport)) {
        content = content.replace(oldImport, newImport);
        fileModified = true;
      }
    }
    
    // Update component usage
    for (const { search, replace } of USAGE_REPLACEMENTS) {
      if (search.test(content)) {
        content = content.replace(search, replace);
        fileModified = true;
      }
    }
    
    // Write updated content back to file
    if (fileModified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
      totalUpdatedFiles++;
    }
  });
  
  console.log(`\n📊 Total updated files: ${totalUpdatedFiles}`);
  
  // Remove old component files
  console.log('\n🗑️ Removing obsolete component files...');
  FILES_TO_REMOVE.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`🗑️ Removed: ${file}`);
    }
  });
  
  console.log('\n✨ Card component consolidation complete!');
}

// Execute the update
updateCardReferences();