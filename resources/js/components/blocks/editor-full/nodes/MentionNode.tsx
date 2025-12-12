import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedTextNode,
  Spread,
} from 'lexical';

import { $applyNodeReplacement, TextNode } from 'lexical';

export type SerializedMentionNode = Spread<
  {
    mentionName: string;
    userId: number;
  },
  SerializedTextNode
>;

function convertMentionElement(
  domNode: HTMLElement,
): DOMConversionOutput | null {
  const textContent = domNode.textContent;
  const userId = domNode.getAttribute('data-user-id');

  if (textContent !== null && userId !== null) {
    const node = $createMentionNode(textContent, parseInt(userId));
    return {
      node,
    };
  }

  return null;
}

const mentionStyle = 'background-color: rgba(24, 119, 232, 0.2); color: rgb(24, 119, 232); font-weight: 500; padding: 2px 4px; border-radius: 4px;';

export class MentionNode extends TextNode {
  __mention: string;
  __userId: number;

  static getType(): string {
    return 'mention';
  }

  static clone(node: MentionNode): MentionNode {
    return new MentionNode(node.__mention, node.__userId, node.__key);
  }

  static importJSON(serializedNode: SerializedMentionNode): MentionNode {
    const node = $createMentionNode(
      serializedNode.mentionName,
      serializedNode.userId,
    );
    node.setTextContent(serializedNode.text);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }

  constructor(mentionName: string, userId: number, key?: NodeKey) {
    super('@' + mentionName, key);
    this.__mention = mentionName;
    this.__userId = userId;
  }

  exportJSON(): SerializedMentionNode {
    return {
      ...super.exportJSON(),
      mentionName: this.__mention,
      userId: this.__userId,
      type: 'mention',
      version: 1,
    };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = super.createDOM(config);
    element.style.cssText = mentionStyle;
    element.className = 'mention';
    element.setAttribute('data-user-id', String(this.__userId));
    return element;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('span');
    element.setAttribute('data-lexical-mention', 'true');
    element.setAttribute('data-user-id', String(this.__userId));
    element.textContent = this.__text;
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      span: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute('data-lexical-mention')) {
          return null;
        }
        return {
          conversion: convertMentionElement,
          priority: 1,
        };
      },
    };
  }

  isTextEntity(): true {
    return true;
  }

  canInsertTextBefore(): boolean {
    return false;
  }

  canInsertTextAfter(): boolean {
    return false;
  }

  getUserId(): number {
    const self = this.getLatest();
    return self.__userId;
  }

  getMentionName(): string {
    const self = this.getLatest();
    return self.__mention;
  }
}

export function $createMentionNode(mentionName: string, userId: number): MentionNode {
  const mentionNode = new MentionNode(mentionName, userId);
  mentionNode.setMode('token').toggleDirectionless();
  return $applyNodeReplacement(mentionNode);
}

export function $isMentionNode(
  node: LexicalNode | null | undefined,
): node is MentionNode {
  return node instanceof MentionNode;
}
