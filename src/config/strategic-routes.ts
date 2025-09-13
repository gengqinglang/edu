/**
 * 战略路线配置
 * 通过修改此文件可以调整战略路线的分类规则和显示名称
 */

export interface StrategicRouteConfig {
  id: string;
  name: string;
  description: string;
  tagCombination: {
    transTiming?: string[];
    degreeType?: string[];
    feasibility?: string[];
  };
  advantages: string[];
  disadvantages: string[];
  examples: string[];
  priority: number; // 显示优先级，数字越小优先级越高
}

// 战略路线配置
export const STRATEGIC_ROUTE_CONFIGS: StrategicRouteConfig[] = [
  {
    id: 'domestic_direct',
    name: '国内直达路线',
    description: '全程国内教育体系，获得国内学位。经济压力小，竞争激烈。',
    tagCombination: {
      transTiming: ['TRANS_NONE'],
      degreeType: ['DEGREE_DOMESTIC']
    },
    advantages: ['费用最低', '熟悉的教育环境', '政策支持'],
    disadvantages: ['高考竞争激烈', '国际化程度有限', '创新能力培养相对不足'],
    examples: [
      '小学公立→初中公立→高中公立→国内本科',
      '小学公立→初中公立→高中公立→国内本科→国内硕士'
    ],
    priority: 1
  },
  
  {
    id: 'overseas_direct',
    name: '海外直通路线',
    description: '早期或全程国际体系，获得海外学位。准备充分，费用高。',
    tagCombination: {
      transTiming: ['TRANS_EARLY', 'TRANS_NONE'],
      degreeType: ['DEGREE_OVERSEAS']
    },
    advantages: ['国际化程度高', '申请海外名校优势明显', '语言能力突出'],
    disadvantages: ['费用最高', '可能缺乏国内基础教育', '文化认同问题'],
    examples: [
      '小学公立→初中民办双语→高中民办国际化→海外本科→海外硕士',
      '小学外籍→初中外籍→高中外籍→海外本科'
    ],
    priority: 4
  },
  
  {
    id: 'mid_transition',
    name: '中期转轨路线',
    description: '高中阶段转入国际体系，获得海外学位。平衡基础教育和留学准备。',
    tagCombination: {
      transTiming: ['TRANS_MID'],
      degreeType: ['DEGREE_OVERSEAS']
    },
    advantages: ['兼顾国内基础教育', '高中阶段充分准备留学', '费用相对可控'],
    disadvantages: ['转轨适应期', '需要额外准备国际课程', '时间安排紧张'],
    examples: [
      '小学公立→初中公立→高中公立国际部→海外本科→海外硕士',
      '小学公立→初中公立→高中民办国际化→海外本科'
    ],
    priority: 2
  },
  
  {
    id: 'late_transition',
    name: '晚期转轨路线',
    description: '本科或研究生阶段转入海外体系，获得海外学位。性价比高，但需适应海外教育。',
    tagCombination: {
      transTiming: ['TRANS_LATE'],
      degreeType: ['DEGREE_OVERSEAS']
    },
    advantages: ['性价比最高', '国内基础教育扎实', '适应能力强'],
    disadvantages: ['语言准备时间短', '文化适应挑战', '申请竞争激烈'],
    examples: [
      '小学公立→初中公立→高中公立→国内本科→海外硕士',
      '小学公立→初中公立→高中公立→海外本科'
    ],
    priority: 3
  },
  
  {
    id: 'return_development',
    name: '回国发展路线',
    description: '海外经历后回国获得学位。常见于海外本科后回国读研或读博。',
    tagCombination: {
      transTiming: ['TRANS_LATE'],
      degreeType: ['DEGREE_DOMESTIC']
    },
    advantages: ['国际化视野', '国内政策支持', '就业优势明显'],
    disadvantages: ['转轨成本高', '时间周期长', '政策变化风险'],
    examples: [
      '小学公立→初中公立→高中公立→海外本科→国内硕士',
      '小学公立→初中公立→高中公立→海外本科→国内博士'
    ],
    priority: 5
  },
  
  {
    id: 'infeasible_paths',
    name: '不可行路径',
    description: '包含不可行或非常罕见的转换，需要特殊条件或身份。',
    tagCombination: {
      feasibility: ['FEASIBLE_LOW']
    },
    advantages: [],
    disadvantages: ['需要特殊条件', '实现难度大', '政策限制多'],
    examples: [
      '包含外籍人员子女学校但无外籍身份的路径',
      '包含公立国际部但无户籍的路径'
    ],
    priority: 6
  },
  
  {
    id: 'other_paths',
    name: '其他个性化路线',
    description: '非常见的路径组合，需要个性化规划。',
    tagCombination: {
      // 兜底分类，匹配其他所有情况
    },
    advantages: ['个性化程度高', '灵活性强'],
    disadvantages: ['缺乏成熟经验', '需要专业指导', '风险相对较高'],
    examples: [
      '早期转轨但获得国内学位的路径',
      '多次转轨的复杂路径'
    ],
    priority: 7
  }
];

// 动态命名规则配置
export const DYNAMIC_NAMING_CONFIG = {
  '大学': {
    '学位': '本科',
    '硕士': '本科',
    '博士': '本科'
  },
  '研究生': {
    '学位': '硕士',
    '本科': '硕士',
    '博士': '硕士'
  },
  '博士': {
    '学位': '博士',
    '本科': '博士',
    '硕士': '博士'
  }
};

// 路径数量阈值配置
export const PATH_COUNT_THRESHOLDS = {
  MIN_INDEPENDENT_ROUTE: 3,  // 独立显示的最小路径数
  MIN_MERGE_ROUTE: 1,        // 合并到其他路线的最小路径数
  MAX_DISPLAY_PATHS: 10      // 每个路线最大显示路径数
};
