# Mock 정리하기

## mockClear / mockReset 비교해보기

- jest.fn()메서드로 생성한 mock함수는 호출되었을 때의 매개변수, 호출 결과 등 여러 정보가 포함된 mock객체를 포함
- 여러 테스트에서 활용하는 가짜 함수의 mock객체를 정리해주어 독립적인 테스트 케이스를 작성할 수 있음
- mockClear는 mock객체를 초기화
- mockReset은 mock객체 뿐만 아니라 함수의 구현까지 초기화, 만약 특정 값을 리턴하도록 구현했다면, mockReset 이후에는 undefined를 리턴함

```jsx
// only.test.js

describe('mockClear는', ()=> {
  const mockFunction = jest.fn().mockReturnValue('Hello');
  
  beforeEach(()=>{
    mockFunction.mockClear();
  })
  
  it('테스트 케이스 실행 전에 mock객체를 정리해 줌', () => {
    mockFunction('first-call');
    expect(mockFunction).toHaveBeenCalledWith('first-call');
    expect(mockFunction).toHaveBeenCalledTimes(1);
    expect(mockFunction()).toEqual('Hello');
    // console.log(mockFunction.mock);
    // log result
    // {
    //   calls: [ [ 'first-call' ], [] ],
    //   contexts: [ undefined, undefined ],
    //   instances: [ undefined, undefined ],
    //   invocationCallOrder: [ 5, 6 ],
    //   results: [
    //     { type: 'return', value: 'Hello' },
    //     { type: 'return', value: 'Hello' }
    //   ],
    //   lastCall: []
    // }
  });
  
  it('함수의 구현은 그대로 남아있음 -> Hello 리턴', () => {
    // console.log(mockFunction.mock);
    // log result
    // {
    //   calls: [],
    //   contexts: [],
    //   instances: [],
    //   invocationCallOrder: [],
    //   results: []
    // }
    mockFunction('second-call');
    expect(mockFunction).toHaveBeenCalledWith('second-call');
    expect(mockFunction).toHaveBeenCalledTimes(1);
    expect(mockFunction()).toEqual('Hello');
  });
});

describe('mockReset은', ()=>{
  const mockFunction = jest.fn().mockReturnValue('Hello');
  
  // beforeEach에서 afterEach로 변경
  afterEach(()=>{
    mockFunction.mockReset();
  });
  
  it('첫 번째 호출 이후에', () => {
    mockFunction('first-call');
    expect(mockFunction).toHaveBeenCalledWith('first-call');
    expect(mockFunction).toHaveBeenCalledTimes(1);
    expect(mockFunction()).toEqual('Hello');
    // console.log(mockFunction.mock);
    // log result
    // {
    //   calls: [ [ 'first-call' ], [] ],
    //   contexts: [ undefined, undefined ],
    //   instances: [ undefined, undefined ],
    //   invocationCallOrder: [ 5, 6 ],
    //   results: [
    //     { type: 'return', value: 'Hello' },
    //     { type: 'return', value: 'Hello' }
    //   ],
    //   lastCall: []
    // }
  });
  
  it('mock 객체 뿐만 아니라 함수의 구현을 통째로 정리함 -> undefined 리턴', () => {
    // console.log(mockFunction.mock);
    // log result
    // {
    //   calls: [],
    //   contexts: [],
    //   instances: [],
    //   invocationCallOrder: [],
    //   results: []
    // }
    mockFunction('second-call');
    expect(mockFunction).toHaveBeenCalledWith('second-call');
    expect(mockFunction).toHaveBeenCalledTimes(1);
    expect(mockFunction()).toBeUndefined();
  });
})
```

## 테스트 전후에 mock 정리하기 

beforeEach, beforeAll, afterEach, afterAll 등을 활용할 수 있음

```jsx
// only.test.js

describe('mock을 정리하지 않은 경우', ()=>{
  const mockFunction = jest.fn();

  it('첫번째 호출', () => {
    mockFunction('first-call');
    expect(mockFunction).toHaveBeenCalledWith('first-call');
    expect(mockFunction).toHaveBeenCalledTimes(1);
  });
  
  // 아래와 같이 다음 테스트 케이스에도 영향을 미침

  it('두번째 호출', () => {
    mockFunction('second-call');
    expect(mockFunction).toHaveBeenCalledWith('second-call');
    expect(mockFunction).toHaveBeenCalledTimes(2);
  });
})

describe('mock을 정리한 경우', ()=>{
  const mockFunction = jest.fn();
  
  beforeEach(()=>{
    mockFunction.mockClear();
  })

  it('첫번째 호출', () => {
    mockFunction('first-call');
    expect(mockFunction).toHaveBeenCalledWith('first-call');
    expect(mockFunction).toHaveBeenCalledTimes(1);
  });
  
  it('두번째 호출이지만 한 번 호출된 것으로 나옴', () => {
    mockFunction('second-call');
    expect(mockFunction).toHaveBeenCalledWith('second-call');
    expect(mockFunction).toHaveBeenCalledTimes(1);
  });
})
```

