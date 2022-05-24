# Stacking Context
<br />

## 직면했던 문제  
<br />

팝업을 출력하기 위한 버튼을(빨간색 원) 인풋 안에 위치시켜야 한다.  
<img src="https://user-images.githubusercontent.com/103919739/169805388-bbb3bee5-07ce-426b-b32d-22e92ea78278.png"  width="300" height="200"/>

"position: absolute"로 구현할 수 있지만,  
상단에 있는 다른 팝업이 출력될 때 빨간 버튼이 팝업 위로 드러난다.  
<img src="https://user-images.githubusercontent.com/103919739/169806501-300fbf2e-b599-461e-9e49-b00b1150a688.png"  width="300" height="200"/>

겹치는 이유는 빨간 버튼이 z-index: 1의 값을 갖고 있기 때문인데,  
만약 z-index값을 부여하지 않으면 버튼이 인풋 뒤에 가려지게 됨  
<img src="https://user-images.githubusercontent.com/103919739/169807171-6667ed6d-f852-4d26-8c09-bb4b027444cf.png"  width="300" height="200"/>

문제 1. z-index를 주지 않는다 -> 인풋에 가려짐  
문제 2. z-index를 준다 -> 상단 팝업을 뚫고 나옴  

```css
.inputWrapper {
  position: relative;

  .colorButton {
    position: absolute;
    z-index: 1;
    left: 16px;
    border: 1px dashed red;
    cursor: pointer;
  }
    
  ...
}
```
<br />

### 상단 팝업과 겹치는 문제를 해결하고자 생각했던 방법들  
<br />

방법 1. 상단 팝업 position에 3차원 속성을 부여하고 더 높은 z-index 값을 부여  
-> mui에 의해 지정된 팝업의 위치를 억지로 조정해야 하고 기존 코드를 많이 건드려야 하는 부담이 있음  

방법 2. 버튼을 3차원 속성이 아닌 static으로 하여 인풋에 넣는 방법  
-> 편리한 인풋 구현을 위해 Input 공용 컴포넌트를 사용하고 있음  
-> 공용 컴포넌트의 구조를 바꿔야 하는 부담이 있음  
<br />

### 해결
<br />

기존의 구현을 건드리지 않고 해결할 수 있는 방법을 찾다가 stacking context에 대해 알게 됨  
결과적으로 버튼의 부모 요소가 되는 input wrapper의 stacking context를 조정해서 해결할 수 있었다.  
<img src="https://user-images.githubusercontent.com/103919739/169810646-0ecb407e-ff01-48d2-a4e6-050a26d8d7d5.png"  width="300" height="200"/>  
<br />

부모 요소의 z-index에 0만 넣어주면 됨  

```css

.inputWrapper {
  @include flex;
  justify-content: flex-end;
  position: relative;
  z-index: 0;

  .colorButton {
    position: absolute;
    z-index: 1;
    left: 16px;
    @include square(16px, 16px, 8px);
    border: 1px dashed red;
    cursor: pointer;
  }
    
  ...
}

```
<br />

## 쌓임 맥락(stacking context)  
<br />

stacking context는 HTML 요소를 3차원으로 배치시키기 위해 z축을 포함하는 가상의 개념임  
동일한 stacking context에서 겹치는 요소들이 있다면 나중에 오는 요소가 앞에 있는 요소 위에 배치됨  

만약 아래와 같은 div 3개가 있고  
<img src="https://user-images.githubusercontent.com/103919739/169812370-61d6c91e-32a7-462f-a12b-7a0f76a9d9c1.png"  width="400" height="300"/>


마진을 조정하여 서로 겹치게 한다면  
<img src="https://user-images.githubusercontent.com/103919739/169812598-4fa58fab-5f31-4edd-b853-b6d80757c516.png"  width="400" height="300"/>  
사진과 같이 뒤에 오는 요소가 앞에 있는 요소를 덮음  
이러한 순서를 natural stacking order라 함  

어떤 요소가 다른 stacking context를 갖도록 하려면  
position 속성에 absolute, relative와 같은 속성을 주어야 함

mid에 relative만 주더라도 새로운 context가 형성되고 다른 요소들보다 위에 위치하게 되는 것을 볼 수 있음  
<img src="https://user-images.githubusercontent.com/103919739/169813916-fe307013-2813-4303-b82f-d9de49dd33a3.png"  width="400" height="300"/>  
position 이외에 transform, opacity 등 몇몇 속성도 다른 stacking context를 형성함  
<br />
만약 위 상황에서 bottom에 transform이나 opacity를 준다면,  
<img src="https://user-images.githubusercontent.com/103919739/169814463-ec5bb50c-b5d0-44ed-821d-493d78be95d0.png"  width="400" height="300"/>
<img src="https://user-images.githubusercontent.com/103919739/169814475-500694e4-b5e8-4677-859f-d71431be928a.png"  width="400" height="300"/>  
bottom에 position을 부여하지 않았음에도 mid보다 앞에 나옴  
<br/>
같은 stacking context에 있는 겹쳐있는 요소들이 동일한 z-index를 갖는다면  

