import { SongData } from './interfaces/song-data';

function toCPPCode(data: SongData[], tempo: number, pin: number | string) {
    let code = `#include <NewTone.h>

uint8_t TEMPO = ${tempo};
int8_t accidental = 0;
int8_t PIN = ${pin};

uint16_t PITCH[] = {
  33, 35, 37, 39, 41, 44, 46, 49, 52,
  55, 58, 62, 65, 69, 73, 78, 82,
  87, 93, 98, 104, 110, 117, 123, 131,
  139, 147, 156, 165, 175, 185, 196, 208,
  220, 233, 247, 262, 277, 294, 311, 330,
  349, 370, 392, 415, 440, 466, 494, 523,
  554, 587, 622, 659, 698, 740, 784, 831,
  880, 932, 988, 1047, 1109, 1175, 1245, 1319,
  1397, 1480, 1568, 1661, 1760, 1865, 1976, 2093,
  2217, 2349, 2489, 2637, 2794, 2960, 3136, 3322,
  3520, 3729, 3951, 4186, 4435, 4699, 4978,
};

const PROGMEM uint16_t MML[] = {\n`;
    data.forEach((e, i) => {
        if (e.pitch === -1) {
            code += `  1, 0, 3, ${e.length}`;
        } else {
            code += `  0, ${e.pitch}, 3, ${e.length}`;
        }
        if (i < data.length - 1) {
            code += ',\n';
        }
    });
    code += `};

uint8_t extendRest = 0;

void setup() {
  Serial.begin(9600);
}

uint16_t i = 0;

void loop() {
  uint16_t cmd = pgm_read_byte_near(MML + (i * 2));
  uint16_t param = pgm_read_byte_near(MML + (i * 2 + 1));
  Serial.print(cmd);
  Serial.print(", ");
  Serial.print(param);
  Serial.print("\\n");
  switch (cmd) {
    case 0:
      // 发声
      noNewTone(PIN);
      NewTone(PIN, PITCH[param + accidental]);
      // Serial.print("Playing tone ");
      // Serial.print(i);
      // Serial.print("!\\n");
      i++;
      break;
    case 1:
      // 停止发声（休止符）
      noNewTone(PIN);
      i++;
      break;
    case 3:
      // 等待
      extendRest = param;
      delay(param * TEMPO);
      i++;
      break;
    case 4:
      i++;
      break;
    case 255:
      i = param;
      break;
    default:
      i = 0;
      break;
  }
}
`;
    return code;
}

export default toCPPCode;
