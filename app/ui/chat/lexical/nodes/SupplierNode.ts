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

export type SerializedSupplierNode = Spread<
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

export class SupplierNode extends TextNode {

    __id: string
  
    constructor(text: string, id: string, key?: NodeKey) {
      super(text, key);
      this.__mode = 1;
      this.__id = id;
    }
  
    static getType(): string {
      return 'supplier';
    }
  
    static clone(node: SupplierNode): SupplierNode {
      return new SupplierNode(node.__text, node.__id, node.__key);
    }
  
    createDOM(config: EditorConfig): HTMLElement {
      const element = super.createDOM(config);

      // styling
      element.id = this.__id
      element.style.border = '3px solid #ff3c00';
      element.style.borderRadius = '2px';
      element.style.color = 'white';
      element.style.background = '#ff3c00';

      return element;
    }
  
    updateDOM(
      prevNode: SupplierNode,
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

    exportJSON():SerializedSupplierNode {
      return {
        detail: this.getDetail(),
        format: this.getFormat(),
        mode: this.getMode(),
        style: this.getStyle(),
        text: this.getTextContent(),
        type: 'supplier',
        version: 1,
      };
    }

}
  
export function $createSupplierNode(text: string, id: string): SupplierNode {
  return new SupplierNode(text, id);
}

export function $isSupplierNode(node: LexicalNode | null | undefined): node is SupplierNode {
  return node instanceof SupplierNode;
}