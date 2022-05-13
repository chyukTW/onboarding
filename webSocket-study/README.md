# 웹 소켓  

웹 소켓 프로토콜은 클라이언트와 서버 간에 양방향으로 통신할 수 있는 방법을 제공한다. HTTP 프로토콜은 클라이언트가 요청을 보내면 서버가 응답하는 방식의 단방향 통신을 한다. 서버는 클라이언트에 먼저 연결을 요청할 수 없고 클라이언트가 요청하지 않은 데이터를 보낼 수 없다. 이런 방식으로 통신하는 전통적인 서버/클라이언트 모델에서는 실시간 어플리케이션을 구현하는 것이 쉽지 않았다. 과거에는 클라이언트와 서버 간의 연결을 유지하기 위해(것처럼 보이기 위해) polling, long-polling과 같은 여러 통신 방식을 사용해왔다.
<br />

## Polling

Polling은 주기적으로 서버에 요청을 보내서 일정한 간격의 응답을 받는 방식이다. 서버와 클라이언트의 구현이 비교적 쉽고 요청의 크기가 작거나 빈번한 업데이트가 요구되지 않는 상황이라면 괜찮은 방법이 될 수도 있다. 그러나 실시간 어플리케이션으로 작동하는 것처럼 구현해야 하는 상황이라면 더 잦은 요청과 응답이 수행되어야 한다. 그 과정에서 전송할 데이터가 없음에도 요청과 응답의 왕복을 강제하기 때문에 불필요한 비용이 발생할 수 있다. 빈번한 업데이트가 요구되거나 요청의 크기가 상당히 크다면 서버 또는 네트워크에 부담을 줄 수 있다. 반대로 폴링의 주기가 너무 길다면 업데이트 지연이 발생할 수 있다.

예시

```jsx
const poll = async ({ fn, validate, interval, maxAttempts }) => {
  let attempts = 0;

  const executePoll = async (resolve, reject) => {
    const result = await fn();
    attempts++;

    if (validate(result)) {
      return resolve(result);
    } else if (maxAttempts && attempts === maxAttempts) {
      return reject(new Error('Exceeded max attempts'));
    } else {
      setTimeout(executePoll, interval, resolve, reject);
    }
  };

  return new Promise(executePoll);
};
```

