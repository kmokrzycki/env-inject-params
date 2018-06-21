import traverse from 'traverse';

const envPlaceholder = /\$\{([\w]+)\}/u;
const envPlaceholderCleanup = /(^[^$]*)(\$\{)([\w]+)(\})(.*)/u;

const replaceEnvPlaceholder = path => {
  const hasEnvPlaceholder = path.match(envPlaceholder);
  if (hasEnvPlaceholder) {
    const envVariable = hasEnvPlaceholder[1];
    const value = process.env[envVariable];
    if (value === undefined || value === null) {
      throw new Error(`ENV Placeholder '${envVariable}' undefined !`);
    }
    const replaced = path.replace(envPlaceholderCleanup, `$1${value}$5`);
    return replaced;
  }
  return path;
};

export default {
  getValuesFromEnv(data) {
    return traverse(data).map(element => {
      if (typeof element === 'string') {
        return replaceEnvPlaceholder(element);
      }
      return element;
    });
  },
};

export { replaceEnvPlaceholder };

