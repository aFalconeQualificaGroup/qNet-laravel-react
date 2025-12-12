import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  useBasicTypeaheadTriggerMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { $createTextNode, $getSelection, $isRangeSelection, TextNode } from 'lexical';
import { useCallback, useEffect, useMemo, useState } from 'react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { $createMentionNode } from '../nodes/MentionNode';

const PUNCTUATION = '\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%\'"~=<>_:;';
const NAME = '\\b[A-Z][^\\s' + PUNCTUATION + ']';

const DocumentMentionsRegex = {
  NAME,
  PUNCTUATION,
};

const PUNC = DocumentMentionsRegex.PUNCTUATION;

const TRIGGERS = ['@'].join('');

// Chars we expect to see in a mention (non-space, non-punctuation).
const VALID_CHARS = '[^' + TRIGGERS + PUNC + '\\s]';

// Non-standard series of chars. Each series must be preceded and followed by
// a valid char.
const VALID_JOINS =
  '(?:' +
  '\\.[ |$]|' + // E.g. "r. " in "Mr. Smith"
  ' |' + // E.g. " " in "Josh Duck"
  '[' +
  PUNC +
  ']|' + // E.g. "-' in "Salier-Hellendag"
  ')';

const LENGTH_LIMIT = 75;

const AtSignMentionsRegex = new RegExp(
  '(^|\\s|\\()(' +
    '[' +
    TRIGGERS +
    ']' +
    '((?:' +
    VALID_CHARS +
    VALID_JOINS +
    '){0,' +
    LENGTH_LIMIT +
    '})' +
    ')$',
);

// 50 is the longest alias length limit.
const ALIAS_LENGTH_LIMIT = 50;

// Regex used to match alias.
const AtSignMentionsRegexAliasRegex = new RegExp(
  '(^|\\s|\\()(' +
    '[' +
    TRIGGERS +
    ']' +
    '((?:' +
    VALID_CHARS +
    '){0,' +
    ALIAS_LENGTH_LIMIT +
    '})' +
    ')$',
);

function checkForAtSignMentions(
  text: string,
  minMatchLength: number,
): MenuTextMatch | null {
  let match = AtSignMentionsRegex.exec(text);

  if (match === null) {
    match = AtSignMentionsRegexAliasRegex.exec(text);
  }
  if (match !== null) {
    // The strategy ignores leading whitespace but we need to know it's
    // length to add it to the leadOffset
    const maybeLeadingWhitespace = match[1];

    const matchingString = match[3];
    if (matchingString.length >= minMatchLength) {
      return {
        leadOffset: match.index + maybeLeadingWhitespace.length,
        matchingString,
        replaceableString: match[2],
      };
    }
  }
  return null;
}

function getPossibleQueryMatch(text: string): MenuTextMatch | null {
  return checkForAtSignMentions(text, 0);
}

class MentionTypeaheadOption extends MenuOption {
  name: string;
  userId: number;
  picture?: string;

  constructor(name: string, userId: number, picture?: string) {
    super(name);
    this.name = name;
    this.userId = userId;
    this.picture = picture;
  }
}

function MentionsTypeaheadMenuItem({
  index,
  isSelected,
  onClick,
  onMouseEnter,
  option,
}: {
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: MentionTypeaheadOption;
}) {
  return (
    <div
      key={option.key}
      tabIndex={-1}
      className={`flex items-center gap-2 px-3 py-2 cursor-pointer ${
        isSelected ? 'bg-accent' : ''
      } hover:bg-accent`}
      ref={option.setRefElement}
      role="option"
      aria-selected={isSelected}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      {option.picture && (
        <img
          src={option.picture}
          alt={option.name}
          className="w-8 h-8 rounded-full object-cover"
        />
      )}
      <span className="font-medium">{option.name}</span>
    </div>
  );
}

export type MenuTextMatch = {
  leadOffset: number;
  matchingString: string;
  replaceableString: string;
};

export default function MentionsPlugin({
  mentionUsers,
}: {
  mentionUsers?: any[];
}) {
  const [editor] = useLexicalComposerContext();

  const [queryString, setQueryString] = useState<string | null>(null);

  const checkForSlashTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
    minLength: 0,
  });

  const options = useMemo(() => {
    if (!mentionUsers) return [];

    return mentionUsers
      .filter((user) =>
        queryString
          ? user.name.toLowerCase().includes(queryString.toLowerCase()) ||
            user.last_name?.toLowerCase().includes(queryString.toLowerCase())
          : true
      )
      .slice(0, 5)
      .map(
        (user) =>
          new MentionTypeaheadOption(
            `${user.name} ${user.last_name || ''}`.trim(),
            user.id,
            user.picture
          )
      );
  }, [mentionUsers, queryString]);

  const onSelectOption = useCallback(
    (
      selectedOption: MentionTypeaheadOption,
      nodeToReplace: TextNode | null,
      closeMenu: () => void,
    ) => {
      editor.update(() => {
        const mentionNode = $createMentionNode(selectedOption.name, selectedOption.userId);
        if (nodeToReplace) {
          nodeToReplace.replace(mentionNode);
        }
        mentionNode.select();
        const spaceNode = $createTextNode(' ');
        mentionNode.insertAfter(spaceNode);
        spaceNode.select();
        closeMenu();
      });
    },
    [editor],
  );

  const checkForMentionMatch = useCallback(
    (text: string) => {
      const mentionMatch = getPossibleQueryMatch(text);
      const slashMatch = checkForSlashTriggerMatch(text, editor);
      return !slashMatch && mentionMatch ? mentionMatch : null;
    },
    [checkForSlashTriggerMatch, editor],
  );

  return (
    <LexicalTypeaheadMenuPlugin<MentionTypeaheadOption>
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForMentionMatch}
      options={options}
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex },
      ) =>
        anchorElementRef.current && options.length
          ? ReactDOM.createPortal(
              <div className="bg-popover text-popover-foreground rounded-md border shadow-md w-64 max-h-64 overflow-auto z-50">
                {options.map((option, i: number) => (
                  <MentionsTypeaheadMenuItem
                    index={i}
                    isSelected={selectedIndex === i}
                    onClick={() => {
                      setHighlightedIndex(i);
                      selectOptionAndCleanUp(option);
                    }}
                    onMouseEnter={() => {
                      setHighlightedIndex(i);
                    }}
                    key={option.key}
                    option={option}
                  />
                ))}
              </div>,
              anchorElementRef.current,
            )
          : null
      }
    />
  );
}