## 자동으로 정리하기

- jest.config.js 설정 변경을 통해 자동으로 mock을 정리할 수 있음
- 기본 값은 모두 false

```jsx
// jest.config.js
// restore에 clear, reset이 포함되어서 restoreMocks만 설정

module.exports = {
//	clearMocks: true,
//  resetMocks: true,
	restoreMocks: true,
};
```

## Creat-React-App 참고

- CRA로 생성된 앱은 resetMocks의 기본 값이 true로 설정되어 있음(restoreMocks가 아님에 주의) 

참고: [https://github.com/facebook/create-react-app/blob/main/packages/react-scripts/scripts/utils/createJestConfig.js](https://github.com/facebook/create-react-app/blob/main/packages/react-scripts/scripts/utils/createJestConfig.js)

- 만약 아래처럼 테스트 밖에서 함수를 mocking하여 특정 값을 리턴하도록 한다면, 테스트 케이스 실행 전에 모두 리셋되어 이를 활용할 수 없음

```jsx
describe('mock을 정리하지 않은 경우', () => {
  const mockFunction = jest.fn().mockReturnValue('result');

  it('첫번째 호출', () => {
    mockFunction('first-call');
    expect(mockFunction).toHaveBeenCalledWith('first-call');
    expect(mockFunction).toHaveBeenCalledTimes(1);
    expect(mockFunction()).toBeUndefined();
  });

  // mockImplementation 활용하는 것을 추천

  it('두번째 호출', () => {
    mockFunction.mockImplementation(() => 'new result');
    mockFunction('second-call');
    expect(mockFunction).toHaveBeenCalledWith('second-call');
    expect(mockFunction).toHaveBeenCalledTimes(1);
    expect(mockFunction()).toEqual('new result');
  });
});
```

- 옵션을 false로 되돌리고 싶다면
```jsx
// package.json

{
  // ...
  "jest": {
    "resetMocks": false
  }
}
```

## mockRestore

- mockRestore는 mockReset이 하는 모든 기능을 포함하고 함수의 구현을 실제 함수의 구현으로 되돌려 놓음(단, spyOn으로 생성된 함수에 한해서만)
- 만약 jest.fn()으로 mocking한 함수를 mockRestore한다면 jest.fn()의 기본 리턴 값인 undefined를 리턴함

spy 예시

```jsx
// spy.test.js

import * as example from './example';

describe('example spy', () => {
  it('clear/reset/restore 비교', () => {
    const spy = jest.spyOn(example, 'originalFunction');

    spy.mockImplementation(() => 'mocked value');

    expect(example.originalFunction()).toEqual('mocked value');
    expect(spy).toHaveBeenCalledTimes(1);

    spy.mockClear();

    // after clear
    expect(example.originalFunction()).toEqual('mocked value');
    expect(spy).toHaveBeenCalledTimes(1);

    spy.mockReset();

    // after reset
    expect(example.originalFunction()).toBeUndefined();
    expect(spy).toHaveBeenCalledTimes(1);

    spy.mockRestore();

    // after restore
    expect(example.originalFunction()).toEqual("original value");
    expect(spy).toHaveBeenCalledTimes(0);
  });
});
```

jest.fn() 예시

```jsx
// jestFn.test.js

import * as example from './example';

const mockedFunction = jest.fn().mockReturnValue('mocked value');

jest.mock('./example', () => ({
  __esModule: true,
  originalFunction: () => mockedFunction(),
}));

describe('mocked example', () => {
  it('clear/reset/restore 비교', () => {
    expect(example.originalFunction()).toEqual('mocked value');
    expect(mockedFunction).toHaveBeenCalledTimes(1);

    mockedFunction.mockClear();
    // after clear
    expect(example.originalFunction()).toEqual('mocked value');
    expect(mockedFunction).toHaveBeenCalledTimes(1);

    mockedFunction.mockRestore();
    // after restore
    // spy와 달리 원본 함수의 리턴 값이 아닌 jest.fn()의 기본 값인 undefined을 리턴하도록 복구
    expect(example.originalFunction()).toBeUndefined();
    expect(mockedFunction).toHaveBeenCalledTimes(1);
    
    mockedFunction.mockClear();
    // reset 테스트를 위해 구현 복구하기
    mockedFunction.mockImplementation(()=> 'mocked value');
    expect(example.originalFunction()).toEqual('mocked value');
    expect(mockedFunction).toHaveBeenCalledTimes(1);

    mockedFunction.mockReset();
    // after reset
    expect(example.originalFunction()).toBeUndefined();
    expect(mockedFunction).toHaveBeenCalledTimes(1);
  });
});
```
