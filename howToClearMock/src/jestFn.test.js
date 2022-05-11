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