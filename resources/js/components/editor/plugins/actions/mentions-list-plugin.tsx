interface MentionsListPluginProps {
  mentionUsers?: any[]
  selectedMentionUsers?: number[]
  onSelectMentionUser?: (userId: number) => void
}

export function MentionsListPlugin({
  mentionUsers,
  selectedMentionUsers,
  onSelectMentionUser,
}: MentionsListPluginProps) {
  if (!selectedMentionUsers || selectedMentionUsers.length === 0) {
    return null
  }

  return (
    <div className="flex items-center gap-2 min-w-0 flex-1">
      <span className="text-xs text-muted-foreground font-medium whitespace-nowrap flex-shrink-0">
        Menzionati:
      </span>
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent flex-1">
        {selectedMentionUsers.map((userId) => {
          const user = mentionUsers?.find((u) => u.id === userId)
          if (!user) return null

          const initials = `${user.name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase()
          const fullName = `${user.name || ""} ${user.last_name || ""}`.trim()

          return (
            <div
              key={userId}
              className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs border border-primary/20 whitespace-nowrap flex-shrink-0 select-none"
              title={fullName}
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-semibold flex-shrink-0">
                {initials}
              </div>
              <span className="font-medium whitespace-nowrap">{fullName}</span>
              <button
                type="button"
                onClick={() => onSelectMentionUser?.(userId)}
                className="ml-1 hover:text-destructive transition-colors flex-shrink-0 text-xl leading-none cursor-pointer font-bold"
                title="Rimuovi menzione"
              >
                ×
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
