import { useEffect, useState } from "react"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { 
  FORMAT_TEXT_COMMAND, 
  FORMAT_ELEMENT_COMMAND,
  UNDO_COMMAND, 
  REDO_COMMAND,
  $getSelection,
  $isRangeSelection,
  SELECTION_CHANGE_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
} from "lexical"
import { $findMatchingParent, mergeRegister } from "@lexical/utils"
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link"
import { 
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  $isListNode,
  ListNode,
} from "@lexical/list"
import {
  $isHeadingNode,
  $createHeadingNode,
  $createQuoteNode,
} from "@lexical/rich-text"
import { $setBlocksType } from "@lexical/selection"
import { $createCodeNode } from "@lexical/code"
import { $createMentionNode } from "./nodes/MentionNode"
import { $createTextNode } from "lexical"
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Link as LinkIcon,
  Undo,
  Redo,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Eraser,
} from "lucide-react"

import { ContentEditable } from "@/components/editor/editor-ui/content-editable"
import { ToolbarPlugin } from "@/components/editor/plugins/toolbar/toolbar-plugin"
import { LinkPlugin } from "@/components/editor/plugins/link-plugin"
import { AutoLinkPlugin } from "@/components/editor/plugins/auto-link-plugin"
import { FloatingLinkEditorPlugin } from "@/components/editor/plugins/floating-link-editor-plugin"
import { ClearFormattingToolbarPlugin } from "@/components/editor/plugins/toolbar/clear-formatting-toolbar-plugin"
import { FontColorToolbarPlugin } from "@/components/editor/plugins/toolbar/font-color-toolbar-plugin"
import { FontBackgroundToolbarPlugin } from "@/components/editor/plugins/toolbar/font-background-toolbar-plugin"
import { FontFamilyToolbarPlugin } from "@/components/editor/plugins/toolbar/font-family-toolbar-plugin"
import { FontSizeToolbarPlugin } from "@/components/editor/plugins/toolbar/font-size-toolbar-plugin"
import { MentionsToolbarPlugin } from "@/components/editor/plugins/toolbar/mentions-toolbar-plugin"
import { SpeechToTextPlugin } from "@/components/editor/plugins/actions/speech-to-text-plugin"
import { ActionsPlugin } from "@/components/editor/plugins/actions/actions-plugin"
import { UserMentionedDropdown } from "@/components/generatedComponents/task-generator/userMentioned-dropdown"
import MentionsPlugin from "./plugins/MentionsPlugin"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const blockTypeToBlockName = {
  paragraph: "Paragrafo",
  h1: "Titolo 1",
  h2: "Titolo 2",
  h3: "Titolo 3",
  quote: "Citazione",
  code: "Blocco Codice",
}

