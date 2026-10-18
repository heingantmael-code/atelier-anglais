const fs = require("fs"), path = require("path"), vm = require("vm");
const dir = process.argv[2];
const ctx = {}; vm.createContext(ctx);
const code = ["rules.js", "vocab.js", "texts.js", "data.js", "content2.js", "speech.js", "tr1.js", "bank1.js", "bank2.js", "bank3.js"].map(f => fs.readFileSync(path.join(dir, f), "utf8")).join("\n;\n")
  + "\n;globalThis.__list = collectSpeech();";
vm.runInContext(code.replace(/^const /gm, "var "), ctx);
const list = ctx.__list;
fs.writeFileSync(path.join(dir, "speech_list.json"), JSON.stringify(list));
const groups = {}; list.forEach(x => groups[x.group] = (groups[x.group] || 0) + 1);
console.log(list.length, "clips,", Object.keys(groups).length, "paquets,", list.reduce((a, x) => a + x.text.length, 0), "caractères");
