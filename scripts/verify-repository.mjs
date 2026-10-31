import {execFileSync} from 'node:child_process';
import {readFileSync,existsSync} from 'node:fs';

// Include new files as well: a build on a developer's machine can hide missing Git sources.
const files=[...new Set(execFileSync('git',['ls-files','--cached','--others','--exclude-standard','-z'],{encoding:'utf8'}).split('\0').filter(file=>file&&existsSync(file)))];
const failures=[];
for(const file of files){
  if(/(^|\/)(?:node_modules|dist|design)(\/|$)|(^|\/)\.env(?!\.example$)|\.log$|^PROJECT_MEMORY\.md$/.test(file))failures.push('Archivo local incluido en Git: '+file);
  const content=readFileSync(file);
  if(content.includes(0)||content.length>2_000_000)continue;
  const value=content.toString('utf8');
  if(/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\b(?:ghp_|github_pat_)[A-Za-z0-9_]{30,}|\bAKIA[A-Z0-9]{16}\b|\bsk_live_[A-Za-z0-9]{20,}/.test(value))failures.push('Posible credencial: '+file);
}
if(!readFileSync('AGENTS.md').equals(readFileSync('CLAUDE.md')))failures.push('AGENTS.md y CLAUDE.md difieren.');
const ignored=execFileSync('git',['check-ignore','--stdin'],{input:'.env.local\n.env.production.local\nPROJECT_MEMORY.md\ndesign/probe.txt\n.codex/skills/probe.txt\n',encoding:'utf8'}).trim().split(/\r?\n/);
if(ignored.length!==5)failures.push('Faltan exclusiones de archivos locales.');
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}
else console.log(`Repositorio: ${files.length} archivos candidatos; reglas, exclusiones y patrones de credenciales comprobados.`);
