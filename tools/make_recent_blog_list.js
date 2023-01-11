const fs = require('fs');
const frontmatter = require('front-matter');

const BLOG_BASE_PATH = './blog';
const OUT_PATH = './src/components/Homepage/recent.yml';
const files = fs.readdirSync(BLOG_BASE_PATH).reverse();
const stream = fs.createWriteStream(OUT_PATH, {encoding: "utf8"});
let count = 0;
for (const file of files) {
  if (file == "authors.yml") {
    continue;
  }
  
  const article = frontmatter(fs.readFileSync(BLOG_BASE_PATH + "/" + file, 'utf8'));
  const date = file.replace(/(.{10})(.+)/, '$1');
  const slug = file.replace(/(.+)(\.md)$/, '$1');
  stream.write(`- name: ${slug}\n`);
  stream.write(`  date: ${date}\n`);
  stream.write(`  title: ${article.attributes.title}\n`);

  count += 1;
  if (count >= 5) {
    break;
  }
}

stream.end();