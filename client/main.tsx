/// <reference path='../typings/tsd.d.ts'/>

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Root } from './containers/Root';

const element: HTMLElement | null = document.getElementById('app');
if (element !== null) {
  const element2: HTMLElement = element;
  ReactDOM.render(
    <Root />,
    element2
  );
}
