# 🪙 SessionStorage를 이용해 캐시 구현하기

## 🤔 캐시를 구현하는 이유

특정 값의 데이터를 저장해두면 이후에 그 특정 값에 대한 데이터가 필요할 경우, 요청을 보내지 않고 저장된 데이터를 가져와 바로 사용할 수 있고 불필요한 요청을 줄일 수 있다는 이점이 있다.

<br />

## 🖱️ 구현 방법

특정 값에 대한 데이터를 SessionStorage에 저장하여 구현할 수 있다. SessionStorage를 사용하는 이유는 브라우저가 닫히기 전까지 데이터가 유지된다. 만약 영구적으로 데이터를 저장하고 싶다면 LocalStoage를 사용할 수 있다.

```javascript
import { getItem, setItem } from "./storage.js";

const $root = document.querySelector(".root");
const $input = document.createElement("input");
$root.appendChild($input);

const cache = getItem("cache_dog", {});

$input.addEventListener("input", (e) => {
  const breed = e.target.value.trim();

  if (breed.length > 1) {
    fetchData(breed);
  }
});

const fetchData = async (breed) => {
  try {
    if (cache[breed]) {
      // cache에 이미 breed에 해당되는 저장된 데이터가 있는 경우
      console.log(cache[breed]);
    } else {
      // cache에 breed에 해당되는 저장된 데이터가 없는 경우
      const response = await fetch(
        `https://dog.ceo/api/breed/${breed}/images/random`
      );

      if (!response.ok) {
        throw new Error("API 에러");
      }

      const dogData = await response.json();
      cache[breed] = dogData.message;

      setItem("cache_dog", cache); // sessionStorage에 저장
      console.log(cache[breed]);
    }
  } catch (e) {
    console.error(e);
  }
};
```

1. cache에 데이터가 있는 경우는 cache에서 데이터를 가져온다.

- 아래 사진에서 볼 수 있듯이 이미 mix의 데이터는 cache_dog에 저장되어 있으므로 요청을 보내지 않는다.

  <p align="center">
    <img src="https://user-images.githubusercontent.com/76807107/204142024-4b25bd80-ddf0-49b6-88a4-551a711622e9.png" width="600px" heigth="auto" />
  </p>

2. 만약 cache에 저장된 데이터가 없는 경우 해당 값에 대해 요청을 보내고 그 데이터를 cache에 저장한다.

- 하지만 cache_dog에 없는 데이터의 경우 요청을 보내는 것을 확인할 수 있다.

  <p align="center">
    <img src="https://user-images.githubusercontent.com/76807107/204142047-385d20e6-8596-49ee-8409-145dff824efb.png" width="600px" heigth="auto" />
  </p>
