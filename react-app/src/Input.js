import { useEffect, useState } from 'react';
import styled from 'styled-components'

const Wrapper = styled.div`
  height: 150vh;
  padding: 1em;
  background-color: lavender;
  display: flex;
  flex-direction: column;
  & > input {
    margin-bottom: 1em;
  }
`;


function Input() {
  const [ textInput, setTextInput] = useState('');
  const [ 복잡한데이터, 셋복잡한데이터 ] = useState('');

  const handleChange = (value) => {
    setTextInput(value);
  };

  useEffect(()=>{
    if(textInput){
      const debounce = setTimeout(()=> {
        const 엄청복잡하고거대한함수 = (value) => '복잡한 로직으로 가공된 ' + value;
        셋복잡한데이터(엄청복잡하고거대한함수(textInput));
      }, 1000);
      return ()=> clearTimeout(debounce);
    }
  }, [textInput])
  
  return (
    <Wrapper>
      <input type="text" onChange={(e)=> handleChange(e.target.value)}/>
      <span>{복잡한데이터}</span>
    </Wrapper>
  );
}

export default Input;
