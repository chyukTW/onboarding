import { forwardRef, useEffect, useRef } from 'react';
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
    
    const handleScroll = () => {
      box.style.width = window.pageYOffset + 100 + 'px';
    };

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
  const boxRef = useRef(null)

  const throttle = (func, delay) => {
    if(timeRef.current) return;
    timeRef.current = setTimeout(()=> {
      func();
      timeRef.current = 0;
    }, delay)
  }
  
  useEffect(()=> {
    const box = boxRef.current;
    
    const handleScroll = () => {
      box.style.width = window.pageYOffset + 100 + 'px';
    };

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
    let ticking = false;
    
    const handleScroll = () => {
      lastScrollY = window.pageYOffset;
      if(!ticking){
        window.requestAnimationFrame(()=> {
          (()=> box.style.width = lastScrollY + 100 + 'px')();
          ticking = false;
        })

        ticking = true;
      }
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

const Box4 = forwardRef((_, ref) => {
  return (
    <Box ref={ref}>
      intersectionObserver
    </Box>
  )
});

function Scroll() {
  const rootRef = useRef(null);
  const targetRef = useRef(null);

  const options = {
      root: null,
      rootMargin: '20px 0px',
      threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    }

  const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.intersectionRatio > 0){
          targetRef.current.style.width = 70 * entry.intersectionRatio + '%';
        }
      })
    }, options);

  useEffect(()=> {
    observer.observe(targetRef.current);
    return () => observer.disconnect();
  })

  return (
    <Wrapper ref={rootRef}>
      <h1>Scroll the page</h1>
      <Box1 />
      <Box2 delay={300}/>
      <Box2 delay={16.66}/>
      <Box3 />
      <Box4 ref={targetRef}/>
    </Wrapper>
  );
}

export default Scroll;
