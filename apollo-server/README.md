# Apollo server
<br/>

## 스택
<br/>

PostgreSQL, Prisma, Apollo-server, express  
<br/>

## 스키마
<br/>

```prisma
model Task {
  id        Int      @id @default(autoincrement())
  text      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model User {
  name      String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

```

<br/>

## Etc.
<br/>

- Apollo-server version 3에서는 Subscription을 위한 빌트인을 제공하지 않음
- subscription을 가능하게 하려면 apollo-server-express를 써야 함
- graphql-ws 라이브러리의 사용을 권장 (subscriptions-transport-ws은 더 이상 유지 관리되지 않음)
- 서버가 graphql-ws을 사용하면 클라이언트도 같은 라이브러리를 써야 함
- dev-tool에서 subscription이 이유없이 안되는 것 같다면 setting에서 subscription implementation을 확인해 볼 것
  