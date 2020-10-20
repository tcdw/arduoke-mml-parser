import fs from 'fs-extra';
import minimist from 'minimist';
import path from 'path';
import SongReader from './SongReader';
import toCPPCode from './toCPPCode';

const helpContent = `Usage: disamk [OPTIONS]
Options:
-h              Display this help information and exit
-i file         (Required) Input MML file
-o dir          Output directory
-t tempo        Tempo, default is 10
-p pin          Speaker output pin, default is 7
`;

const args = minimist(process.argv.slice(2));

if (args.h || args.help) {
    process.stdout.write(helpContent);
    process.exit(0);
}
if (!args.i) {
    process.stdout.write(helpContent);
    process.exit(1);
}

const fileName = path.resolve(process.cwd(), args.i);
const out = args.o || path.parse(fileName).name;
const file = fs.readFileSync(fileName, { encoding: 'utf8' });
const song = new SongReader(file);
const result = toCPPCode(song.parse(), `${args.t}`, `${args.p}`);

fs.mkdirpSync(path.resolve(process.cwd(), out));
fs.writeFileSync(path.resolve(process.cwd(), out, `${out}.ino`), result, { encoding: 'utf8' });
