// I believe that a clickable button can be made directly from here as a Lexical node but
// I am afraid I am too dumb for this

import {
    TextNode, 
    NodeKey, 
    EditorConfig, 
    LexicalNode,
    LexicalEditor,
    DOMExportOutput,
    Spread,
    TextModeType,
    SerializedLexicalNode} 
from 'lexical';

export type SerializedToolNode = Spread<
  {
    detail: number;
    format: number;
    mode: TextModeType;
    style: string;
    text: string;
  },
  SerializedLexicalNode
>;

function wrapElementWith(
  element: HTMLElement | Text,
  tag: string,
): HTMLElement {
  const el = document.createElement(tag);
  el.appendChild(element);
  return el;
}

export class ToolNode extends TextNode {

    __id: string
  
    constructor(text: string, id: string, key?: NodeKey) {
      super(text, key);
      this.__mode = 1;
      this.__id = id;
    }
  
    static getType(): string {
      return 'tool';
    }
  
    static clone(node: ToolNode): ToolNode {
      return new ToolNode(node.__text, node.__id, node.__key);
    }
  
    createDOM(config: EditorConfig): HTMLElement {
      const element = super.createDOM(config);

      // styling
      element.id = this.__id
      element.style.border = '3px solid #646e78';
      element.style.borderRadius = '2px';
      element.style.color = 'white';
      element.style.background = '#646e78';

      return element;
    }
  
    updateDOM(
      prevNode: ToolNode,
      dom: HTMLElement,
      config: EditorConfig,
    ): boolean {
      const isUpdated = super.updateDOM(prevNode, dom, config);
      if (prevNode.__id !== this.__id) {
        dom.style.color = this.__id;
      }
      return isUpdated;
    }

    exportDOM(editor: LexicalEditor): DOMExportOutput {
      let element = this.createDOM(editor._config);
      element = wrapElementWith(element, 'button');

      return {element}
    }

    exportJSON():SerializedToolNode {
      return {
        detail: this.getDetail(),
        format: this.getFormat(),
        mode: this.getMode(),
        style: this.getStyle(),
        text: this.getTextContent(),
        type: 'tool',
        version: 1,
      };
    }

}
  
export function $createToolNode(text: string, id: string): ToolNode {
  return new ToolNode(text, id);
}

export function $isToolNode(node: LexicalNode | null | undefined): node is ToolNode {
  return node instanceof ToolNode;
}