import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { EditorState, SerializedEditorState, $getRoot, $createParagraphNode, $nodesOfType } from "lexical"
import { useEffect } from "react"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"

import { editorTheme } from "@/components/editor/themes/editor-theme"
import { TooltipProvider } from "@/components/ui/tooltip"

import { nodes } from "./nodes"
import { Plugins } from "./plugins"
import { $isMentionNode, MentionNode } from "./nodes/MentionNode"

function ResetPlugin() {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    const handleReset = () => {
      editor.update(() => {
        const root = $getRoot()
        root.clear()
        root.append($createParagraphNode())
      })
    }

    window.addEventListener('reset-rich-text-editors', handleReset)
    return () => window.removeEventListener('reset-rich-text-editors', handleReset)
  }, [editor])

  return null
}

function MentionTrackingPlugin({
  onSelectMentionUser,
  selectedMentionUsers
}: {
  onSelectMentionUser?: (userId: number) => void;
  selectedMentionUsers?: number[];
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!onSelectMentionUser || !selectedMentionUsers) return;

    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const currentMentionIds = new Set<number>();

        // Raccogli tutti gli ID delle menzioni presenti nel testo
        const mentionNodes = $nodesOfType(MentionNode);
        mentionNodes.forEach((node) => {
          currentMentionIds.add(node.getUserId());
        });

        // Trova gli utenti che sono stati rimossi
        selectedMentionUsers.forEach((userId) => {
          if (!currentMentionIds.has(userId)) {
            // Questo utente era menzionato ma ora non c'è più nel testo
            // Chiamiamo il callback per rimuoverlo
            onSelectMentionUser(userId);
          }
        });
      });
    });
  }, [editor, onSelectMentionUser, selectedMentionUsers]);

  return null;
}

const editorConfig: InitialConfigType = {
  namespace: "Editor",
  theme: editorTheme,
  nodes,
  onError: (error: Error) => {
    console.error(error)
  },
}

export function Editor({
  editorState,
  editorSerializedState,
  onChange,
  onSerializedChange,
  showMentions = false,
  mentionUsers,
  selectedMentionUsers,
  onSelectMentionUser,
  onCloseMentions,
  onFilterMentionUsers,
}: {
  editorState?: EditorState
  editorSerializedState?: SerializedEditorState
  onChange?: (editorState: EditorState) => void
  onSerializedChange?: (editorSerializedState: SerializedEditorState) => void
  showMentions?: boolean
  mentionUsers?: any[]
  selectedMentionUsers?: number[]
  onSelectMentionUser?: (userId: number) => void
  onCloseMentions?: () => void
  onFilterMentionUsers?: (filter: string) => void
}) {
  return (
    <div className="bg-background overflow-hidden rounded-lg border shadow relative">
      <LexicalComposer
        initialConfig={{
          ...editorConfig,
          ...(editorState ? { editorState } : {}),
          ...(editorSerializedState
            ? { editorState: JSON.stringify(editorSerializedState) }
            : {}),
        }}
      >
        <TooltipProvider>
          <Plugins
            showMentions={showMentions}
            mentionUsers={mentionUsers}
            selectedMentionUsers={selectedMentionUsers}
            onSelectMentionUser={onSelectMentionUser}
            onCloseMentions={onCloseMentions}
            onFilterMentionUsers={onFilterMentionUsers}
          />

          <ResetPlugin />

          <MentionTrackingPlugin
            onSelectMentionUser={onSelectMentionUser}
            selectedMentionUsers={selectedMentionUsers}
          />

          <OnChangePlugin
            ignoreSelectionChange={true}
            onChange={(editorState) => {
              onChange?.(editorState)
              onSerializedChange?.(editorState.toJSON())
            }}
          />
        </TooltipProvider>
      </LexicalComposer>
    </div>
  )
}
