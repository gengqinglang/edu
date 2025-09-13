// 教育阶段枚举
export type EducationStage = 
  | '幼儿园' 
  | '小学' 
  | '初中' 
  | '高中' 
  | '大学' 
  | '研究生' 
  | '博士';

// 教育水平枚举 - 根据阶段不同有不同的选项
export type EducationLevel = 
  // 幼儿园
  | '公立' 
  | '普通私立' 
  | '民办双语'
  | '外籍人员子女学校'
  // 小学&初中
  | '公立' 
  | '普通私立' 
  | '民办双语' 
  | '外籍人员子女学校'
  // 高中
  | '公立' 
  | '民办普通高中' 
  | '职业高中' 
  | '公立国际部' 
  | '民办国际化学校' 
  | '外籍人员子女学校' 
  | '海外高中'
  // 大学
  | '国内公办' 
  | '国内民办' 
  | '海外大学' 
  | '中外合作办学'
  // 研究生
  | '国内硕士' 
  | '海外硕士'
  // 博士
  | '国内博士' 
  | '海外博士';

// 目标阶段枚举
export type TargetStage = '大学' | '研究生' | '博士';

// 用户输入接口
export interface UserInput {
  // 当前教育阶段
  currentStage: EducationStage;
  // 当前年级 (数字表示，例如：四年级 -> 4)
  currentGrade: number;
  // 当前教育水平
  currentLevel: EducationLevel;
  // 计划培养到的最终阶段
  targetStage: TargetStage;
}

// 转换规则接口
export interface TransitionRule {
  from: { stage: string; level: string; }; // 从哪个节点来
  to: { stage: string; level: string; };   // 到哪个节点去
  feasibility: 'feasible' | 'conditional' | 'infeasible'; // 可行性
  conditions: string[]; // 转换条件，空数组表示无条件
  description: string;   // 规则描述
  prevalence: number;    // 常见度 (0-1)，表示该转换的常见程度
}

// 费用项接口
export interface CostItem {
  tuition: number;     // 学费
  boarding?: number;   // 住宿费 (可选)
  meals?: number;      // 餐费 (可选)
  materials?: number;  // 教材杂费 (可选)
  other?: number;      // 其他费用 (可选)
  source: string;      // 数据来源说明
}

// 阶段-水平费用接口
export interface StageLevelCost {
  stage: EducationStage;
  level: EducationLevel;
  cost: CostItem; // 年度费用明细
  duration: number; // 该阶段就读年数
}

// 年级费用接口（新增）
export interface GradeCost {
  stage: EducationStage;
  level: EducationLevel;
  grade: number; // 年级（1-12）
  cost: CostItem; // 该年级费用明细
  source: string; // 数据来源说明
}

// 教育路径节点
export interface EducationNode {
  stage: string;
  level: string;
}

// 教育路径
export interface EducationPath {
  nodes: EducationNode[];
  totalConditions: string[];
  feasibility: 'feasible' | 'conditional' | 'infeasible';
  description: string;
  // 费用详情
  costBreakdown?: {
    total: number; // 路径总费用
    stages: { // 每个阶段的费用详情
      stage: EducationStage;
      level: EducationLevel;
      duration: number;
      costPerYear: CostItem; // 年度费用明细
      costTotal: number; // 该阶段总费用 (年度费用加总 * 年数)
    }[];
  };
}

// 路径查找结果
export interface PathFinderResult {
  paths: EducationPath[];
  totalPaths: number;
  feasiblePaths: number;
  conditionalPaths: number;
  infeasiblePaths: number;
}

// 转轨时机标签
export type TransTimingTag = 
  | 'TRANS_NONE'   // 全程无转轨
  | 'TRANS_EARLY'  // 小学或初中阶段转入国际体系
  | 'TRANS_MID'    // 高中阶段转入国际体系
  | 'TRANS_LATE'   // 本科或研究生阶段转入国际体系
  | 'TRANS_MULTIPLE'; // 多个转轨时机（归类到其他个性化路线）

// 目标学位标签
export type TargetDegreeTag = 
  | 'TARGET_UG'     // 目标阶段为大学（本科为终点）
  | 'TARGET_MASTER' // 目标阶段为研究生（硕士为终点）
  | 'TARGET_PHD';   // 目标阶段为博士（博士为终点）

// 学位类型标签
export type DegreeTypeTag = 
  | 'DEGREE_DOMESTIC'  // 目标学位在国内获得
  | 'DEGREE_OVERSEAS'; // 目标学位在海外获得

// 可行性标签
export type FeasibilityTag = 
  | 'FEASIBLE_HIGH'   // 高可行性路径（所有节点都是feasible）
  | 'FEASIBLE_MEDIUM' // 中等可行性路径（有条件可行或较罕见）
  | 'FEASIBLE_LOW';   // 低可行性路径（不可行或非常罕见）

// 路径特征标签（核心标签）
export interface PathCoreTags {
  transTiming: TransTimingTag;
  targetDegree: TargetDegreeTag;
  degreeType: DegreeTypeTag;
  feasibility: FeasibilityTag;
}

// 路径特征标签（辅助标签，用于细化描述和排序）
export type PathFeature = 
  | 'domestic_ug'      // 国内本科
  | 'overseas_ug'      // 海外本科
  | 'domestic_pg'      // 国内研究生
  | 'overseas_pg'      // 海外研究生
  | 'gaokao'           // 参加高考
  | 'early_transition' // 小学/初中转轨
  | 'late_transition'  // 高中转轨
  | 'cost_high'        // 费用高昂
  | 'cost_low'         // 费用较低
  | 'international'    // 国际化路径
  | 'traditional'      // 传统路径
  | 'hybrid';          // 混合路径

// 战略路线接口
export interface StrategicRoute {
  id: string;
  name: string;
  description: string;
  coreTags: PathCoreTags; // 核心标签组合
  features: PathFeature[]; // 辅助标签
  costRange: {
    min: number;
    max: number;
  };
  advantages: string[];
  disadvantages: string[];
  paths: EducationPath[];
  prevalence: number; // 该战略路线的常见度
  pathCount: number; // 路径数量
  feasibilityScore: number; // 可行性评分
  averageMatchScore: number; // 与当前状态的匹配度评分
}

// 路径排序权重配置
export interface RankingWeights {
  feasibility: number;    // 可行性权重 (默认: 0.4)
  prevalence: number;     // 常见度权重 (默认: 0.3)
  cost: number;          // 费用权重 (默认: 0.2)
  transition: number;    // 转轨次数权重 (默认: 0.1)
}

// 路径排序结果
export interface RankedPath extends EducationPath {
  rankingScore: number;
  rankingReasons: string[];
  coreTags: PathCoreTags; // 核心标签
  features: PathFeature[]; // 辅助标签
}

// 战略路线模板接口
export interface StrategicRouteTemplate {
  id: string;
  name: string;
  descriptionTemplate: string;
  suitableFor: string[];
  needToKnow: string[];
}
