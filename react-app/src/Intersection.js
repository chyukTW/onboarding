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
  justify-content: center;
  margin: 20px 0;
  padding: 5px;
  width: 150px;
  height: 150px;
  background-color: skyblue;
  color: white;
`

const Target = forwardRef((_, ref) => {
  return (
    <Box ref={ref}>
      intersectionObserver
    </Box>
  )
});

function Intersection() {
  const rootRef = useRef(null);
  const targetRef = useRef(null);

  const options = {
      root: null,
      rootMargin: '0px',
      threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    }

  const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.intersectionRatio > 0){
          targetRef.current.style.transform = `rotate(${360 * entry.intersectionRatio}deg)`;
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
      <Target ref={targetRef}/>
    </Wrapper>
  );
}

export default Intersection;
