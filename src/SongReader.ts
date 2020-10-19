import { SongData } from './interfaces/song-data';

type NotePitch = {
    [key: string]: number
}

const notePitch: NotePitch = {
    c: 0,
    d: 2,
    e: 4,
    f: 5,
    g: 7,
    a: 9,
    b: 11,
    r: -1,
    '^': -2,
};

class SongReader {
    static octaveMin = 0;
    static octaveMax = 7;

    text: string = '';
    pos: number = 0;
    tuning: number = 0;
    octave: number = 4;
    defaultLength: number = 8;
    data: SongData[] = [];

    char() {
        return this.text[this.pos];
    }

    next(step = 1) {
        this.pos += step;
    }

    fetchNumber(mayNegative = false) {
        let content = '';
        if (mayNegative) {
            if (this.char() === '-' || this.char() === '+') {
                content += this.char();
            }
        }
        while (this.char() >= '0' && this.char() <= '9') {
            content += this.char();
            this.next();
        }
        if (content === '') {
            return null;
        }
        return Number(content);
    }

    fetchNote() {
        const songData: SongData = {
            length: this.defaultLength,
            pitch: 0,
        };
        let abs = false;
        songData.length = this.defaultLength;
        songData.pitch = notePitch[this.char()];
        this.next();
        if (this.char() === '+' || this.char() === '-') {
            if (songData.pitch < 0) {
                throw new SyntaxError('Sharp/Flat mark can\'t be used with a tie or rest');
            }
            songData.pitch += (this.char() === '+') ? 1 : -1;
            this.next();
        }
        if (this.char() === '=') {
            abs = true;
            this.next();
        }
        const len = this.fetchNumber();
        if (len !== null) {
            if (len > 192) {
                throw new SyntaxError('Invaild note length');
            }
            if (abs) {
                songData.length = len;
            } else if (192 % len === 0) {
                songData.length = 192 / len;
            } else {
                throw new SyntaxError(`192 is not divisible by ${len}`);
            }
        }
        let oldLen = songData.length;
        while (this.char() === '.') {
            songData.length += Math.floor(oldLen / 2);
            oldLen /= 2;
            this.next();
        }
        if (songData.pitch >= 0) {
            const newPitch = this.octave * 12 + songData.pitch + this.tuning;
            if (newPitch < 0 || newPitch >= SongReader.octaveMax * 12) {
                throw new SyntaxError('Pitch out of bound');
            }
            songData.pitch = newPitch;
        }
        if (this.data.length > 0 && songData.pitch === -2) {
            this.data[this.data.length - 1].length += songData.length;
            return;
        }
        this.data.push(songData);
        // return songData;
    }

    fetchTuning() {
        this.next();
        const tuning = this.fetchNumber(true);
        if (tuning === null) {
            throw new SyntaxError('Invaild tuning value');
        }
        this.tuning = tuning;
    }

    fetchOctave() {
        this.next();
        const octave = this.fetchNumber();
        if (octave === null || (octave < SongReader.octaveMin || octave > SongReader.octaveMax)) {
            throw new SyntaxError('Invaild octave value');
        }
        this.octave = octave;
    }

    fetchOctaveStep() {
        let newOctave = this.octave;
        if (this.char() === '>') {
            newOctave += 1;
        } else if (this.char() === '<') {
            newOctave -= 1;
        }
        if (newOctave < SongReader.octaveMin && newOctave > SongReader.octaveMax) {
            throw new SyntaxError('Octave goes out of bound');
        }
        this.octave = newOctave;
        this.next();
    }

    parse() {
        while (this.pos < this.text.length - 1) {
            if (/^([a-g^r])$/g.test(this.char())) {
                this.fetchNote();
                continue;
            }
            if (this.char() === 'h') {
                this.fetchTuning();
                continue;
            }
            if (this.char() === 'o') {
                this.fetchOctave();
                continue;
            }
            if (this.char() === '<' || this.char() === '>') {
                this.fetchOctaveStep();
                continue;
            }
            if (/^\s$/g.test(this.char())) {
                this.next();
                continue;
            }
            throw new SyntaxError(`Unknown character: ${this.char()}`);
        }
        return this.data;
    }

    constructor(text: string) {
        this.pos = 0;
        this.tuning = 0;
        this.octave = 4;
        this.defaultLength = 8;
        this.data = [];
        this.text = text;
    }
}

export default SongReader;
