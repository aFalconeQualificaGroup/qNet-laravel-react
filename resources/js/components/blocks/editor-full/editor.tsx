import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { EditorState, SerializedEditorState } from "lexical"

import { editorTheme } from "@/components/editor/themes/editor-theme"
import { TooltipProvider } from "@/components/ui/tooltip"

import { nodes } from "./nodes"
import { Plugins } from "./plugins"

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
