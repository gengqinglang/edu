// 前端教育类型定义

// 转轨时机标签
const TRANS_TIMING_TAGS = {
  TRANS_NONE: 'TRANS_NONE',     // 全程无转轨
  TRANS_EARLY: 'TRANS_EARLY',   // 小学或初中阶段转入国际体系
  TRANS_MID: 'TRANS_MID',       // 高中阶段转入国际体系
  TRANS_LATE: 'TRANS_LATE',     // 本科或研究生阶段转入国际体系
  TRANS_MULTIPLE: 'TRANS_MULTIPLE' // 多个转轨时机（归类到其他个性化路线）
};

// 目标学位标签
const TARGET_DEGREE_TAGS = {
  TARGET_UG: 'TARGET_UG',         // 目标阶段为大学（本科为终点）
  TARGET_MASTER: 'TARGET_MASTER', // 目标阶段为研究生（硕士为终点）
  TARGET_PHD: 'TARGET_PHD'        // 目标阶段为博士（博士为终点）
};

// 学位类型标签
const DEGREE_TYPE_TAGS = {
  DEGREE_DOMESTIC: 'DEGREE_DOMESTIC',  // 目标学位在国内获得
  DEGREE_OVERSEAS: 'DEGREE_OVERSEAS'  // 目标学位在海外获得
};

// 可行性标签
const FEASIBILITY_TAGS = {
  FEASIBLE_HIGH: 'FEASIBLE_HIGH',     // 高可行性路径（所有节点都是feasible）
  FEASIBLE_MEDIUM: 'FEASIBLE_MEDIUM', // 中等可行性路径（有条件可行或较罕见）
  FEASIBLE_LOW: 'FEASIBLE_LOW'        // 低可行性路径（不可行或非常罕见）
};

// 路径特征标签（辅助标签）
const PATH_FEATURES = {
  DOMESTIC_UG: 'domestic_ug',      // 国内本科
  OVERSEAS_UG: 'overseas_ug',      // 海外本科
  DOMESTIC_PG: 'domestic_pg',      // 国内研究生
  OVERSEAS_PG: 'overseas_pg',      // 海外研究生
  GAOKAO: 'gaokao',                // 参加高考
  EARLY_TRANSITION: 'early_transition', // 小学/初中转轨
  LATE_TRANSITION: 'late_transition',   // 高中转轨
  COST_HIGH: 'cost_high',          // 费用高昂
  COST_LOW: 'cost_low',            // 费用较低
  INTERNATIONAL: 'international',   // 国际化路径
  TRADITIONAL: 'traditional',       // 传统路径
  HYBRID: 'hybrid'                 // 混合路径
};

// 导出类型定义
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    TRANS_TIMING_TAGS,
    TARGET_DEGREE_TAGS,
    DEGREE_TYPE_TAGS,
    FEASIBILITY_TAGS,
    PATH_FEATURES
  };
}
