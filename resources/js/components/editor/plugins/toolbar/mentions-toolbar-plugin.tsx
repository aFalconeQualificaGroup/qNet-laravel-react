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

export function MentionsToolbarPlugin() {
  const [editor] = useLexicalComposerContext()
  const [isMentionMode, setIsMentionMode] = useState(false)

  // Funzione di test che verrà chiamata quando si attiva la mention
  const handleMentionTrigger = () => {
    console.log("🔔 Mention triggered!")
    console.log("📍 Current selection:", editor.getEditorState().read(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        return {
          anchor: selection.anchor,
          focus: selection.focus,
        }
      }
      return null
    }))
    
    // TODO: Qui implementerai la logica per mostrare il menu utenti
    // Esempio: aprire un dropdown con lista utenti
    setIsMentionMode(true)
    alert("Mention attivata! Qui puoi implementare il menu di selezione utenti")
  }

  // Click sull'icona @
  const handleButtonClick = () => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        // Inserisce il carattere @ nella posizione del cursore
        selection.insertText("@")
      }
    })
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
          // Lascia che il carattere @ venga inserito normalmente
          // e poi attiva la mention
          setTimeout(() => {
            handleMentionTrigger()
          }, 0)
        }
        return false // Non blocca l'evento, permette l'inserimento del carattere
      },
      COMMAND_PRIORITY_LOW
    )
  }, [editor])

  // Monitor per il testo inserito (alternativa più robusta)
  useEffect(() => {
    return editor.registerNodeTransform(TextNode, (node: TextNode) => {
      const text = node.getTextContent()
      
      // Verifica se l'ultimo carattere inserito è @
      if (text.endsWith("@")) {
        // Delay per permettere al DOM di aggiornarsi
        setTimeout(() => {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            // Verifica che il cursore sia subito dopo la @
            const anchorNode = selection.anchor.getNode()
            if (anchorNode === node) {
              handleMentionTrigger()
            }
          }
        }, 10)
      }
    })
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
