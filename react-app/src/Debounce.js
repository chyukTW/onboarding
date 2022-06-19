import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components'

const Wrapper = styled.div`
  height: fit-content;
  min-height: 100vh;
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
const DataUnit = ({id}) => {
  return (
    <Box>
      DATA UNIT {id + 1}
    </Box>
  )
};

function Intersection() {
  const ref = useRef(null);
  const timer = useRef(null)
  const [data, setData] = useState([]);

  const debounce = (fn, delay) => {
    return (...args) => {
      if(timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(()=> fn(...args), delay);
    }
  }
  
  const handleScroll = () => {
    const target = ref.current;
    if(!target) return 

    const isEndpoint = window.scrollY + window.innerHeight >= target.offsetHeight;
    
    if (isEndpoint) setData(prev => {
      return [...prev, new Date()]
    });
  }

  useEffect(()=> { 
    window.addEventListener('scroll', debounce(handleScroll, 1000))    
    return () => window.removeEventListener('scroll', debounce(handleScroll, 1000))
  }, [data])

  return (
    <Wrapper ref={ref}>
      <h1>무한스크롤 with Debounce</h1>
      <div>
        {data && data.map((_, i)=> {
          return <DataUnit key={i} id={i}/>
        })}
      </div>
    </Wrapper>    
  );
}

export default Intersection;
