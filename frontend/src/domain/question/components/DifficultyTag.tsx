import React from 'react'
import { Chip } from '@mui/material'
import { QuestionDifficulty } from '../types/types.ts'

interface DifficultyTagProps {
  difficulty?: QuestionDifficulty
}

/**
 * 根据题目难度返回对应的标签
 */
const DifficultyTag: React.FC<DifficultyTagProps> = ({ difficulty }) => {
  switch (difficulty) {
    case QuestionDifficulty.Easy:
      return <Chip label="简单" color="success" size="small" />
    case QuestionDifficulty.Medium:
      return <Chip label="中等" color="warning" size="small" />
    case QuestionDifficulty.Hard:
      return <Chip label="困难" color="error" size="small" />
    default:
      return <Chip label="难度" color="default" size="small" />
  }
}

export default DifficultyTag