```css

...생략

.top, .mid, .bottom {
  position: relative;
}
```
<img src="https://user-images.githubusercontent.com/103919739/169815377-7779b1b7-301c-4b1e-88fe-bf06499b6f67.png"  width="400" height="300"/>  
역시나 natural stacking order를 따르게 됨  

z축에서의 위치를 조절하기 위해서는 z-index값을 부여해야 함  
```css

  .top {
    width: 50px;
    height: 50px;
    background-color: tomato;
    margin-bottom: -20px;
    z-index: 1;
  }

  .mid {
    width: 200px;
    height: 100px;
    background-color: cadetblue;
    z-index: 2;
  }

  .bottom {
    width: 50px;
    height: 50px;
    background-color: blue;
    margin-top: -20px;
    z-index: 1;
  }
```
<img src="https://user-images.githubusercontent.com/103919739/169815599-77f361ae-484c-49b0-a327-d79e0e832eca.png"  width="400" height="300"/>

그런데 간혹 z-index를 제대로 할당해주었음에도 원하는 대로 구현되지 않을 때가 있음  
3차원 속성을 제대로 사용하기 위해선 stacking context가 계층 구조라는 것을 이해해야 하는데,  
MDN에서는 stacking context의 계층 구조를 아래와 같이 요약하고 있다.  

- 쌓임 맥락이 다른 쌓임 맥락을 포함할 수 있고, 함께 계층 구조를 이룹니다.  
- 쌓임 맥락은 형제 쌓임 맥락과 완전히 분리됩니다. 쌓임을 처리할 땐 자손 요소만 고려합니다.  
- 각각의 쌓임 맥락은 독립적입니다. 어느 요소의 콘텐츠를 쌓은 후에는 그 요소를 통째 부모 쌓임 맥락 안에 배치합니다.  

stacking context은 계층 구조를 갖고 있기 때문에 부모 요소의 맥락에 영향을 받을 수 밖에 없음  

만약 아래와 같이 서로 다른 부모를 갖는 요소가 겹쳐있고 같은 z-index를 갖는 다면   
<img src="https://user-images.githubusercontent.com/103919739/169817439-6b6562c4-f3cd-40dc-83bb-116b0666ce59.png"  width="450" height="350"/>  
natural stacking order에 따라 뒤에 오는 요소인 parent2의 mid가 자연스럽게 위에 배치됨

만약 parent1의 mid가 더 높은 z-index를 갖는다면 당연히  
<img src="https://user-images.githubusercontent.com/103919739/169818294-576341dd-2087-4da8-a972-1e52c44e0a71.png"  width="450" height="350"/>  
더 높은 z-index를 갖는 요소이기 때문에 더 위에 배치됨

그런데 더 높은 z-index를 갖는 경우에도 위에 배치되지 않는 경우가 있음  
오른쪽 요소가 99인데 2보다 아래에 배치되는 경우...  
<img src="https://user-images.githubusercontent.com/103919739/169818693-746a68f8-fe5f-4fdd-8e0d-0e908e07884c.png"  width="450" height="350"/>  

원인은 부모 요소에 있음  
<img src="https://user-images.githubusercontent.com/103919739/169819063-eb1dc839-b3f1-48d6-9808-e5ac473c0020.png"  width="450" height="350"/>  
만약 부모 요소가 진다면 자식은 이길 수 없음  

자식 요소는 부모 요소의 stacking context에 제한되기 때문에 만약 z-index가 원하는 대로 동작하지 않는다면 부모 요소를 살펴볼 필요가 있다.  
위에서 언급한 문제의 경우 부모 요소의 z-index를 낮춤으로써 자식 요소의 z-index를 제한시켜서 해결할 수 있었다.  
<br />

## 참고
<br />

[MDN](https://developer.mozilla.org/ko/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context)  
[blog](https://erwinousy.medium.com/z-index%EA%B0%80-%EB%8F%99%EC%9E%91%ED%95%98%EC%A7%80%EC%95%8A%EB%8A%94-%EC%9D%B4%EC%9C%A0-4%EA%B0%80%EC%A7%80-%EA%B7%B8%EB%A6%AC%EA%B3%A0-%EA%B3%A0%EC%B9%98%EB%8A%94-%EB%B0%A9%EB%B2%95-d5097572b82f)









