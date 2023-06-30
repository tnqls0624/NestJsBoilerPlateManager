import RESULT_CODE from './RESULT_CODE';

const RESULT_CODE_NAME: {[key: number]: string} = {};
for (const [key, value] of Object.entries(RESULT_CODE)) {
  RESULT_CODE_NAME[value] = key;
}

export default RESULT_CODE_NAME;
