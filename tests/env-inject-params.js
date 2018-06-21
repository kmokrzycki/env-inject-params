/* eslint-env jest */
/* no-template-curly-in-string */
import chai from 'chai';
import * as EnvInject from '../src/env-inject-params';
import EnvInjectObj from '../src/env-inject-params';

const { expect } = chai;
process.env.ENV_TEST = 'test_value';

describe('Make sure replaceEnvPlaceholder captures placeholders strings', () => {

  it('Placeholders on its own are recognized', async () => {
    const result = EnvInject.replaceEnvPlaceholder('${ENV_TEST}');
    const expected = 'test_value';
    expect(result).to.equal(expected);
  });

  it('Placeholders at the begining of a string are recognized', async () => {
    const result = EnvInject.replaceEnvPlaceholder('${ENV_TEST}sometestmoretext');
    const expected = 'test_valuesometestmoretext';
    expect(result).to.equal(expected);
  });

  it('Placeholders in middle of a string are recognized', async () => {
    const result = EnvInject.replaceEnvPlaceholder('sometest${ENV_TEST}moretext');
    const expected = 'sometesttest_valuemoretext';
    expect(result).to.equal(expected);
  });

  it('Placeholders at the end of a string are recognized', async () => {
    const result = EnvInject.replaceEnvPlaceholder('sometestmoretext${ENV_TEST}');
    const expected = 'sometestmoretexttest_value';
    expect(result).to.equal(expected);
  });

  it('Placeholders at the begining of a path are recognized', async () => {
    const result = EnvInject.replaceEnvPlaceholder('${ENV_TEST}/some/test/more/text');
    const expected = 'test_value/some/test/more/text';
    expect(result).to.equal(expected);
  });

  it('Placeholders in middle of the path are recognized', async () => {
    const result = EnvInject.replaceEnvPlaceholder('/some/test/${ENV_TEST}/more/text');
    const expected = '/some/test/test_value/more/text';
    expect(result).to.equal(expected);
  });

  it('Placeholders at the end of the path are recognized', async () => {
    const result = EnvInject.replaceEnvPlaceholder('/some/test/more/text/${ENV_TEST}');
    const expected = '/some/test/more/text/test_value';
    expect(result).to.equal(expected);
  });

  it('Placeholders not in ENV should throw errors', async () => {
    const throwFunction = () => {
      EnvInject.replaceEnvPlaceholder('/this/${NOT_IN_ENV}/valid/path');
    };
    expect(throwFunction).to.throw(Error, /ENV Placeholder 'NOT_IN_ENV' undefined !/);
  });
});

describe('Empty value is still accepted as long as env placeholder is defined', () => {

  process.env.EMPTY = '';
  it('Placeholders on its own are recognized', async () => {
    const result = EnvInject.replaceEnvPlaceholder('${EMPTY}');
    const expected = '';
    expect(result).to.equal(expected);
  });
  it('Placeholders on its own are recognized', async () => {
    const result = EnvInject.replaceEnvPlaceholder('/some_text_${EMPTY}_more');
    const expected = '/some_text__more';
    expect(result).to.equal(expected);
  });
});

describe('Make sure getValuesFromEnv replaces placeholders in complex objects', () => {
  it('Placeholders in objects should be replaced', async () => {
    const result = EnvInject.default.getValuesFromEnv(
      {
        short: '${ENV_TEST}',
        long: '/test/${ENV_TEST}/value',
        two: 2,
      },
    );
    const expected = '/some/test/more/text/test_value';
    expect(result).to.deep.equal({
      long: "/test/test_value/value",
      short: "test_value",
      two: 2,
    });
  });

  it('Placeholders not in ENV should throw errors', async () => {
    const throwFunction = () => {
      EnvInjectObj.getValuesFromEnv(
        {
          one: '${NOT_IN_ENV}',
          two: 2,
        },
      );
    };
    expect(throwFunction).to.throw(Error, /ENV Placeholder 'NOT_IN_ENV' undefined !/);
  });
});
