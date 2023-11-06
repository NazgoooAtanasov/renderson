type BasicJSON = string | number | boolean | undefined | null;
type RenderableJSON  = { [key: string]: BasicJSON | RenderableJSON | RenderableJSONArray };
type RenderableJSONArray = (BasicJSON | RenderableJSON | RenderableJSONArray)[];
type RSJSON = RenderableJSON | RenderableJSONArray;
type RSJSONOptions = {
  leftPixelOffset: number | undefined
};

function jsonbody(): [HTMLElement, HTMLElement] {
  const body = document.createElement('div');
  body.classList.add('renderson-hide');

  const trigger = document.createElement('button');
  trigger.textContent = '+';
  trigger.classList.add('renderson-body-trigger');
  trigger.addEventListener('click', () => {
    const show = !body.classList.contains('renderson-hide');
    body.classList.toggle('renderson-hide', show);
    trigger.textContent = show ? '+' : '-';
  });

  return [trigger, body];
}

function openingSquare(block?: boolean): HTMLElement {
  const openingSquare = document.createElement(block ? 'div' : 'span');
  openingSquare.textContent = '[';
  return openingSquare;
}

function closingSquare(): HTMLElement {
  const closingSquare = document.createElement('div');
  closingSquare.textContent = ']';
  return closingSquare;
}

function openingCurly(block?: boolean): HTMLElement {
  const openingCurly = document.createElement(block ? 'div' : 'span');
  openingCurly.textContent = '{';
  return openingCurly;
}

function closingCurly(): HTMLElement {
  const closingCurly = document.createElement('div');
  closingCurly.textContent = '}';
  return closingCurly;
}

function keyvalue(_: TemplateStringsArray, objKey: string, objValue: BasicJSON | number): HTMLElement {
  const keyValueElement = document.createElement('div');
  if (typeof objValue === 'string') {
    keyValueElement.textContent = `"${objKey}": "${objValue}"`;
  } else {
    keyValueElement.textContent = `"${objKey}": ${objValue}`;
  }
  return keyValueElement;
}

function keyobj(key: string, openingBracket: HTMLElement) {
  const keyObjElement = document.createElement('span');
  keyObjElement.textContent = `"${key}": `;

  const wrapper = document.createElement('div');
  wrapper.appendChild(keyObjElement);
  wrapper.appendChild(openingBracket);

  return wrapper;
}

function arraySimpleValue(value: BasicJSON): HTMLElement {
  const valueElement = document.createElement('div');
  valueElement.textContent = typeof value === 'string' ? `"${value}"` : `${value}`;
  return valueElement;
}

function _renderson(json: RSJSON, body: HTMLElement) {

  if (Array.isArray(json)) {
    const array = json;
    for (const value of array) {
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'undefined' || value === null) {
        body.appendChild(arraySimpleValue(value));
      } else if (Array.isArray(value)) {
        const [trigger, nextBody] = jsonbody();

        const opening = openingSquare(true)
        opening.appendChild(trigger);
        body.appendChild(opening);

        _renderson(value, nextBody);

        body.appendChild(nextBody);
        body.appendChild(closingSquare());
      } else if (typeof value === 'object') {
        const [trigger, nextBody] = jsonbody();

        const opening = openingCurly(true);
        opening.appendChild(trigger);
        body.appendChild(opening);

        _renderson(value, nextBody);

        body.appendChild(nextBody);
        body.appendChild(closingCurly());
      }
    }
  } else {
    for (const key in json as RenderableJSON) {
      const value = json[key];
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'undefined' || value === null) {
        body.appendChild(keyvalue`${key}: ${value}`);
      } else if (Array.isArray(value)) {
        const [trigger, nextBody] = jsonbody();

        const objkey = keyobj(key, openingSquare());
        objkey.appendChild(trigger);
        body.appendChild(objkey);

        _renderson(value, nextBody);

        body.appendChild(nextBody);
        body.appendChild(closingSquare());
      } else if (typeof value === 'object') {
        const [trigger, nextBody] = jsonbody();

        const objkey = keyobj(key, openingCurly());
        objkey.appendChild(trigger);
        body.appendChild(objkey);

        _renderson(value, nextBody);

        body.appendChild(nextBody);
        body.appendChild(closingCurly());
      }
    }

  }
}

function rendersonStyles(strings: TemplateStringsArray, ...rest: string[]): HTMLStyleElement {
  const styleElement = document.createElement('style');

  let accumulator = '';
  for (let i = 0; i < strings.length; ++i) {
    accumulator += strings[i];
    if (rest[i]) {
      accumulator += rest[i];
    }
  }

  styleElement.textContent = accumulator;
  return styleElement;
}

const renderOptions: RSJSONOptions = {
  leftPixelOffset: 30
};

function mergeRenderOptions(baseRenderOptions: RSJSONOptions, customRenderOptions: RSJSONOptions): RSJSONOptions {
  return {
    ...baseRenderOptions,
    ...customRenderOptions
  };
};

export function renderson(json: RSJSON, customRenderOptions?: RSJSONOptions): HTMLElement {
  const [_, body] = jsonbody();
  body.classList.remove('renderson-hide');

  const mergedRenderOptions = mergeRenderOptions(renderOptions, customRenderOptions || {} as RSJSONOptions);

  body.appendChild(rendersonStyles`
    .renderson-hide {
      display: none; 
    }

    .renderson-root div {
      margin-left: ${mergedRenderOptions.leftPixelOffset!.toString()}px; 
    }

    .renderson-body-trigger {
      border: none;
      background-color: transparent;
      cursor: pointer;
      font-size: inherit;
      padding: 0 5px;
    }`
  );

  const [trigger, nextBody] = jsonbody();
  const opening = !Array.isArray(json) ? openingCurly() : openingSquare();
  opening.appendChild(trigger);
  body.appendChild(opening);

  nextBody.classList.add('renderson-root');
  _renderson(json, nextBody);
  body.appendChild(nextBody);
  body.appendChild(!Array.isArray(json) ? closingCurly() : closingSquare());
  return body;
}
