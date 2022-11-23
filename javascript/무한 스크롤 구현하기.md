# 🖱️ 무한 스크롤 구현

## 무한 스크롤이란?

> 컨텐츠를 페이징하는 기법 중 하나로 스크롤을 이용해 맨 아래까지 도달할 때 새로운 컨텐츠를 불러오는 방식을 말한다.

- 만약 footer에 컨텐츠가 있는 경우, 무한 스크롤로 인해 footer에 접근하지 못하는 상황이 발생할 수 있으므로 무한 스크롤 대신 '더보기'와 같은 버튼을 눌러 데이터를 추가로 불러오는 방식이 더 좋다.

## 구현 방식

> 스크롤을 끝까지 내렸을 때 fetch된 새로운 데이터를 엘리먼트에 계속 추가(appendChild)하는 방식으로 구현한다. 구현 방식은 크게 두 가지이다.

## 1. scroll 이벤트 이용

- 전통적인 방식
- window의 scroll 이벤트가 일어날 때마다 브라우저 화면의 높이, 스크롤바의 위치를 이용해 body(컨텐츠)의 끝까지 다다랐으면 새로운 데이터를 가져오는 방식을 말한다.

<br />

<p align="center">
   <img src="https://user-images.githubusercontent.com/76807107/203087608-463d51bb-d00d-49fe-9129-4091054daaa2.png" width="60%" heigth="auto" />
</p>

- `window.innerHeight` : 클라이언트에서 보여지는 화면 중 탭, url 주소창, 북마크 탭을 제외한 브라우저의 높이
- `window.scrollY` : 현재 스크롤바 위치
- `document.body.offsetHeight` : body의 height
- `window.innerHeight + window.scrollY` : (탭, url 주소창, 북마크 탭을 제외한)브라우저의 높이 + 사용자의 스크롤 Y 값
- `window.innerHeight + window.scrollY` 값이 현재 body의 높이 값보다 같거나 큰 경우 새 데이터를 추가하는 것이다.

```javascript
window.addEventListener("scroll", () => {
  // 100을 더하면 스크롤을 끝까지 내리기 100px 전에 데이터를 받아올 수 있다.
  const isScrollEnded =
    window.innerHeight + window.scrollY + 100 >= document.body.offsetHeight;

  // totalCount : api의 데이터의 전체 길이
  // photos.length: 현재 랜더링된 데이터의 길이
  const { photos, totalCount, isLoading } = this.state;
  if (isScrollEnded && !isLoading && photos.length < totalCount) {
    onScrollEnded();
  }
});
```

1. isLoading의 상태 존재 이유

- 데이터를 이미 요청했음에도 계속 데이터를 요청하는 문제가 발생한다.
  <p align="center">
      <img src="https://user-images.githubusercontent.com/76807107/203087867-73105ff6-40f6-43a4-8c40-acdd34148fe1.png" width="50%" heigth="auto" />
  </p>

- 이 경우 isLoading 상태를 두어 데이터를 요청하고 응답받기 전까지는 재요청을 하지 않도록 할 수 있다.

2. totalCount의 존재 이유

- 이미 api의 마지막 데이터까지 모두 가져왔음에도 불구하고 1) 스크롤을 맨 아래 내린 상태, 2) isLoading이 false인 경우, 이 두 가지가 참일 때 계속 요청을 보내는 상황이 발생한다.
- 이 경우 api의 데이터 전체 개수(totalCount)와 현재까지 랜더링된 리스트의 개수(photos.length)를 비교해 해결할 수 있다.

<br />
<br />

## 2. Intersection Observer

- 최근 방식
- observe, unobserve를 사용해 구현한다.
- threshold 값으로 observe 대상이 얼마나 노출되었는지에 따라 동작하게 할 수 있다.
- `root`: 관찰 대상이 화면에 들어왔음을 감지하는 영역이며, 기본값은 null(Viewport)이다.
- `rootMargin`: 관찰 대상을 감지하는 영역을 바깥 범위(Margin)까지 확장한다. 기본값은 상우하좌 순으로 '0px 0px 0px 0px'이며, 옵션값을 지정할 때는 문자열로 단위와 함께 작성해야 한다.
- `threshold`: 관찰 대상이 화면 내에 얼마나 들어 왔을 때 콜백 함수를 호출할 지 결정하는 값으로 기본값은 0(0%)이며 최대 1(100%)까지 지정 가능하다. 만약 0.6이면, 대상이 화면에 60% 이상 보이기 시작할 때 콜백 함수를 호출한다.

```javascript
// 첫번째 인자는 콜백함수, 두 번째 인자는 설정
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const { photos, totalCount, isLoading } = this.state;
      // 로딩 중에는 데이터를 불러오지 않도록 해야 함
      if (entry.isIntersecting && !isLoading) {
        if (photos.length < totalCount) {
          onScrollEnded();
        }
      }
    });
  },
  {
    // 1인 경우 스크롤을 이용해 관찰 대상이 모두 보인 경우에 콜백 함수가 실행된다.
    threshold: 1,
  }
);

// 중략

this.render = () => {
  // 중략

  let $lastLi = null;

  // 다음 관찰 대상을 마지막의 리스트 요소로 한다.
  const $nextLi = $photos.querySelector("li:last-child");

  if ($nextLi !== null) {
    if ($lastLi !== null) {
      // 마지막 요소가 null인 경우에는 관찰하지 않는다.
      observer.unobserve($lastLi);
    }

    $lastLi = $nextLi;
    observer.observe($lastLi); // 관찰 대상 등록
  }
};
```
