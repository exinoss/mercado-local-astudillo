import {readdir,readFile,stat} from 'node:fs/promises';
import {resolve,relative,dirname,extname} from 'node:path';

const root=resolve('dist'),files=[];
async function walk(directory){for(const item of await readdir(directory,{withFileTypes:true})){const path=resolve(directory,item.name);if(item.isSymbolicLink())throw Error('Enlace simbólico en dist: '+item.name);if(item.isDirectory())await walk(path);else files.push(path);}}
await walk(root);
const known=new Set(files),failures=[],pages=files.filter(file=>file.endsWith('.html'));
async function reference(value,source){
  if(!value||/^(?:[a-z][\w+.-]*:|#|\/\/)/i.test(value))return;
  let clean;try{clean=decodeURIComponent(value.split(/[?#]/)[0].replaceAll('&amp;','&'));}catch{failures.push('URL inválida en '+relative(root,source));return;}
  if(!clean)return;
  let target=resolve(clean.startsWith('/')?root:dirname(source),'.'+(clean.startsWith('/')?clean:'/'+clean));
  if(!relative(root,target).startsWith('..')&&(known.has(target)||known.has(resolve(target,'index.html'))))return;
  failures.push(`${relative(root,source)} -> ${clean}`);
}
for(const file of files){
  const name=relative(root,file).replaceAll('\\','/');
  if(/(^|\/)(?:\.env[^/]*|[^/]*\.map|[^/]*\.log)$/.test(name))failures.push('Archivo privado o de desarrollo: '+name);
  const extension=extname(file);
  if(!['.html','.css','.svg','.js'].includes(extension))continue;
  const content=await readFile(file,'utf8');
  if(/(?:C:\\Users\\|C:\/Users\/|design\/auditoria)/.test(content))failures.push('Ruta local en '+name);
  if(extension==='.html'){
    if(!/<html[^>]+lang="es"/.test(content)||!content.includes('id="main"'))failures.push('Estructura incompleta: '+name);
    for(const match of content.matchAll(/\b(?:src|href)="([^"]*)"/g))await reference(match[1],file);
    for(const match of content.matchAll(/\bsrcset="([^"]*)"/g))for(const candidate of match[1].split(','))await reference(candidate.trim().split(/\s+/)[0],file);
  }
  if(extension==='.css')for(const match of content.matchAll(/url\(["']?([^)'"\s]+)["']?\)/g))await reference(match[1],file);
  if(extension==='.js')for(const match of content.matchAll(/["'](\/_astro\/[^"']+)["']/g))await reference(match[1],file);
}
if(!pages.length||!files.some(file=>file.endsWith('.wasm')))failures.push('Faltan páginas o SQLite WASM.');
const bytes=(await Promise.all(files.map(file=>stat(file)))).reduce((sum,item)=>sum+item.size,0);
if(failures.length){console.error([...new Set(failures)].join('\n'));process.exitCode=1;}
else console.log(`Distribución: ${pages.length} páginas, ${files.length} archivos, ${(bytes/1024/1024).toFixed(2)} MiB; referencias locales completas.`);
