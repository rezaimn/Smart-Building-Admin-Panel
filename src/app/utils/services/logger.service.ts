import { Injectable } from '@angular/core';

@Injectable()
export class LoggerService {
  public logs: string[] = [];

  log(message: string) {
    this.logs.push(message);
    console.log(`${message}`);
  }

  debug(message: any, line?: number, color?: string): void {
    this.logs.push(`DEBUG: ${message} ${this.lineNumber(line)}`);
    console.log('%c' + `DEBUG: ${message} ${this.lineNumber(line)}`, 'color: grey;');
  }

  info(message: any, line?: number, color?: string): void {
    this.logs.push(`INFO: ${message} ${this.lineNumber(line)}`);
    console.log('%c' + `INFO: ${message} ${this.lineNumber(line)}`, 'color: #1574FB;');
  }

  warning(message: any, line?: number, color?: string): void {
    this.logs.push(`WARNING: ${message}`);
    console.log('%c' + `WARNING: ${message} ${this.lineNumber(line)}`, 'color: orange;');
  }

  error(message: any, line?: number, color?: string): void {
    this.logs.push(`ERROR: ${message} ${this.lineNumber(line)}`);
    console.log('%c' + `ERROR: ${message} ${this.lineNumber(line)}`, 'color:red;');
  }

  lineNumber(line): string {
    return line ? `in line number: ${line}` : '';
  }

}
