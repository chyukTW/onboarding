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