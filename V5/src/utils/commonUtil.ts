import moment from 'moment-timezone';

/**
 * Resolve after given ms
 * @param ms
 */
export async function sleep(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

/**
 * Fill zeros
 * @param input
 * @param length
 * @param [reverse]
 */
export function zerofill(
  input: number,
  length: number,
  reverse?: boolean
): string {
  const inputText = String(input);
  const diff = length - inputText.length;
  if (diff > 0) {
    return reverse
      ? `${inputText}${'0'.repeat(diff)}`
      : `${'0'.repeat(diff)}${inputText}`;
  } else {
    return inputText;
  }
}

export function getPreviousGameTimes(
  times: string,
  round: number,
  gameMaxCount: number,
  limit: number
): string {
  if (round >= limit)
    return times.substring(0, 8) + zerofill(round - limit + 1, 4);
  else
    return (
      moment(times.substring(0, 8)).add(-1, 'day').format('YYYYMMDD') +
      zerofill(gameMaxCount + round - limit + 1, 4)
    );
}

export function getModuleFileName(fullFileName: string): string {
  const filenameMatch = /([^/\\]+?).(js|ts)$/.exec(fullFileName);
  return (filenameMatch && filenameMatch[1]) ?? '';
}

export default {
  sleep,
  zerofill,
  getPreviousGameTimes,
};
