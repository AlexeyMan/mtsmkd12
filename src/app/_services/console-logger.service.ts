import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

import {Logger} from './logger.service';

export let production = environment.production;

const noop = (): any => undefined;

@Injectable({ providedIn: 'root' })
export class ConsoleLoggerService implements Logger {

  get info() {
    if (!production) {
      return console.info.bind(console);
    } else {
      return noop;
    }
  }

  get warn() {
    if (!production) {
      return console.warn.bind(console);
    } else {
      return noop;
    }
  }

  get error() {
    if (!production) {
      return console.error.bind(console);
    } else {
      return noop;
    }
  }

  invokeConsoleMethod(type: string, args?: any): void {
    const logFn: Function = (console as any)[type] || console.log || noop;
    logFn.apply(console, [args]);
  }
}
