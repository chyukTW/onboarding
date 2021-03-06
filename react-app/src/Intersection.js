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
const FetchMore = ({ setData }) => {
  const fetchMoreTrigger = useRef(null);
  
  useEffect(() => {
    const fetchMoreObserver = new IntersectionObserver(([{ isIntersecting }]) => {
      if (!isIntersecting) return
      setData();
    });

    fetchMoreObserver.observe(fetchMoreTrigger.current);

    return () => fetchMoreObserver.disconnect();
  }, [setData]);

  return (
    <div
      ref={fetchMoreTrigger}
    />
  );
};


const DataUnit = ({id}) => {
  return (
    <Box>
      DATA UNIT {id + 1}
    </Box>
  )
};

function Intersection() {
  const [data, setData] = useState([]);

  const handleData = () => setData(prev => ([...prev, new Date()]));

  return (
    <Wrapper>
      <h1>무한스크롤 with IntersectionObserver</h1>
      <div>
        {data && data.map((_, i)=> {
          return <DataUnit key={i} id={i}/>
        })}
      </div>
      <FetchMore setData={handleData}/>
    </Wrapper>    
  );
}

export default Intersection;
