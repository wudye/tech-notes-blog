import React, { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import CopyButton from './CopyButton.tsx'
import { Box, Modal, IconButton } from '@mui/material'
import { Close, ZoomIn } from '@mui/icons-material'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

interface MarkdownRenderProps {
  markdown: string
}

const MarkdownRender: React.FC<MarkdownRenderProps> = ({ markdown }) => {
  const markdownBodyRef = useRef<HTMLDivElement>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  useEffect(() => {
    if (!markdownBodyRef.current) return
    markdownBodyRef.current.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block as HTMLElement)
    })
  })

  const handleImageClick = (src: string) => {
    setPreviewImage(src)
  }

  const handleClosePreview = () => {
    setPreviewImage(null)
  }

  return (
    <>
      <Box className="markdown-body" ref={markdownBodyRef}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            code(props) {
              const { children, className, ...rest } = props
              const match = /language-(\w+)/.exec(className || '')
              return match ? (
                <Box sx={{ position: 'relative' }}>
                  <CopyButton textToCopy={String(children)} />
                  <code className={className} {...props}>
                    {children}
                  </code>
                </Box>
              ) : (
                <code {...rest} className={className}>
                  {children}
                </code>
              )
            },
            img(props) {
              const { src, alt } = props
              return (
                <Box
                  sx={{
                    position: 'relative',
                    display: 'inline-block',
                    maxWidth: '100%',
                    cursor: 'pointer',
                    '&:hover .zoom-icon': {
                      opacity: 1,
                    },
                  }}
                  onClick={() => src && handleImageClick(src)}
                >
                  <Box
                    component="img"
                    src={src}
                    alt={alt}
                    sx={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: 1,
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.02)',
                      },
                    }}
                  />
                  <IconButton
                    className="zoom-icon"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      color: 'white',
                      opacity: 0,
                      transition: 'opacity 0.2s',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      },
                    }}
                    size="small"
                  >
                    <ZoomIn fontSize="small" />
                  </IconButton>
                </Box>
              )
            },
            p: ({ children }) => (
              <Box sx={{ mt: 0, mb: 2 }}>{children}</Box>
            ),
          }}
        >
          {markdown}
        </ReactMarkdown>
      </Box>

      {/* Image Preview Modal */}
      <Modal
        open={!!previewImage}
        onClose={handleClosePreview}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Box
          sx={{
            position: 'relative',
            maxWidth: '90vw',
            maxHeight: '90vh',
            outline: 'none',
          }}
        >
          <IconButton
            onClick={handleClosePreview}
            sx={{
              position: 'absolute',
              top: -40,
              right: -40,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              },
            }}
          >
            <Close />
          </IconButton>
          <Box
            component="img"
            src={previewImage || ''}
            sx={{
              maxWidth: '100%',
              maxHeight: '100%',
              borderRadius: 1,
              boxShadow: 24,
            }}
          />
        </Box>
      </Modal>
    </>
  )
}

export default MarkdownRender