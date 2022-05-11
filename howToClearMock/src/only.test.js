
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

describe('mockClear는', ()=>{
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
