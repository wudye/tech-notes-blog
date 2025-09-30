import React, { Suspense, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { QuestionView, useQuestion } from '../../../../domain/question'
import {
  MarkdownEditor,
  MarkdownRender,
  Panel,
} from '../../../../base/components'
import { 
  Button, 
  Dialog, 
  DialogContent, 
  CircularProgress, 
  Box, 
  Paper 
} from '@mui/material'
import { Upload, Visibility } from '@mui/icons-material'
import { NoteList, NoteQueryParams, useNotes } from '../../../../domain/note'
import { useApp } from '../../../../base/hooks'
import { toast } from 'react-hot-toast'

const QuestionPage: React.FC = () => {
  /**
   * 地址栏参数
   */
  const { questionId } = useParams()

  /**
   * 获取问题携带用户相关笔记的问题详情
   */
  const { question, userFinishedQuestion } = useQuestion(Number(questionId))

  /**
   * 笔记内容
   */
  const [value, setValue] = useState(question?.userNote.content ?? '')
  const setValueHandle = (value: string) => {
    setValue(value)
  }

  useEffect(() => {
    if (question?.userNote) {
      if (question?.userNote.finished) {
        setValueHandle(question?.userNote.content)
      }
    }
  }, [question])

  /**
   * 控制编辑器显示隐藏功能
   */
  const [isEditorVisible, setIsEditorVisible] = useState(false)
  const toggleEditorVisible = () => {
    setIsEditorVisible(!isEditorVisible)
  }

  /**
   * 写笔记 / 编辑笔记按钮点击事件
   */
  function writeOrEditButtonHandle() {
    toggleEditorVisible()
  }

  /**
   * 获取和问题相关的笔记列表
   */
  const [noteQueryParams, setNoteQueryParams] = useState<NoteQueryParams>({
    page: 1,
    pageSize: 10,
    questionId: Number(questionId),
  })

  const {
    noteList,
    pagination,
    createNoteHandle,
    updateNoteHandle,
    setNoteLikeStatusHandle,
    setNoteCollectStatusHandle,
  } = useNotes(noteQueryParams)

  /**
   * 提交笔记处理事件
   */
  const [createBtnLoading, setCreateBtnLoading] = useState(false)

  /**
   * 用户信息
   * app 信息
   */
  const app = useApp()

  const createOrUpdateNoteClickHandle = async () => {
    if (!app.isLogin) {
      toast.info('请先登录')
      return
    }

    setCreateBtnLoading(true)

    try {
      if (!question?.userNote.finished) {
        const noteId = await createNoteHandle(Number(questionId), value)
        toggleEditorVisible()
        // 校验一下 noteId
        if (noteId) {
          userFinishedQuestion(noteId, value)
        }
        toast.success('笔记已提交')
      } else {
        // 修改笔记操作
        if (!question?.userNote) return
        await updateNoteHandle(question?.userNote.noteId, {
          content: value,
          questionId: Number(questionId),
        })
        toast.success('笔记已修改')
        toggleEditorVisible()
      }
    } catch (e: any) {
      console.log(e.message)
      toast.error(e.message)
    } finally {
      setCreateBtnLoading(false)
    }
  }

  const [isShowPreview, setIsShowPreview] = useState(false)

  return (
    <>
      <QuestionView
        question={question}
        writeOrEditButtonHandle={writeOrEditButtonHandle}
      />
      {/* 编辑器 */}
      {isEditorVisible && (
        <Box
          sx={{
            mb: 4,
            display: 'flex',
            width: '100%',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ width: 900 }}>
            <Box
              sx={{
                height: 'calc(100vh - var(--header-height) - 65px)',
              }}
            >
              <Suspense
                fallback={
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      pt: 12,
                    }}
                  >
                    <CircularProgress sx={{ mb: 2 }} />
                    <span>加载编辑器中</span>
                  </Box>
                }
              >
                <MarkdownEditor
                  value={value}
                  setValue={setValueHandle}
                />
              </Suspense>
            </Box>
            <Paper
              sx={{
                position: 'sticky',
                bottom: 0,
                zIndex: 20,
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 2,
                borderTop: 1,
                borderColor: 'divider',
                bgcolor: 'background.paper',
                p: 2,
                boxShadow: 1,
              }}
            >
              <Button
                variant="outlined"
                startIcon={<Visibility />}
                onClick={() => setIsShowPreview(true)}
              >
                预览笔记
              </Button>
              <Button
                variant="contained"
                startIcon={<Upload />}
                disabled={createBtnLoading}
                onClick={createOrUpdateNoteClickHandle}
                sx={{
                  position: 'relative',
                }}
              >
                {createBtnLoading && (
                  <CircularProgress
                    size={16}
                    sx={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      marginLeft: '-8px',
                      marginTop: '-8px',
                    }}
                  />
                )}
                {question?.userNote.finished ? '修改笔记' : '提交笔记'}
              </Button>
            </Paper>
          </Box>
        </Box>
      )}
      {/* 预览框 */}
      <Dialog
        open={isShowPreview}
        onClose={() => setIsShowPreview(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { minHeight: '400px' }
        }}
      >
        <DialogContent>
          <MarkdownRender markdown={value} />
        </DialogContent>
      </Dialog>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ width: 700 }}>
          <Panel>
            <NoteList
              showQuestion={false}
              noteList={noteList}
              pagination={pagination}
              queryParams={noteQueryParams}
              setQueryParams={setNoteQueryParams}
              setNoteLikeStatusHandle={setNoteLikeStatusHandle}
              setNoteCollectStatusHandle={setNoteCollectStatusHandle}
            />
          </Panel>
        </Box>
      </Box>
    </>
  )
}

export default QuestionPage