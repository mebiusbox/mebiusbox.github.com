"use strict";(self.webpackChunkmebiusbox_docusaurus=self.webpackChunkmebiusbox_docusaurus||[]).push([[3089],{88801:(e,t,s)=>{s.r(t),s.d(t,{default:()=>h});s(67294);var o=s(36905),a=s(39962),n=s(97682),r=s(23702),i=s(7306),l=s(42568),c=s(33647),d=s(88389),u=s(31514),g=s(388),m=s(85893);function p(e){const t=(0,g.C)(e);return(0,m.jsx)(u.Z,{children:(0,m.jsx)("script",{type:"application/ld+json",children:JSON.stringify(t)})})}function b(e){const{metadata:t}=e,{siteConfig:{title:s}}=(0,a.Z)(),{blogDescription:o,blogTitle:r,permalink:i}=t,l="/"===i?s:r;return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(n.d,{title:l,description:o}),(0,m.jsx)(c.Z,{tag:"blog_posts_list"})]})}function x(e){const{metadata:t,items:s,sidebar:o}=e;return(0,m.jsxs)(i.Z,{sidebar:o,children:[(0,m.jsx)(d.Z,{items:s}),(0,m.jsx)(l.Z,{metadata:t})]})}function h(e){return(0,m.jsxs)(n.FG,{className:(0,o.Z)(r.k.wrapper.blogPages,r.k.page.blogListPage),children:[(0,m.jsx)(b,{...e}),(0,m.jsx)(p,{...e}),(0,m.jsx)(x,{...e})]})}},42568:(e,t,s)=>{s.d(t,{Z:()=>r});s(67294);var o=s(97325),a=s(23672),n=s(85893);function r(e){const{metadata:t}=e,{previousPage:s,nextPage:r}=t;return(0,n.jsxs)("nav",{className:"pagination-nav","aria-label":(0,o.I)({id:"theme.blog.paginator.navAriaLabel",message:"Blog list page navigation",description:"The ARIA label for the blog pagination"}),children:[s&&(0,n.jsx)(a.Z,{permalink:s,title:(0,n.jsx)(o.Z,{id:"theme.blog.paginator.newerEntries",description:"The label used to navigate to the newer blog posts page (previous page)",children:"Newer Entries"})}),r&&(0,n.jsx)(a.Z,{permalink:r,title:(0,n.jsx)(o.Z,{id:"theme.blog.paginator.olderEntries",description:"The label used to navigate to the older blog posts page (next page)",children:"Older Entries"}),isNext:!0})]})}},88389:(e,t,s)=>{s.d(t,{Z:()=>r});s(67294);var o=s(79107),a=s(86846),n=s(85893);function r(e){let{items:t,component:s=a.Z}=e;return(0,n.jsx)(n.Fragment,{children:t.map((e=>{let{content:t}=e;return(0,n.jsx)(o.n,{content:t,children:(0,n.jsx)(s,{children:(0,n.jsx)(t,{})})},t.metadata.permalink)}))})}},41209:(e,t,s)=>{s.d(t,{Z:()=>r});s(67294);var o=s(99861),a=s(9200),n=s(85893);function r(){const{colorMode:e}=(0,a.I)();return(0,n.jsx)("div",{className:"margin-top--lg margin-bottom--sm",children:(0,n.jsx)(o.Z,{repo:"mebiusbox/mebiusbox.github.com",repoId:"MDEwOlJlcG9zaXRvcnk2MDQ0OTA3Ng==",category:"Announcements",categoryId:"DIC_kwDOA5phNM4CT08m",mapping:"url",strict:"0",reactionsEnabled:"1",emitMetadata:"0",inputPosition:"bottom",theme:e,lang:"ja",loading:"lazy",crossorigin:"anonymous",async:!0})})}},32402:(e,t,s)=>{s.d(t,{Z:()=>j});s(67294);var o=s(86010),a=s(79107),n=s(94850),r=s(74597),i=s(97325),l=s(34791);const c={readMoreButton:"readMoreButton_vHrp"};var d=s(85893);function u(){return(0,d.jsx)("b",{children:(0,d.jsx)(i.Z,{id:"theme.blog.post.readMore",description:"The label used in blog post item excerpts to link to full blog posts",children:"Read More"})})}function g(e){const{blogPostTitle:t,...s}=e;return(0,d.jsx)(l.Z,{className:(0,o.Z)("padding--sm",c.readMoreButton),"aria-label":(0,i.I)({message:"Read more about {title}",id:"theme.blog.post.readMoreLabel",description:"The ARIA label for the link to full blog posts from excerpts"},{title:t}),...s,children:(0,d.jsx)(u,{})})}var m=s(68258),p=s(39962),b=s(51048),x=s(41209);const h={blogPostFooterDetailsFull:"blogPostFooterDetailsFull_Wr5y",shareButton:"shareButton_SIER"};function j(){const{metadata:e,isBlogPostPage:t}=(0,a.C)(),{tags:s,title:i,editUrl:l,hasTruncateMarker:c}=e,u=!t&&c,j=s.length>0;if(!(j||u||l))return null;const{siteConfig:Z}=(0,p.Z)(),f=48,v=`${Z.url}${e.permalink}`,k=`${i} | Mebiusbox`,{disableComments:N}=e.frontMatter;let M=!1;return(0,b.Z)()&&(M="/blog"===window.location.pathname),(0,d.jsxs)("footer",{className:(0,o.Z)("row docusaurus-mt-lg",t&&h.blogPostFooterDetailsFull),children:[t&&(0,d.jsxs)("div",{className:"text--center margin-bottom--sm",children:[(0,d.jsx)(m.Dk,{url:v,className:h.shareButton,children:(0,d.jsx)(m.Vq,{size:f,round:!0})}),(0,d.jsx)(m.B,{url:v,title:k,className:h.shareButton,children:(0,d.jsx)(m.b0,{size:f,round:!0})}),(0,d.jsx)(m.fm,{url:v,title:k,className:h.shareButton,children:(0,d.jsx)(m.b1,{size:f,round:!0})})]}),!N&&!M&&t&&(0,d.jsx)(x.Z,{}),j&&(0,d.jsx)("div",{className:(0,o.Z)("col",{"col--9":u}),children:(0,d.jsx)(r.Z,{tags:s})}),t&&l&&(0,d.jsx)("div",{className:"col margin-top--sm",children:(0,d.jsx)(n.Z,{editUrl:l})}),u&&(0,d.jsx)("div",{className:(0,o.Z)("col text--right",{"col--3":j}),children:(0,d.jsx)(g,{blogPostTitle:i,to:e.permalink})})]})}}}]);