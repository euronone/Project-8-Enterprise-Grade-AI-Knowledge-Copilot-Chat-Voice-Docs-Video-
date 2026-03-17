import * as React from 'react'
import { highlight, languages } from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-sql'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/button'

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  code: string
  language?: string
  showLineNumbers?: boolean
  showCopyButton?: boolean
}

const CodeBlock = React.forwardRef<HTMLPreElement, CodeBlockProps>(
  (
    {
      code,
      language = 'typescript',
      showLineNumbers = true,
      showCopyButton = true,
      className,
      ...props
    },
    ref
  ) => {
    const [copied, setCopied] = React.useState(false)

    const highlightCode = (code: string, lang: string) => {
      try {
        if (languages[lang]) {
          return highlight(code, languages[lang], lang)
        }
        return code
      } catch {
        return code
      }
    }

    const handleCopy = async () => {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }

    const highlightedCode = highlightCode(code.trim(), language)
    const lines = highlightedCode.split('\n')

    return (
      <div className="relative rounded-[14px] border border-[#374151] bg-[#0F172A] shadow-sm">
        <div className="flex items-center justify-between bg-[#1F2937]/50 px-4 py-3 border-b border-[#374151]">
          <span className="text-xs font-medium text-[#6B7280] uppercase tracking-wider">{language}</span>
          {showCopyButton && (
            <Button
              onClick={handleCopy}
              variant="ghost"
              size="icon"
              className={cn(
                'h-8 w-8',
                copied ? 'text-[#22C55E]' : 'text-[#9CA3AF]'
              )}
              title="Copy code"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
        <pre
          ref={ref}
          className={cn(
            'overflow-x-auto bg-[#0F172A] p-4 text-sm text-[#E5E7EB]',
            className
          )}
          {...props}
        >
          {showLineNumbers ? (
            <table className="w-full">
              <tbody>
                {lines.map((line: string, i: number) => (
                  <tr key={i}>
                    <td className="select-none pr-4 text-right text-muted-foreground">
                      {i + 1}
                    </td>
                    <td>
                      <code
                        dangerouslySetInnerHTML={{ __html: line }}
                        className={`language-${language}`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <code
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
              className={`language-${language}`}
            />
          )}
        </pre>
      </div>
    )
  }
)

CodeBlock.displayName = 'CodeBlock'

export { CodeBlock }
export type { CodeBlockProps }
