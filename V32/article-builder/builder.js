/* UFi article builder v3 — static, dependency-free authoring. */
(() => {
 'use strict';
 const $=id=>document.getElementById(id);
 const TYPES=['paragraph','heading','list','image','highlight','quote','links'];
 const CHILD_TYPES=['heading','paragraph','list'];
 const MAX_BLOCKS=200;
 const MAX_IMAGE=5*1024*1024,MAX_TOTAL=20*1024*1024;
 const clone=v=>JSON.parse(JSON.stringify(v));
 const text=(v,max=20000)=>typeof v==='string'?v.slice(0,max):'';
 const escape=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const slugify=v=>text(v,180).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').split('-').slice(0,7).join('-').slice(0,40).replace(/-$/,'');
 const uid=()=>{const bytes=new Uint32Array(2);if(globalThis.crypto?.getRandomValues){crypto.getRandomValues(bytes);return 'b'+Array.from(bytes,n=>n.toString(16).padStart(8,'0')).join('');}return 'b'+Math.random().toString(36).slice(2)+Date.now().toString(36);};
 const lockedNames=new Map();
 const validName=v=>typeof v==='string'&&/^[a-z0-9]+(-[a-z0-9]+)*$/.test(v)&&v.length<=100&&!['index','about','services','contact','playtest','thanks','what-a-playtest-can-tell-you'].includes(v);
 function ensureName(d,lock=false) {
  if(lockedNames.has(d.id)){d.slug=lockedNames.get(d.id);d.fileLocked=true;}
  if(!d.fileLocked)d.slug=(slugify(d.title)||'article')+'-'+d.fileStamp+'-'+d.fileToken;
  if(lock){d.fileLocked=true;lockedNames.set(d.id,d.slug);}
  return d.slug;
 }
 function newBlock(type) {
  const b={id:uid(),type,text:'',title:'',level:'h2',style:'unordered',lead:false};
  if(type==='highlight')Object.assign(b,{label:'',level:'auto',children:[]});
  if(type==='entries')b.items=[{label:'',text:''}];
  if(type==='links')b.items=[{label:'',url:''}];
  if(type==='image')Object.assign(b,{data:'',alt:'',caption:'',decorative:false});
  return b;
 }
 function fresh() {const d={version:3,id:uid(),title:'',intro:'',author:'',date:'',category:'Research insights',fileStamp:new Date().toISOString().replace(/[-:T.]/g,'').slice(0,14)+'z',fileToken:uid().slice(1,9),fileLocked:false,slug:'',blocks:[]};ensureName(d);return d;}
 function imageInfo(data) {
  const m = /^data:image\/(png|jpeg|webp|gif);base64,([A-Za-z0-9+/=]+)$/.exec(data || '');
  if (!m || data.length > MAX_IMAGE * 1.4) throw Error('Use PNG, JPEG, WebP, or GIF images, up to 5 MB each.');
  const bytes = Uint8Array.from(atob(m[2]), c => c.charCodeAt(0));
  const sig = Array.from(bytes.slice(0,12));
  const valid = m[1]==='png' ? sig.slice(0,8).join(',')==='137,80,78,71,13,10,26,10' : m[1]==='jpeg' ? sig[0]===255 && sig[1]===216 && sig[2]===255 : m[1]==='gif' ? String.fromCharCode(...sig.slice(0,6)).match(/^GIF8[79]a$/) : String.fromCharCode(...sig.slice(0,4))==='RIFF' && String.fromCharCode(...sig.slice(8,12))==='WEBP';
  if (!valid || bytes.length>MAX_IMAGE) throw Error('An image is invalid or exceeds 5 MB. Choose the original image again.');
  return {bytes,ext:m[1]==='jpeg'?'jpg':m[1]};
 }
 function safeURL(raw) {
  const u=raw.trim();
  if(!u || /[\u0000-\u0020<>"'\\]/.test(u)) return null;
  if(/^https?:\/\//i.test(u)) { try { const p=new URL(u); return p.hostname ? u : null; } catch { return null; } }
  if(/^(mailto:|tel:)/i.test(u)) return u;
  if(!/^[a-z][a-z0-9+.-]*:/i.test(u) && !u.startsWith('//')) return u;
  return null;
 }
 // A deliberately small inline syntax; arbitrary HTML never passes through.
 function inline(source) {
  const pattern=/\*\*([^*\n]+)\*\*|\*([^*\n]+)\*|\[([^\]\n]+)\]\(([^)\n]+)\)/g;
  let out='',at=0,m;
  while((m=pattern.exec(source))) {
   out+=escape(source.slice(at,m.index));
   if(m[1]) out+='<strong>'+escape(m[1])+'</strong>';
   else if(m[2]) out+='<em>'+escape(m[2])+'</em>';
   else { const u=safeURL(m[4]); out+=u?'<a href="'+escape(u)+'"'+(/^https?:\/\//i.test(u)?' target="_blank" rel="noopener noreferrer"':'')+'>'+escape(m[3])+'</a>':escape(m[0]); }
   at=pattern.lastIndex;
  }
  return (out+escape(source.slice(at))).replace(/\n/g,'<br>');
 }
 const paragraphs = source => source.split(/\n\s*\n/).filter(s=>s.trim()).map(s=>'<p>'+inline(s.trim())+'</p>').join('');
 const crcTable = Array.from({length:256},(_,n)=>{for(let k=0;k<8;k++) n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0;});
 function crc32(bytes) {let n=0xffffffff;for(const b of bytes)n=crcTable[(n^b)&255]^(n>>>8);return (n^0xffffffff)>>>0;}
 // Standard uncompressed ZIP: keeps exports self-contained without a ZIP dependency.
 function zip(entries) {
  const encoder=new TextEncoder(),parts=[],central=[]; let offset=0;
  const record=(size,fields)=>{const b=new Uint8Array(size),v=new DataView(b.buffer);for(const [o,n,width] of fields) width===4?v.setUint32(o,n,true):v.setUint16(o,n,true);return b;};
  for(const [path,content] of entries) {
   const name=encoder.encode(path),data=typeof content==='string'?encoder.encode(content):content,crc=crc32(data);
   const local=record(30,[[0,0x04034b50,4],[4,20,2],[6,0x800,2],[12,33,2],[14,crc,4],[18,data.length,4],[22,data.length,4],[26,name.length,2]]);
   parts.push(local,name,data);
   central.push(record(46,[[0,0x02014b50,4],[4,20,2],[6,20,2],[8,0x800,2],[14,33,2],[16,crc,4],[20,data.length,4],[24,data.length,4],[28,name.length,2],[42,offset,4]]),name);
   offset+=30+name.length+data.length;
  }
  const size=central.reduce((s,b)=>s+b.length,0);
  return new Blob([...parts,...central,record(22,[[0,0x06054b50,4],[8,entries.length,2],[10,entries.length,2],[12,size,4],[16,offset,4]])],{type:'application/zip'});
 }
 function download(blob,name) { const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.hidden=true;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000); }
 // Only a tiny inline vocabulary is saved/exported. Arbitrary authored HTML is never rendered.
 function decodeEntities(s){return s.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi,(_,v)=>{if(v[0]==='#'){const n=v[1].toLowerCase()==='x'?parseInt(v.slice(2),16):parseInt(v.slice(1),10);return n>0&&n<=0x10ffff&&!(n>=0xd800&&n<=0xdfff)?String.fromCodePoint(n):'';}return ({amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",nbsp:' '})[v.toLowerCase()];});}
 function sanitizeInline(raw){
  const input=text(raw,100000).replace(/<(script|style|iframe|object)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,'');let out='',stack=[];
  for(const part of input.match(/<[^>]*>|[^<]+|</g)||[]){
   if(part[0]!=='<'){out+=escape(decodeEntities(part).replace(/\u200b/g,''));continue;}
   const m=/^<\s*(\/?)\s*([a-z0-9]+)/i.exec(part);if(!m)continue;const closing=!!m[1];let tag=m[2].toLowerCase();if(tag==='b')tag='strong';if(tag==='i')tag='em';
   if(['div','p','li'].includes(tag)){if((closing||out)&&!out.endsWith('<br>'))out+='<br>';continue;}
   if(tag==='br'){out+='<br>';continue;}
   if(!['strong','em','a'].includes(tag))continue;
   if(closing){const at=stack.lastIndexOf(tag);if(at>=0)while(stack.length>at)out+='</'+stack.pop()+'>';}
   else if(tag==='a'){const href=/\bhref\s*=\s*(?:"([^"]*)"|'([^']*)')/i.exec(part),url=href?safeURL(decodeEntities(href[1]??href[2])):null;if(url&&!stack.includes('a')){out+='<a href="'+escape(url)+'"'+(/^https?:\/\//i.test(url)?' target="_blank" rel="noopener noreferrer"':'')+'>';stack.push('a');}}
   else{out+='<'+tag+'>';stack.push(tag);}
  }
  while(stack.length)out+='</'+stack.pop()+'>';
  return out.replace(/(?:<br>)+$/,'').replace(/<(strong|em)><\/\1>/g,'');
 }
 function richText(html){return decodeEntities(text(html,100000).replace(/<br>/g,'\n').replace(/<[^>]*>/g,''));}
 function balancedParts(html,separator){const stack=[];return html.split(separator).map(part=>{const prefix=stack.map(t=>t.open).join('');for(const token of part.match(/<[^>]+>/g)||[]){const m=/^<(\/?)(strong|em|a)\b/.exec(token);if(!m)continue;if(m[1]){const at=stack.map(t=>t.tag).lastIndexOf(m[2]);if(at>=0)stack.splice(at);}else stack.push({tag:m[2],open:token});}return prefix+part+[...stack].reverse().map(t=>'</'+t.tag+'>').join('');});}
 function richParagraphs(b){if(b.rich===undefined)return paragraphs(b.text||'');return balancedParts(sanitizeInline(b.rich),/<br>\s*<br>/).filter(p=>richText(p).trim()).map(p=>'<p>'+p+'</p>').join('');}

 function normalize(raw) {
  if(!raw||![1,2,3].includes(raw.version)||!Array.isArray(raw.blocks))throw Error('Choose a supported UFi article draft.');
  raw=clone(raw);
  if(raw.version<3)for(const b of raw.blocks)if(b?.type==='highlight'&&Array.isArray(b.children))b.children=b.children.flatMap(c=>c.type==='entries'?(Array.isArray(c.items)?c.items.flatMap(i=>[{type:'heading',text:i.label,compact:true},{type:'paragraph',text:i.text}]):[]):[c]);
  const d=fresh();
  for(const k of ['title','intro','author','category'])if(k in raw)d[k]=text(raw[k],({title:180,intro:1500,author:100,category:150})[k]);
  d.date=/^\d{4}-\d{2}-\d{2}$/.test(raw.date)?raw.date:'';
  if(raw.version>=2){
   if(/^b[a-z0-9]+$/.test(raw.id))d.id=raw.id;
   if(/^\d{14}z$/.test(raw.fileStamp))d.fileStamp=raw.fileStamp;
   if(typeof raw.fileToken==='string'&&/^[a-z0-9]{4,16}$/.test(raw.fileToken))d.fileToken=raw.fileToken;
   if(raw.fileLocked===true){if(!validName(raw.slug))throw Error('The saved article filename is invalid.');d.slug=raw.slug;d.fileLocked=true;}
  }else if(raw.slug&&validName(raw.slug)){d.slug=raw.slug;d.fileLocked=true;}
  let count=0,total=0;
  function block(rawBlock,nested=false){
   if(!rawBlock||!(nested?CHILD_TYPES:TYPES).includes(rawBlock.type))throw Error(nested?'Highlight boxes can contain headings, text, and lists.':'The draft contains an unsupported block.');
   if(++count>MAX_BLOCKS)throw Error('This article is too large. Split it into shorter articles.');
   let type=rawBlock.type;
   if(raw.version===1&&type==='highlight'&&rawBlock.variant==='quote')type='quote';
   const b=newBlock(type);
   b.text=text(rawBlock.text,type==='heading'?180:20000);b.compact=rawBlock.compact===true;b.title=text(rawBlock.title,180);b.level=['h2','h3','h4'].includes(rawBlock.level)?rawBlock.level:'auto';b.style=rawBlock.style==='ordered'?'ordered':'unordered';b.lead=rawBlock.lead===true;
   if(['paragraph','quote','list'].includes(type)){b.rich=sanitizeInline(typeof rawBlock.rich==='string'?rawBlock.rich:inline(b.text));b.text=richText(b.rich);}
   if(type==='image'){b.alt=text(rawBlock.alt,500);b.caption=text(rawBlock.caption,1500);b.decorative=rawBlock.decorative===true;if(rawBlock.data){total+=imageInfo(rawBlock.data).bytes.length;b.data=rawBlock.data;}}
   if(type==='highlight'){
    if(nested)throw Error('Highlight panels cannot contain another panel.');
    if(raw.version===1){b.label=rawBlock.variant==='example'?'Example':'Takeaway';b.level='h2';const child=newBlock('paragraph');child.text=text(rawBlock.text);child.rich=inline(child.text);b.children=[child];if(++count>MAX_BLOCKS)throw Error('This article is too large.');}
    else {b.label=text(rawBlock.label,150);if(!Array.isArray(rawBlock.children))throw Error('A panel is missing its content blocks.');b.children=rawBlock.children.map(c=>block(c,true));}
   }
   if(type==='entries'||type==='links'){
    if(!Array.isArray(rawBlock.items)||rawBlock.items.length>30)throw Error('Use up to 30 entries or links per block.');
    b.items=rawBlock.items.map(i=>({label:text(i?.label,180),...(type==='links'?{url:text(i?.url,2000)}:{text:text(i?.text)})}));
   }
   return b;
  }
  d.blocks=raw.blocks.map(b=>block(b));if(total>MAX_TOTAL)throw Error('Keep the combined image size below 20 MB.');if(d.fileLocked){if(lockedNames.has(d.id)&&lockedNames.get(d.id)!==d.slug)throw Error('This draft conflicts with an already exported filename.');lockedNames.set(d.id,d.slug);}ensureName(d);return d;
 }
 const blockCount=d=>d.blocks.reduce((n,b)=>n+1+(b.children?.length||0),0);
 function renderChild(b,headingLevel='h3') {
  if(b.type==='heading')return '<'+headingLevel+' class="panel-content-heading">'+escape(b.text)+'</'+headingLevel+'>';
  if(b.type==='paragraph')return richParagraphs(b);
  if(b.type==='list'){const tag=b.style==='ordered'?'ol':'ul';return '<'+tag+'>'+balancedParts(b.rich===undefined?inline(text(b.text)):sanitizeInline(b.rich),/<br>/).filter(s=>richText(s).trim()).map(s=>'<li>'+s+'</li>').join('')+'</'+tag+'>';}
  if(b.type==='entries')return '<dl>'+b.items.map(i=>'<dt>'+escape(i.label)+'</dt><dd>'+inline(i.text)+'</dd>').join('')+'</dl>';
  return '';
 }
 function articleHTML(d,preview=false) {
  ensureName(d);let body='',section=false;
  const close=()=>{if(section){body+='</section>';section=false;}};
  d.blocks.forEach((b,i)=>{
   if(b.type==='heading'){
    if(b.level!=='h3'){close();body+='<section aria-labelledby="heading-'+i+'"><h2 id="heading-'+i+'">'+escape(b.text)+'</h2>';section=true;}
    else body+='<h3>'+escape(b.text)+'</h3>';
   }else if(b.type==='paragraph'){
    let html=richParagraphs(b);if(b.lead)html=html.replace('<p>','<p class="article-lede">');body+=html;
   }else if(b.type==='list')body+=renderChild(b);
   else if(b.type==='highlight'){
    const level=(!section||b.level==='h2')?'h2':'h3';const top=b.title&&level!=='h3';if(top)close();
    const tag=top?'section':'aside',heading=level==='h3'?'h3':'h2';
    body+='<'+tag+' class="'+(top&&!b.label?'article-takeaway':'article-example')+'"'+(b.title?' aria-labelledby="panel-'+i+'"':'')+'>'+(b.label?'<p class="eyebrow">'+escape(b.label)+'</p>':'')+(b.title?'<'+heading+' id="panel-'+i+'">'+escape(b.title)+'</'+heading+'>':'')+b.children.map(child=>renderChild(child,b.title?(heading==='h2'?'h3':'h4'):(section?'h3':'h2'))).join('')+'</'+tag+'>';
   }else if(b.type==='quote')body+='<aside class="article-example article-quote"><blockquote>'+richParagraphs(b)+'</blockquote>'+(b.title?'<cite>'+escape(b.title)+'</cite>':'')+'</aside>';
   else if(b.type==='links')body+='<div class="article-resources">'+b.items.map(item=>{const url=safeURL(item.url);return url?'<a class="button button-secondary" href="'+escape(url)+'"'+(/^https?:\/\//i.test(url)?' target="_blank" rel="noopener noreferrer"':'')+'>'+escape(item.label)+' <span aria-hidden="true">↗</span></a>':'';}).join('')+'</div>';
   else if(b.type==='image'&&b.data){const info=imageInfo(b.data),src=preview?b.data:'assets/articles/'+d.slug+'/image-'+(i+1)+'.'+info.ext;body+='<figure class="article-image"><img src="'+src+'" alt="'+escape(b.decorative?'':b.alt)+'" loading="lazy">'+(b.caption?'<figcaption>'+inline(b.caption)+'</figcaption>':'')+'</figure>';}
  });
  close();let date='';if(d.date){const value=new Date(d.date+'T12:00:00Z');if(!isNaN(value))date='<time datetime="'+escape(d.date)+'">'+value.toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric',timeZone:'UTC'})+'</time>';}
  const article='<article aria-labelledby="article-title"><header class="page-banner article-banner"><div class="wrap">'+(d.category?'<p class="eyebrow">'+escape(d.category)+'</p>':'')+'<h1 id="article-title">'+escape(d.title||'Your article title')+'</h1><p class="article-deck">'+escape(d.intro||'Your introduction will appear here.')+'</p>'+((d.author||date)?'<div class="article-meta">'+(d.author?'<span>By '+escape(d.author)+'</span>':'')+date+'</div>':'')+'</div></header><div class="section wrap article-reading-wrap"><div class="article-reading">'+body+'<nav class="article-navigation" aria-label="Article navigation"><a class="button button-secondary" href="index.html#insights-heading">Back to research insights <span aria-hidden="true">↗</span></a></nav></div></div></article>';
  let html=window.UFI_ARTICLE_TEMPLATE.replace('<!--TITLE-->',()=>escape(d.title||'Article')).replace('<!--DESCRIPTION-->',()=>escape(d.intro)).replace('<!--ARTICLE-->',()=>article);
  if(preview)html=html.replace('<head>','<head><base href="'+escape(new URL('../',location.href).href)+'">');return html;
 }
 function packageEntries(d) {
  ensureName(d,true);const name=d.slug,entries=[[name+'.html',articleHTML(d)]];
  d.blocks.forEach((b,i)=>{if(b.type==='image'&&b.data){const info=imageInfo(b.data);entries.push(['assets/articles/'+name+'/image-'+(i+1)+'.'+info.ext,info.bytes]);}});
  entries.push(['editable-draft/'+name+'.json',JSON.stringify(d,null,2)]);
  entries.push(['homepage-link.html','<!-- Add this within the homepage insights section. -->\n<a class="button button-secondary" href="'+name+'.html">'+escape(d.title)+' <span aria-hidden="true">↗</span></a>\n']);
  entries.push(['UPLOAD-INSTRUCTIONS.txt','UFi ARTICLE PACKAGE\n\nExtract this ZIP. Merge the article HTML and assets/ into the SAME website folder as index.html, preserving the existing files. Articles use the V32 shared CSS, scripts, fonts and images.\n\nAdd the snippet from homepage-link.html to the homepage insights section manually.\n\nKeep editable-draft/ locally for editing or handoff; it includes all images. Do not upload private/unpublished drafts to a public repository.\n\nThe automatic filename is now fixed. Re-exporting this draft updates the same article, even after changing its title. New article creates a new identity.\n\nReview text, links, image descriptions, headings, narrow layouts, themes and accessibility preferences. This prototype retains noindex/nofollow until launch review.\n\nNothing was published by the builder.\n']);return entries;
 }
 function firstIssue(d){
  ensureName(d);const issue=(message,extra={})=>({message,...extra});
  if(!d.title.trim())return issue('Enter an article title.',{metadata:'title'});
  if(!d.intro.trim())return issue('Enter a short introduction.',{metadata:'intro'});
  if(!validName(d.slug))return issue('This draft has an invalid filename. Open a valid saved draft or start another article.');
  if(!d.blocks.length)return issue('Add some article content before finishing.',{empty:true});
  if(blockCount(d)>MAX_BLOCKS)return issue('This article is too large. Split it into shorter articles.');
  let h2=false,total=0;
  for(const b of d.blocks){
   if(b.type==='highlight'){
    if(!b.children.length)return issue('Add content inside this highlight box.',{blockId:b.id,key:'children'});
    if(b.title&&(b.level==='h2'||!h2))h2=true;
    for(const child of b.children){
     if(!CHILD_TYPES.includes(child.type))return issue('Highlight boxes can contain headings, text, and lists.',{blockId:b.id,key:'children'});
     if(!text(child.text).trim())return issue('Write something here, or delete this empty section.',{blockId:child.id,key:child.type==='heading'?'text':'rich'});
    }
   }else if(b.type==='image'){
    if(!b.data)return issue('Choose an image, or delete this image section.',{blockId:b.id,key:'file'});
    total+=imageInfo(b.data).bytes.length;
    if(!b.decorative&&!b.alt.trim())return issue('Describe this image for people who cannot see it.',{blockId:b.id,key:'alt'});
   }else if(b.type==='links'){
    if(!b.items.length)return issue('Add a link, or delete this link section.',{blockId:b.id,key:'items'});
    for(let i=0;i<b.items.length;i++){
     if(!b.items[i].label.trim())return issue('Enter the text for this link button.',{blockId:b.id,key:'label',item:i});
     if(!safeURL(b.items[i].url))return issue('Enter a valid web address for this link.',{blockId:b.id,key:'url',item:i});
    }
   }else if(!text(b.text).trim())return issue('Write something here, or delete this empty section.',{blockId:b.id,key:b.type==='heading'?'text':'rich'});
   if(b.type==='heading'){if(b.level==='h3'&&!h2)return issue('Add a heading first, or turn off Use as a subheading in Options.',{blockId:b.id,key:'subheading'});if(b.level!=='h3')h2=true;}
  }
  return total>MAX_TOTAL?issue('Keep all article images together below 20 MB.'):null;
 }
 function checkDraft(d){return firstIssue(d)?.message||'';}

 window.UFIArticle={firstIssue,sanitizeInline,richText,richParagraphs,fresh,newBlock,ensureName,normalize,inline,safeURL,articleHTML,packageEntries,zip,checkDraft,imageInfo,blockCount};

 let state=fresh(),history=[],historyAt=-1,db=null,ready=false,storageFailed=false,loadToken=0,backupSnapshot='',previewScroll=0,hasSaved=false;
 let previewTimer,persistTimer,dragged=null,pendingStart=null,insertion=null,activeRich=null,savedRange=null,linkAnchor=null;
 const names={paragraph:'Text',heading:'Heading',list:'List',image:'Image',highlight:'Highlight box',quote:'Quote',links:'Link buttons'};
 const mini={paragraph:'<path d="M7 9h62M7 19h62M7 29h52M7 39h38"/>',heading:'<path stroke-width="4" d="M8 7v19M24 7v19M8 16h16M35 12h34M35 23h26"/><path d="M8 38h61"/>',list:'<circle cx="9" cy="10" r="2"/><circle cx="9" cy="23" r="2"/><circle cx="9" cy="36" r="2"/><path d="M20 10h50M20 23h44M20 36h48"/>',image:'<rect x="7" y="4" width="62" height="33" rx="2"/><circle cx="51" cy="13" r="3"/><path d="m10 33 15-17 13 12 8-7 20 13M20 43h35"/>',highlight:'<rect x="5" y="3" width="66" height="42" rx="5"/><path d="M14 12h25M14 23h48M14 33h40"/>',quote:'<path stroke-width="4" d="M12 12H6v10h10V12c0-7 4-9 7-9M35 12h-6v10h10V12c0-7 4-9 7-9"/><path d="M8 33h59M8 42h36"/>',links:'<rect x="5" y="8" width="30" height="28" rx="14"/><rect x="41" y="8" width="30" height="28" rx="14"/><path d="M12 22h15M48 22h15"/>'};
 function icon(name){const shape=window.UFI_EDITOR_ICONS?.[name];return shape?'<svg class="action-icon" aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+shape+'</svg>':'';}
 function actionLabel(name,label){return icon(name)+'<span>'+escape(label)+'</span>';}
 function movement(b,i,length,parent=null){return '<div class="movement-controls" role="group" aria-label="Move '+names[b.type].toLowerCase()+' '+(i+1)+(parent?' inside this highlight box':'')+'">'+(parent?'':'<span class="block-handle" draggable="true" title="Drag to move" aria-hidden="true">'+icon('grip')+'</span>')+['up','down'].map(action=>'<button type="button" class="quiet-button movement-button" data-action="'+action+'" '+((action==='up'&&!i)||(action==='down'&&i===length-1)?'disabled':'')+'>'+actionLabel(action,'Move '+action)+'</button>').join('')+'</div>';}
 function tile(type){return '<button type="button" class="block-tile" data-add-type="'+type+'"><svg viewBox="0 0 76 48" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+mini[type]+'</svg><strong>'+names[type]+'</strong></button>';}
 function report(message){$('error').textContent=message;$('error').hidden=!message;}
 function hasWork(d=state){return !!(d.title||d.intro||d.author||d.blocks.length);}
 function syncMeta(){ensureName(state);$('details-summary').textContent=state.title||'Untitled article';}
 function historyButtons(){$('undo').disabled=historyAt<1;$('redo').disabled=historyAt>=history.length-1;}
 function snapshot(){ensureName(state);const value=JSON.stringify(state);if(history[historyAt]!==value){history=history.slice(0,historyAt+1);history.push(value);while(history.length>2&&(history.length>25||history.reduce((n,v)=>n+v.length,0)>24*1024*1024))history.shift();historyAt=history.length-1;}historyButtons();}
 function changed(commit=false){if(commit&&invalidTarget)clearValidation();syncMeta();if(commit)snapshot();clearTimeout(previewTimer);previewTimer=setTimeout(preview,250);clearTimeout(persistTimer);persistTimer=setTimeout(persist,600);}
 function preview(){if($('main').hidden)return;const frame=$('preview');try{previewScroll=frame.contentWindow?.scrollY||0;}catch{}frame.srcdoc=articleHTML(state,true);}
 $('preview').addEventListener('load',()=>{const frame=$('preview'),doc=frame.contentDocument;if(doc){doc.addEventListener('click',e=>{if(e.target.closest('a'))e.preventDefault();},true);frame.contentWindow.scrollTo(0,previewScroll);}});
 document.addEventListener('ufi:preferenceschange',()=>{clearTimeout(previewTimer);previewTimer=setTimeout(preview,100);});
 function context(id){for(let i=0;i<state.blocks.length;i++){const b=state.blocks[i];if(b.id===id)return {b,array:state.blocks,index:i,parent:null};if(b.children){const index=b.children.findIndex(c=>c.id===id);if(index>=0)return {b:b.children[index],array:b.children,index,parent:b};}}return null;}
 function richHTML(b){return sanitizeInline(b.rich===undefined?inline(b.text||''):b.rich);}
 function textField(b,key,label,{max=180,placeholder='',compact=false,disabled=false}={}){const id=b.id+'-'+key;return '<label for="'+id+'"'+(compact?' class="visually-hidden"':'')+'>'+label+'</label><input id="'+id+'" data-key="'+key+'" maxlength="'+max+'" '+(disabled?'disabled':'')+' value="'+escape(b[key]||'')+'" placeholder="'+escape(placeholder)+'">';}
 function formatTools(id){return '<div class="format-tools" role="group" aria-label="Text formatting">'+['bold','italic','link'].map(v=>'<button type="button" class="quiet-button" data-format="'+v+'" data-for="'+id+'">'+actionLabel(v,v[0].toUpperCase()+v.slice(1))+'</button>').join('')+'</div>';}
 function richField(b,label,placeholder){const id=b.id+'-rich';return '<label id="'+id+'-label" class="visually-hidden">'+label+'</label>'+formatTools(id)+'<div id="'+id+'" class="rich-input" contenteditable="true" role="textbox" aria-multiline="true" aria-labelledby="'+id+'-label" data-rich data-placeholder="'+escape(placeholder)+'" spellcheck="true">'+richHTML(b)+'</div>';}
 function options(b,i,length,parent){return '<details class="block-options"><summary aria-label="Options for '+names[b.type].toLowerCase()+' '+(i+1)+'">'+actionLabel('more','Options')+'</summary><div class="options-popover">'+['duplicate','remove'].map(action=>'<button type="button" data-action="'+action+'" '+((action==='up'&&!i)||(action==='down'&&i===length-1)?'disabled':'')+'>'+actionLabel(action==='duplicate'?'copy':'delete',({duplicate:'Make a copy',remove:'Delete'})[action])+'</button>').join('')+(b.type==='heading'&&!parent?'<label><input type="checkbox" data-key="subheading" '+(b.level==='h3'?'checked':'')+'>Use as a subheading</label>':'')+(b.type==='paragraph'&&!parent?'<label><input type="checkbox" data-key="lead" '+(b.lead?'checked':'')+'>Use as opening text</label>':'')+'</div></details>';}
 function insertionHTML(index,parent=null,end=false,empty=false){
  const label=empty?(parent?'Add content inside this box':'Add your first section'):'Add content'+(end?'':' here');
  const accessible=empty?label:(end?'Add content at the end':'Add content before section '+(index+1))+(parent?' inside this highlight box':'');
  return '<div class="insertion-zone'+(end||empty?' insertion-visible':'')+'"><button type="button" class="insert-button" data-insert-index="'+index+'" data-insert-parent="'+(parent?.id||'')+'" aria-haspopup="dialog" aria-controls="picker-dialog" aria-label="'+accessible+'">'+actionLabel('plus',label)+'</button></div>';
 }
 function blockHTML(b,i,length,parent=null){
  let controls='';
  if(b.type==='heading')controls=textField(b,'text',parent?'Heading inside highlight box':'Heading',{compact:true,placeholder:'Write a heading…'});
  if(b.type==='paragraph')controls=richField(b,'Text','Write your text…');
  if(b.type==='list')controls='<div class="list-choice" role="group" aria-label="List style">'+[['unordered','Bullets'],['ordered','Numbers']].map(([v,label])=>'<button type="button" class="quiet-button" data-list-style="'+v+'" aria-pressed="'+(b.style===v)+'">'+actionLabel(v==='unordered'?'bullets':'numbers',label)+'</button>').join('')+'<span>One item per line</span></div>'+richField(b,'List items','Write one item per line…');
  if(b.type==='quote')controls=richField(b,'Quotation','Write the quotation…')+textField(b,'title','Who said this? (optional)',{placeholder:'Person or source'});
  if(b.type==='image')controls='<div class="image-control">'+(b.data?'<img class="image-thumb" src="'+b.data+'" alt="Selected image preview">':'')+'<label class="file-label" for="'+b.id+'-file">'+actionLabel('image',b.data?'Change image':'Choose an image')+'</label><input id="'+b.id+'-file" data-image type="file" accept="image/png,image/jpeg,image/webp,image/gif"><small>PNG, JPEG, WebP or GIF · up to 5 MB</small></div>'+textField(b,'alt','Describe this image for people who cannot see it',{max:500,disabled:b.decorative})+'<label class="check-label"><input type="checkbox" data-key="decorative" '+(b.decorative?'checked':'')+'>This image is only decoration</label><p class="field-help">Only choose this if the image adds no information, such as a background texture.</p><details class="caption-option" '+(b.caption?'open':'')+'><summary>Caption (optional)</summary>'+textField(b,'caption','Image caption',{max:1500,compact:true,placeholder:'Add a caption or image credit'})+'</details>';
  if(b.type==='highlight')controls='<div class="panel-meta"><div class="panel-field">'+textField(b,'label','Box label (optional)',{max:150,placeholder:'Label, e.g. Example'})+'</div><div class="panel-field">'+textField(b,'title','Box title (optional)',{placeholder:'Title'})+'</div></div><div class="panel-children">'+listHTML(b.children,b)+'</div>';
  if(b.type==='links')controls=b.items.map((item,j)=>'<div class="link-row" data-link-row="'+j+'"><div class="link-fields"><label for="'+b.id+'-'+j+'-label">Button text<input id="'+b.id+'-'+j+'-label" data-item="'+j+'" data-key="label" maxlength="180" value="'+escape(item.label)+'"></label><label for="'+b.id+'-'+j+'-url">Web address<input id="'+b.id+'-'+j+'-url" data-item="'+j+'" data-key="url" maxlength="2000" value="'+escape(item.url)+'" placeholder="https://…"></label></div><div class="row-actions"><div class="row-movement" role="group" aria-label="Move link '+(j+1)+'">'+['up','down'].map(action=>'<button type="button" class="quiet-button movement-button" data-row-action="'+action+'" data-row="'+j+'" '+((action==='up'&&!j)||(action==='down'&&j===b.items.length-1)?'disabled':'')+'>'+actionLabel(action,'Move '+action)+'</button>').join('')+'</div><details class="row-options"><summary>'+actionLabel('more','Options')+'</summary><div class="options-popover">'+['remove'].map(action=>'<button type="button" data-row-action="'+action+'" data-row="'+j+'" '+((action==='up'&&!j)||(action==='down'&&j===b.items.length-1)?'disabled':'')+'>'+actionLabel('delete','Delete link')+'</button>').join('')+'</div></details></div></div>').join('')+'<button class="quiet-button" type="button" data-row-action="add">'+actionLabel('plus','Add another link')+'</button>';
  return '<div role="group" class="block-card'+(b.type==='heading'?' heading-card':'')+(parent?' child-card':'')+'" data-type="'+b.type+'" data-id="'+b.id+'" '+(parent?'':'data-top="true"')+' aria-label="'+names[b.type]+' '+(i+1)+'"><div class="block-top">'+movement(b,i,length,parent)+'<span class="block-name">'+names[b.type]+'</span>'+options(b,i,length,parent)+'</div><div class="block-content">'+controls+'</div></div>';
 }
 function listHTML(array,parent=null){if(!array.length)return insertionHTML(0,parent,true,true);return insertionHTML(0,parent)+array.map((b,i)=>blockHTML(b,i,array.length,parent)+insertionHTML(i+1,parent,i===array.length-1)).join('');}
 function renderBlocks(){$('blocks').innerHTML=listHTML(state.blocks);activeRich=null;savedRange=null;}
 function render(){for(const key of ['title','intro','author','date','category'])$(key).value=state[key];syncMeta();renderBlocks();preview();}
 function focusRowMovement(id,index,action){const card=document.querySelector('[data-id="'+id+'"]'),group=card?.querySelector('[data-link-row="'+index+'"] > .row-actions > .row-movement');const button=group?.querySelector('[data-row-action="'+action+'"]:not(:disabled)')||group?.querySelector('button:not(:disabled)');if(button)button.focus();else focusBlock(id);}
 function focusMovement(id,action){const card=document.querySelector('[data-id="'+id+'"]');const group=card?.querySelector(':scope > .block-top > .movement-controls');const button=group?.querySelector('[data-action="'+action+'"]:not(:disabled)')||group?.querySelector('button:not(:disabled)');if(button)button.focus();else focusBlock(id);}
 function focusBlock(id){const card=document.querySelector('[data-id="'+id+'"]');(card?.querySelector('.rich-input')||card?.querySelector('input:not([type=file])')||card?.querySelector('input[type=file]')||card?.querySelector('button,summary'))?.focus();}
 function editorEntryTarget(){if($('article-details').open)return $('title');const card=state.blocks[0]?document.querySelector('[data-id="'+state.blocks[0].id+'"]'):null;return card?.querySelector('.rich-input')||card?.querySelector('input:not([type=file])')||$('blocks').querySelector('.insert-button')||$('article-details').querySelector('summary');}
 function enterEditor(focus=true){document.body.dataset.mode='edit';$('start-screen').hidden=true;$('main').hidden=false;render();if(focus){$('article-details').open=true;$('title').focus();}else editorEntryTarget()?.focus();}
 function showStart(){document.body.dataset.mode='start';$('main').hidden=true;$('start-screen').hidden=false;$('continue').hidden=!(hasSaved||hasWork());$('start-message').textContent=hasSaved||hasWork()?'Your current article is available to continue.':'Choose a starting point. You can add or remove sections later.';$('continue').innerHTML=actionLabel('file','Continue '+(state.title?'“'+state.title+'”':'your article'));report('');(hasSaved||hasWork()?$('continue'):$('start-template')).focus();}
 function requestStart(kind,draft=null){pendingStart={kind,draft};if(hasWork()){ showDialog($('confirm-dialog')); }else applyStart();}
 function applyStart(){if(!pendingStart)return;loadToken++;const {kind,draft}=pendingStart;snapshot();state=kind==='template'?normalize(window.UFI_EXAMPLE_DRAFT):kind==='import'?draft:fresh();pendingStart=null;hasSaved=true;previewScroll=0;if(kind==='template')$('article-details').open=false;enterEditor(kind!=='template');changed(true);report('');}
 $('start-blank').addEventListener('click',()=>requestStart('blank'));
 $('start-template').addEventListener('click',()=>requestStart('template'));
 $('continue').addEventListener('click',()=>enterEditor(false));
 $('new').addEventListener('click',showStart);
 for(const id of ['import','start-import'])$(id).addEventListener('click',()=>$('import-file').click());
 for(const key of ['title','intro','author','date','category']){$(key).addEventListener('input',()=>{state[key]=$(key).value;changed();});$(key).addEventListener('change',snapshot);}
 $('blocks').addEventListener('input',e=>{const ctx=context(e.target.closest('[data-id]')?.dataset.id);if(!ctx)return;const b=ctx.b;if(e.target.hasAttribute('data-rich')){b.rich=sanitizeInline(e.target.innerHTML);b.text=richText(b.rich);}else if(e.target.dataset.item!==undefined){const item=b.items?.[Number(e.target.dataset.item)];if(item&&['label','url'].includes(e.target.dataset.key))item[e.target.dataset.key]=e.target.value;}else {const key=e.target.dataset.key;if(key==='subheading')b.level=e.target.checked?'h3':'h2';else if(['text','title','label','alt','caption','decorative','lead'].includes(key))b[key]=e.target.type==='checkbox'?e.target.checked:e.target.value;if(key==='decorative')$(b.id+'-alt').disabled=b.decorative;}changed();});
 $('blocks').addEventListener('focusout',e=>{if(e.target.matches('.rich-input,input'))snapshot();});
 $('blocks').addEventListener('change',async e=>{
  const ctx=context(e.target.closest('[data-id]')?.dataset.id);if(!ctx)return;
  if(e.target.hasAttribute('data-image')){const id=ctx.b.id,file=e.target.files[0];if(!file)return;try{if(file.size>MAX_IMAGE)throw Error('Choose an image under 5 MB.');const data=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=()=>reject(Error('The image could not be read.'));r.readAsDataURL(file);});imageInfo(data);await new Promise((resolve,reject)=>{const image=new Image();image.onload=resolve;image.onerror=()=>reject(Error('This image could not be decoded.'));image.src=data;});const current=context(id);if(!current)return;let total=imageInfo(data).bytes.length;for(const b of state.blocks)if(b.id!==id&&b.data)total+=imageInfo(b.data).bytes.length;if(total>MAX_TOTAL)throw Error('Keep article images together below 20 MB.');current.b.data=data;report('');renderBlocks();changed(true);$(id+'-alt')?.focus();}catch(err){report(err.message);e.target.value='';}}else snapshot();
 });
 function canAdd(n=1){if(blockCount(state)+n>MAX_BLOCKS){report('This article is too large. Split it into shorter articles.');return false;}return true;}
 function openPicker(button){const parent=button.dataset.insertParent?context(button.dataset.insertParent)?.b:null;if(button.dataset.insertParent&&!parent)return;insertion={parentId:parent?.id||null,index:Number(button.dataset.insertIndex),opener:button};$('picker-title').textContent=parent?'Add inside this highlight box':'Add content here';$('block-picker').innerHTML=(parent?CHILD_TYPES:TYPES).map(tile).join('');showDialog($('picker-dialog'));}
 $('blocks').addEventListener('click',e=>{const button=e.target.closest('button');if(!button||button.disabled)return;if(button.dataset.insertIndex!==undefined){openPicker(button);return;}const ctx=context(button.closest('[data-id]')?.dataset.id);if(!ctx)return;const {b,array,index,parent}=ctx;
  if(button.dataset.format){const target=$(button.dataset.for);if(!target)return;activeRich=target;if(button.dataset.format==='link')openLink();else applyFormat(button.dataset.format==='bold'?'strong':'em');return;}
  if(button.dataset.listStyle){snapshot();b.style=button.dataset.listStyle;renderBlocks();changed(true);focusBlock(b.id);return;}
  if(button.dataset.rowAction){
   const action=button.dataset.rowAction,i=Number(button.dataset.row);if(!b.items)return;const item=b.items[i];snapshot();
   if(action==='add'){if(b.items.length>=30){report('Use up to 30 link buttons.');return;}b.items.push({label:'',url:''});}
   else if(i>=0&&i<b.items.length){if(action==='remove')b.items.splice(i,1);if(action==='up'&&i>0)[b.items[i-1],b.items[i]]=[b.items[i],b.items[i-1]];if(action==='down'&&i<b.items.length-1)[b.items[i+1],b.items[i]]=[b.items[i],b.items[i+1]];}
   renderBlocks();changed(true);
   if((action==='up'||action==='down')&&item){const position=b.items.indexOf(item);focusRowMovement(b.id,position,action);$('editor-announcement').textContent='Moved link to position '+(position+1)+' of '+b.items.length+'.';}
   else {const position=action==='add'?b.items.length-1:Math.min(i,b.items.length-1);if(position>=0)$(b.id+'-'+position+'-label')?.focus();else focusBlock(b.id);}return;
  }
  const action=button.dataset.action;if(!action)return;snapshot();let target=b.id;
  if(action==='duplicate'){if(!canAdd(1+(b.children?.length||0)))return;const copy=clone(b);copy.id=uid();copy.children?.forEach(child=>{child.id=uid();});const total=state.blocks.reduce((n,x)=>n+(x.data?imageInfo(x.data).bytes.length:0),0)+(copy.data?imageInfo(copy.data).bytes.length:0);if(total>MAX_TOTAL){report('This would exceed the 20 MB image limit.');return;}array.splice(index+1,0,copy);target=copy.id;}
  if(action==='remove'){array.splice(index,1);target=array[Math.min(index,array.length-1)]?.id||parent?.id;}
  if(action==='up'&&index>0)[array[index-1],array[index]]=[array[index],array[index-1]];
  if(action==='down'&&index<array.length-1)[array[index+1],array[index]]=[array[index],array[index+1]];
  renderBlocks();changed(true);if(target){if(action==='up'||action==='down')focusMovement(target,action);else focusBlock(target);}else $('blocks').querySelector('button')?.focus();$('save-status').textContent=action==='remove'?'Section deleted. Undo brings it back.':'Article updated.';if(action==='up'||action==='down')$('editor-announcement').textContent='Moved '+names[b.type].toLowerCase()+' to position '+(array.indexOf(b)+1)+' of '+array.length+(parent?' inside this highlight box.':'.');
 });
 $('block-picker').addEventListener('click',e=>{const button=e.target.closest('[data-add-type]');if(!button||!insertion)return;const parent=insertion.parentId?context(insertion.parentId)?.b:null,array=parent?parent.children:state.blocks;if(insertion.parentId&&!parent)return;const allowed=parent?CHILD_TYPES:TYPES;if(!allowed.includes(button.dataset.addType)||!canAdd())return;const b=newBlock(button.dataset.addType);if(parent)b.level='auto';snapshot();array.splice(Math.min(Math.max(insertion.index,0),array.length),0,b);$('picker-dialog').close('inserted');renderBlocks();changed(true);focusBlock(b.id);const card=document.querySelector('[data-id="'+b.id+'"]');card?.classList.add('is-new');setTimeout(()=>card?.classList.remove('is-new'),1400);});
 $('close-picker').addEventListener('click',()=>$('picker-dialog').close('cancel'));
 $('blocks').addEventListener('dragstart',e=>{const handle=e.target.closest('[draggable=true]');if(!handle)return;const card=handle.closest('[data-top]');if(!card)return;dragged=card.dataset.id;e.dataTransfer.setData('text/plain',dragged);e.dataTransfer.effectAllowed='move';});
 $('blocks').addEventListener('dragover',e=>{const card=e.target.closest('[data-top]');if(dragged&&card){e.preventDefault();document.querySelectorAll('.drag-over').forEach(c=>c.classList.remove('drag-over'));card.classList.add('drag-over');}});
 const endDrag=()=>{dragged=null;document.querySelectorAll('.drag-over').forEach(c=>c.classList.remove('drag-over'));};
 $('blocks').addEventListener('drop',e=>{const card=e.target.closest('[data-top]');if(dragged&&card){e.preventDefault();const from=state.blocks.findIndex(b=>b.id===dragged),to=state.blocks.findIndex(b=>b.id===card.dataset.id);if(from>=0&&to>=0&&from!==to){snapshot();const [b]=state.blocks.splice(from,1);state.blocks.splice(to,0,b);renderBlocks();changed(true);focusBlock(b.id);}}endDrag();});$('blocks').addEventListener('dragend',endDrag);
 $('undo').addEventListener('click',()=>{if(historyAt>0){state=JSON.parse(history[--historyAt]);ensureName(state);render();changed();historyButtons();}});
 $('redo').addEventListener('click',()=>{if(historyAt<history.length-1){state=JSON.parse(history[++historyAt]);ensureName(state);render();changed();historyButtons();}});
 let invalidTarget=null;
 function clearValidation(){if(invalidTarget){invalidTarget.removeAttribute('aria-invalid');invalidTarget.removeAttribute('aria-describedby');invalidTarget=null;}report('');}
 function showIssue(issue){
  clearValidation();report(issue.message);let target=null;
  if(issue.metadata){$('article-details').open=true;target=$(issue.metadata);}
  else if(issue.empty)target=$('blocks').querySelector('.insert-button');
  else if(issue.blockId){const card=document.querySelector('[data-id="'+issue.blockId+'"]');
   if(issue.item!==undefined)target=$(issue.blockId+'-'+issue.item+'-'+issue.key);
   else if(issue.key==='children')target=card?.querySelector('.panel-children .insert-button');
   else if(issue.key==='items')target=card?.querySelector('[data-row-action="add"]');
   else if(issue.key==='subheading'){const options=card?.querySelector('.block-options');if(options)options.open=true;target=card?.querySelector('[data-key="subheading"]');}
   else target=$(issue.blockId+'-'+issue.key);
  }
  if(target){target.setAttribute('aria-invalid','true');target.setAttribute('aria-describedby','error');invalidTarget=target;target.scrollIntoView({block:'center'});target.focus();queueMicrotask(()=>{if(target.isConnected){const details=target.closest?.('details');if(details)details.open=true;target.focus();}});}else $('error').focus();
 }
 function saveDraftFile(){ensureName(state);download(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),state.slug+'.json');backupSnapshot=JSON.stringify(state);$('save-status').textContent='Draft download started. Keep the file to continue later or send to your publisher.';if($('finish-dialog').open)$('finish-status').textContent='Your editable draft download has started.';}
 $('save-draft').addEventListener('click',saveDraftFile);
 $('finish-save-draft').addEventListener('click',saveDraftFile);
 $('finish').addEventListener('click',()=>{try{clearValidation();const issue=firstIssue(state);if(issue){showIssue(issue);return;}$('finish-status').textContent='';$('finish-error').hidden=true;showDialog($('finish-dialog'));$('finish-title').focus();}catch(err){report(err.message);$('error').focus();}});
 dialogBehavior($('finish-dialog'),()=>$('finish'));
 for(const id of ['close-finish','return-editing'])$(id).addEventListener('click',()=>$('finish-dialog').close());
 $('export').addEventListener('click',()=>{try{const issue=firstIssue(state);if(issue){$('finish-dialog').close('fix');showIssue(issue);return;}download(zip(packageEntries(state)),state.slug+'-article.zip');snapshot();syncMeta();persist();backupSnapshot=JSON.stringify(state);$('finish-status').textContent='Your article ZIP download has started. Follow its instructions to upload it.';}catch(err){$('finish-error').textContent='Could not prepare the download: '+err.message;$('finish-error').hidden=false;}});
 document.addEventListener('input',e=>{if(invalidTarget===e.target||(invalidTarget?.closest?.('[data-id]')&&invalidTarget.closest('[data-id]')===e.target.closest?.('[data-id]')))clearValidation();});
 $('import-file').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;const token=++loadToken;try{if(file.size>30*1024*1024)throw Error('Drafts must be under 30 MB.');const draft=normalize(JSON.parse(await file.text()));if(token!==loadToken)return;requestStart('import',draft);}catch(err){report('Could not open draft: '+err.message);}e.target.value='';});
 $('focus-preview').addEventListener('click',()=>{$('preview-pane').scrollIntoView({block:'start'});$('preview-heading').focus();});
 function showDialog(dialog){dialog.returnValue='';dialog.showModal();}
 function dialogBehavior(dialog,returnFocus){let outside=false;const out=e=>{const r=dialog.getBoundingClientRect();return e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom;};dialog.addEventListener('pointerdown',e=>{outside=e.target===dialog&&out(e);});dialog.addEventListener('pointercancel',()=>{outside=false;});dialog.addEventListener('click',e=>{if(outside&&e.target===dialog&&out(e))dialog.close('cancel');outside=false;});dialog.addEventListener('close',()=>{if(!['inserted','fix'].includes(dialog.returnValue))returnFocus()?.focus();});}
 dialogBehavior($('picker-dialog'),()=>insertion?.opener?.isConnected?insertion.opener:editorEntryTarget());
 dialogBehavior($('confirm-dialog'),()=>$('start-screen').hidden?editorEntryTarget():$('continue'));
 $('confirm-dialog').addEventListener('close',()=>{if($('confirm-dialog').returnValue==='confirm')applyStart();else pendingStart=null;});
 for(const [dialogId,openId,closeId] of [['help-dialog','help','close-help']]){dialogBehavior($(dialogId),()=>$('draft-menu').querySelector('summary'));$(openId).addEventListener('click',()=>showDialog($(dialogId)));$(closeId).addEventListener('click',()=>$(dialogId).close());}
 document.addEventListener('click',e=>{for(const d of document.querySelectorAll('.block-options[open],.row-options[open],#draft-menu[open]'))if(!d.contains(e.target))d.open=false;});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')for(const d of document.querySelectorAll('.block-options[open],.row-options[open],#draft-menu[open]')){d.open=false;d.querySelector('summary').focus();}});
 $('draft-menu').addEventListener('click',e=>{if(e.target.closest('button')){$('draft-menu').open=false;if(!document.querySelector('dialog[open]')&&!$('main').hidden)$('draft-menu').querySelector('summary').focus();}});
 for(const size of ['desktop','mobile'])$(size).addEventListener('click',()=>{document.querySelector('.preview-frame-wrap').classList.toggle('mobile',size==='mobile');$('desktop').setAttribute('aria-pressed',String(size==='desktop'));$('mobile').setAttribute('aria-pressed',String(size==='mobile'));});
 function persist(){if(!ready||(!hasSaved&&!hasWork()))return;if(!db){$('save-status').textContent='Autosave unavailable. Use Save draft to keep your work.';return;}try{const tx=db.transaction('drafts','readwrite');tx.objectStore('drafts').put(clone(state),'current-v3');tx.oncomplete=()=>{hasSaved=true;storageFailed=false;$('save-status').textContent='Saved in this browser · Use Save draft to keep a copy';};tx.onerror=()=>{storageFailed=true;$('save-status').textContent='Autosave failed. Use Save draft to keep your work.';};}catch{storageFailed=true;$('save-status').textContent='Autosave failed. Use Save draft to keep your work.';}}
 async function setupStorage(){const controls=[...document.querySelectorAll('#start-screen button,.editing-actions button')];controls.forEach(c=>c.disabled=true);let timeout,active=true;try{const saved=await Promise.race([new Promise((resolve,reject)=>{const request=indexedDB.open('ufi-article-builder',1);request.onupgradeneeded=()=>request.result.createObjectStore('drafts');request.onerror=()=>reject(request.error);request.onblocked=()=>reject(Error('Storage blocked'));request.onsuccess=()=>{if(!active){request.result.close();return;}db=request.result;const read=keys=>{const r=db.transaction('drafts').objectStore('drafts').get(keys[0]);r.onerror=()=>reject(r.error);r.onsuccess=()=>r.result?resolve(r.result):keys.length>1?read(keys.slice(1)):resolve(null);};read(['current-v3','current-v2','current']);};}),new Promise((_,reject)=>{timeout=setTimeout(()=>reject(Error('Storage timeout')),3000);})]);if(saved){state=normalize(saved);hasSaved=true;}}catch{db=null;storageFailed=true;}finally{active=false;clearTimeout(timeout);ready=true;controls.forEach(c=>c.disabled=false);render();snapshot();showStart();if(storageFailed)$('start-message').textContent='Browser autosave is unavailable. You can still write articles and save draft files.';}}
 window.addEventListener('pagehide',persist);window.addEventListener('beforeunload',e=>{if(storageFailed&&JSON.stringify(state)!==backupSnapshot&&hasWork()){e.preventDefault();e.returnValue='';}});
 function rememberSelection(){const selection=window.getSelection();if(!selection?.rangeCount)return;const range=selection.getRangeAt(0),node=range.commonAncestorContainer,element=node.nodeType===1?node:node.parentElement,editor=element?.closest?.('.rich-input');if(editor){activeRich=editor;savedRange=range.cloneRange();}}
 document.addEventListener('selectionchange',rememberSelection);
 function editingRange(){if(!activeRich)return null;if(savedRange&&activeRich.contains(savedRange.commonAncestorContainer))return savedRange.cloneRange();const range=document.createRange();range.selectNodeContents(activeRich);range.collapse(false);return range;}
 function selectRange(range){activeRich.focus();const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);savedRange=range.cloneRange();}
 function richChanged(){if(!activeRich)return;activeRich.dispatchEvent(new Event('input',{bubbles:true}));snapshot();}
 function applyFormat(tag){
  const range=editingRange();if(!range)return;snapshot();const node=range.commonAncestorContainer,element=node.nodeType===1?node:node.parentElement,wrapper=element?.closest?.(tag);
  if(wrapper&&activeRich.contains(wrapper)){
   const after=document.createRange();after.setStart(range.endContainer,range.endOffset);after.setEnd(wrapper,wrapper.childNodes.length);const tailContents=after.extractContents(),middle=range.collapsed?document.createTextNode('\u200b'):range.extractContents();
   const first=middle.nodeType===11?middle.firstChild:middle,last=middle.nodeType===11?middle.lastChild:middle;
   wrapper.after(middle);if(tailContents.childNodes.length){const tail=wrapper.cloneNode(false);tail.append(tailContents);last.after(tail);}if(!wrapper.textContent)wrapper.remove();
   if(first&&last){range.setStartBefore(first);range.setEndAfter(last);if(first===last&&first.textContent==='\u200b'){range.selectNodeContents(first);range.collapse(false);}}selectRange(range);
  }else{const mark=document.createElement(tag);if(range.collapsed)mark.append(document.createTextNode('\u200b'));else mark.append(range.extractContents());range.insertNode(mark);range.selectNodeContents(mark);if(mark.textContent==='\u200b')range.collapse(false);selectRange(range);}richChanged();
 }
 function insertPlain(value){const range=editingRange();if(!range)return;snapshot();range.deleteContents();const fragment=document.createDocumentFragment(),parts=value.replace(/\r\n?/g,'\n').split('\n');let last;parts.forEach((part,i)=>{if(i)fragment.append(document.createElement('br'));last=document.createTextNode(part);fragment.append(last);});range.insertNode(fragment);range.setStartAfter(last);range.collapse(true);selectRange(range);richChanged();}
 $('blocks').addEventListener('pointerdown',e=>{if(e.target.closest('[data-format]'))e.preventDefault();});
 $('blocks').addEventListener('paste',e=>{const editor=e.target.closest('.rich-input');if(!editor)return;e.preventDefault();activeRich=editor;rememberSelection();const value=e.clipboardData?.getData('text/plain');if(value)insertPlain(value.slice(0,20000));});
 $('blocks').addEventListener('drop',e=>{if(e.defaultPrevented)return;const editor=e.target.closest('.rich-input');if(editor){e.preventDefault();activeRich=editor;rememberSelection();const value=e.dataTransfer?.getData('text/plain');if(value)insertPlain(value.slice(0,20000));}});
 $('blocks').addEventListener('keydown',e=>{if(!e.target.closest('.rich-input')||!(e.ctrlKey||e.metaKey))return;const key=e.key.toLowerCase();if(key==='b'||key==='i'){e.preventDefault();activeRich=e.target.closest('.rich-input');rememberSelection();applyFormat(key==='b'?'strong':'em');}if(key==='z'||key==='y'){e.preventDefault();const id=e.target.closest('[data-id]').dataset.id;if(key==='z'&&!e.shiftKey){snapshot();$('undo').click();}else $('redo').click();focusBlock(id);}});
 function openLink(){const range=editingRange();if(!range)return;snapshot();savedRange=range.cloneRange();const node=range.commonAncestorContainer,element=node.nodeType===1?node:node.parentElement;linkAnchor=element?.closest?.('a');if(linkAnchor&&!activeRich.contains(linkAnchor))linkAnchor=null;$('link-text').value=linkAnchor?.textContent||range.toString();$('link-url').value=linkAnchor?.getAttribute('href')||'';$('remove-link').hidden=!linkAnchor;$('link-error').textContent='';showDialog($('link-dialog'));}
 $('link-form').addEventListener('submit',e=>{e.preventDefault();const url=safeURL($('link-url').value),label=$('link-text').value.trim();if(!url||!label){$('link-error').textContent='Enter the link text and a valid web address.';return;}const range=editingRange();if(!range)return;if(linkAnchor?.isConnected)range.selectNode(linkAnchor);range.deleteContents();const anchor=document.createElement('a');anchor.href=url;anchor.textContent=label;range.insertNode(anchor);range.selectNodeContents(anchor);$('link-dialog').close('saved');selectRange(range);richChanged();});
 $('remove-link').addEventListener('click',()=>{if(linkAnchor?.isConnected){const range=document.createRange(),node=document.createTextNode(linkAnchor.textContent);linkAnchor.replaceWith(node);range.selectNodeContents(node);$('link-dialog').close('saved');selectRange(range);richChanged();}});
 $('cancel-link').addEventListener('click',()=>$('link-dialog').close('cancel'));
 dialogBehavior($('link-dialog'),()=>activeRich);
 setupStorage();
})();
