import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import { LinkNode, AutoLinkNode } from "@lexical/link"
import { ListItemNode, ListNode } from "@lexical/list"
import { CodeHighlightNode, CodeNode } from "@lexical/code"
import {
  Klass,
  LexicalNode,
  LexicalNodeReplacement,
  ParagraphNode,
  TextNode,
} from "lexical"

export const nodes: ReadonlyArray<Klass<LexicalNode> | LexicalNodeReplacement> =
  [
    HeadingNode, 
    ParagraphNode, 
    TextNode, 
    QuoteNode,
    LinkNode,
    AutoLinkNode,
    ListNode,
    ListItemNode,
    CodeNode,
    CodeHighlightNode,
  ]
