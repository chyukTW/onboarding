import { useEffect, useRef } from 'react';
import styled from 'styled-components'

const Wrapper = styled.div`
  height: 150vh;
  padding: 1em;
  background-color: tomato;
  display: flex;
  flex-direction: column;
  & > h1 {
    font-size: 36px;
    margin-bottom: 80vh;
  }
`;

const Box = styled.div`
  display: flex;
  align-items: center;
  padding: 5px;
  width: 50px;
  height: 50px;
  background-color: mintcream;
  margin-bottom: 5px;
`

function Box1(){
  const boxRef = useRef(null)

  useEffect(()=> {
    const box = boxRef.current;  
    const handleScroll = () => box.style.width = window.pageYOffset + 100 + 'px';
  
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [])

  return (
    <Box ref={boxRef}>
      no throttle
    </Box>
  )
}

function Box2({delay}){
  const timeRef = useRef(0);
  const boxRef = useRef(null);

  const throttle = (func, delay) => {
    if(timeRef.current) return;
    timeRef.current = setTimeout(()=> {
      func();
      timeRef.current = 0;
    }, delay)
  }
  
  useEffect(()=> {
    const box = boxRef.current;
    const handleScroll = () => box.style.width = window.pageYOffset + 100 + 'px';
    const throttleHandleScroll = () => throttle(handleScroll, delay);

    window.addEventListener('scroll', throttleHandleScroll);

    return () => window.removeEventListener('scroll', throttleHandleScroll);
  })

  return (
    <Box ref={boxRef}>
      throttle({delay})
    </Box>
  )
}

function Box3(){
  const boxRef = useRef(null)

  useEffect(()=> {
    const box = boxRef.current;
    let lastScrollY = 0;
    let isQueuing = false;
    
    const handleScroll = () => {
      if(isQueuing) return

      isQueuing = true;
      lastScrollY = window.pageYOffset;
      
      return requestAnimationFrame(()=> {
        (()=> box.style.width = lastScrollY + 100 + 'px')();
        isQueuing = false;
      })
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  })

  return (
    <Box ref={boxRef}>
      requestAnimationFrame
    </Box>
  )
}

function Scroll() {
  return (
    <Wrapper>
      <h1>Scroll the page</h1>
      <Box1 />
      <Box2 delay={300}/>
      <Box2 delay={10}/>
      <Box3 />
    </Wrapper>
  );
}

export default Scroll;
