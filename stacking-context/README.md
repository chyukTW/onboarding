# Stacking Context

## 직면했던 문제  

팝업을 띄우는 버튼을(빨간색 원) 인풋 안에 위치시켜야 함  
![스크린샷 2022-05-23 오후 7 57 10](https://user-images.githubusercontent.com/103919739/169805388-bbb3bee5-07ce-426b-b32d-22e92ea78278.png)  

position을 absolute로 주어 어렵지 않게 구현할 수 있었지만, 상단에 다른 팝업이 출력될 때 인풋 안에 있는 버튼이 팝업 위로 드러나는 문제 발생
![스크린샷 2022-05-23 오후 7 56 56](https://user-images.githubusercontent.com/103919739/169806501-300fbf2e-b599-461e-9e49-b00b1150a688.png)  

겹치는 이유는 빨간 버튼이 z-index: 1의 값을 갖고 있기 떄문  
만약 z-index값을 부여하지 않으면 버튼이 인풋 뒤에 가려지게 됨  
![스크린샷 2022-05-23 오후 8 12 54](https://user-images.githubusercontent.com/103919739/169807171-6667ed6d-f852-4d26-8c09-bb4b027444cf.png)  

당시에는 stacking order에 대한 내용을 알지 못해서 버튼이 가려지는 이유를 몰랐음  
어쨋든 z-index를 주지 않거나 기본값이나 마찬가지인 auto를 주게 되면 버튼이 가려지기 때문에 1 이상의 값을 줘야 인풋 위로 버튼이 드러나게 됨  
상단에 출력되는 팝업도 뚫어버린다는 점이 문제...   

```css

.inputWrapper {
  @include flex;
  justify-content: flex-end;
  position: relative;

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

### 상단 팝업과 겹치는 문제를 해결하기 위해 생각했던 방법들  

방법 1. 문제가 되는 상단 팝업 position에 3차원 속성을 부여하고 더 높은 z-index 값을 부여  
-> mui에 의해 지정된 팝업의 위치를 억지로 조정해야 하고 기존 코드를 많이 건드려야 하는 부담이 있음  
방법 2. 버튼을 3차원 속성이 아닌 static으로 하여 인풋에 넣는 방법  
-> 편리한 인풋 구현을 위해 Input 공용 컴포넌트를 사용하고 있음, 공용 컴포넌트의 구조를 바꿔야 하는 부담이 있음  

### 해결

기존의 구현을 건드리지 않고 해결할 수 있는 방법을 찾다가 stacking context에 대해 알게 됨  
결과적으로 부모 요소의 stacking context를 조정해서 해결할 수 있었다.  

![스크린샷 2022-05-23 오후 8 34 57](https://user-images.githubusercontent.com/103919739/169810646-0ecb407e-ff01-48d2-a4e6-050a26d8d7d5.png)

CSS 코드는 부모 요소의 z-index에 0만 넣어주면 됨  

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

## 쌓임 맥락(stacking context)  

stacking context는 HTML 요소를 3차원으로 배치시키기 위해 z축을 포함하는 가상의 개념임  

그전에 알아두어야 할 것은 만약 동일한 stacking context에서 겹치는 요소들이 있다면 나중에 오는 요소가 앞에 있는 요소 위에 배치됨  

만약 아래와 같은 div 3개가 있다고 가정하고  
![스크린샷 2022-05-23 오후 5 05 00](https://user-images.githubusercontent.com/103919739/169812370-61d6c91e-32a7-462f-a12b-7a0f76a9d9c1.png)  

마진을 조정하여 서로 겹치게 한다면  
![스크린샷 2022-05-23 오후 5 05 31](https://user-images.githubusercontent.com/103919739/169812598-4fa58fab-5f31-4edd-b853-b6d80757c516.png) 
사진과 같이 mid가 top을 덮고 bottom이 mid를 덮음  

만약 어떤 요소가 다른 stacking context를 갖도록 하려면 position 속성에 absolute, relative와 같은 속성을 주어야 함  
mid


position 이외에도 transform, opacity 등과 같은 몇몇 속성은 요소가 다른 stacking context를 갖게 함  

만약 










