# 스크롤 이벤트 최적화 관련

- Debounce
- Throttle
- requestAnimationFrame API


## **디바운스**

바운싱 현상이란 기계 스위치들의 접점이 붙거나 떨어지는 시점에 의도치 않게 스위치가 여러번 ON/OFF되는 현상을 말하는데 이를 방지하기 위한 기법을 디바운싱(Debouncing)이라고 합니다. 이벤트를 그룹화시켜 특정 시간이 지난 후에 하나의 이벤트만 발생하도록 하는 기술입니다. 연속적으로 호출되는 함수 중 마지막 또는 처음에 호출되는 함수만을 실행시켜 디바운스를 구현할 수 있습니다.

예시 1. 타이핑을 하다가 일정 시간 멈추었을 때 검색어를 모두 입력했다고 판단하고 검색 결과 출력

예시 2. 유저가 브라우저의 크기를 조절하다가 일정 시간 조작을 하지 않았을 때 이벤트 실행

예제. React에서 setTimeout을 활용한 debounce를 구현

순서:

1. 사용자 입력에 의해 textInput 상태 변경
2. setTimeout을 활용한 debounce 함수 스케쥴링
3. setTimeout에 등록된 시간이 지나기 전에 textInput이 다시 변경되면 debounce 갱신
4. setTimeout에 등록된 시간이 지나기 전까지 새로운 입력이 없다면 엄청복잡하고거대한함수 실행

```tsx
function Input() {
  const [ textInput, setTextInput] = useState('');
  const [ 복잡한데이터, 복잡한데이터저장하기 ] = useState('');

  const handleChange = (value) => {
    setTextInput(value);
  };

  useEffect(()=>{
    if(textInput){
      const debounce = setTimeout(()=> {
        const 엄청복잡하고거대한함수 = (value) => '복잡한 로직으로 가공된 ' + value;
        복잡한데이터저장하기(엄청복잡하고거대한함수(textInput));
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
```

![Jun-11-2022 22-02-48](https://user-images.githubusercontent.com/103919739/173189334-74975891-2d6a-435c-bfde-a7bc77a8231a.gif)


## **쓰로틀**

*나무위키*

> 영어 단어에서 유래한 말로, 원어는 목을 조르는 행위를 말한다. 즉, 인간의 목을 조르는 것도 스로틀링이다. 이 점에서 유래하여 무언가의 출력을 조절하는 뜻도 가지고 있는데, 기계장치에 연결된 액체나 기체가 흐르는 관에 달린 밸브를 조절하는 광경을 생각해보면 적절한 의미 확장인 셈이다.
> 

쓰로틀은 연속적으로 호출되는 함수를 특정 주기에 한 번만 호출하는 기법을 말합니다. 디바운스와 달리  특정 주기에 최소 한번의 함수 호출을 보장합니다.

예시 1. 무한 스크롤 화면에서 유저가 너무 빠르게 스크롤을 내리면 과도한 API 요청이 발생할 수 있음 → 쓰로틀을 활용하여 너무 빈번하게 함수가 실행되지 않도록 최적화

예제. React에서 setTimeout을 활용한 throttle 구현

순서:

1. 브라우저의 스크롤 이벤트가 감지될 때마다 throttle 함수가 실행
2. throttle 함수는 스케쥴링된 setTimeout 함수가 이미 존재한다면 이벤트 핸들러 실행하지 않음
3. 만약 스케쥴링된 로직이 없다면 이벤트 핸들러 실행하고, setTimeout 초기화

```tsx
function ThrottleBox({delay}){
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
    <ThrottleBox ref={boxRef}>
      throttle({delay})
    </ThrottleBox>
  )
}
```

## requestAnimationFrame API를 활용한 쓰로틀링 구현

오늘날 대부분의 장치는 화면을 초당 60회 갱신합니다. 브라우저 환경에서 애니메이션이 작동하거나 사용자가 스크롤하여 화면이 이동하면 장치의 화면 주사율에 맞추어 화면이 그려져야 합니다. 각각의 프레임은 16.6ms(1초/60) 정도의 budget을 갖고 있지만, 브라우저가 기본적으로 수행해야 하는 작업 때문에 pixel pipeline은 10ms 이내에 완료되어야 합니다. 만약 이 조건을 달성하지 못하면 프레임률이 떨어지고 사용자 경험에 부정적 영향을 끼칠 수 있습니다.

Pixel Pipeline 예시 (CSS 속성에 따라 중간 과정이 생략될 수 있음)

![image](https://user-images.githubusercontent.com/103919739/173189300-953c2651-3fcb-45c9-a256-441236877eaf.png)  


쓰로틀링을 적용하면서도 최대한 부드러운 애니메이션을 구현해야 하는 상황을 가정해볼 수 있습니다. 해당 애니메이션이 스크롤 이벤트에 따라 발생한다면 화면 주사율에 따라 브라우저가 렌더링하는 능력에 맞추어 함수가 실행되도록 해야 합니다. setTimeout의 delay를 10ms 이하로 준다면 어떨까요?

만약 setTimeout을 이용한 복잡한 로직으로 애니메이션을 구현하려고 한다면 16.6ms의 frame budget을 초과하여 부드러운 애니메이션을 구현하는데 실패할 수도 있습니다. setTimeout API의 비동기 로직은 Task Queue에 넣어둔 후에 순서대로 처리됩니다. Queue에 저장된 로직이 실행되는 시점은 Call Stack이 비어졌을 경우인데, 만약 이 시점이 setTimeout에 설정한 시간과 맞지 않는다면 비동기 로직이 예상대로 실행되지 않을 수 있습니다. 혹은 setTimeout에 전달된 콜백이 실행하는 로직이 setTimeout에 설정된 시간 내에 처리될 수 없는 경우도 생각해 볼 수 있습니다. 이런 경우 프레임 누락이 발생하여 사용자 입장에서는 애니메이션 끊김이 발생한다고 느끼게 됩니다.

이런 경우에 활용할 수 있는 requestAnimationFrame API가 있습니다. 줄여서 raf은 리페인트 이전에 실행할 콜백을 인자로 받습니다. 애니메이션이 실행되기 위한 조건이 되면 raf은 인자로 전달받은 콜백을 repaint 전에 실행하도록 브라우저에 요청합니다. raf API의 로직도 setTimeout과 마찬가지로 비동기로 실행되지만, task queue가 아닌 animaiton frame에서 처리되기 때문에 브라우저 렌더링 퍼포먼스에 최적화된 애니메이션을 구현할 수 있습니다.

![image](https://user-images.githubusercontent.com/103919739/173189308-6caf8b5b-4011-4fba-82b0-7665aec0c7a4.png)  

예제. requsetAnimation 활용한 throttle 예제
<br />

순서:

1. 브라우저의 스크롤 이벤트가 감지될 때마다 handleScroll 함수 실행
2. isQueuing: true → Animation frames에 있는 비동기 로직 실행 전
    
    : handleScroll은 아무것도 실행하지 않고 종료
    
3. isQueuing: false→ Animation frames에 있는 비동기 로직 실행 후
    
    : requestAnimation으로 전달받은 콜백을 Animation frames에 대기시킴
    

```tsx
function ThrottleBox(){
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
    <ThrottleBox ref={boxRef}>
      requestAnimationFrame
    </ThrottleBox>
  )
}
```

## 참고

https://web.dev/rendering-performance/  
https://jbee.io/web/optimize-scroll-event/  
https://blog.risingstack.com/writing-a-javascript-framework-execution-timing-beyond-settimeout/  
