import React from 'react';
import { MDXProvider } from '@mdx-js/react'
import Highlight, { defaultProps, Language } from 'prism-react-renderer';
import githubTheme from 'prism-react-renderer/themes/github';
import { MDXComponents } from 'mdx/types';

import General from '../mdx/general.mdx';
const components = {
  pre: ({ children: { props: { children, className = '' }}}) => {
    const matches = className?.match(/language-(?<lang>.*)/);
    const language = matches?.groups?.lang ? matches.groups.lang : '';
    return (
      <Highlight
        {...defaultProps}
        code={children}
        theme={githubTheme}
        language={language as Language}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <>
          <pre className={className} style={style}>
            {tokens.map((line, i) => !line[0].empty ? (
               <div {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} />
                ))}
              </div>
            ) : null)}
          </pre>
          </>
        )}
      </Highlight>
    );
  },
}

export const Docs = () => (
  <MDXProvider components={components as MDXComponents}>
    <div className='mc__container mc__container--docs'>
      <General />
    </div>
  </MDXProvider>
)
