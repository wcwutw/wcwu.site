#!/usr/bin/env node

// Helper script to create a new blog post
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

function getCurrentDate() {
    const now = new Date();
    return now.toISOString().split('T')[0];
}

async function main() {
    console.log('\n📝 Create a New Blog Post\n');

    const title = await question('Post title: ');
    if (!title) {
        console.log('❌ Title is required');
        rl.close();
        return;
    }

    const category = await question('Category (general/code/baseball): ') || 'general';
    const tagsInput = await question('Tags (comma-separated): ');
    const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()) : [];
    const description = await question('Short description: ');

    const slug = slugify(title);
    const date = getCurrentDate();
    const filename = `${slug}.md`;
    const filepath = path.join(__dirname, '..', 'content', 'posts', filename);

    const frontmatter = `---
title: ${title}
date: ${date}
category: ${category}
tags: [${tags.join(', ')}]
description: ${description}
---

# ${title}

Write your content here...

## Section 1

Your content...

## Conclusion

Final thoughts...
`;

    try {
        fs.writeFileSync(filepath, frontmatter, 'utf8');
        console.log(`\n✅ Created: content/posts/${filename}`);
        console.log('\n📋 Next steps:');
        console.log(`1. Edit content/posts/${filename}`);
        console.log(`2. Add '${filename}' to src/posts.ts`);
        console.log('3. Run: npm run build');
        console.log('\n💡 Tip: Add this line to src/posts.ts POST_FILES array:');
        console.log(`   '${filename}',`);
    } catch (error) {
        console.error('❌ Error creating post:', error.message);
    }

    rl.close();
}

main();
