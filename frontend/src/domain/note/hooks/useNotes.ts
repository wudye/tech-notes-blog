import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import type {
  CreateNoteParams,
  NoteQueryParams,
  NoteWithRelations,
} from '../types/serviceTypes.ts'
import { noteService } from '../service/noteService.ts'
import type { Pagination } from '../../../request'
import { useUser } from '../../user/hooks/useUser.ts'

/**
 * 获取笔记列表
 */
export function useNotes(noteQueryParams: NoteQueryParams) {
  /**
   * 笔记列表
   */
  const [noteList, setNoteList] = useState<NoteWithRelations[]>([])
  const [loading, setLoading] = useState(false)

  const user = useUser()

  /**
   * 分页参数
   */
  const [pagination, setPagination] = useState<Pagination>()

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const { data, pagination } =
          await noteService.getNoteList(noteQueryParams)
        setNoteList(data)
        setPagination(pagination)
      } catch (error) {
        toast.error('获取笔记列表失败')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [
    noteQueryParams,
    noteQueryParams.authorId,
    noteQueryParams.questionId,
    noteQueryParams.collectionId,
    noteQueryParams.page,
    noteQueryParams.pageSize,
    noteQueryParams.sort,
    noteQueryParams.order,
    noteQueryParams.recentDays,
  ])

  function createNewNoteWithRelations(
    questionId: number,
    noteId: number,
    content: string,
  ): NoteWithRelations {
    return {
      noteId,
      content,
      needCollapsed: true,
      displayContent: content,
      likeCount: 0,
      commentCount: 0,
      collectCount: 0,
      createdAt: new Date().toISOString(),
      author: {
        userId: user.userId,
        username: user.username,
        avatarUrl: user.avatarUrl,
      },
      question: {
        questionId: questionId,
        title: '',
      },
      userActions: {
        isLiked: false,
        isCollected: false,
      },
    }
  }

  /**
   * 创建笔记
   * @param questionId 题目 ID
   * @param content 笔记内容
   */
  async function createNoteHandle(
    questionId: number,
    content: string,
  ): Promise<number | undefined> {
    if (!content.trim()) {
      toast.info('笔记内容为空')
      return
    }

    try {
      // data == noteId
      const { data } = await noteService.createNoteService({
        content,
        questionId,
      })

      setNoteList((prevNoteList) => {
        return [
          createNewNoteWithRelations(questionId, data.noteId, content),
          ...prevNoteList,
        ]
      })
      
      toast.success('笔记创建成功')
      return data.noteId
    } catch (error) {
      toast.error('创建笔记失败')
    }
  }

  /**
   * 更新笔记
   */
  async function updateNoteHandle(
    noteId: number,
    updateBody: CreateNoteParams,
  ) {
    try {
      await noteService.updateNoteService(noteId, updateBody)

      setNoteList((prevNoteList) => {
        return prevNoteList.map((note) => {
          if (note.noteId === noteId) {
            return {
              ...note,
              content: updateBody.content,
            }
          }
          return note
        })
      })
      
      toast.success('笔记更新成功')
    } catch (error) {
      toast.error('更新笔记失败')
    }
  }

  /**
   * 设置笔记点赞状态
   */
  function setNoteLikeStatusHandle(noteId: number, isLiked: boolean) {
    if (!noteId) return
    setNoteList((prevNoteList) => {
      return prevNoteList.map((item) => {
        if (item.noteId === noteId && item.userActions) {
          return {
            ...item,
            likeCount: isLiked ? item.likeCount + 1 : item.likeCount - 1,
            userActions: {
              ...item.userActions,
              isLiked,
            },
          }
        }
        return item
      })
    })
  }

  /**
   * 设置笔记收藏状态
   */
  function setNoteCollectStatusHandle(noteId: number, isCollected: boolean) {
    if (!noteId) return
    setNoteList((prevNoteList) => {
      return prevNoteList.map((item) => {
        if (item.noteId === noteId && item.userActions) {
          return {
            ...item,
            collectCount: isCollected
              ? item.collectCount + 1
              : item.collectCount - 1,
            userActions: {
              ...item.userActions,
              isCollected,
            },
          }
        }
        return item
      })
    })
  }

  return {
    loading,
    noteList,
    pagination,
    createNoteHandle,
    updateNoteHandle,
    setNoteLikeStatusHandle,
    setNoteCollectStatusHandle,
  }
}