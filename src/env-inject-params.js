import traverse from 'traverse';

const envPlaceholder = /\$\{([A-z0-9_-]+)\}/u;
const envPlaceholderCleanup = /(^[^$]*)(\$\{)([A-z0-9_-]+)(\})(.*)/u;

const replaceEnvPlaceholder = path => {
  const hasEnvPlaceholder = path.match(envPlaceholder);
  if (hasEnvPlaceholder) {
    const envVariable = hasEnvPlaceholder[1];
    const value = process.env[envVariable];
    if (value === undefined || value === null) {
      throw new Error(`ENV Placeholder '${envVariable}' undefined !`);
    }
    let replaced = path.replace(envPlaceholderCleanup, `$1${value}$5`);

    if (replaced.match(envPlaceholder)) {
      replaced = replaceEnvPlaceholder(replaced);
    }

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

