# About Mocking


## About Mocking

Jest는 자바스크립트 테스팅 프레임워크로 간단한 설정만으로도 테스트를 실행할 수 있다. 또한 풍부한 matcher를 제공하고 다른 라이브러리를 설치할 필요없이 Mocking할 수 있는 기능을 제공한다. Mocking이란 특정 함수의 실제 구현을 가짜로 대체하는 기법을 말하며, 주로 테스트하려는 코드가 의존하고 있는 외부 모듈이나 함수등을 가짜로 구현하고자 할 때 사용한다. 가짜 객체를 이용함으로써 외부와의 의존 관계를 끊고 독립적인 테스트를 작성할 수 있게 된다. 만약 의존하고 있는 실제 코드를 사용하여 테스트를 작성하게 되면 특정 기능만 분리하여 테스트하겠다는 단위 테스트의 목적에도 부합하지 않게 된다. mocking을 이용하면 더 가볍고 빠르고, 항상 동일한 결과를 내는 테스트를 작성할 수 있다.


## Jest.fn()

__jest.fn()__으로 간단하게 가짜 함수를 생성할 수 있다.

```jsx
const plus = jest.fn();

describe('target', () => {
  it('returns a + b', () => {
    expect(plus(1, 2)).toBeUndefined();
  });
});

// 결과: PASS
// 리턴 값을 정해주지 않으면 undefined를 리턴한다.
```


__jest.fn(callback)__

: 인자로 콜백을 넣어 원하는 값을 리턴하게 하거나

```jsx
const plus = jest.fn((a, b) => a + b);

describe('target', () => {
  it('returns a + b', () => {
    expect(plus(1, 2)).toBe(3);
  });
});

// 결과: PASS
```


__jest.fn().mockReturnValue(value)__

: 지정된 값을 리턴하도록 할 수 있음

```jsx
const plus = jest.fn().mockReturnValue(3);

describe('target', () => {
  it('returns a + b', () => {
    expect(plus(1, 2)).toBe(3);
  });
});

// 결과: PASS
```


__jest.fn().mockReturnValueOnce(value)__

: 호출할 때마다 다른 결과를 리턴하는 것도 가능

```jsx

const saySomething = jest.fn();

describe('target', () => {
  it('returns something', () => {
    console.log(saySomething()); // undefined

    saySomething
			.mockReturnValueOnce('a')
			.mockReturnValueOnce('b')
			.mockReturnValue('default');

    expect(saySomething()).toBe('a');
    expect(saySomething()).toBe('b');
    expect(saySomething()).toBe('default');
  });
});

// 결과: PASS
```


__jest.fn().mockImplementation(fn)__

: 함수를 즉석에서 통째로 재구현하는 방법으로 케이스마다 다른 가짜 결과를 이용해야 할 때 유용함

```jsx
import * authUtil from './utils/authUtil';

jest.mock('./utils/authUtil');

it('로그아웃 상태라면, 로그인 텍스트를 보여준다.', () => {
  authUtil.getToken.mockImplementation(()=> null);

  const { container } = render((
    <App />
  ));

  expect(container).toHaveTextContent('로그인');
});

it('로그인 상태라면, 로그아웃 텍스트를 보여준다.', () => {
  authUtil.getToken.mockImplementation(()=> 'MOCK_TOKEN');

  const { container } = render((
    <App />
  ));

  expect(container).toHaveTextContent('로그아웃');
});
```


__jest.fn().mockResolvedValue() / jest.fn().mockRejectedValue()__

: 프라미스 객체 리턴할 때 사용

```jsx
test('async test', async () => {
  const asyncMock = jest
    .fn()
    .mockResolvedValueOnce('first call')
    .mockRejectedValueOnce(new Error('Async error message'));

  await asyncMock(); // 'first call'
  await asyncMock(); // throws 'Async error message'
});
```


## 비동기 함수 mocking

비동기 로직은 아래와 같이 테스트할 수 있다.

```jsx
import axios from 'axios';

export function getAdvice() {
  return axios.get('https://api.adviceslip.com/advice');
};
```

```jsx
it('returns random advice', async () => {
    const result = await getAdvice();

    expect(result.status).toBe(200);
    expect(result.data.slip.advice).not.toHaveLength(0);
  });
```

이 밖에도 Jest는 비동기 로직을 테스트할 수 있는 여러 방법을 제공하고 있다. (아래 공식문서 링크 참고)

