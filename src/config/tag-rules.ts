/**
 * 标签规则配置文件
 * 通过修改此文件可以调整标签计算规则，无需修改核心算法代码
 */

// 国际体系水平定义配置
export const INTERNATIONAL_LEVEL_CONFIG = {
  // 小学/初中阶段的国际体系水平
  '小学': ['民办双语'],
  '初中': ['民办双语'],
  
  // 高中阶段的国际体系水平
  '高中': ['公立国际部', '民办国际化学校'],
  
  // 大学/研究生阶段的国际体系水平
  '大学': ['海外大学'],
  '研究生': ['海外硕士', '海外博士']
};

// 转轨时机标签配置
export const TRANSITION_TIMING_CONFIG = {
  // 转轨时机判断规则
  EARLY_STAGES: ['小学', '初中'],
  MID_STAGES: ['高中'],
  LATE_STAGES: ['大学', '研究生'],
  
  // 教育阶段顺序（用于连续性判断）
  STAGE_ORDER: ['小学', '初中', '高中', '大学', '研究生']
};

// 学位类型标签配置
export const DEGREE_TYPE_CONFIG = {
  // 国内学位类型
  DOMESTIC_LEVELS: ['国内公办', '国内民办', '中外合作办学', '国内硕士', '国内博士'],
  
  // 海外学位类型
  OVERSEAS_LEVELS: ['海外大学', '海外硕士', '海外博士']
};

// 可行性标签配置
export const FEASIBILITY_CONFIG = {
  // 可行性阈值
  HIGH_FEASIBILITY_THRESHOLD: 0.8,  // 高可行性阈值
  MEDIUM_FEASIBILITY_THRESHOLD: 0.3, // 中等可行性阈值
  
  // 常见度阈值
  HIGH_PREVALENCE_THRESHOLD: 0.5,    // 高常见度阈值
  MEDIUM_PREVALENCE_THRESHOLD: 0.1   // 中等常见度阈值
};
