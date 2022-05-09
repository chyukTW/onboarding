import express from 'express';
import cors from 'cors';

const app = express();

const PORT = 4000;
const TIMEOUT = 20000;

const fakeEventTiming = () => Math.floor(Math.random() * 100);

let connections = [];
let tick = 0;
let limit = fakeEventTiming();

app.get('/subscribe', cors(), (req, res, next) => {
  connections.push({
    res,
    exp: new Date().getTime() + TIMEOUT,
  });
})

setInterval(()=>{
  console.log(tick);

  if(++tick > limit){
    connections.forEach(({res}) => {
      res.write('Completed\n');
      res.end();
    })
    connections = [];
    tick = 0;    
    limit = fakeEventTiming();
  }

  connections.forEach(({res, exp}, i)=> {
    const time = new Date().getTime();

    if (time > exp){
      res.sendStatus(502);
      
      connections = [
        ...connections.slice(0, i),
        ...connections.slice(i + 1)
      ];

      limit = fakeEventTiming();

      return;
    }
  });
}, 1000)

app.listen(PORT, ()=> {
  console.log(`server is listening at localhost:${PORT}`);
})