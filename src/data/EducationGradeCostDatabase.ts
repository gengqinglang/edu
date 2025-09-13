import { GradeCost, EducationStage, EducationLevel } from '../types';

// 汇率转换 (美元对人民币，2024年汇率)
const USD_TO_CNY = 7.2;

// 按年级计算的教育费用数据库
export const EDUCATION_GRADE_COST_DATABASE: GradeCost[] = [
  // ========== 幼儿园 ==========
  // 幼儿园小班（1年级）
  {
    stage: '幼儿园' as EducationStage,
    level: '公立' as EducationLevel,
    grade: 1,
    cost: { 
      tuition: 10000, 
      meals: 5000, 
      other: 2000, 
      source: '市场均价估算' 
    },
    source: '市场均价估算'
  },
  {
    stage: '幼儿园' as EducationStage,
    level: '普通私立' as EducationLevel,
    grade: 1,
    cost: { 
      tuition: 30000, 
      meals: 8000, 
      other: 5000, 
      source: '市场均价估算' 
    },
    source: '市场均价估算'
  },
  {
    stage: '幼儿园' as EducationStage,
    level: '民办双语' as EducationLevel,
    grade: 1,
    cost: { 
      tuition: 150000, 
      meals: 10000, 
      other: 15000, 
      source: '市场均价估算（北京上海）' 
    },
    source: '市场均价估算（北京上海）'
  },
  {
    stage: '幼儿园' as EducationStage,
    level: '外籍人员子女学校' as EducationLevel,
    grade: 1,
    cost: { 
      tuition: 200000, 
      meals: 12000, 
      other: 20000, 
      source: '外籍人员子女学校标准费用' 
    },
    source: '外籍人员子女学校标准费用'
  },

  // 幼儿园中班（2年级）
  {
    stage: '幼儿园' as EducationStage,
    level: '公立' as EducationLevel,
    grade: 2,
    cost: { 
      tuition: 10000, 
      meals: 5000, 
      other: 2000, 
      source: '市场均价估算' 
    },
    source: '市场均价估算'
  },
  {
    stage: '幼儿园' as EducationStage,
    level: '普通私立' as EducationLevel,
    grade: 2,
    cost: { 
      tuition: 30000, 
      meals: 8000, 
      other: 5000, 
      source: '市场均价估算' 
    },
    source: '市场均价估算'
  },
  {
    stage: '幼儿园' as EducationStage,
    level: '民办双语' as EducationLevel,
    grade: 2,
    cost: { 
      tuition: 150000, 
      meals: 10000, 
      other: 15000, 
      source: '市场均价估算（北京上海）' 
    },
    source: '市场均价估算（北京上海）'
  },
  {
    stage: '幼儿园' as EducationStage,
    level: '外籍人员子女学校' as EducationLevel,
    grade: 2,
    cost: { 
      tuition: 200000, 
      meals: 12000, 
      other: 20000, 
      source: '外籍人员子女学校标准费用' 
    },
    source: '外籍人员子女学校标准费用'
  },

  // 幼儿园大班（3年级）
  {
    stage: '幼儿园' as EducationStage,
    level: '公立' as EducationLevel,
    grade: 3,
    cost: { 
      tuition: 10000, 
      meals: 5000, 
      other: 2000, 
      source: '市场均价估算' 
    },
    source: '市场均价估算'
  },
  {
    stage: '幼儿园' as EducationStage,
    level: '普通私立' as EducationLevel,
    grade: 3,
    cost: { 
      tuition: 30000, 
      meals: 8000, 
      other: 5000, 
      source: '市场均价估算' 
    },
    source: '市场均价估算'
  },
  {
    stage: '幼儿园' as EducationStage,
    level: '民办双语' as EducationLevel,
    grade: 3,
    cost: { 
      tuition: 150000, 
      meals: 10000, 
      other: 15000, 
      source: '市场均价估算（北京上海）' 
    },
    source: '市场均价估算（北京上海）'
  },
  {
    stage: '幼儿园' as EducationStage,
    level: '外籍人员子女学校' as EducationLevel,
    grade: 3,
    cost: { 
      tuition: 200000, 
      meals: 12000, 
      other: 20000, 
      source: '外籍人员子女学校标准费用' 
    },
    source: '外籍人员子女学校标准费用'
  },

  // ========== 小学 ==========
  // 小学1-6年级
  ...Array.from({ length: 6 }, (_, i) => i + 1).flatMap(grade => [
    {
      stage: '小学' as EducationStage,
      level: '公立' as EducationLevel,
      grade: grade,
      cost: { 
        tuition: 0, 
        materials: 3000, 
        other: 3000, 
        source: '义务教育阶段' 
      },
      source: '义务教育阶段'
    },
    {
      stage: '小学' as EducationStage,
      level: '普通私立' as EducationLevel,
      grade: grade,
      cost: { 
        tuition: 40000, 
        materials: 5000, 
        other: 5000, 
        source: '市场均价估算' 
      },
      source: '市场均价估算'
    },
    {
      stage: '小学' as EducationStage,
      level: '民办双语' as EducationLevel,
      grade: grade,
      cost: { 
        tuition: 180000, 
        materials: 8000, 
        other: 12000, 
        source: '市场均价估算（北京上海）' 
      },
      source: '市场均价估算（北京上海）'
    },
    {
      stage: '小学' as EducationStage,
      level: '外籍人员子女学校' as EducationLevel,
      grade: grade,
      cost: { 
        tuition: 250000, 
        materials: 10000, 
        other: 15000, 
        source: '外籍人员子女学校标准费用' 
      },
      source: '外籍人员子女学校标准费用'
    }
  ]),

  // ========== 初中 ==========
  // 初中1-3年级
  ...Array.from({ length: 3 }, (_, i) => i + 1).flatMap(grade => [
    {
      stage: '初中' as EducationStage,
      level: '公立' as EducationLevel,
      grade: grade,
      cost: { 
        tuition: 0, 
        materials: 4000, 
        other: 4000, 
        source: '义务教育阶段' 
      },
      source: '义务教育阶段'
    },
    {
      stage: '初中' as EducationStage,
      level: '普通私立' as EducationLevel,
      grade: grade,
      cost: { 
        tuition: 50000, 
        materials: 6000, 
        other: 6000, 
        source: '市场均价估算' 
      },
      source: '市场均价估算'
    },
    {
      stage: '初中' as EducationStage,
      level: '民办双语' as EducationLevel,
      grade: grade,
      cost: { 
        tuition: 200000, 
        materials: 10000, 
        other: 15000, 
        source: '市场均价估算（北京上海）' 
      },
      source: '市场均价估算（北京上海）'
    },
    {
      stage: '初中' as EducationStage,
      level: '外籍人员子女学校' as EducationLevel,
      grade: grade,
      cost: { 
        tuition: 280000, 
        materials: 12000, 
        other: 18000, 
        source: '外籍人员子女学校标准费用' 
      },
      source: '外籍人员子女学校标准费用'
    }
  ]),

  // ========== 高中 ==========
  // 高中1-3年级
  ...Array.from({ length: 3 }, (_, i) => i + 1).flatMap(grade => [
    {
      stage: '高中' as EducationStage,
      level: '公立' as EducationLevel,
      grade: grade,
      cost: { 
        tuition: 2000, 
        materials: 5000, 
        other: 5000, 
        source: '市场均价估算' 
      },
      source: '市场均价估算'
    },
    {
      stage: '高中' as EducationStage,
      level: '民办普通高中' as EducationLevel,
      grade: grade,
      cost: { 
        tuition: 50000, 
        materials: 8000, 
        other: 8000, 
        source: '市场均价估算' 
      },
      source: '市场均价估算'
    },
    {
      stage: '高中' as EducationStage,
      level: '职业高中' as EducationLevel,
      grade: grade,
      cost: { 
        tuition: 3000, 
        materials: 4000, 
        other: 4000, 
        source: '职业高中标准费用' 
      },
      source: '职业高中标准费用'
    },
    {
      stage: '高中' as EducationStage,
      level: '公立国际部' as EducationLevel,
      grade: grade,
      cost: { 
        tuition: 100000, 
        materials: 10000, 
        other: 20000, 
        source: '一般费用，不含额外培训' 
      },
      source: '一般费用，不含额外培训'
    },
    {
      stage: '高中' as EducationStage,
      level: '民办国际化学校' as EducationLevel,
      grade: grade,
      cost: { 
        tuition: 280000, 
        boarding: 50000, 
        materials: 15000, 
        other: 25000, 
        source: '市场均价估算' 
      },
      source: '市场均价估算'
    },
    {
      stage: '高中' as EducationStage,
      level: '外籍人员子女学校' as EducationLevel,
      grade: grade,
      cost: { 
        tuition: 350000, 
        boarding: 60000, 
        materials: 18000, 
        other: 30000, 
        source: '外籍人员子女学校标准费用' 
      },
      source: '外籍人员子女学校标准费用'
    },
    {
      stage: '高中' as EducationStage,
      level: '海外高中' as EducationLevel,
      grade: grade,
      cost: { 
        tuition: Math.round(45000 * USD_TO_CNY), // 45000美元
        boarding: Math.round(15000 * USD_TO_CNY), // 15000美元
        meals: Math.round(8000 * USD_TO_CNY), // 8000美元
        other: Math.round(12000 * USD_TO_CNY), // 12000美元
        source: '美国私立高中平均费用（含汇率转换）' 
      },
      source: '美国私立高中平均费用（含汇率转换）'
    }
  ]),

  // ========== 大学 ==========
  // 大学1-4年级
  ...Array.from({ length: 4 }, (_, i) => i + 1).flatMap(grade => [
    {
      stage: '大学' as EducationStage,
      level: '国内公办' as EducationLevel,
      grade: grade,
      cost: { 
        tuition: 6000, 
        boarding: 4000, 
        meals: 8000, 
        other: 4000, 
        source: '国内大学一般标准' 
      },
      source: '国内大学一般标准'
    },
    {
      stage: '大学' as EducationStage,
      level: '国内民办' as EducationLevel,
      grade: grade,
      cost: { 
        tuition: 20000, 
        boarding: 6000, 
        meals: 10000, 
        other: 6000, 
        source: '国内民办大学标准费用' 
      },
      source: '国内民办大学标准费用'
    },
    {
      stage: '大学' as EducationStage,
      level: '海外大学' as EducationLevel,
      grade: grade,
      cost: { 
        tuition: Math.round(50000 * USD_TO_CNY), // 50000美元
        boarding: Math.round(12000 * USD_TO_CNY), // 12000美元
        meals: Math.round(10000 * USD_TO_CNY), // 10000美元
        other: Math.round(15000 * USD_TO_CNY), // 15000美元
        source: '美国大学平均费用（含汇率转换）' 
      },
      source: '美国大学平均费用（含汇率转换）'
    },
    {
      stage: '大学' as EducationStage,
      level: '中外合作办学' as EducationLevel,
      grade: grade,
      cost: { 
        tuition: 80000, 
        boarding: 8000, 
        meals: 12000, 
        other: 10000, 
        source: '中外合作办学标准费用' 
      },
      source: '中外合作办学标准费用'
    }
  ]),

  // ========== 研究生 ==========
  // 研究生1-3年级（硕士通常2-3年）
  ...Array.from({ length: 3 }, (_, i) => i + 1).flatMap(grade => [
    {
      stage: '研究生' as EducationStage,
      level: '国内硕士' as EducationLevel,
      grade: grade,
      cost: { 
        tuition: 8000, 
        boarding: 5000, 
        meals: 10000, 
        other: 5000, 
        source: '国内研究生一般标准' 
      },
      source: '国内研究生一般标准'
    },
    {
      stage: '研究生' as EducationStage,
      level: '海外硕士' as EducationLevel,
      grade: grade,
      cost: { 
        tuition: Math.round(40000 * USD_TO_CNY), // 40000美元
        boarding: Math.round(10000 * USD_TO_CNY), // 10000美元
        meals: Math.round(8000 * USD_TO_CNY), // 8000美元
        other: Math.round(12000 * USD_TO_CNY), // 12000美元
        source: '美国硕士平均费用（含汇率转换）' 
      },
      source: '美国硕士平均费用（含汇率转换）'
    }
  ]),

  // ========== 博士 ==========
  // 博士1-5年级
  ...Array.from({ length: 5 }, (_, i) => i + 1).flatMap(grade => [
    {
      stage: '博士' as EducationStage,
      level: '国内博士' as EducationLevel,
      grade: grade,
      cost: { 
        tuition: 10000, 
        boarding: 6000, 
        meals: 12000, 
        other: 6000, 
        source: '国内博士一般标准' 
      },
      source: '国内博士一般标准'
    },
    {
      stage: '博士' as EducationStage,
      level: '海外博士' as EducationLevel,
      grade: grade,
      cost: { 
        tuition: Math.round(35000 * USD_TO_CNY), // 35000美元
        boarding: Math.round(12000 * USD_TO_CNY), // 12000美元
        meals: Math.round(10000 * USD_TO_CNY), // 10000美元
        other: Math.round(15000 * USD_TO_CNY), // 15000美元
        source: '美国博士平均费用（含汇率转换）' 
      },
      source: '美国博士平均费用（含汇率转换）'
    }
  ])
];
