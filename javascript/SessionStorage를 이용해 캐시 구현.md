# ๐ช SessionStorage๋ฅผ ์ด์ฉํด ์บ์ ๊ตฌํํ๊ธฐ

## ๐ค ์บ์๋ฅผ ๊ตฌํํ๋ ์ด์ 

ํน์  ๊ฐ์ ๋ฐ์ดํฐ๋ฅผ ์ ์ฅํด๋๋ฉด ์ดํ์ ๊ทธ ํน์  ๊ฐ์ ๋ํ ๋ฐ์ดํฐ๊ฐ ํ์ํ  ๊ฒฝ์ฐ, ์์ฒญ์ ๋ณด๋ด์ง ์๊ณ  ์ ์ฅ๋ ๋ฐ์ดํฐ๋ฅผ ๊ฐ์ ธ์ ๋ฐ๋ก ์ฌ์ฉํ  ์ ์๊ณ  ๋ถํ์ํ ์์ฒญ์ ์ค์ผ ์ ์๋ค๋ ์ด์ ์ด ์๋ค.

<br />

## ๐ฑ๏ธ ๊ตฌํ ๋ฐฉ๋ฒ

ํน์  ๊ฐ์ ๋ํ ๋ฐ์ดํฐ๋ฅผ SessionStorage์ ์ ์ฅํ์ฌ ๊ตฌํํ  ์ ์๋ค. SessionStorage๋ฅผ ์ฌ์ฉํ๋ ์ด์ ๋ ๋ธ๋ผ์ฐ์ ๊ฐ ๋ซํ๊ธฐ ์ ๊น์ง ๋ฐ์ดํฐ๊ฐ ์ ์ง๋๋ค. ๋ง์ฝ ์๊ตฌ์ ์ผ๋ก ๋ฐ์ดํฐ๋ฅผ ์ ์ฅํ๊ณ  ์ถ๋ค๋ฉด LocalStoage๋ฅผ ์ฌ์ฉํ  ์ ์๋ค.

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
      // cache์ ์ด๋ฏธ breed์ ํด๋น๋๋ ์ ์ฅ๋ ๋ฐ์ดํฐ๊ฐ ์๋ ๊ฒฝ์ฐ
      console.log(cache[breed]);
    } else {
      // cache์ breed์ ํด๋น๋๋ ์ ์ฅ๋ ๋ฐ์ดํฐ๊ฐ ์๋ ๊ฒฝ์ฐ
      const response = await fetch(
        `https://dog.ceo/api/breed/${breed}/images/random`
      );

      if (!response.ok) {
        throw new Error("API ์๋ฌ");
      }

      const dogData = await response.json();
      cache[breed] = dogData.message;

      setItem("cache_dog", cache); // sessionStorage์ ์ ์ฅ
      console.log(cache[breed]);
    }
  } catch (e) {
    console.error(e);
  }
};
```

1. cache์ ๋ฐ์ดํฐ๊ฐ ์๋ ๊ฒฝ์ฐ๋ cache์์ ๋ฐ์ดํฐ๋ฅผ ๊ฐ์ ธ์จ๋ค.

- ์๋ ์ฌ์ง์์ ๋ณผ ์ ์๋ฏ์ด ์ด๋ฏธ mix์ ๋ฐ์ดํฐ๋ cache_dog์ ์ ์ฅ๋์ด ์์ผ๋ฏ๋ก ์์ฒญ์ ๋ณด๋ด์ง ์๋๋ค.

  <p align="center">
    <img src="https://user-images.githubusercontent.com/76807107/204142024-4b25bd80-ddf0-49b6-88a4-551a711622e9.png" width="600px" heigth="auto" />
  </p>

2. ๋ง์ฝ cache์ ์ ์ฅ๋ ๋ฐ์ดํฐ๊ฐ ์๋ ๊ฒฝ์ฐ ํด๋น ๊ฐ์ ๋ํด ์์ฒญ์ ๋ณด๋ด๊ณ  ๊ทธ ๋ฐ์ดํฐ๋ฅผ cache์ ์ ์ฅํ๋ค.

- ํ์ง๋ง cache_dog์ ์๋ ๋ฐ์ดํฐ์ ๊ฒฝ์ฐ ์์ฒญ์ ๋ณด๋ด๋ ๊ฒ์ ํ์ธํ  ์ ์๋ค.

  <p align="center">
    <img src="https://user-images.githubusercontent.com/76807107/204142047-385d20e6-8596-49ee-8409-145dff824efb.png" width="600px" heigth="auto" />
  </p>
