"use strict";(self.webpackChunkmebiusbox_docusaurus=self.webpackChunkmebiusbox_docusaurus||[]).push([[6103],{63940:(e,t,n)=>{n.r(t),n.d(t,{default:()=>j});n(67294);var s=n(36905),o=n(97682),a=n(23702),i=n(79107),l=n(7306),r=n(86846),c=n(97325),d=n(23672),u=n(85893);function m(e){const{nextItem:t,prevItem:n}=e;return(0,u.jsxs)("nav",{className:"pagination-nav docusaurus-mt-lg","aria-label":(0,c.I)({id:"theme.blog.post.paginator.navAriaLabel",message:"Blog post page navigation",description:"The ARIA label for the blog posts pagination"}),children:[n&&(0,u.jsx)(d.Z,{...n,subLabel:(0,u.jsx)(c.Z,{id:"theme.blog.post.paginator.newerPost",description:"The blog post button label to navigate to the newer/previous post",children:"Newer Post"})}),t&&(0,u.jsx)(d.Z,{...t,subLabel:(0,u.jsx)(c.Z,{id:"theme.blog.post.paginator.olderPost",description:"The blog post button label to navigate to the older/next post",children:"Older Post"}),isNext:!0})]})}function g(){const{assets:e,metadata:t}=(0,i.C)(),{title:n,description:s,date:a,tags:l,authors:r,frontMatter:c}=t,{keywords:d}=c,m=e.image??c.image;return(0,u.jsxs)(o.d,{title:n,description:s,keywords:d,image:m,children:[(0,u.jsx)("meta",{property:"og:type",content:"article"}),(0,u.jsx)("meta",{property:"article:published_time",content:a}),r.some((e=>e.url))&&(0,u.jsx)("meta",{property:"article:author",content:r.map((e=>e.url)).filter(Boolean).join(",")}),l.length>0&&(0,u.jsx)("meta",{property:"article:tag",content:l.map((e=>e.label)).join(",")})]})}var h=n(31514),x=n(388);function p(){const e=(0,x.i)();return(0,u.jsx)(h.Z,{children:(0,u.jsx)("script",{type:"application/ld+json",children:JSON.stringify(e)})})}var f=n(87086),b=n(69501);function v(e){let{sidebar:t,children:n}=e;const{metadata:s,toc:o}=(0,i.C)(),{nextItem:a,prevItem:c,frontMatter:d,unlisted:g}=s,{hide_table_of_contents:h,toc_min_heading_level:x,toc_max_heading_level:p}=d;return(0,u.jsxs)(l.Z,{sidebar:t,toc:!h&&o.length>0?(0,u.jsx)(f.Z,{toc:o,minHeadingLevel:x,maxHeadingLevel:p}):void 0,children:[g&&(0,u.jsx)(b.Z,{}),(0,u.jsx)(r.Z,{children:n}),(a||c)&&(0,u.jsx)(m,{nextItem:a,prevItem:c})]})}function j(e){const t=e.content;return(0,u.jsx)(i.n,{content:e.content,isBlogPostPage:!0,children:(0,u.jsxs)(o.FG,{className:(0,s.Z)(a.k.wrapper.blogPages,a.k.page.blogPostPage),children:[(0,u.jsx)(g,{}),(0,u.jsx)(p,{}),(0,u.jsx)(v,{sidebar:e.sidebar,children:(0,u.jsx)(t,{})})]})})}},87086:(e,t,n)=>{n.d(t,{Z:()=>c});n(67294);var s=n(36905),o=n(2728);const a={tableOfContents:"tableOfContents_bqdL",docItemContainer:"docItemContainer_F8PC"};var i=n(85893);const l="table-of-contents__link toc-highlight",r="table-of-contents__link--active";function c(e){let{className:t,...n}=e;return(0,i.jsx)("div",{className:(0,s.Z)(a.tableOfContents,"thin-scrollbar",t),children:(0,i.jsx)(o.Z,{...n,linkClassName:l,linkActiveClassName:r})})}},2728:(e,t,n)=>{n.d(t,{Z:()=>x});var s=n(67294),o=n(20107);function a(e){const t=e.map((e=>({...e,parentIndex:-1,children:[]}))),n=Array(7).fill(-1);t.forEach(((e,t)=>{const s=n.slice(2,e.level);e.parentIndex=Math.max(...s),n[e.level]=t}));const s=[];return t.forEach((e=>{const{parentIndex:n,...o}=e;n>=0?t[n].children.push(o):s.push(o)})),s}function i(e){let{toc:t,minHeadingLevel:n,maxHeadingLevel:s}=e;return t.flatMap((e=>{const t=i({toc:e.children,minHeadingLevel:n,maxHeadingLevel:s});return function(e){return e.level>=n&&e.level<=s}(e)?[{...e,children:t}]:t}))}function l(e){const t=e.getBoundingClientRect();return t.top===t.bottom?l(e.parentNode):t}function r(e,t){let{anchorTopOffset:n}=t;const s=e.find((e=>l(e).top>=n));if(s){return function(e){return e.top>0&&e.bottom<window.innerHeight/2}(l(s))?s:e[e.indexOf(s)-1]??null}return e[e.length-1]??null}function c(){const e=(0,s.useRef)(0),{navbar:{hideOnScroll:t}}=(0,o.L)();return(0,s.useEffect)((()=>{e.current=t?0:document.querySelector(".navbar").clientHeight}),[t]),e}function d(e){const t=(0,s.useRef)(void 0),n=c();(0,s.useEffect)((()=>{if(!e)return()=>{};const{linkClassName:s,linkActiveClassName:o,minHeadingLevel:a,maxHeadingLevel:i}=e;function l(){const e=function(e){return Array.from(document.getElementsByClassName(e))}(s),l=function(e){let{minHeadingLevel:t,maxHeadingLevel:n}=e;const s=[];for(let o=t;o<=n;o+=1)s.push(`h${o}.anchor`);return Array.from(document.querySelectorAll(s.join()))}({minHeadingLevel:a,maxHeadingLevel:i}),c=r(l,{anchorTopOffset:n.current}),d=e.find((e=>c&&c.id===function(e){return decodeURIComponent(e.href.substring(e.href.indexOf("#")+1))}(e)));e.forEach((e=>{!function(e,n){n?(t.current&&t.current!==e&&t.current.classList.remove(o),e.classList.add(o),t.current=e):e.classList.remove(o)}(e,e===d)}))}return document.addEventListener("scroll",l),document.addEventListener("resize",l),l(),()=>{document.removeEventListener("scroll",l),document.removeEventListener("resize",l)}}),[e,n])}var u=n(34791),m=n(85893);function g(e){let{toc:t,className:n,linkClassName:s,isChild:o}=e;return t.length?(0,m.jsx)("ul",{className:o?void 0:n,children:t.map((e=>(0,m.jsxs)("li",{children:[(0,m.jsx)(u.Z,{to:`#${e.id}`,className:s??void 0,dangerouslySetInnerHTML:{__html:e.value}}),(0,m.jsx)(g,{isChild:!0,toc:e.children,className:n,linkClassName:s})]},e.id)))}):null}const h=s.memo(g);function x(e){let{toc:t,className:n="table-of-contents table-of-contents__left-border",linkClassName:l="table-of-contents__link",linkActiveClassName:r,minHeadingLevel:c,maxHeadingLevel:u,...g}=e;const x=(0,o.L)(),p=c??x.tableOfContents.minHeadingLevel,f=u??x.tableOfContents.maxHeadingLevel,b=function(e){let{toc:t,minHeadingLevel:n,maxHeadingLevel:o}=e;return(0,s.useMemo)((()=>i({toc:a(t),minHeadingLevel:n,maxHeadingLevel:o})),[t,n,o])}({toc:t,minHeadingLevel:p,maxHeadingLevel:f});return d((0,s.useMemo)((()=>{if(l&&r)return{linkClassName:l,linkActiveClassName:r,minHeadingLevel:p,maxHeadingLevel:f}}),[l,r,p,f])),(0,m.jsx)(h,{toc:b,className:n,linkClassName:l,...g})}},69501:(e,t,n)=>{n.d(t,{Z:()=>g});n(67294);var s=n(36905),o=n(97325),a=n(31514),i=n(85893);function l(){return(0,i.jsx)(o.Z,{id:"theme.unlistedContent.title",description:"The unlisted content banner title",children:"Unlisted page"})}function r(){return(0,i.jsx)(o.Z,{id:"theme.unlistedContent.message",description:"The unlisted content banner message",children:"This page is unlisted. Search engines will not index it, and only users having a direct link can access it."})}function c(){return(0,i.jsx)(a.Z,{children:(0,i.jsx)("meta",{name:"robots",content:"noindex, nofollow"})})}var d=n(23702),u=n(79114);function m(e){let{className:t}=e;return(0,i.jsx)(u.Z,{type:"caution",title:(0,i.jsx)(l,{}),className:(0,s.Z)(t,d.k.common.unlistedBanner),children:(0,i.jsx)(r,{})})}function g(e){return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(c,{}),(0,i.jsx)(m,{...e})]})}},41209:(e,t,n)=>{n.d(t,{Z:()=>i});n(67294);var s=n(99861),o=n(9200),a=n(85893);function i(){const{colorMode:e}=(0,o.I)();return(0,a.jsx)("div",{className:"margin-top--lg margin-bottom--sm",children:(0,a.jsx)(s.Z,{repo:"mebiusbox/mebiusbox.github.com",repoId:"MDEwOlJlcG9zaXRvcnk2MDQ0OTA3Ng==",category:"Announcements",categoryId:"DIC_kwDOA5phNM4CT08m",mapping:"url",strict:"0",reactionsEnabled:"1",emitMetadata:"0",inputPosition:"bottom",theme:e,lang:"ja",loading:"lazy",crossorigin:"anonymous",async:!0})})}},32402:(e,t,n)=>{n.d(t,{Z:()=>b});n(67294);var s=n(86010),o=n(79107),a=n(94850),i=n(74597),l=n(97325),r=n(34791);const c={readMoreButton:"readMoreButton_vHrp"};var d=n(85893);function u(){return(0,d.jsx)("b",{children:(0,d.jsx)(l.Z,{id:"theme.blog.post.readMore",description:"The label used in blog post item excerpts to link to full blog posts",children:"Read More"})})}function m(e){const{blogPostTitle:t,...n}=e;return(0,d.jsx)(r.Z,{className:(0,s.Z)("padding--sm",c.readMoreButton),"aria-label":(0,l.I)({message:"Read more about {title}",id:"theme.blog.post.readMoreLabel",description:"The ARIA label for the link to full blog posts from excerpts"},{title:t}),...n,children:(0,d.jsx)(u,{})})}var g=n(68258),h=n(39962),x=n(51048),p=n(41209);const f={blogPostFooterDetailsFull:"blogPostFooterDetailsFull_Wr5y",shareButton:"shareButton_SIER"};function b(){const{metadata:e,isBlogPostPage:t}=(0,o.C)(),{tags:n,title:l,editUrl:r,hasTruncateMarker:c}=e,u=!t&&c,b=n.length>0;if(!(b||u||r))return null;const{siteConfig:v}=(0,h.Z)(),j=48,N=`${v.url}${e.permalink}`,L=`${l} | Mebiusbox`,{disableComments:C}=e.frontMatter;let Z=!1;return(0,x.Z)()&&(Z="/blog"===window.location.pathname),(0,d.jsxs)("footer",{className:(0,s.Z)("row docusaurus-mt-lg",t&&f.blogPostFooterDetailsFull),children:[t&&(0,d.jsxs)("div",{className:"text--center margin-bottom--sm",children:[(0,d.jsx)(g.Dk,{url:N,className:f.shareButton,children:(0,d.jsx)(g.Vq,{size:j,round:!0})}),(0,d.jsx)(g.B,{url:N,title:L,className:f.shareButton,children:(0,d.jsx)(g.b0,{size:j,round:!0})}),(0,d.jsx)(g.fm,{url:N,title:L,className:f.shareButton,children:(0,d.jsx)(g.b1,{size:j,round:!0})})]}),!C&&!Z&&t&&(0,d.jsx)(p.Z,{}),b&&(0,d.jsx)("div",{className:(0,s.Z)("col",{"col--9":u}),children:(0,d.jsx)(i.Z,{tags:n})}),t&&r&&(0,d.jsx)("div",{className:"col margin-top--sm",children:(0,d.jsx)(a.Z,{editUrl:r})}),u&&(0,d.jsx)("div",{className:(0,s.Z)("col text--right",{"col--3":b}),children:(0,d.jsx)(m,{blogPostTitle:l,to:e.permalink})})]})}}}]);