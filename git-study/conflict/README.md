## Git 충돌 예시 및 해결 방법


1. master branch:  
![스크린샷 2022-05-19 오후 6 52 34](https://user-images.githubusercontent.com/103919739/169268488-4cbca081-f7fe-4eb8-86b9-42439bd9f436.png)


2. 테스트를 위한 브랜치 생성
```
git switch -c test1
```

3. README.md 내용 바꿈 -> ```git add .``` -> ```git commit```    
![스크린샷 2022-05-19 오후 6 59 11](https://user-images.githubusercontent.com/103919739/169268891-6dcbfe96-436b-4b6d-acbc-6695e05ebafc.png)

4. master 브랜치 복귀
```
git switch master
```

5. README.md 같은 줄에 있는 내용 다른 걸로 바꾸기 -> ```git add .``` -> ```git commit```  
![스크린샷 2022-05-19 오후 6 59 33](https://user-images.githubusercontent.com/103919739/169269174-c1aee77d-bae5-42ef-b47d-5002912c9c2a.png)


6. 현재 브랜치 상황  
![스크린샷 2022-05-19 오후 7 00 05](https://user-images.githubusercontent.com/103919739/169269230-1a9c523d-814d-4f62-8767-e18e42531b5e.png)

7. 같은 파일, 같은 줄에 서로 다른 내용을 갖고 있는 상황에서 merge 시도  
![스크린샷 2022-05-19 오후 7 00 49](https://user-images.githubusercontent.com/103919739/169269546-aa0feb90-b7bc-4684-9ff9-018e7fa82411.png)

8. 충돌 에러 발생 - merge가 실패했다고 나온다.  
![스크린샷 2022-05-19 오후 7 01 45](https://user-images.githubusercontent.com/103919739/169269667-570f01e6-cf74-44b2-a043-3f30bc8f219a.png)

9. VS Code에서 충돌 해결을 위한 인터페이스 제공  (Accept Current Change / Accept Incoming Change / Accept Both Change 中 하나 선택)
![스크린샷 2022-05-19 오후 7 01 56](https://user-images.githubusercontent.com/103919739/169269880-2938c260-6757-40cb-813f-ad4964a7f7fa.png)

10. 충돌 해결: accept 후에 ```git add .``` -> ```git commit```  
![스크린샷 2022-05-19 오후 7 03 29](https://user-images.githubusercontent.com/103919739/169271152-0b95acae-96d9-48d2-bbc4-8a5655859e31.png)

11. 최종 브랜치 상황  
![스크린샷 2022-05-19 오후 7 03 39](https://user-images.githubusercontent.com/103919739/169271304-2f3d58e0-f86d-407b-a97d-25aa7118dac0.png)





