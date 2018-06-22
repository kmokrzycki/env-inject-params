# env-inject-params

Module allows to replace placeholders of object/structure with values from System Environment.

This module is commonly used with Config generation that will make you application deployment simpler as well as independent from deployment environment.

## Install
```bash
npm install env-inject-params --save
```

## Usage
```javascript
import envInjectParams from 'env-inject-params';
```

### Putting **Parameter Store** data into data structure

Export value into environment e.g. bash:
```
export SERVICE_NAME='MySuperApp'
```


Prepare object with placeholder (environment variable name wrapped with **${}** ):

```javascript
    const data = {
        path: '/application/${SERVICE_NAME}',
        enabled: true,
    }
```

Using the module:
```javascript
    const dataWithValue = envInjectParams.getValuesFromEnv(data);
    console.log(dataWithValue);
```

should print you data structure as below:
```javascript
    {
        path: '/application/MySuperApp',
        enabled: true
    }
```

If given placeholder is not defined in environment exception is thrown:

```javascript
    const data = {
        path: '/application/${NO_SUCH_THING}',
        enabled: true,
    }
```
 Error thrown:
 ```
 Error: 'ENV Placeholder 'NO_SUCH_THING' undefined !'
 ```
