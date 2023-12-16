const fs = require('fs');
const frontmatter = require('front-matter');

const BLOG_BASE_PATH = './blog';
const I18N_BASE_PATH = './i18n';
const locales = ['en'];
const OUT_PATH = './src/components/Homepage/recent.yml';
const files = fs.readdirSync(BLOG_BASE_PATH, { recursive: true }).reverse();
const stream = fs.createWriteStream(OUT_PATH, {encoding: "utf8"});
let count = 0;
for (const file of files) {
  if (file == "authors.yml") {
    continue;
  }
  
  const article = frontmatter(fs.readFileSync(BLOG_BASE_PATH + "/" + file, 'utf8'));
  const date = file.replace(/(.{4}).(.{5})(.+)/, '$1-$2');
  const slug = file.replace(/(.{4}).(.+)(\.md)$/, '$1-$2');
  stream.write(`- name: ${slug}\n`);
  stream.write(`  date: ${date}\n`);
  stream.write(`  title:\n`);
  stream.write(`    ja: ${article.attributes.title}\n`)

  for (const loc of locales) {
    const path = I18N_BASE_PATH + "/" + loc + "/docusaurus-plugin-content-blog/" + file;
    if (fs.existsSync(path)) {
      const ft = frontmatter(fs.readFileSync(path, 'utf8'));
      stream.write(`    ${loc}: ${ft.attributes.title}\n`)
    }
  }

  count += 1;
  if (count >= 5) {
    break;
  }
}

stream.end();