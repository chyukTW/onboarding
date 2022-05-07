import { sayHello } from './exam1';

descrbie('exam1', ()=> {
  it('does sth', ()=>{
    expect(sayHello()).toBe('Hello');
  })
})