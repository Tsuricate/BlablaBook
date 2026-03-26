import parse, {
  domToReact,
  type HTMLReactParserOptions,
  Element,
  type DOMNode,
} from 'html-react-parser';
import { Text, List, ListItem } from '@chakra-ui/react';
import i18n from '../i18n';

export const renderDescription = (html?: string) => {
  if (!html) return <Text>{i18n.t('common:noDescription')}</Text>;

  const allowedTags = ['b', 'i', 'p', 'ul', 'li'];

  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element) {
        const { name, children } = domNode;

        if (!allowedTags.includes(name)) return <></>;

        const safeChildren = domToReact(children as DOMNode[], options);

        switch (name) {
          case 'b':
            return <Text as="b">{safeChildren}</Text>;
          case 'i':
            return <Text as="i">{safeChildren}</Text>;
          case 'p':
            return <Text mb={2}>{safeChildren}</Text>;
          case 'ul':
            return (
              <List.Root pl={4} mb={2}>
                {safeChildren}
              </List.Root>
            );
          case 'li':
            return <ListItem>{safeChildren}</ListItem>;
          default:
            return <></>;
        }
      }

      return undefined;
    },
  };

  return parse(html, options);
};