[https://jestjs.io/docs/asynchronous](https://jestjs.io/docs/asynchronous)


그러나 만약 실제 API를 검증하기 위한 테스트가 아니라면, 테스트가 돌아갈 때마다 서버에 불필요한 요청을 하게 된다.
비동기 로직이 관심사가 아니라면 이를 mocking하여 관심있는 부분만 독립적으로 테스트할 수 있다.

```jsx
// target.test.js

import axios from 'axios'; // 1. import axios

import { getAdvice } from './target';

jest.mock('axios'); // 2. mock axios

const mockResponse = { // 3. makes mocked response
  status: 200,
  data: {
    slip: {
      advice: 'hahaha',
    },
  },
};

// axios.get 가짜로 구현
// axios.get.mockResolvedValue(mockResponse)로 대체 가능
axios.get.mockImplementation(() => Promise.resolve(mockResponse));

describe('target', () => {
	// ...

  it('returns random advice', async () => {
    const result = await getAdvice();

    expect(result.status).toBe(200);
    expect(result.data.slip.advice).not.toHaveLength(0);
  });
});

// 결과: PASS
```


## 모듈 모킹

만약 이런 코드가 있다면,

```jsx
// examUtil.js

export const getA = () => 'a';
export const getB = () => 'b';
export const getC = () => 'c';
export const getD = () => 'd';
```

아래와 같이 테스트할 수 있다.

```jsx
// examUtil.test.js

import * as examUtil from './examUtil';

describe('examUtil', () => {
  it('returns "a"', () => {
    expect(examUtil.getA()).toBe('a');
  });

  it('returns "b"', () => {
    expect(examUtil.getB()).toBe('b');
  });

  it('returns "c"', () => {
    expect(examUtil.getC()).toBe('c');
  });

  it('returns "d"', () => {
    expect(examUtil.getD()).toBe('d');
  });
});

// 결과: PASS
```


__jest.mock(moduleName)__로 모듈 전체를 모킹할 수 있음

: 이름이 아닌 파일 경로에서 import해주고 있다면 파일 경로를 똑같이 넣어주면 됨

```jsx
jest.mock('./examUtil');
```


리턴 값을 정해주지 않으면 undefined를 리턴함

```jsx
import * as examUtil from './examUtil';

jest.mock('./examUtil');

describe('examUtil', () => {
	console.log(examUtil.getA()); // undefined
	console.log(examUtil.getB()); // undefined
	console.log(examUtil.getC()); // undefined
	console.log(examUtil.getD()); // undefined

  it('returns "a"', () => {
    expect(examUtil.getA()).toBe('a');
  });

  it('returns "b"', () => {
    expect(examUtil.getB()).toBe('b');
  });

  it('returns "c"', () => {
    expect(examUtil.getC()).toBe('c');
  });

  it('returns "d"', () => {
    expect(examUtil.getD()).toBe('d');
  });
});

// 결과: FAIL
```


__jest.requireActual(moduleName)__

: jest.requireActual() 사용하면 실제 모듈을 불러올 수 있는데, 스프레드 연산자를 함께 사용한다면 모킹한 전체 모듈 중 일부는 가짜 값을 리턴하도록 하고, 나머지는 실제 모듈을 이용할 수 있음

```jsx
import * as examUtil from './examUtil';

jest.mock('./examUtil', () => {
  return {
    ...jest.requireActual('./examUtil'),
  };
});

describe('examUtil', () => {
  it('returns "a"', () => {
    expect(examUtil.getA()).toBe('a');
  });

  it('returns "b"', () => {
    expect(examUtil.getB()).toBe('b');
  });

  it('returns "c"', () => {
    expect(examUtil.getC()).toBe('c');
  });

  it('returns "d"', () => {
    expect(examUtil.getD()).toBe('d');
  });
});

// 결과: PASS
```


만약 함수 getA()가 다른 값을 리턴하도록 모킹해주고 싶다면,

```jsx
jest.mock('./examUtil', () => {
  return {
    ...jest.requireActual('./examUtil'),
    getA: jest.fn(),
  };
});

describe('examUtil', () => {
  it('returns "a"', () => {
		examUtil.getA.mockImplementation(() => 'Z');

	  console.log(examUtil.getA()); // Z

    expect(examUtil.getA()).toBe('Z');
  });

	// ...
});

// 결과: PASS
```


__spy.on(object, methodName)__

: 만약 실제 구현을 대체하지 않고, 함수의 호출 여부나 어떻게 호출되었는지만을 알고 싶다면 스파이를 붙일 수 있다. 기본적으로 실제 구현을 따라가지만, 필요에 따라 특정 구현을 mocking하고 다시 복원시키는 것도 가능함

```jsx
import * as examUtil from './examUtil';

describe('examUtil', () => {
  it('returns "a"', () => {
    const mockFnA = jest.spyOn(examUtil, 'getA');

    expect(examUtil.getA()).toStrictEqual('a');

    expect(mockFnA).toHaveBeenCalled();
  });

  it('returns "b"', () => {
    const mockFnB = jest.spyOn(examUtil, 'getB');

    expect(examUtil.getB()).toStrictEqual('b');

    expect(mockFnB).toHaveBeenCalled();
  });
});

// 결과: PASS
```


__함수 모킹했다가 다시 복원시키기__

: 유연한 방식으로 mocking 가능, afterAll() 등을 불필요하게 사용하지 않아도 됨

```jsx
import * as examUtil from './examUtil';

describe('examUtil', () => {
  it('returns "a"', () => {
    const mockFn = jest.spyOn(examUtil, 'getA');

    mockFn.mockImplementation(() => 'mocked value');

    expect(examUtil.getA()).toStrictEqual('mocked value');

    expect(mockFn).toHaveBeenCalled();

    mockFn.mockRestore();

    expect(examUtil.getA()).toStrictEqual('a');
  });

	// ...
});
```
