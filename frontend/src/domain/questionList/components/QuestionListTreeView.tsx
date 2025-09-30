import React, { useEffect, useState } from 'react'
import { TreeView, TreeItem } from '@mui/x-tree-view'
import { ExpandMore, ChevronRight } from '@mui/icons-material'
import type { QuestionListCategory } from '../types/types.ts'

interface QuestionListTreeViewProps {
  treeData: QuestionListCategory[]
  selectedQuestionListId: number | undefined
  handleQuestionListSelect: (selectedQuestionListId: number | undefined) => void
}

const QuestionListTreeView: React.FC<QuestionListTreeViewProps> = ({
  treeData,
  handleQuestionListSelect,
  selectedQuestionListId,
}) => {
  const [selected, setSelected] = useState<string>(
    selectedQuestionListId?.toString() ?? ''
  )
  const [expanded, setExpanded] = useState<string[]>([])

  useEffect(() => {
    if (selectedQuestionListId) {
      const selectedKey = selectedQuestionListId.toString()
      setSelected(selectedKey)
      
      // Find parent category to expand
      const parentCategory = treeData.find((treeNode) => {
        return treeNode.children?.find((childTreeNode) => {
          return childTreeNode.questionListId === selectedQuestionListId
        })
      })
      
      if (parentCategory) {
        setExpanded((prev) => [...prev, parentCategory.key.toString()])
      }
    }
  }, [selectedQuestionListId, treeData])

  /**
   * 选中节点
   */
  const handleSelect = (event: React.SyntheticEvent, nodeId: string) => {
    setSelected(nodeId)
    
    // Find the selected node in treeData
    let selectedNode: QuestionListCategory | undefined
    
    for (const category of treeData) {
      if (category.key.toString() === nodeId) {
        selectedNode = category
        break
      }
      if (category.children) {
        const childNode = category.children.find(
          child => child.key.toString() === nodeId
        )
        if (childNode) {
          selectedNode = childNode
          break
        }
      }
    }
    
    if (selectedNode) {
      handleQuestionListSelect(selectedNode.questionListId)
    }
  }

  /**
   * 展开/收起节点
   */
  const handleToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
    setExpanded(nodeIds)
  }

  /**
   * 递归渲染树节点
   */
  const renderTreeItems = (nodes: QuestionListCategory[]): React.ReactNode => {
    return nodes.map((node) => (
      <TreeItem
        key={node.key}
        nodeId={node.key.toString()}
        label={node.title}
      >
        {node.children && node.children.length > 0
          ? renderTreeItems(node.children)
          : null}
      </TreeItem>
    ))
  }

  return (
    <TreeView
      aria-label="question list tree"
      defaultCollapseIcon={<ExpandMore />}
      defaultExpandIcon={<ChevronRight />}
      selected={selected}
      expanded={expanded}
      onNodeSelect={handleSelect}
      onNodeToggle={handleToggle}
      sx={{
        flexGrow: 1,
        overflowY: 'auto',
        '& .MuiTreeItem-root': {
          '& .MuiTreeItem-content': {
            padding: '8px',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
            '&.Mui-selected': {
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            },
          },
        },
      }}
    >
      {renderTreeItems(treeData)}
    </TreeView>
  )
}

export default QuestionListTreeView