// 汇率转换 (美元对人民币，2024年汇率)
const USD_TO_CNY = 7.2;

// 完整的教育费用数据库
const EDUCATION_COST_DATABASE = [
  // ========== 幼儿园 ==========
  {
    stage: '幼儿园',
    level: '公立',
    duration: 3,
    cost: { 
      tuition: 10000, 
      meals: 5000, 
      other: 2000, 
      source: '市场均价估算' 
    },
  },
  {
    stage: '幼儿园',
    level: '普通私立',
    duration: 3,
    cost: { 
      tuition: 30000, 
      meals: 8000, 
      other: 5000, 
      source: '市场均价估算' 
    },
  },
  {
    stage: '幼儿园',
    level: '民办双语',
    duration: 3,
    cost: { 
      tuition: 150000, 
      meals: 10000, 
      other: 15000, 
      source: '市场均价估算（北京上海）' 
    },
  },
  {
    stage: '幼儿园',
    level: '外籍人员子女学校',
    duration: 3,
    cost: { 
      tuition: 200000, 
      meals: 12000, 
      other: 20000, 
      source: '外籍人员子女学校标准费用' 
    },
  },

  // ========== 小学 ==========
  {
    stage: '小学',
    level: '公立',
    duration: 6,
    cost: { 
      tuition: 0, 
      materials: 3000, 
      other: 3000, 
      source: '义务教育阶段' 
    },
  },
  {
    stage: '小学',
    level: '普通私立',
    duration: 6,
    cost: { 
      tuition: 40000, 
      materials: 5000, 
      other: 5000, 
      source: '市场均价估算' 
    },
  },
  {
    stage: '小学',
    level: '民办双语',
    duration: 6,
    cost: { 
      tuition: 180000, 
      materials: 8000, 
      other: 12000, 
      source: '市场均价估算（北京上海）' 
    },
  },
  {
    stage: '小学',
    level: '外籍人员子女学校',
    duration: 6,
    cost: { 
      tuition: 250000, 
      materials: 10000, 
      other: 15000, 
      source: '外籍人员子女学校标准费用' 
    },
  },

  // ========== 初中 ==========
  {
    stage: '初中',
    level: '公立',
    duration: 3,
    cost: { 
      tuition: 0, 
      materials: 4000, 
      other: 4000, 
      source: '义务教育阶段' 
    },
  },
  {
    stage: '初中',
    level: '普通私立',
    duration: 3,
    cost: { 
      tuition: 50000, 
      materials: 6000, 
      other: 6000, 
      source: '市场均价估算' 
    },
  },
  {
    stage: '初中',
    level: '民办双语',
    duration: 3,
    cost: { 
      tuition: 200000, 
      materials: 10000, 
      other: 15000, 
      source: '市场均价估算（北京上海）' 
    },
  },
  {
    stage: '初中',
    level: '外籍人员子女学校',
    duration: 3,
    cost: { 
      tuition: 280000, 
      materials: 12000, 
      other: 18000, 
      source: '外籍人员子女学校标准费用' 
    },
  },

  // ========== 高中 ==========
  {
    stage: '高中',
    level: '公立',
    duration: 3,
    cost: { 
      tuition: 2000, 
      materials: 5000, 
      other: 5000, 
      source: '市场均价估算' 
    },
  },
  {
    stage: '高中',
    level: '民办普通高中',
    duration: 3,
    cost: { 
      tuition: 50000, 
      materials: 8000, 
      other: 8000, 
      source: '市场均价估算' 
    },
  },
  {
    stage: '高中',
    level: '公立国际部',
    duration: 3,
    cost: { 
      tuition: 100000, 
      materials: 10000, 
      other: 20000, 
      source: '一般费用，不含额外培训' 
    },
  },
  {
    stage: '高中',
    level: '民办国际化学校',
    duration: 3,
    cost: { 
      tuition: 280000, 
      boarding: 50000, 
      materials: 15000, 
      other: 25000, 
      source: '市场均价估算' 
    },
  },
  {
    stage: '高中',
    level: '外籍人员子女学校',
    duration: 3,
    cost: { 
      tuition: 350000, 
      boarding: 60000, 
      materials: 18000, 
      other: 30000, 
      source: '外籍人员子女学校标准费用' 
    },
  },
  {
    stage: '高中',
    level: '海外高中',
    duration: 3,
    cost: { 
      tuition: Math.round(45000 * USD_TO_CNY), // 45000美元
      boarding: Math.round(15000 * USD_TO_CNY), // 15000美元
      meals: Math.round(8000 * USD_TO_CNY), // 8000美元
      other: Math.round(12000 * USD_TO_CNY), // 12000美元
      source: '美国私立高中平均费用（含汇率转换）' 
    },
  },

  // ========== 大学 ==========
  {
    stage: '大学',
    level: '国内公办',
    duration: 4,
    cost: { 
      tuition: 6000, 
      boarding: 4000, 
      meals: 8000, 
      other: 4000, 
      source: '国内大学一般标准' 
    },
  },
  {
    stage: '大学',
    level: '国内民办',
    duration: 4,
    cost: { 
      tuition: 20000, 
      boarding: 6000, 
      meals: 10000, 
      other: 6000, 
      source: '国内民办大学标准费用' 
    },
  },
  {
    stage: '大学',
    level: '海外大学',
    duration: 4,
    cost: { 
      tuition: Math.round(50000 * USD_TO_CNY), // 50000美元
      boarding: Math.round(12000 * USD_TO_CNY), // 12000美元
      meals: Math.round(10000 * USD_TO_CNY), // 10000美元
      other: Math.round(15000 * USD_TO_CNY), // 15000美元
      source: '美国大学平均费用（含汇率转换）' 
    },
  },
  {
    stage: '大学',
    level: '中外合作办学',
    duration: 4,
    cost: { 
      tuition: 80000, 
      boarding: 8000, 
      meals: 12000, 
      other: 10000, 
      source: '中外合作办学标准费用' 
    },
  },

  // ========== 研究生 ==========
  {
    stage: '研究生',
    level: '国内硕士',
    duration: 3,
    cost: { 
      tuition: 8000, 
      boarding: 5000, 
      meals: 10000, 
      other: 5000, 
      source: '国内研究生一般标准' 
    },
  },
  {
    stage: '研究生',
    level: '海外硕士',
    duration: 2,
    cost: { 
      tuition: Math.round(40000 * USD_TO_CNY), // 40000美元
      boarding: Math.round(10000 * USD_TO_CNY), // 10000美元
      meals: Math.round(8000 * USD_TO_CNY), // 8000美元
      other: Math.round(12000 * USD_TO_CNY), // 12000美元
      source: '美国硕士平均费用（含汇率转换）' 
    },
  },

  // ========== 博士 ==========
  {
    stage: '博士',
    level: '国内博士',
    duration: 4,
    cost: { 
      tuition: 10000, 
      boarding: 6000, 
      meals: 12000, 
      other: 6000, 
      source: '国内博士一般标准' 
    },
  },
  {
    stage: '博士',
    level: '海外博士',
    duration: 5,
    cost: { 
      tuition: Math.round(35000 * USD_TO_CNY), // 35000美元
      boarding: Math.round(12000 * USD_TO_CNY), // 12000美元
      meals: Math.round(10000 * USD_TO_CNY), // 10000美元
      other: Math.round(15000 * USD_TO_CNY), // 15000美元
      source: '美国博士平均费用（含汇率转换）' 
    },
  },
];

// 导出费用数据库
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EDUCATION_COST_DATABASE };
} else {
  window.EDUCATION_COST_DATABASE = EDUCATION_COST_DATABASE;
}
