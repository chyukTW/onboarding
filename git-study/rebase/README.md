# rebase

- 커밋 히스토리가 깔끔하게 재배치된다.
- merge할 때 충돌을 해결하면 메인 브랜치 위에서, rebase할 때 충돌을 해결하면 feature 브랜치 위에서 할 수 있다.


<br />

## merge와 비교

main 브랜치에 feature 브랜치가 merge가 되는 모습  
![image](https://user-images.githubusercontent.com/103919739/169433908-a2c58dda-c45a-42a1-b260-1fe036c18c50.png)  
커밋 순서가 변경되지 않고, 기존 분기도 유지된다.


main 브랜치에 feature 브랜치를 rebase한 모습  
![image](https://user-images.githubusercontent.com/103919739/169433977-7542d87f-413a-4da3-b799-ff8fdc0214b3.png)  
브랜치의 커밋 순서가 시간 순서대로 합쳐지고 히스토리가 깔끔하게 유지된다.  
master 브랜치의 마지막 커밋 뒤에 merge 대상이 되는 커밋들이 붙어서 결국 master 브랜치가 재배치(rebase)된다.  
이후 feature 브랜치를 master 브랜치에 merge하여 HEAD를 맞춰주면 된다.

<br />

## reabse 전후 비교
before   
![image](https://user-images.githubusercontent.com/103919739/169434024-5e5bfebb-4416-425b-afa1-166963511dbe.png)

after  
![image](https://user-images.githubusercontent.com/103919739/169434054-ecdec94a-7ef9-444a-8459-25f4034b736e.png)

## rebase로 충돌 해결

- 현재 test브랜치에서 2개의 변경사항이 커밋된 상황  
![스크린샷 2022-05-20 오전 10 52 56](https://user-images.githubusercontent.com/103919739/169434515-418f2a1b-30b4-49e1-bf48-47ffc0bf2d00.png)

1. rebase 시도(1)  
만약 이 상태에서 rebase를 시도하면 master 브랜치의 마지막 커밋이 공통 조상인 base가 되기 때문에 reabse가 작동하지 않는다.
![스크린샷 2022-05-20 오전 10 53 20](https://user-images.githubusercontent.com/103919739/169434683-8ac30f47-e5e4-4304-a174-65c864c95f1e.png)


- master브랜치에서도 1개의 변경사항이 커밋된 상황  
![스크린샷 2022-05-20 오전 10 54 18](https://user-images.githubusercontent.com/103919739/169434747-7a3c1e46-ed0d-4d54-adf1-6906b78d7cba.png)

2. rebase를 위해 test브랜치 이동
```
git switch test
```

3. rebase 시도(2)  
![스크린샷 2022-05-20 오전 10 56 21](https://user-images.githubusercontent.com/103919739/169434912-f7e67acf-b4dd-48c8-ae68-2aa932b19182.png)  

4. 충돌이 났다면 먼저 해결해줘야 한다.  
![스크린샷 2022-05-20 오전 10 56 37](https://user-images.githubusercontent.com/103919739/169435054-9068a178-479e-4749-af55-156c3fb5e4e3.png)

- 충돌 해결 이후에 바로 브랜치 이동을 시도하면 rebase중에는 불가능하다고 나온다.  
- rebase까지 끝내줘야 한다.  
![스크린샷 2022-05-20 오전 10 58 34](https://user-images.githubusercontent.com/103919739/169435224-1b6a7581-80f7-4565-867b-5c35c2ab8fb3.png)

6. 변경사항 스테이징하고  
```
git add .
```

7. rebase를 재개하면
```
git rebase --continue
```

8. 커밋을 생성해야 한다.  
![스크린샷 2022-05-20 오전 11 00 05](https://user-images.githubusercontent.com/103919739/169435670-981de164-7d65-4e2b-9f1b-632e9a9b306d.png)

- rebase가 완료된 모습, 히스토리가 정렬된다.  
![스크린샷 2022-05-20 오전 11 00 38](https://user-images.githubusercontent.com/103919739/169435715-dc8d5fa0-858c-459a-8ad9-454eaebc15fe.png)


9. master브랜치로 이동해서
```
git swtich master
```

10. test브랜치를 merge하면  
```
git merge test
```

11. HEAD가 master도 가리킨다.  
![스크린샷 2022-05-20 오전 11 01 21](https://user-images.githubusercontent.com/103919739/169436001-3150073e-38c7-4044-8734-a247fd926765.png)


- 최종 git log  
![스크린샷 2022-05-20 오전 11 27 03](https://user-images.githubusercontent.com/103919739/169436462-c33449a4-9a24-421a-966f-d595d0177fb7.png)


## 참고

[https://hajoung56.tistory.com/5](https://hajoung56.tistory.com/5)














