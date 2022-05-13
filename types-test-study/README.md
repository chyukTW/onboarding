# 프론트엔드 테스트 유형

<img src="https://user-images.githubusercontent.com/103919739/168051575-5846025a-64ad-4d71-901a-1b4ae9a54a85.png" width="350" height="500">  
<br />

## 정적 테스트(Static Test)
<br />

코드를 실행시키지 않고 테스트하는 방법  
일반적으로 데이터의 타입 에러, 참조 오류 등을 걸러내기 위한 테스트로 프론트엔드의 경우 ESLint, 타입스크립트 등이 활용될 수 있음  
<br />

## 단위 테스트(Unit Test)
<br />

각 모듈을 단독 실행 환경에서 의도한 대로 작동하는지 테스트하는 것을 말한다.  

단위 테스트는 세 가지 속성으로 정의될 수 있음  

1. 작은 코드 조각을 검증하고,
2. 빠르게 수행하고,
3. 격리된 방식으로 처리하는 자동화 테스트다.
<br />

1번과 2번에는 논란의 여지가 없지만, 3번의 격리에 관한 접근 방식에 따라 Sociable/Solitary 또는 고전파/런던파로 구분된다. 고전파는 테스트 대상이 의존하고 있는 코드 중에서 테스트 간에 공유되어 서로의 결과에 영향을 미치는 의존성만을 모의 코드로 대체하는 방식을 주장한다. 반면에 런던파는 불변하는 의존성을 제외한 모든 의존성을 모의하는 방식을 주장한다. 전자의 방식에는 의존하고 있는 코드도 함께 효과적으로 검증할 수 있다는 장점이 있고, 후자의 방식에는 테스트가 실패하면 어느 부분에 문제가 있는지 확실히 알 수 있고 간단한 구조의 테스트를 작성할 수 있다는 장점이 있다. 서로 격리를 다루는 방식이 다르기 때문에 단위 테스트 뿐만 아니라 통합 테스트를 바라보는 관점에도 차이가 생긴다.  
<br />

단위 테스트의 장점

- 문제점을 발견하기 좋다.
- 프로그램의 안정성이 높아진다.
- 코드 수정에 자신감이 생긴다.
- 내가 변경한 부분이 어디에 영향을 끼치는지 쉽게 파악할 수 있다.
- 협업에 도움을 준다. (컨벤션, 코드 스타일, 코드에 대한 설명서 역할 등)
- 리팩토링 이후에 코드가 의도대로 작동하고 있음을 어느 정도 확신할 수 있다  
<br />

단위 테스트의 한계
<br />

 ![unit_vs_integration_tests](https://user-images.githubusercontent.com/103919739/168054224-2d3a08ca-d762-4b23-a1cd-3f308557d192.gif)

<br />

## 통합 테스트(Integration Test)
<br />

- 두 개 이상의 모듈이 실제로 연결된 상태를 테스트
- 모듈 간의 상호작용을 검증할 수 있어서 단위 테스트에서 발생할 수 없는 에러를 발견할 수 있음
- 예시
    - 이벤트가 발생할 때 UI가 의도한 대로 변경되는지
    - 같은 의존성을 사용하는 여러 컴포넌트가 문제 없이 렌더링 되는지
    - 리덕스의 dispatch가 올바르게 작동하는지  
<br />

## E2E(End to End) 테스트  
<br />

- 실제 환경에 근접한 상태에서 사용자 관점으로 테스트하는 방법으로 E2E 테스트를 통합 테스트의 극단적인 형태로 보기도 함
- 실제 환경과 거의 동일한 환경에서 테스트를 진행하기 때문에 실제 상황에서 발생할 수 있는 에러를 발견할 수 있고, 자바스크립트 API만으로 제어할 수 없는 행위(브라우저 크기 변경, 실제 키보드 입력 등)를 테스트 할 수 있음
- 테스트가 실패하면 상대적으로 원인을 찾기가 쉽지 않지만, 성공하면 더 많은 신뢰를 얻을 수 있음
- 공수가 많이 들고 실행 시간이 오래 걸린다는 특징이 있음
- 예시
    - 브라우저에 텍스트가 제대로 출력되는지
    - 버튼을 클릭했을 때 올바른 동작을 수행하는지  
<br />

## Trade-offs
<br />

<img src="https://user-images.githubusercontent.com/103919739/168052873-9a05bb26-15d2-4d6a-a4a2-80abefed68b1.png" width="350" height="500">
<br />

## 참고  
[https://kentcdodds.com/blog/static-vs-unit-vs-integration-vs-e2e-tests](https://kentcdodds.com/blog/static-vs-unit-vs-integration-vs-e2e-tests)

[https://soozl91.tistory.com/64](https://soozl91.tistory.com/64)

[https://blog.mathpresso.com/모던-프론트엔드-테스트-전략-1편-841e87a613b2](https://blog.mathpresso.com/%EB%AA%A8%EB%8D%98-%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C-%ED%85%8C%EC%8A%A4%ED%8A%B8-%EC%A0%84%EB%9E%B5-1%ED%8E%B8-841e87a613b2)

[https://velog.io/@dnr6054/what-is-a-unit-test](https://velog.io/@dnr6054/what-is-a-unit-test)

[http://www.yes24.com/Product/Goods/104084175](http://www.yes24.com/Product/Goods/104084175)
