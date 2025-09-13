// src/data/EducationTransitionRules.ts

export interface TransitionRule {
  from: { stage: string; level: string; };
  to: { stage: string; level: string; };
  feasibility: 'feasible' | 'infeasible';
  conditions: string[];
  description: string;
  prevalence: number; // 常见度 (0-1)
}

export const EDUCATION_TRANSITION_RULES: TransitionRule[] = [
  // ================== 幼儿园 -> 小学 ==================
  { from: { stage: '幼儿园', level: '公立' }, to: { stage: '小学', level: '公立' }, feasibility: 'feasible', conditions: ['需满足小学学区户籍与房产要求'], description: '按政策升学，需提前规划学区房', prevalence: 0.9 },
  { from: { stage: '幼儿园', level: '公立' }, to: { stage: '小学', level: '普通私立' }, feasibility: 'feasible', conditions: ['通过私立小学入学考核'], description: '通过目标私立学校的选拔考试即可', prevalence: 0.6 },
  { from: { stage: '幼儿园', level: '公立' }, to: { stage: '小学', level: '民办双语' }, feasibility: 'feasible', conditions: ['通过双语学校入学考核（中英文面试）'], description: '通过目标双语学校的选拔即可', prevalence: 0.5 },
  { from: { stage: '幼儿园', level: '公立' }, to: { stage: '小学', level: '外籍人员子女学校' }, feasibility: 'infeasible', conditions: ['孩子需持有外籍护照或港澳台身份'], description: '身份不符，无法申请', prevalence: 0.1 },

  { from: { stage: '幼儿园', level: '普通私立' }, to: { stage: '小学', level: '公立' }, feasibility: 'feasible', conditions: ['需满足小学学区户籍与房产要求'], description: '按政策升学，需有学区房', prevalence: 0.6 },
  { from: { stage: '幼儿园', level: '普通私立' }, to: { stage: '小学', level: '普通私立' }, feasibility: 'feasible', conditions: [], description: '常见选择', prevalence: 0.8 },
  { from: { stage: '幼儿园', level: '普通私立' }, to: { stage: '小学', level: '民办双语' }, feasibility: 'feasible', conditions: ['通过双语学校入学考核（中英文面试）'], description: '通过目标双语学校的选拔即可', prevalence: 0.5 },
  { from: { stage: '幼儿园', level: '普通私立' }, to: { stage: '小学', level: '外籍人员子女学校' }, feasibility: 'infeasible', conditions: ['孩子需持有外籍护照或港澳台身份'], description: '身份不符，无法申请', prevalence: 0.1 },

  { from: { stage: '幼儿园', level: '民办双语' }, to: { stage: '小学', level: '公立' }, feasibility: 'feasible', conditions: ['需满足小学学区户籍与房产要求'], description: '按政策升学，需有学区房', prevalence: 0.5 },
  { from: { stage: '幼儿园', level: '民办双语' }, to: { stage: '小学', level: '普通私立' }, feasibility: 'feasible', conditions: [], description: '常见选择', prevalence: 0.5 },
  { from: { stage: '幼儿园', level: '民办双语' }, to: { stage: '小学', level: '民办双语' }, feasibility: 'feasible', conditions: [], description: '自然衔接，常见选择', prevalence: 0.7 },
  { from: { stage: '幼儿园', level: '民办双语' }, to: { stage: '小学', level: '外籍人员子女学校' }, feasibility: 'infeasible', conditions: ['孩子需持有外籍护照或港澳台身份'], description: '身份不符，无法申请', prevalence: 0.1 },

  { from: { stage: '幼儿园', level: '外籍人员子女学校' }, to: { stage: '小学', level: '公立' }, feasibility: 'infeasible', conditions: ['无法满足户籍政策'], description: '政策不允许', prevalence: 0.1 },
  { from: { stage: '幼儿园', level: '外籍人员子女学校' }, to: { stage: '小学', level: '普通私立' }, feasibility: 'feasible', conditions: ['通过私立小学入学考核'], description: '需通过考试，且孩子需适应中文教学环境', prevalence: 0.3 },
  { from: { stage: '幼儿园', level: '外籍人员子女学校' }, to: { stage: '小学', level: '民办双语' }, feasibility: 'feasible', conditions: ['通过双语学校入学考核'], description: '相对顺畅的转换', prevalence: 0.3 },
  { from: { stage: '幼儿园', level: '外籍人员子女学校' }, to: { stage: '小学', level: '外籍人员子女学校' }, feasibility: 'feasible', conditions: [], description: '自然衔接', prevalence: 0.3 },

  // ================== 小学 -> 初中 ==================
  { from: { stage: '小学', level: '公立' }, to: { stage: '初中', level: '公立' }, feasibility: 'feasible', conditions: ['参加毕业考试或按学区派位'], description: '主流路径', prevalence: 0.9 },
  { from: { stage: '小学', level: '公立' }, to: { stage: '初中', level: '普通私立' }, feasibility: 'feasible', conditions: ['通过私立初中选拔考试'], description: '通过目标初中选拔', prevalence: 0.6 },
  { from: { stage: '小学', level: '公立' }, to: { stage: '初中', level: '民办双语' }, feasibility: 'feasible', conditions: ['通过双语初中选拔考试（含英文测试）'], description: '通过目标双语初中选拔', prevalence: 0.5 },
  { from: { stage: '小学', level: '公立' }, to: { stage: '初中', level: '外籍人员子女学校' }, feasibility: 'infeasible', conditions: ['孩子需持有外籍护照或港澳台身份'], description: '身份不符', prevalence: 0.1 },

  { from: { stage: '小学', level: '普通私立' }, to: { stage: '初中', level: '公立' }, feasibility: 'feasible', conditions: ['需参加毕业考试或按学区派位'], description: '需有学区房或通过考试', prevalence: 0.6 },
  { from: { stage: '小学', level: '普通私立' }, to: { stage: '初中', level: '普通私立' }, feasibility: 'feasible', conditions: [], description: '常见选择', prevalence: 0.8 },
  { from: { stage: '小学', level: '普通私立' }, to: { stage: '初中', level: '民办双语' }, feasibility: 'feasible', conditions: ['通过双语初中选拔考试（含英文测试）'], description: '通过目标双语初中选拔', prevalence: 0.5 },
  { from: { stage: '小学', level: '普通私立' }, to: { stage: '初中', level: '外籍人员子女学校' }, feasibility: 'infeasible', conditions: ['孩子需持有外籍护照或港澳台身份'], description: '身份不符', prevalence: 0.1 },

  { from: { stage: '小学', level: '民办双语' }, to: { stage: '初中', level: '公立' }, feasibility: 'feasible', conditions: ['需参加毕业考试或按学区派位'], description: '需有学区房或通过考试', prevalence: 0.5 },
  { from: { stage: '小学', level: '民办双语' }, to: { stage: '初中', level: '普通私立' }, feasibility: 'feasible', conditions: ['通过私立初中选拔考试'], description: '通过目标初中选拔', prevalence: 0.5 },
  { from: { stage: '小学', level: '民办双语' }, to: { stage: '初中', level: '民办双语' }, feasibility: 'feasible', conditions: [], description: '最常见的选择，自然衔接', prevalence: 0.7 },
  { from: { stage: '小学', level: '民办双语' }, to: { stage: '初中', level: '外籍人员子女学校' }, feasibility: 'infeasible', conditions: ['孩子需持有外籍护照或港澳台身份'], description: '身份不符', prevalence: 0.1 },

  { from: { stage: '小学', level: '外籍人员子女学校' }, to: { stage: '初中', level: '公立' }, feasibility: 'infeasible', conditions: ['无法满足户籍政策'], description: '政策不允许', prevalence: 0.1 },
  { from: { stage: '小学', level: '外籍人员子女学校' }, to: { stage: '初中', level: '普通私立' }, feasibility: 'feasible', conditions: ['通过私立初中选拔考试'], description: '需通过考试，且孩子需适应中文教学环境', prevalence: 0.3 },
  { from: { stage: '小学', level: '外籍人员子女学校' }, to: { stage: '初中', level: '民办双语' }, feasibility: 'feasible', conditions: ['通过双语初中选拔考试'], description: '相对顺畅的转换', prevalence: 0.3 },
  { from: { stage: '小学', level: '外籍人员子女学校' }, to: { stage: '初中', level: '外籍人员子女学校' }, feasibility: 'feasible', conditions: [], description: '自然衔接', prevalence: 0.3 },

  // ================== 初中 -> 高中 ==================
  { from: { stage: '初中', level: '公立' }, to: { stage: '高中', level: '公立' }, feasibility: 'feasible', conditions: ['必须参加中考并达到录取分数线'], description: '最主流的路径，竞争激烈', prevalence: 0.9 },
  { from: { stage: '初中', level: '公立' }, to: { stage: '高中', level: '民办普通高中' }, feasibility: 'feasible', conditions: ['参加中考，分数达到私立校要求'], description: '中考分数达到要求即可', prevalence: 0.5 },
  { from: { stage: '初中', level: '公立' }, to: { stage: '高中', level: '职业高中' }, feasibility: 'feasible', conditions: ['参加中考，或通过自主招生'], description: '通过中考或职业高中自主招生', prevalence: 0.3 },
  { from: { stage: '初中', level: '公立' }, to: { stage: '高中', level: '公立国际部' }, feasibility: 'feasible', conditions: ['必须参加中考并达到极高分数线', '通过国际部的加试（英语、面试）'], description: '要求最高，需要学术和英语能力俱佳', prevalence: 0.9 },
  { from: { stage: '初中', level: '公立' }, to: { stage: '高中', level: '民办国际化学校' }, feasibility: 'feasible', conditions: ['通过学校的自主招生考试（数学、英语、面试）'], description: '主流转轨路径，通过学校考试即可', prevalence: 0.4 },
  { from: { stage: '初中', level: '公立' }, to: { stage: '高中', level: '外籍人员子女学校' }, feasibility: 'infeasible', conditions: ['孩子需持有外籍护照或港澳台身份'], description: '身份不符', prevalence: 0.1 },

  { from: { stage: '初中', level: '普通私立' }, to: { stage: '高中', level: '公立' }, feasibility: 'feasible', conditions: ['必须参加中考并达到录取分数线'], description: '可行，但需额外备考国内中考课程', prevalence: 0.6 },
  { from: { stage: '初中', level: '普通私立' }, to: { stage: '高中', level: '民办普通高中' }, feasibility: 'feasible', conditions: [], description: '常见选择', prevalence: 0.5 },
  { from: { stage: '初中', level: '普通私立' }, to: { stage: '高中', level: '职业高中' }, feasibility: 'feasible', conditions: [], description: '可选路径', prevalence: 0.3 },
  { from: { stage: '初中', level: '普通私立' }, to: { stage: '高中', level: '公立国际部' }, feasibility: 'feasible', conditions: ['必须参加中考并达到分数线', '通过国际部的加试'], description: '理想路径之一，优势在于英语能力', prevalence: 0.6 },
  { from: { stage: '初中', level: '普通私立' }, to: { stage: '高中', level: '民办国际化学校' }, feasibility: 'feasible', conditions: ['通过学校的自主招生考试'], description: '常见转轨路径', prevalence: 0.4 },
  { from: { stage: '初中', level: '普通私立' }, to: { stage: '高中', level: '外籍人员子女学校' }, feasibility: 'infeasible', conditions: ['孩子需持有外籍护照或港澳台身份'], description: '身份不符', prevalence: 0.1 },

  { from: { stage: '初中', level: '民办双语' }, to: { stage: '高中', level: '公立' }, feasibility: 'feasible', conditions: ['必须参加中考并达到录取分数线'], description: '可行，但需额外备考国内中考课程', prevalence: 0.5 },
  { from: { stage: '初中', level: '民办双语' }, to: { stage: '高中', level: '民办普通高中' }, feasibility: 'feasible', conditions: ['参加中考，分数达到要求'], description: '中考分数达到要求即可', prevalence: 0.5 },
  { from: { stage: '初中', level: '民办双语' }, to: { stage: '高中', level: '职业高中' }, feasibility: 'feasible', conditions: [], description: '可选路径', prevalence: 0.3 },
  { from: { stage: '初中', level: '民办双语' }, to: { stage: '高中', level: '公立国际部' }, feasibility: 'feasible', conditions: ['必须参加中考并达到分数线', '通过国际部的加试'], description: '理想路径之一，优势在于英语能力', prevalence: 0.4 },
  { from: { stage: '初中', level: '民办双语' }, to: { stage: '高中', level: '民办国际化学校' }, feasibility: 'feasible', conditions: ['通过学校的自主招生考试'], description: '最自然、最常见的衔接路径', prevalence: 0.4 },
  { from: { stage: '初中', level: '民办双语' }, to: { stage: '高中', level: '外籍人员子女学校' }, feasibility: 'infeasible', conditions: ['孩子需持有外籍护照或港澳台身份'], description: '身份不符', prevalence: 0.1 },

  { from: { stage: '初中', level: '外籍人员子女学校' }, to: { stage: '高中', level: '公立' }, feasibility: 'infeasible', conditions: ['无法参加中考'], description: '政策不允许', prevalence: 0.1 },
  { from: { stage: '初中', level: '外籍人员子女学校' }, to: { stage: '高中', level: '民办普通高中' }, feasibility: 'feasible', conditions: ['通过私立高中选拔考试'], description: '需通过考试，且孩子需适应中文教学环境', prevalence: 0.3 },
  { from: { stage: '初中', level: '外籍人员子女学校' }, to: { stage: '高中', level: '职业高中' }, feasibility: 'feasible', conditions: ['通过自主招生'], description: '需通过考试，且孩子需适应中文教学环境', prevalence: 0.3 },
  { from: { stage: '初中', level: '外籍人员子女学校' }, to: { stage: '高中', level: '公立国际部' }, feasibility: 'infeasible', conditions: ['通常需本地户籍和中考成绩'], description: '政策不符', prevalence: 0.1 },
  { from: { stage: '初中', level: '外籍人员子女学校' }, to: { stage: '高中', level: '民办国际化学校' }, feasibility: 'feasible', conditions: ['通过学校自主招生考试'], description: '常见选择', prevalence: 0.3 },
  { from: { stage: '初中', level: '外籍人员子女学校' }, to: { stage: '高中', level: '外籍人员子女学校' }, feasibility: 'feasible', conditions: [], description: '自然衔接', prevalence: 0.3 },

  // ================== 高中 -> 大学 ==================
  { from: { stage: '高中', level: '公立' }, to: { stage: '大学', level: '国内公办' }, feasibility: 'feasible', conditions: ['必须参加高考并达到录取分数线'], description: '主流国内升学路径', prevalence: 0.8 },
  { from: { stage: '高中', level: '公立' }, to: { stage: '大学', level: '国内民办' }, feasibility: 'feasible', conditions: ['必须参加高考并达到录取分数线'], description: '国内升学路径', prevalence: 0.6 },
  { from: { stage: '高中', level: '公立' }, to: { stage: '大学', level: '海外大学' }, feasibility: 'feasible', conditions: ['不参加高考，需额外准备托福/雅思、SAT/ACT、申请材料'], description: '可行但极其辛苦，需在高考体系外付出巨大努力', prevalence: 0.3 },
  { from: { stage: '高中', level: '公立' }, to: { stage: '大学', level: '中外合作办学' }, feasibility: 'feasible', conditions: ['必须参加高考并达到录取分数线', '或通过综合评价选拔'], description: '通过高考或综合评价录取', prevalence: 0.5 },

  { from: { stage: '高中', level: '民办普通高中' }, to: { stage: '大学', level: '国内公办' }, feasibility: 'feasible', conditions: ['必须参加高考并达到录取分数线'], description: '主流国内升学路径', prevalence: 0.8 },
  { from: { stage: '高中', level: '民办普通高中' }, to: { stage: '大学', level: '国内民办' }, feasibility: 'feasible', conditions: ['必须参加高考并达到录取分数线'], description: '国内升学路径', prevalence: 0.6 },
  { from: { stage: '高中', level: '民办普通高中' }, to: { stage: '大学', level: '海外大学' }, feasibility: 'feasible', conditions: ['不参加高考，需额外准备托福/雅思、SAT/ACT、申请材料'], description: '可行但极其辛苦，需在高考体系外付出巨大努力', prevalence: 0.3 },
  { from: { stage: '高中', level: '民办普通高中' }, to: { stage: '大学', level: '中外合作办学' }, feasibility: 'feasible', conditions: ['必须参加高考并达到录取分数线', '或通过综合评价选拔'], description: '通过高考或综合评价录取', prevalence: 0.5 },

  { from: { stage: '高中', level: '职业高中' }, to: { stage: '大学', level: '国内公办' }, feasibility: 'feasible', conditions: ['参加职教高考或技能拔尖人才免试入学'], description: '通过职业教育的升学通道', prevalence: 0.3 },
  { from: { stage: '高中', level: '职业高中' }, to: { stage: '大学', level: '国内民办' }, feasibility: 'feasible', conditions: ['参加职教高考'], description: '通过职业教育的升学通道', prevalence: 0.3 },
  { from: { stage: '高中', level: '职业高中' }, to: { stage: '大学', level: '海外大学' }, feasibility: 'feasible', conditions: ['需额外准备语言成绩和申请材料'], description: '需要针对性地准备申请', prevalence: 0.3 },
  { from: { stage: '高中', level: '职业高中' }, to: { stage: '大学', level: '中外合作办学' }, feasibility: 'feasible', conditions: ['参加职教高考或通过自主招生'], description: '通过职业教育通道或自主招生', prevalence: 0.5 },

  { from: { stage: '高中', level: '公立国际部' }, to: { stage: '大学', level: '国内公办' }, feasibility: 'infeasible', conditions: ['通常无国内学籍，无法参加高考'], description: '路径锁定，极难回头', prevalence: 0.1 },
  { from: { stage: '高中', level: '公立国际部' }, to: { stage: '大学', level: '国内民办' }, feasibility: 'infeasible', conditions: ['通常无国内学籍，无法参加高考'], description: '路径锁定，极难回头', prevalence: 0.1 },
  { from: { stage: '高中', level: '公立国际部' }, to: { stage: '大学', level: '海外大学' }, feasibility: 'feasible', conditions: ['完成AP/A-Level/IB课程', '取得合格的托福/雅思成绩', '完成申请'], description: '主流出口，目标明确', prevalence: 0.3 },
  { from: { stage: '高中', level: '公立国际部' }, to: { stage: '大学', level: '中外合作办学' }, feasibility: 'feasible', conditions: ['用国际课程成绩申请'], description: '良好的备选路径', prevalence: 0.5 },

  { from: { stage: '高中', level: '民办国际化学校' }, to: { stage: '大学', level: '国内公办' }, feasibility: 'infeasible', conditions: ['无国内学籍，无法参加高考'], description: '路径锁定，无法回头', prevalence: 0.1 },
  { from: { stage: '高中', level: '民办国际化学校' }, to: { stage: '大学', level: '国内民办' }, feasibility: 'infeasible', conditions: ['无国内学籍，无法参加高考'], description: '路径锁定，无法回头', prevalence: 0.1 },
  { from: { stage: '高中', level: '民办国际化学校' }, to: { stage: '大学', level: '海外大学' }, feasibility: 'feasible', conditions: ['完成AP/A-Level/IB课程', '取得合格的托福/雅思成绩', '完成申请'], description: '主流出口，目标明确', prevalence: 0.4 },
  { from: { stage: '高中', level: '民办国际化学校' }, to: { stage: '大学', level: '中外合作办学' }, feasibility: 'feasible', conditions: ['用国际课程成绩申请'], description: '良好的备选路径', prevalence: 0.4 },

  { from: { stage: '高中', level: '外籍人员子女学校' }, to: { stage: '大学', level: '国内公办' }, feasibility: 'infeasible', conditions: ['无法参加高考'], description: '政策不允许', prevalence: 0.1 },
  { from: { stage: '高中', level: '外籍人员子女学校' }, to: { stage: '大学', level: '国内民办' }, feasibility: 'infeasible', conditions: ['无法参加高考'], description: '政策不允许', prevalence: 0.1 },
  { from: { stage: '高中', level: '外籍人员子女学校' }, to: { stage: '大学', level: '海外大学' }, feasibility: 'feasible', conditions: ['完成IB/AP等课程', '取得合格的语言成绩', '完成申请'], description: '主流出口，目标明确', prevalence: 0.3 },
  { from: { stage: '高中', level: '外籍人员子女学校' }, to: { stage: '大学', level: '中外合作办学' }, feasibility: 'feasible', conditions: ['用国际课程成绩申请'], description: '可能的备选路径', prevalence: 0.3 },

  // ================== 大学 -> 研究生 ==================
  { from: { stage: '大学', level: '国内公办' }, to: { stage: '研究生', level: '国内硕士' }, feasibility: 'feasible', conditions: ['参加全国硕士研究生招生考试（考研）'], description: '主流国内深造路径', prevalence: 0.8 },
  { from: { stage: '大学', level: '国内公办' }, to: { stage: '研究生', level: '海外硕士' }, feasibility: 'feasible', conditions: ['高GPA', '合格的托福/雅思成绩', '优秀的个人陈述与推荐信'], description: '常见路径，“海硕”性价比高', prevalence: 0.4 },

  { from: { stage: '大学', level: '国内民办' }, to: { stage: '研究生', level: '国内硕士' }, feasibility: 'feasible', conditions: ['参加全国硕士研究生招生考试（考研）'], description: '国内深造路径', prevalence: 0.6 },
  { from: { stage: '大学', level: '国内民办' }, to: { stage: '研究生', level: '海外硕士' }, feasibility: 'feasible', conditions: ['高GPA', '合格的托福/雅思成绩', '优秀的个人陈述与推荐信'], description: '常见路径', prevalence: 0.4 },

  { from: { stage: '大学', level: '海外大学' }, to: { stage: '研究生', level: '海外硕士' }, feasibility: 'feasible', conditions: ['高GPA', '合格的GRE/GMAT成绩（如需）', '优秀的个人陈述与推荐信'], description: '自然衔接', prevalence: 0.3 },
  { from: { stage: '大学', level: '海外大学' }, to: { stage: '研究生', level: '国内硕士' }, feasibility: 'feasible', conditions: ['参加全国硕士研究生招生考试（考研）'], description: '回国考研，需额外复习政治等科目', prevalence: 0.3 },

  { from: { stage: '大学', level: '中外合作办学' }, to: { stage: '研究生', level: '国内硕士' }, feasibility: 'feasible', conditions: ['参加全国硕士研究生招生考试（考研）'], description: '国内深造路径', prevalence: 0.5 },
  { from: { stage: '大学', level: '中外合作办学' }, to: { stage: '研究生', level: '海外硕士' }, feasibility: 'feasible', conditions: ['高GPA', '合格的托福/雅思成绩', '优秀的个人陈述与推荐信'], description: '常见路径，优势较大', prevalence: 0.4 },

  // ================== 研究生 -> 博士 ==================
  { from: { stage: '研究生', level: '国内硕士' }, to: { stage: '博士', level: '国内博士' }, feasibility: 'feasible', conditions: ['通过博士申请考核制或考试'], description: '国内学术深造', prevalence: 0.7 },
  { from: { stage: '研究生', level: '国内硕士' }, to: { stage: '博士', level: '海外博士' }, feasibility: 'feasible', conditions: ['出色的研究成果（论文）', '高GPA', '合格的托福/雅思成绩', '优秀的Research Proposal'], description: '申请制，看重科研潜力', prevalence: 0.2 },

  { from: { stage: '研究生', level: '海外硕士' }, to: { stage: '博士', level: '海外博士' }, feasibility: 'feasible', conditions: ['出色的研究成果', '高GPA', '优秀的Research Proposal'], description: '自然衔接', prevalence: 0.4 },
  { from: { stage: '研究生', level: '海外硕士' }, to: { stage: '博士', level: '国内博士' }, feasibility: 'feasible', conditions: ['通过博士申请考核制或考试'], description: '回国读博，需满足国内高校要求', prevalence: 0.4 },
];