import SongReader from './SongReader';
import toCPPCode from './toCPPCode';

const song = new SongReader(`
o4
r2..b16>d16
e4.e16g16a8b16r16f+8d16r16
<b2.r8b16>d16
e4.e16g16a8b16r16>d8e16r16
<b2.r8b16>d16
e4.g8f+8d16r16<b8g16r16
a8b16a16g8a16r16b4.e8
g4a8b8f+8g8a8d8
e16f+16e2^e6r12<b16>d16
e4.e16g16a8b16r16f+8d16r16
<b2.r8b16>d16
e4.e16g16a8b16r16>d8e16r16
<b2.r8b16>d16
e4.g8f+8d16r16<b8g16r16
a4>f+4e4.<b8
>c+4e8g+8f+8e16r16d+8c+2..
r8<e16f+16
g+8r4f+8b4r8g+8
f+8g+8c+4r4e8r8
d+4r8<g+8>f+4e4
d+8e16d+16c+4.r8e8f+8
g+8r4f+8b4r8>c+8
<g+8b8f+4r4d+8b8
g+1
r2.<g+4
>g+8r4f+8b4r8g+8
f+16r16f+16g+16<b4r4>c+8r8
d+4r8<g+8>f+8.e8.d+8
d+8e16d+16c+4.r4<g+8
a8>c+8g+8f+8r8b4e8
d+8<b8>f+8e4r4e16f+16
g+4r8e16f+16g+8.e8.b8
g+1
b4a16r16b8>d8r8e8d16r16
<g8r8a8r8b8r4e16f+16
g+4a16r16b8e8r8c+8e16r16
b8r8g8r8a8r4g16a16
b4a16r16b8>d8r8e8d16r16
<g8r8a8r8b8r4b16>d16
e4d8e16r16f+8g16r16f+8d16r16
<b8r8>f+8r8e8r4.
<b4a16r16b8>d8r8e8d16r16
<g8r8a8r8b8r4e16f+16
g+4a8b16r16e8r8c+8e16r16
b8r8g8r8a8r4g16a16
b4a8b16r16>d8r8e8d16r16
<g8r8a8r8b8r4b16>d16
e4f+8g8f+8d8<b8>f+8
e1`);
console.log(toCPPCode(song.parse(), 10, 7));
