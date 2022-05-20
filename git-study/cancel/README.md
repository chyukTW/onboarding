- 변경사항(Changed) 취소
    - git restore .
    - git restore /path
- 스테이지(Staged) 취소
    - git restore —staged .
    - git restore —staged /path
- 커밋 취소
    - git reset HEAD~n (HEAD를 n개 커밋만큼 back, 커밋 사라짐 주의)
    - git reset ${commit_hash::7} (특정 커밋으로 HEAD 되돌리기도 가능)
    - 옵션: reset으로 돌아갈 때 어디로 가는지(default: mixed)
        - --soft: add까지 한 상태(Stage에 올라간 상태)
        - --mixed: 변경된 상태(Changed에 올라간 상태)
        - --hard: 아예 기존 커밋(변경 내용까지 다 사라짐)
        
* 리셋 이후 커밋 사라짐 주의, 원격 레포에 푸쉬된게 있다면 커밋 기록이 남아있기 때문에 복구할 수 있음, 만약 원격 레포에도 기록되지 않은 커밋을 복구하려면 git reflog를 사용할 수도 있지만 사용해야 하는 상황이 오지 않도록 하기