import {
  Component, Input, Output, ElementRef, ViewChild, OnInit,
  EventEmitter, forwardRef, AfterViewInit, ViewEncapsulation
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import * as CodeMirror from 'codemirror';

// code extensions
import 'codemirror/mode/yaml/yaml.js';
import 'codemirror/mode/python/python.js';
import 'codemirror/mode/powershell/powershell.js';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/htmlmixed/htmlmixed.js';
import 'codemirror/mode/htmlmixed/htmlmixed.js';

// add-ons
import 'codemirror/addon/lint/lint.js';
import 'codemirror/addon/lint/yaml-lint.js';

// themes
import * as codeMirrorCss from 'codemirror/lib/codemirror.css';
import * as lintCss from 'codemirror/addon/lint/lint.css';
import * as draculaCss from 'codemirror/theme/dracula.css';

const CODEMIRROR_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CodeEditorComponent),
  multi: true
};

@Component({
  selector: 'ngx-codemirror',
  providers: [CODEMIRROR_VALUE_ACCESSOR],
  template: `<textarea #host></textarea>`,
  encapsulation: ViewEncapsulation.None,
  styles: [
    codeMirrorCss,
    lintCss,
    draculaCss
  ]
})
export class CodeEditorComponent implements OnInit, AfterViewInit, ControlValueAccessor {

  static defaultConfig = {
    theme: 'dracula'
  };

  @Input() config: any = {};

  set value(val: string) {
    if (val !== this._value) {
      this._value = val;
      this.onChangeCallback(val);
      this.change.emit(this._value);
    }
  }

  get value(): string {
    return this._value;
  }

  @Output() change: EventEmitter<any> = new EventEmitter();

  @ViewChild('host') host: any;

  editor: any;
  instance: any;
  _value: string = '';

  ngOnInit(): void {
    this.config = Object.assign(this.config, CodeEditorComponent.defaultConfig);
  }

  ngAfterViewInit(): void {
    this.instance = CodeMirror.fromTextArea(this.host.nativeElement, this.config);
    this.instance.on('change', () => {
      this.updateValue(this.instance.getValue());
    });
  }

  updateValue(value): void {
    this.value = value;
    this.onTouchedCallback();
    this.onChangeCallback(value);
    this.change.emit(value);
  }

  writeValue(val: any): void {
    if (val !== this.value && this.instance) {
      this._value = val;
      this.instance.setValue(this._value);
    }
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  private onTouchedCallback: () => void = () => {
    // placeholder
  }

  private onChangeCallback: (_: any) => void = () => {
    // placeholder
  }

}
