import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import type { QuestionListItemVO } from '../types/types.ts'
import { adminQuestionListService } from '../service/questionListService.ts'
import type { QuestionSummary } from '../../question'

export function useQuestionListItem(questionListId: number) {
  /**
   * 题单项列表
   */
  const [questionListItems, setQuestionListItems] = useState<
    QuestionListItemVO[]
  >([])

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const { data } =
          await adminQuestionListService.getQuestionListItemService(
            questionListId,
          )
        setQuestionListItems(data)
      } catch (error) {
        toast.error('获取题单项失败')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [questionListId])

  /**
   * 添加题单项
   * @param questionListId 题单 ID
   * @param question QuestionSummary
   */
  async function createQuestionListItem(
    questionListId: number,
    question: QuestionSummary,
  ) {
    /**
     * 检查是否加入了重复的题目
     */
    if (
      questionListItems.some(
        (item) => item.question.questionId === question.questionId,
      )
    ) {
      toast.warning('题目已存在')
      return
    }

    try {
      const { data } =
        await adminQuestionListService.createQuestionListItemService(
          questionListId,
          question.questionId,
        )
      setQuestionListItems((prev) => {
        const item = {
          questionListId,
          question,
          rank: data.rank,
        }
        return [...prev, item]
      })
      toast.success('添加成功')
    } catch (error) {
      toast.error('添加失败')
    }
  }

  /**
   * 删除题单项
   */
  async function deleteQuestionListItem(
    questionListId: number,
    questionId: number,
  ) {
    try {
      await adminQuestionListService.deleteQuestionListItemService(
        questionListId,
        questionId,
      )
      setQuestionListItems(
        questionListItems.filter(
          (item) => item.question.questionId !== questionId,
        ),
      )
      toast.success('删除成功')
    } catch (error) {
      toast.error('删除失败')
    }
  }

  /**
   * 排序处理函数
   */
  async function sortListItemVO(listItemVO: QuestionListItemVO[]) {
    if (listItemVO.length === 0) {
      toast.warning('listItem 长度为 0')
      return
    }

    setQuestionListItems(listItemVO)

    const questionListId = listItemVO[0].questionListId
    const questionIds = listItemVO.map((item) => item.question.questionId)

    try {
      await adminQuestionListService.sortQuestionListItemService({
        questionListId,
        questionIds,
      })
    } catch (error) {
      toast.error('排序失败')
    }
  }

  return {
    loading,
    questionListItems,
    createQuestionListItem,
    deleteQuestionListItem,
    sortListItemVO,
  }
}