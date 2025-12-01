import { useEffect, useState } from "react"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  KEY_DOWN_COMMAND,
  TextNode,
} from "lexical"
import { AtSign } from "lucide-react"

import { Button } from "@/components/ui/button"

export function MentionsToolbarPlugin({ 
  onMentionTrigger 
}: { 
  onMentionTrigger?: () => void 
} = {}) {
  const [editor] = useLexicalComposerContext()
  const [isMentionMode, setIsMentionMode] = useState(false)

  // Funzione che viene chiamata quando si attiva la mention
  const handleMentionTrigger = () => {
    console.log("🔔 Mention triggered!")
    setIsMentionMode(true)
    onMentionTrigger?.()
  }

  // Click sull'icona @
  const handleButtonClick = () => {
   /* editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        // Inserisce il carattere @ nella posizione del cursore
        selection.insertText("@")
      }
    })*/
    handleMentionTrigger()
  }

  // Intercetta la digitazione del carattere @
  useEffect(() => {
    return editor.registerCommand(
      KEY_DOWN_COMMAND,
      (event: KeyboardEvent) => {
        // Verifica se è stato premuto il tasto @ (Shift + 2 su tastiera italiana)
        // oppure direttamente @ su tastiere internazionali
        if (event.key === "@" || (event.shiftKey && event.key === "2")) {
          event.preventDefault() // Previene l'inserimento del carattere @
          handleMentionTrigger()
          return true // Blocca l'evento
        }
        return false
      },
      COMMAND_PRIORITY_LOW
    )
  }, [editor])

  return (
    <Button
      type="button"
      size="icon"
      variant={isMentionMode ? "secondary" : "ghost"}
      onClick={handleButtonClick}
      className="h-8 w-8"
      title="Mention utente (@)"
    >
      <AtSign className="h-4 w-4" />
    </Button>
  )
}
