const fs=require('fs');const R=__dirname+'/../';
const src=fs.readFileSync(R+'index.html','utf8');const RAW=eval(src.match(/const RAW\s*=\s*(\[[\s\S]*?\]);\n/)[1]);
let SHK_RAW;eval(fs.readFileSync(R+'shk-data.js','utf8').replace(/const SHK_RAW/,'SHK_RAW'));
const all=RAW.concat(SHK_RAW);const S=require(__dirname+'/bilder-src.js');
const out=[];let bad=0;
for(const k in S){const [de,th]=k.split('@');const hits=all.filter(r=>r[3]===de&&(!th||r[8]===th));
 if(!hits.length){console.log('MISSING',k);bad++;continue;}
 if(hits.length>1)console.log('MULTI',k,hits.map(r=>r[12]+'/'+r[8]+'='+r[7]).join(' ; '));
 hits.forEach(r=>out.push(`${r[0]}:${JSON.stringify(S[k])} /* ${de} */`));}
fs.writeFileSync(R+'bilder.js',`/* Built-in word pictures: word id -> SVG drawing on a 120x80 grid (colours come from the app's CSS). */\nconst BILDER={\n${out.join(',\n')}\n};\n`);
console.log(out.length,'pictures,',fs.statSync(R+'bilder.js').size,'bytes');process.exit(bad?1:0);
