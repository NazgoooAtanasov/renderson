import { renderson } from '/renderson/js/renderson.js';

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.add('light');
}

document.querySelector('.theme-changer').addEventListener('click', () => {
  if (document.documentElement.classList.contains('dark')) {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  } else {
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
  }
});

const helloExample = document.querySelector('.hello-example');
helloExample.appendChild(renderson({
  hello: "world"
}));

const longerExample = document.querySelector('.longer-example');
longerExample.appendChild(renderson({
  "save": false,
  "situation": [
    true,
    "time",
    {
      "cheese": false,
      "breathe": "club",
      "door": -549143479.2958512,
      "outside": -18219074,
      "beat": true,
      "seen": false
    },
    2093428657.2301016,
    -1418328946.6731272,
    true
  ],
  "printed": true,
  "evening": true,
  "loose": 1169290172.4492664,
  "food": false
}));

const randomDataApi = 'https://random-data-api.com/api/v2/addresses';
const addresseRequest = await fetch(randomDataApi);
const address = await addresseRequest.json();
const randomDataApiExample = document.querySelector('.random-data-api-example');
randomDataApiExample.appendChild(renderson(address));

const randomDataApiArray = 'https://random-data-api.com/api/v2/addresses?size=10';
const addressesRequest = await fetch(randomDataApiArray);
const addresses = await addressesRequest.json();
const randomDataApiArrayExample = document.querySelector('.random-data-api-array-example');
randomDataApiArrayExample.appendChild(renderson(addresses));