[https://levelup.gitconnected.com/polling-in-javascript-ab2d6378705a](https://levelup.gitconnected.com/polling-in-javascript-ab2d6378705a)  
<br />

## Long Polling

Long Polling은 이전 방식의 단점을 보완하기 위해 고안된 방식이다. 서버와 클라이언트 간에 지연 발생과 프로세싱/네트워크의 사용을 최소화하는 데 그 목적이 있다. 이 방식에서 서버는 특정한 이벤트가 발생하거나, 특정 상태 혹은 타임 아웃이 발생했을 때에만 응답한다. 서버로부터 응답을 받은 클라이언트는 즉각적으로 새로운 long poll request를 보내기 때문에 거의 항상 연결이 유지될 수 있고 사실상 실시간으로 통신하는 어플리케이션을 구현할 수 있다. 기존의 polling 방식에 비해 불필요한 요청과 응답의 수를 줄일 수 있다는 장점이 있다. 그러나 빈번한 업데이트가 필요한 경우라면 기존 방식보다 서버 또는 네트워크에 더 큰 부담을 줄 수도 있다.

클라 예시

```jsx
const subscribe = async () => {
	const response = await fetch('http://localhost:4000/subscribe');

      if(response.status === 502) {
        console.log('TIMEOUT');
        console.log('reconnecting...');
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await subscribe();
        return;
      };
      
      if(response.status !== 200) {
        console.log('FAIL');
        console.log('reconnecting...');
        await subscribe();
        return;
      };

      const data = await response.text();

      console.log(data);

      console.log('SUCCESS');
      console.log('reconnecting...');

      await subscribe();
};

subscribe();
```

참고: [https://ko.javascript.info/long-polling#ref-6396](https://ko.javascript.info/long-polling#ref-6396)

서버 예시

```jsx
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
```
<br />

## Streaming

클라이언트의 요청에 대한 응답을 완료하지 않은 상태에서 데이터를 계속 내려받는 방식. 응답을 받으면 다시 연결 요청을 하는 Long-polling과는 달리, 연결을 유지한 상태에서 서버의 데이터를 전송받기 때문에 연결을 맺는 과정에서 발생하는 부담이 줄어든다. 연결이 유지된 상태에서 서버로부터 데이터를 받는 경우에 유리한 방식이다. 거의 단방향 통신이라고 할 수 있어 클라이언트의 데이터 전송이 요구되는 경우에는 적합하지 않다.  
<br />

## WebSocket

웹소켓 프로토콜은 양방향 통신을 위한 단일 TCP 연결 방식을 제공한다. 이를 통해 서버와 브라우저 간 연결을 유지한 상태로 서로 간에 데이터를 교환할 수 있다. 데이터 전송은 추가적인 HTTP 요청이 필요하지 않고 기존의 80, 443 포트로 접속한다는 특징이 있다.

웹소켓 프로토콜은 handshake 및 데이터 전송, 이렇게 두 과정으로 구분됨  
<br />

**핸드셰이크**

- 웹소켓을 생성하면 즉시 연결이 시작된다.
- 웹소켓 프로토콜을 위한 클라이언트의 첫 요청은 HTTP 프로토콜 상에서 전송된다. 요청 헤더는 아래와 같다.

![image](https://user-images.githubusercontent.com/103919739/167349804-ff0a8262-d96f-413a-b1f0-10b8fdcf284a.png)  


- Origin - 서버는 클라이언트 오리진을 보고 소켓 통신의 여부 결정
- Connection: Upgrade - 프로토콜의 변경 요청
- Upgrade: websocket - 변경하고자 하는 프로토콜은 웹소켓임을 명시
- Sec-WebSocket-Key - 보안을 위해 브라우저에서 생성한 키
- Sec-WebSocket-Version - 프로토콜 버젼
- Sec-WebSocket-Protocol - 웹소켓에서 지원하는 서브 프로토콜 명시

(서브 프로토콜은 데이터 정보에 관한 통신의 종류를 나타낸 것으로, 하나의 여러 개의 서브 프로토콜을 구현할 수 있도록 해준다.)

- 최초 요청을 받은 서버는 이에 동의하면, 상태 코드 101이 담긴 응답을 전송
    
![image](https://user-images.githubusercontent.com/103919739/167349853-ece40d0e-c214-4913-b7b2-5c81c59f0919.png)  

    
- 브라우저는 서버에서 생성한 Sec-WebSocket-Accept 값을 확인하여 자신이 보낸 요청에 대한 응답인지 확인
<br />

**데이터 전송**

- 핸드셰이크가 끝나면 프로토콜이 웹소켓으로 전환되고 데이터 전송 시작
- 웹소켓 통신은 frame이라는 데이터 조각을 사용해 이뤄진다.
- 참고로 WebSocket.send() 메서드는 텍스트나 바이너리 데이터만 전송 가능  
<br />


## SSE(Server Sent Event)

SSE는 서버가 비동기적인 방식으로 클라이언트에 데이터를 전송할 수 있는 메커니즘이다. 사용자가 항상 최신의 정보를 유지해야 하는 환경에서 사용하기에 좋다. SSE는 polling(short, long)과 streaming을 모두 지원한다. 연결을 항상 유지하고 만약 끊어지는 경우 자동으로 다시 연결을 시도한다. 웹 소켓과는 달리 단방향 통신을 수행하며 별도의 프로토콜을 사용하지 않고 HTTP을 그대로 사용한다. 대신 HTTP의 body를 특정 포맷으로 작성해야 하고, Content-Type에 application/event-stream을 명시해줘야 한다. HTTP의 버젼에 따라 최대 동시 접속 수가 달라지는데, 1의 경우 6개, 2, 3의 경우 100개의 연결이 동시에 가능하다. SSE는 단방향으로 구현되는 발행/구독 모델이라고 할 수 있다.

사용 예시: 트위터 feed, 페이스북 push 알람  
<br />

---

Reference

[https://developer.mozilla.org/ko/](https://developer.mozilla.org/ko/)

[https://ko.javascript.info/](https://ko.javascript.info/long-polling#ref-6396)

[https://levelup.gitconnected.com/polling-in-javascript-ab2d6378705a](https://levelup.gitconnected.com/polling-in-javascript-ab2d6378705a)

[https://datatracker.ietf.org/doc/html/rfc6455](https://datatracker.ietf.org/doc/html/rfc6455)

[https://codeburst.io/polling-vs-sse-vs-websocket-how-to-choose-the-right-one-1859e4e13bd9](https://codeburst.io/polling-vs-sse-vs-websocket-how-to-choose-the-right-one-1859e4e13bd9)