export function Plugins({
  showMentions = false,
  mentionUsers,
  selectedMentionUsers,
  onSelectMentionUser,
  onCloseMentions,
  onFilterMentionUsers,
}: {
  showMentions?: boolean
  mentionUsers?: any[]
  selectedMentionUsers?: number[]
  onSelectMentionUser?: (userId: number) => void
  onCloseMentions?: () => void
  onFilterMentionUsers?: (filter: string) => void
} = {}) {
  const [editor] = useLexicalComposerContext()
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null)
  const [isLinkEditMode, setIsLinkEditMode] = useState(false)
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [isStrikethrough, setIsStrikethrough] = useState(false)
  const [isLink, setIsLink] = useState(false)
  const [blockType, setBlockType] = useState<keyof typeof blockTypeToBlockName>("paragraph")
  const [showMentionDropdown, setShowMentionDropdown] = useState(false)

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem)
    }
  }

  // Aggiorna lo stato della toolbar quando cambia la selezione
  const updateToolbar = () => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'))
      setIsItalic(selection.hasFormat('italic'))
      setIsUnderline(selection.hasFormat('underline'))
      setIsStrikethrough(selection.hasFormat('strikethrough'))
      
      // Controlla se è un link
      const node = selection.anchor.getNode()
      const parent = node.getParent()
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true)
      } else {
        setIsLink(false)
      }

      // Determina il tipo di blocco
      const anchorNode = selection.anchor.getNode()
      let element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent()
              return parent !== null && parent.getKey() === "root"
            })

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow()
      }

      const elementKey = element.getKey()
      const elementDOM = editor.getElementByKey(elementKey)

      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = $findMatchingParent(
            anchorNode,
            (e) => $isListNode(e) && e instanceof ListNode
          )
          const type = parentList ? (parentList as ListNode).getListType() : element.getListType()
          setBlockType(type === "bullet" ? "paragraph" : "paragraph")
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType()
          if (type in blockTypeToBlockName) {
            setBlockType(type as keyof typeof blockTypeToBlockName)
          } else {
            setBlockType("paragraph")
          }
        }
      }
    }
  }

  // Registra l'update della toolbar
  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar()
        })
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbar()
          return false
        },
        COMMAND_PRIORITY_CRITICAL
      )
    )
  }, [editor])

  const insertLink = () => {
    if (!isLink) {
      setIsLinkEditMode(true)
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://')
    } else {
      setIsLinkEditMode(false)
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
    }
  }

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode("h1").getLatest())
        $setBlocksType(selection, () => $createHeadingNode("h1"))
      }
    })
  }

  const formatHeading = (tag: "h1" | "h2" | "h3") => {
    if (blockType !== tag) {
      editor.update(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(tag))
        }
      })
    }
  }

  const formatQuote = () => {
    if (blockType !== "quote") {
      editor.update(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode())
        }
      })
    }
  }

  const formatCode = () => {
    if (blockType !== "code") {
      editor.update(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createCodeNode())
        }
      })
    }
  }

  const formatBulletList = () => {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
  }

  const formatNumberedList = () => {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
  }

  return (
    <div className="relative">
      {/* Toolbar */}
      <ToolbarPlugin>
        {() => (
          <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/50">
            {/* Undo/Redo */}
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
              className="h-8 w-8"
              title="Annulla (Ctrl+Z)"
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
              className="h-8 w-8"
              title="Ripeti (Ctrl+Y)"
            >
              <Redo className="h-4 w-4" />
            </Button>

            <Separator orientation="vertical" className="h-8 mx-1" />

            {/* Font Family */}
            <FontFamilyToolbarPlugin />

            <Separator orientation="vertical" className="h-8 mx-1" />

            {/* Tipo di blocco */}
            <Select
              value={blockType}
              onValueChange={(value) => {
                if (value === "h1") formatHeading("h1")
                else if (value === "h2") formatHeading("h2")
                else if (value === "h3") formatHeading("h3")
                else if (value === "quote") formatQuote()
                else if (value === "code") formatCode()
                else formatParagraph()
              }}
            >
              <SelectTrigger className="h-8 w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paragraph">Paragrafo</SelectItem>
                <SelectItem value="h1">Titolo 1</SelectItem>
                <SelectItem value="h2">Titolo 2</SelectItem>
                <SelectItem value="h3">Titolo 3</SelectItem>
                <SelectItem value="quote">Citazione</SelectItem>
                <SelectItem value="code">Codice</SelectItem>
              </SelectContent>
            </Select>

            <Separator orientation="vertical" className="h-8 mx-1" />

            {/* Formattazione testo */}
            <Button
              type="button"
              size="icon"
              variant={isBold ? "secondary" : "ghost"}
              onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
              className="h-8 w-8"
              title="Grassetto (Ctrl+B)"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant={isItalic ? "secondary" : "ghost"}
              onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
              className="h-8 w-8"
              title="Corsivo (Ctrl+I)"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant={isUnderline ? "secondary" : "ghost"}
              onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
              className="h-8 w-8"
              title="Sottolineato (Ctrl+U)"
            >
              <Underline className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant={isStrikethrough ? "secondary" : "ghost"}
              onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
              className="h-8 w-8"
              title="Barrato"
            >
              <Strikethrough className="h-4 w-4" />
            </Button>

            <Separator orientation="vertical" className="h-8 mx-1" />

            {/* Link */}
            <Button
              type="button"
              size="icon"
              variant={isLink ? "secondary" : "ghost"}
              onClick={insertLink}
              className="h-8 w-8"
              title="Inserisci Link (Ctrl+K)"
            >
              <LinkIcon className="h-4 w-4" />
            </Button>

            {/* Mentions */}
            <MentionsToolbarPlugin onMentionTrigger={() => setShowMentionDropdown(true)} />

            <Separator orientation="vertical" className="h-8 mx-1" />

            {/* Rimuovi Formattazione */}
            <ClearFormattingToolbarPlugin />

            <Separator orientation="vertical" className="h-8 mx-1" />

            {/* Dimensione Carattere */}
            <FontSizeToolbarPlugin />

            <Separator orientation="vertical" className="h-8 mx-1" />

            {/* Colore Testo */}
            <FontColorToolbarPlugin />
            <FontBackgroundToolbarPlugin />

            <Separator orientation="vertical" className="h-8 mx-1" />

            {/* Liste */}
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={formatBulletList}
              className="h-8 w-8"
              title="Lista Puntata"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={formatNumberedList}
              className="h-8 w-8"
              title="Lista Numerata"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>

            <Separator orientation="vertical" className="h-8 mx-1" />

            {/* Allineamento */}
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}
              className="h-8 w-8"
              title="Allinea a Sinistra"
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')}
              className="h-8 w-8"
              title="Centra"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')}
              className="h-8 w-8"
              title="Allinea a Destra"
            >
              <AlignRight className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')}
              className="h-8 w-8"
              title="Giustifica"
            >
              <AlignJustify className="h-4 w-4" />
            </Button>
          </div>
        )}
      </ToolbarPlugin>

      {/* Editor principale */}
      <div className="relative">
        <RichTextPlugin
          contentEditable={
            <div className="min-h-[400px]">
              <div className="" ref={onRef}>
                <ContentEditable placeholder={"Inizia a scrivere..."} />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />

        {/* Plugin funzionalità */}
        <HistoryPlugin />
        <LinkPlugin />
        <AutoLinkPlugin />
        <ListPlugin />
        
        {/* Plugin UI floating */}
        {floatingAnchorElem && (
          <>
            <FloatingLinkEditorPlugin 
              anchorElem={floatingAnchorElem} 
              isLinkEditMode={isLinkEditMode}
              setIsLinkEditMode={setIsLinkEditMode}
            />
          </>
        )}

        {/* Mention Dropdown */}
        {showMentions && showMentionDropdown && mentionUsers && onSelectMentionUser && onCloseMentions && (
          <div className="absolute z-50 mt-1 top-0">
            <UserMentionedDropdown
              users={mentionUsers}
              selectedUsers={selectedMentionUsers || []}
              open={showMentionDropdown}
              onClose={() => {
                setShowMentionDropdown(false)
                onCloseMentions?.()
              }}
              onSelectUser={(userId) => {
                // Inserisci la menzione nel testo invece di aggiungerla alla lista
                const user = mentionUsers.find(u => u.id === userId);
                if (user) {
                  editor.update(() => {
                    const selection = $getSelection();
                    if ($isRangeSelection(selection)) {
                      const mentionNode = $createMentionNode(
                        `${user.name} ${user.last_name || ''}`.trim(),
                        user.id
                      );
                      selection.insertNodes([mentionNode]);
                      // Aggiungi uno spazio dopo
                      const spaceNode = $createTextNode(' ');
                      mentionNode.insertAfter(spaceNode);
                      spaceNode.select();
                    }
                  });
                }
                // Chiama anche il callback originale per tracking
                onSelectMentionUser?.(userId);
              }}
              setFilter={onFilterMentionUsers}
            />
          </div>
        )}

        {/* Mentions Plugin - per digitare @ */}
        {showMentions && <MentionsPlugin mentionUsers={mentionUsers} />}
      </div>

       
      {/* Azioni */}
      <ActionsPlugin>
        <div className="clear-both flex items-center gap-2 border-t p-1">
          <div className="flex-shrink-0">
            <SpeechToTextPlugin />
          </div>
        </div>
      </ActionsPlugin>

    </div>
  )
}
