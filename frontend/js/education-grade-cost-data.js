// 汇率转换 (美元对人民币，2024年汇率)
const USD_TO_CNY = 7.2;

// 按年级计算的教育费用数据库
const EDUCATION_GRADE_COST_DATABASE = [
  {
    "stage": "幼儿园",
    "level": "公立",
    "grade": 1,
    "cost": {
      "tuition": 10000,
      "meals": 5000,
      "other": 2000,
      "source": "市场均价估算"
    },
    "source": "市场均价估算"
  },
  {
    "stage": "幼儿园",
    "level": "普通私立",
    "grade": 1,
    "cost": {
      "tuition": 30000,
      "meals": 8000,
      "other": 5000,
      "source": "市场均价估算"
    },
    "source": "市场均价估算"
  },
  {
    "stage": "幼儿园",
    "level": "民办双语",
    "grade": 1,
    "cost": {
      "tuition": 150000,
      "meals": 10000,
      "other": 15000,
      "source": "市场均价估算（北京上海）"
    },
    "source": "市场均价估算（北京上海）"
  },
  {
    "stage": "幼儿园",
    "level": "外籍人员子女学校",
    "grade": 1,
    "cost": {
      "tuition": 200000,
      "meals": 12000,
      "other": 20000,
      "source": "外籍人员子女学校标准费用"
    },
    "source": "外籍人员子女学校标准费用"
  },
  {
    "stage": "幼儿园",
    "level": "公立",
    "grade": 2,
    "cost": {
      "tuition": 10000,
      "meals": 5000,
      "other": 2000,
      "source": "市场均价估算"
    },
    "source": "市场均价估算"
  },
  {
    "stage": "幼儿园",
    "level": "普通私立",
    "grade": 2,
    "cost": {
      "tuition": 30000,
      "meals": 8000,
      "other": 5000,
      "source": "市场均价估算"
    },
    "source": "市场均价估算"
  },
  {
    "stage": "幼儿园",
    "level": "民办双语",
    "grade": 2,
    "cost": {
      "tuition": 150000,
      "meals": 10000,
      "other": 15000,
      "source": "市场均价估算（北京上海）"
    },
    "source": "市场均价估算（北京上海）"
  },
  {
    "stage": "幼儿园",
    "level": "外籍人员子女学校",
    "grade": 2,
    "cost": {
      "tuition": 200000,
      "meals": 12000,
      "other": 20000,
      "source": "外籍人员子女学校标准费用"
    },
    "source": "外籍人员子女学校标准费用"
  },
  {
    "stage": "幼儿园",
    "level": "公立",
    "grade": 3,
    "cost": {
      "tuition": 10000,
      "meals": 5000,
      "other": 2000,
      "source": "市场均价估算"
    },
    "source": "市场均价估算"
  },
  {
    "stage": "幼儿园",
    "level": "普通私立",
    "grade": 3,
    "cost": {
      "tuition": 30000,
      "meals": 8000,
      "other": 5000,
      "source": "市场均价估算"
    },
    "source": "市场均价估算"
  },
  {
    "stage": "幼儿园",
    "level": "民办双语",
    "grade": 3,
    "cost": {
      "tuition": 150000,
      "meals": 10000,
      "other": 15000,
      "source": "市场均价估算（北京上海）"
    },
    "source": "市场均价估算（北京上海）"
  },
  {
    "stage": "幼儿园",
    "level": "外籍人员子女学校",
    "grade": 3,
    "cost": {
      "tuition": 200000,
      "meals": 12000,
      "other": 20000,
      "source": "外籍人员子女学校标准费用"
    },
    "source": "外籍人员子女学校标准费用"
  },
  {
    "stage": "小学",
    "level": "公立",
    "grade": 1,
    "cost": {
      "tuition": 0,
      "materials": 3000,
      "other": 3000,
      "source": "义务教育阶段"
    },
    "source": "义务教育阶段"
  },
  {
    "stage": "小学",
    "level": "普通私立",
    "grade": 1,
    "cost": {
      "tuition": 40000,
      "materials": 5000,
      "other": 5000,
      "source": "市场均价估算"
    },
    "source": "市场均价估算"
  },
  {
    "stage": "小学",
    "level": "民办双语",
    "grade": 1,
    "cost": {
      "tuition": 180000,
      "materials": 8000,
      "other": 12000,
      "source": "市场均价估算（北京上海）"
    },
    "source": "市场均价估算（北京上海）"
  },
  {
    "stage": "小学",
    "level": "外籍人员子女学校",
    "grade": 1,
    "cost": {
      "tuition": 250000,
      "materials": 10000,
      "other": 15000,
      "source": "外籍人员子女学校标准费用"
    },
    "source": "外籍人员子女学校标准费用"
  },
  {
    "stage": "小学",
    "level": "公立",
    "grade": 2,
    "cost": {
      "tuition": 0,
      "materials": 3000,
      "other": 3000,
      "source": "义务教育阶段"
    },
    "source": "义务教育阶段"
  },
  {
    "stage": "小学",
    "level": "普通私立",
    "grade": 2,
    "cost": {
      "tuition": 40000,
      "materials": 5000,
      "other": 5000,
      "source": "市场均价估算"
    },
    "source": "市场均价估算"
  },
  {
    "stage": "小学",
    "level": "民办双语",
    "grade": 2,
    "cost": {
      "tuition": 180000,
      "materials": 8000,
      "other": 12000,
      "source": "市场均价估算（北京上海）"
    },
    "source": "市场均价估算（北京上海）"
  },
  {
    "stage": "小学",
    "level": "外籍人员子女学校",
    "grade": 2,
    "cost": {
      "tuition": 250000,
      "materials": 10000,
      "other": 15000,
      "source": "外籍人员子女学校标准费用"
    },
    "source": "外籍人员子女学校标准费用"
  },
  {
    "stage": "小学",
    "level": "公立",
    "grade": 3,
    "cost": {
      "tuition": 0,
      "materials": 3000,
      "other": 3000,
      "source": "义务教育阶段"
    },
    "source": "义务教育阶段"
  },
  {
    "stage": "小学",
    "level": "普通私立",
    "grade": 3,
    "cost": {
      "tuition": 40000,
      "materials": 5000,
      "other": 5000,
      "source": "市场均价估算"
    },
    "source": "市场均价估算"
  },
  {
    "stage": "小学",
    "level": "民办双语",
    "grade": 3,
    "cost": {
      "tuition": 180000,
      "materials": 8000,
      "other": 12000,
      "source": "市场均价估算（北京上海）"
    },
    "source": "市场均价估算（北京上海）"
  },
  {
    "stage": "小学",
    "level": "外籍人员子女学校",
    "grade": 3,
    "cost": {
      "tuition": 250000,
      "materials": 10000,
      "other": 15000,
      "source": "外籍人员子女学校标准费用"
    },
    "source": "外籍人员子女学校标准费用"
  },
  {
    "stage": "小学",
    "level": "公立",
    "grade": 4,
    "cost": {
      "tuition": 0,
      "materials": 3000,
      "other": 3000,
      "source": "义务教育阶段"
    },
    "source": "义务教育阶段"
  },
  {
    "stage": "小学",
    "level": "普通私立",
    "grade": 4,
    "cost": {
      "tuition": 40000,
      "materials": 5000,
      "other": 5000,
      "source": "市场均价估算"
    },
    "source": "市场均价估算"
  },
  {
    "stage": "小学",
    "level": "民办双语",
    "grade": 4,
    "cost": {
      "tuition": 180000,
      "materials": 8000,
      "other": 12000,
      "source": "市场均价估算（北京上海）"
    },
    "source": "市场均价估算（北京上海）"
  },
  {
    "stage": "小学",
    "level": "外籍人员子女学校",
    "grade": 4,
    "cost": {
      "tuition": 250000,
      "materials": 10000,
      "other": 15000,
      "source": "外籍人员子女学校标准费用"
    },
    "source": "外籍人员子女学校标准费用"
  },
  {
    "stage": "小学",
    "level": "公立",
    "grade": 5,
    "cost": {
      "tuition": 0,
      "materials": 3000,
      "other": 3000,
      "source": "义务教育阶段"
    },
    "source": "义务教育阶段"
  },
  {
    "stage": "小学",
    "level": "普通私立",
    "grade": 5,
    "cost": {
      "tuition": 40000,
      "materials": 5000,
      "other": 5000,
      "source": "市场均价估算"
    },
    "source": "市场均价估算"
  },
  {
    "stage": "小学",
    "level": "民办双语",
    "grade": 5,
    "cost": {
      "tuition": 180000,
      "materials": 8000,
      "other": 12000,
      "source": "市场均价估算（北京上海）"
    },
    "source": "市场均价估算（北京上海）"
  },
  {
    "stage": "小学",
    "level": "外籍人员子女学校",
    "grade": 5,
    "cost": {
      "tuition": 250000,
      "materials": 10000,
      "other": 15000,
      "source": "外籍人员子女学校标准费用"
    },
    "source": "外籍人员子女学校标准费用"
  },
  {
    "stage": "小学",
    "level": "公立",
    "grade": 6,
    "cost": {
      "tuition": 0,
      "materials": 3000,
      "other": 3000,
      "source": "义务教育阶段"
    },
    "source": "义务教育阶段"
  },
  {
    "stage": "小学",
    "level": "普通私立",
    "grade": 6,
    "cost": {
      "tuition": 40000,
      "materials": 5000,
      "other": 5000,
      "source": "市场均价估算"
    },
    "source": "市场均价估算"
  },
  {
    "stage": "小学",
    "level": "民办双语",
    "grade": 6,
    "cost": {
      "tuition": 180000,
      "materials": 8000,
      "other": 12000,
      "source": "市场均价估算（北京上海）"
    },
    "source": "市场均价估算（北京上海）"
  },
  {
    "stage": "小学",
    "level": "外籍人员子女学校",
    "grade": 6,
    "cost": {
      "tuition": 250000,
      "materials": 10000,
      "other": 15000,
      "source": "外籍人员子女学校标准费用"
    },
    "source": "外籍人员子女学校标准费用"
  },
  {
    "stage": "初中",
    "level": "公立",
    "grade": 1,
    "cost": {
      "tuition": 0,
      "materials": 4000,
      "other": 4000,
      "source": "义务教育阶段"
    },
    "source": "义务教育阶段"
  },
  {
    "stage": "初中",
    "level": "普通私立",
    "grade": 1,
    "cost": {
      "tuition": 50000,
      "materials": 6000,
      "other": 6000,
      "source": "市场均价估算"
    },
    "source": "市场均价估算"
  },
  {
    "stage": "初中",
    "level": "民办双语",
    "grade": 1,
    "cost": {
      "tuition": 200000,
      "materials": 10000,
      "other": 15000,
      "source": "市场均价估算（北京上海）"
    },
    "source": "市场均价估算（北京上海）"
  },
  {
    "stage": "初中",
    "level": "外籍人员子女学校",
    "grade": 1,
    "cost": {
      "tuition": 280000,
      "materials": 12000,
      "other": 18000,
      "source": "外籍人员子女学校标准费用"
    },
    "source": "外籍人员子女学校标准费用"
  },
  {
    "stage": "初中",
    "level": "公立",
    "grade": 2,
    "cost": {
      "tuition": 0,
      "materials": 4000,
      "other": 4000,
      "source": "义务教育阶段"
    },
    "source": "义务教育阶段"
  },
  {
    "stage": "初中",
    "level": "普通私立",
    "grade": 2,
    "cost": {
      "tuition": 50000,
      "materials": 6000,
      "other": 6000,
      "source": "市场均价估算"
    },
    "source": "市场均价估算"
  },
  {
    "stage": "初中",
    "level": "民办双语",
    "grade": 2,
    "cost": {
      "tuition": 200000,
      "materials": 10000,
      "other": 15000,
      "source": "市场均价估算（北京上海）"
    },
    "source": "市场均价估算（北京上海）"
  },
  {
    "stage": "初中",
    "level": "外籍人员子女学校",
    "grade": 2,
    "cost": {
      "tuition": 280000,
      "materials": 12000,
      "other": 18000,
      "source": "外籍人员子女学校标准费用"
    },
    "source": "外籍人员子女学校标准费用"
  },
  {
    "stage": "初中",
    "level": "公立",
    "grade": 3,
    "cost": {
      "tuition": 0,
      "materials": 4000,
      "other": 4000,
      "source": "义务教育阶段"
    },
    "source": "义务教育阶段"
  },
  {
    "stage": "初中",
    "level": "普通私立",
    "grade": 3,
    "cost": {
      "tuition": 50000,
      "materials": 6000,
      "other": 6000,
      "source": "市场均价估算"
    },
    "source": "市场均价估算"
  },
  {
    "stage": "初中",
    "level": "民办双语",
    "grade": 3,
    "cost": {
      "tuition": 200000,
      "materials": 10000,
      "other": 15000,
      "source": "市场均价估算（北京上海）"
    },
    "source": "市场均价估算（北京上海）"
  },
  {
    "stage": "初中",
    "level": "外籍人员子女学校",
    "grade": 3,
    "cost": {
      "tuition": 280000,
      "materials": 12000,
      "other": 18000,
      "source": "外籍人员子女学校标准费用"
    },
    "source": "外籍人员子女学校标准费用"
  },
  {
    "stage": "高中",
    "level": "公立",
    "grade": 1,
    "cost": {
      "tuition": 2000,
      "materials": 5000,
      "other": 5000,
      "source": "市场均价估算"
    },
    "source": "市场均价估算"
  },
  {
    "stage": "高中",
    "level": "民办普通高中",
    "grade": 1,
    "cost": {
      "tuition": 50000,
      "materials": 8000,
      "other": 8000,
      "source": "市场均价估算"
    },
    "source": "市场均价估算"
  },
  {
    "stage": "高中",
    "level": "职业高中",
    "grade": 1,
    "cost": {
      "tuition": 3000,
      "materials": 4000,
      "other": 4000,
      "source": "职业高中标准费用"
    },
    "source": "职业高中标准费用"
  },
  {
    "stage": "高中",
    "level": "公立国际部",
    "grade": 1,
    "cost": {
      "tuition": 100000,
      "materials": 10000,
      "other": 20000,
      "source": "一般费用，不含额外培训"
    },
    "source": "一般费用，不含额外培训"
  },
  {
    "stage": "高中",
    "level": "民办国际化学校",
    "grade": 1,
    "cost": {
      "tuition": 280000,
      "boarding": 50000,
      "materials": 15000,
      "other": 25000,
      "source": "市场均价估算"
    },
    "source": "市场均价估算"
  },
  {
    "stage": "高中",
    "level": "外籍人员子女学校",
    "grade": 1,
    "cost": {
      "tuition": 350000,
      "boarding": 60000,
      "materials": 18000,
      "other": 30000,
      "source": "外籍人员子女学校标准费用"
    },
    "source": "外籍人员子女学校标准费用"
  },
  {
    "stage": "高中",
    "level": "海外高中",
    "grade": 1,
    "cost": {
      "tuition": 324000,
      "boarding": 108000,
      "meals": 57600,
      "other": 86400,
      "source": "美国私立高中平均费用（含汇率转换）"
    },
    "source": "美国私立高中平均费用（含汇率转换）"
  },
  {
    "stage": "高中",
    "level": "公立",
    "grade": 2,
    "cost": {
      "tuition": 2000,
      "materials": 5000,
      "other": 5000,
      "source": "市场均价估算"
    },
    "source": "市场均价估算"
  },
  {
    "stage": "高中",
    "level": "民办普通高中",
    "grade": 2,
    "cost": {
      "tuition": 50000,
      "materials": 8000,
      "other": 8000,
      "source": "市场均价估算"
    },
    "source": "市场均价估算"
  },
  {
    "stage": "高中",
    "level": "职业高中",
    "grade": 2,
    "cost": {
      "tuition": 3000,
      "materials": 4000,
      "other": 4000,
      "source": "职业高中标准费用"
    },
    "source": "职业高中标准费用"
  },
  {
    "stage": "高中",
    "level": "公立国际部",
    "grade": 2,
    "cost": {
      "tuition": 100000,
      "materials": 10000,
      "other": 20000,
      "source": "一般费用，不含额外培训"
    },
    "source": "一般费用，不含额外培训"
  },
  {
    "stage": "高中",
    "level": "民办国际化学校",
    "grade": 2,
    "cost": {
      "tuition": 280000,
      "boarding": 50000,
      "materials": 15000,
      "other": 25000,
      "source": "市场均价估算"
    },
    "source": "市场均价估算"
  },
  {
    "stage": "高中",
    "level": "外籍人员子女学校",
    "grade": 2,
    "cost": {
      "tuition": 350000,
      "boarding": 60000,
      "materials": 18000,
      "other": 30000,
      "source": "外籍人员子女学校标准费用"
    },
    "source": "外籍人员子女学校标准费用"
  },
  {
    "stage": "高中",
    "level": "海外高中",
    "grade": 2,
    "cost": {
      "tuition": 324000,
      "boarding": 108000,
      "meals": 57600,
      "other": 86400,
      "source": "美国私立高中平均费用（含汇率转换）"
    },
    "source": "美国私立高中平均费用（含汇率转换）"
  },
  {
    "stage": "高中",
    "level": "公立",
    "grade": 3,
    "cost": {
      "tuition": 2000,
      "materials": 5000,
      "other": 5000,
      "source": "市场均价估算"
    },
    "source": "市场均价估算"
  },
  {
    "stage": "高中",
    "level": "民办普通高中",
    "grade": 3,
    "cost": {
      "tuition": 50000,
      "materials": 8000,
      "other": 8000,
      "source": "市场均价估算"
    },
    "source": "市场均价估算"
  },
  {
    "stage": "高中",
    "level": "职业高中",
    "grade": 3,
    "cost": {
      "tuition": 3000,
      "materials": 4000,
      "other": 4000,
      "source": "职业高中标准费用"
    },
    "source": "职业高中标准费用"
  },
  {
    "stage": "高中",
    "level": "公立国际部",
    "grade": 3,
    "cost": {
      "tuition": 100000,
      "materials": 10000,
      "other": 20000,
      "source": "一般费用，不含额外培训"
    },
    "source": "一般费用，不含额外培训"
  },
  {
    "stage": "高中",
    "level": "民办国际化学校",
    "grade": 3,
    "cost": {
      "tuition": 280000,
      "boarding": 50000,
      "materials": 15000,
      "other": 25000,
      "source": "市场均价估算"
    },
    "source": "市场均价估算"
  },
  {
    "stage": "高中",
    "level": "外籍人员子女学校",
    "grade": 3,
    "cost": {
      "tuition": 350000,
      "boarding": 60000,
      "materials": 18000,
      "other": 30000,
      "source": "外籍人员子女学校标准费用"
    },
    "source": "外籍人员子女学校标准费用"
  },
  {
    "stage": "高中",
    "level": "海外高中",
    "grade": 3,
    "cost": {
      "tuition": 324000,
      "boarding": 108000,
      "meals": 57600,
      "other": 86400,
      "source": "美国私立高中平均费用（含汇率转换）"
    },
    "source": "美国私立高中平均费用（含汇率转换）"
  },
  {
    "stage": "大学",
    "level": "国内公办",
    "grade": 1,
    "cost": {
      "tuition": 6000,
      "boarding": 4000,
      "meals": 8000,
      "other": 4000,
      "source": "国内大学一般标准"
    },
    "source": "国内大学一般标准"
  },
  {
    "stage": "大学",
    "level": "国内民办",
    "grade": 1,
    "cost": {
      "tuition": 20000,
      "boarding": 6000,
      "meals": 10000,
      "other": 6000,
      "source": "国内民办大学标准费用"
    },
    "source": "国内民办大学标准费用"
  },
  {
    "stage": "大学",
    "level": "海外大学",
    "grade": 1,
    "cost": {
      "tuition": 360000,
      "boarding": 86400,
      "meals": 72000,
      "other": 108000,
      "source": "美国大学平均费用（含汇率转换）"
    },
    "source": "美国大学平均费用（含汇率转换）"
  },
  {
    "stage": "大学",
    "level": "中外合作办学",
    "grade": 1,
    "cost": {
      "tuition": 80000,
      "boarding": 8000,
      "meals": 12000,
      "other": 10000,
      "source": "中外合作办学标准费用"
    },
    "source": "中外合作办学标准费用"
  },
  {
    "stage": "大学",
    "level": "国内公办",
    "grade": 2,
    "cost": {
      "tuition": 6000,
      "boarding": 4000,
      "meals": 8000,
      "other": 4000,
      "source": "国内大学一般标准"
    },
    "source": "国内大学一般标准"
  },
  {
    "stage": "大学",
    "level": "国内民办",
    "grade": 2,
    "cost": {
      "tuition": 20000,
      "boarding": 6000,
      "meals": 10000,
      "other": 6000,
      "source": "国内民办大学标准费用"
    },
    "source": "国内民办大学标准费用"
  },
  {
    "stage": "大学",
    "level": "海外大学",
    "grade": 2,
    "cost": {
      "tuition": 360000,
      "boarding": 86400,
      "meals": 72000,
      "other": 108000,
      "source": "美国大学平均费用（含汇率转换）"
    },
    "source": "美国大学平均费用（含汇率转换）"
  },
  {
    "stage": "大学",
    "level": "中外合作办学",
    "grade": 2,
    "cost": {
      "tuition": 80000,
      "boarding": 8000,
      "meals": 12000,
      "other": 10000,
      "source": "中外合作办学标准费用"
    },
    "source": "中外合作办学标准费用"
  },
  {
    "stage": "大学",
    "level": "国内公办",
    "grade": 3,
    "cost": {
      "tuition": 6000,
      "boarding": 4000,
      "meals": 8000,
      "other": 4000,
      "source": "国内大学一般标准"
    },
    "source": "国内大学一般标准"
  },
  {
    "stage": "大学",
    "level": "国内民办",
    "grade": 3,
    "cost": {
      "tuition": 20000,
      "boarding": 6000,
      "meals": 10000,
      "other": 6000,
      "source": "国内民办大学标准费用"
    },
    "source": "国内民办大学标准费用"
  },
  {
    "stage": "大学",
    "level": "海外大学",
    "grade": 3,
    "cost": {
      "tuition": 360000,
      "boarding": 86400,
      "meals": 72000,
      "other": 108000,
      "source": "美国大学平均费用（含汇率转换）"
    },
    "source": "美国大学平均费用（含汇率转换）"
  },
  {
    "stage": "大学",
    "level": "中外合作办学",
    "grade": 3,
    "cost": {
      "tuition": 80000,
      "boarding": 8000,
      "meals": 12000,
      "other": 10000,
      "source": "中外合作办学标准费用"
    },
    "source": "中外合作办学标准费用"
  },
  {
    "stage": "大学",
    "level": "国内公办",
    "grade": 4,
    "cost": {
      "tuition": 6000,
      "boarding": 4000,
      "meals": 8000,
      "other": 4000,
      "source": "国内大学一般标准"
    },
    "source": "国内大学一般标准"
  },
  {
    "stage": "大学",
    "level": "国内民办",
    "grade": 4,
    "cost": {
      "tuition": 20000,
      "boarding": 6000,
      "meals": 10000,
      "other": 6000,
      "source": "国内民办大学标准费用"
    },
    "source": "国内民办大学标准费用"
  },
  {
    "stage": "大学",
    "level": "海外大学",
    "grade": 4,
    "cost": {
      "tuition": 360000,
      "boarding": 86400,
      "meals": 72000,
      "other": 108000,
      "source": "美国大学平均费用（含汇率转换）"
    },
    "source": "美国大学平均费用（含汇率转换）"
  },
  {
    "stage": "大学",
    "level": "中外合作办学",
    "grade": 4,
    "cost": {
      "tuition": 80000,
      "boarding": 8000,
      "meals": 12000,
      "other": 10000,
      "source": "中外合作办学标准费用"
    },
    "source": "中外合作办学标准费用"
  },
  {
    "stage": "研究生",
    "level": "国内硕士",
    "grade": 1,
    "cost": {
      "tuition": 8000,
      "boarding": 5000,
      "meals": 10000,
      "other": 5000,
      "source": "国内研究生一般标准"
    },
    "source": "国内研究生一般标准"
  },
  {
    "stage": "研究生",
    "level": "海外硕士",
    "grade": 1,
    "cost": {
      "tuition": 288000,
      "boarding": 72000,
      "meals": 57600,
      "other": 86400,
      "source": "美国硕士平均费用（含汇率转换）"
    },
    "source": "美国硕士平均费用（含汇率转换）"
  },
  {
    "stage": "研究生",
    "level": "国内硕士",
    "grade": 2,
    "cost": {
      "tuition": 8000,
      "boarding": 5000,
      "meals": 10000,
      "other": 5000,
      "source": "国内研究生一般标准"
    },
    "source": "国内研究生一般标准"
  },
  {
    "stage": "研究生",
    "level": "海外硕士",
    "grade": 2,
    "cost": {
      "tuition": 288000,
      "boarding": 72000,
      "meals": 57600,
      "other": 86400,
      "source": "美国硕士平均费用（含汇率转换）"
    },
    "source": "美国硕士平均费用（含汇率转换）"
  },
  {
    "stage": "研究生",
    "level": "国内硕士",
    "grade": 3,
    "cost": {
      "tuition": 8000,
      "boarding": 5000,
      "meals": 10000,
      "other": 5000,
      "source": "国内研究生一般标准"
    },
    "source": "国内研究生一般标准"
  },
  {
    "stage": "研究生",
    "level": "海外硕士",
    "grade": 3,
    "cost": {
      "tuition": 288000,
      "boarding": 72000,
      "meals": 57600,
      "other": 86400,
      "source": "美国硕士平均费用（含汇率转换）"
    },
    "source": "美国硕士平均费用（含汇率转换）"
  },
  {
    "stage": "博士",
    "level": "国内博士",
    "grade": 1,
    "cost": {
      "tuition": 10000,
      "boarding": 6000,
      "meals": 12000,
      "other": 6000,
      "source": "国内博士一般标准"
    },
    "source": "国内博士一般标准"
  },
  {
    "stage": "博士",
    "level": "海外博士",
    "grade": 1,
    "cost": {
      "tuition": 252000,
      "boarding": 86400,
      "meals": 72000,
      "other": 108000,
      "source": "美国博士平均费用（含汇率转换）"
    },
    "source": "美国博士平均费用（含汇率转换）"
  },
  {
    "stage": "博士",
    "level": "国内博士",
    "grade": 2,
    "cost": {
      "tuition": 10000,
      "boarding": 6000,
      "meals": 12000,
      "other": 6000,
      "source": "国内博士一般标准"
    },
    "source": "国内博士一般标准"
  },
  {
    "stage": "博士",
    "level": "海外博士",
    "grade": 2,
    "cost": {
      "tuition": 252000,
      "boarding": 86400,
      "meals": 72000,
      "other": 108000,
      "source": "美国博士平均费用（含汇率转换）"
    },
    "source": "美国博士平均费用（含汇率转换）"
  },
  {
    "stage": "博士",
    "level": "国内博士",
    "grade": 3,
    "cost": {
      "tuition": 10000,
      "boarding": 6000,
      "meals": 12000,
      "other": 6000,
      "source": "国内博士一般标准"
    },
    "source": "国内博士一般标准"
  },
  {
    "stage": "博士",
    "level": "海外博士",
    "grade": 3,
    "cost": {
      "tuition": 252000,
      "boarding": 86400,
      "meals": 72000,
      "other": 108000,
      "source": "美国博士平均费用（含汇率转换）"
    },
    "source": "美国博士平均费用（含汇率转换）"
  },
  {
    "stage": "博士",
    "level": "国内博士",
    "grade": 4,
    "cost": {
      "tuition": 10000,
      "boarding": 6000,
      "meals": 12000,
      "other": 6000,
      "source": "国内博士一般标准"
    },
    "source": "国内博士一般标准"
  },
  {
    "stage": "博士",
    "level": "海外博士",
    "grade": 4,
    "cost": {
      "tuition": 252000,
      "boarding": 86400,
      "meals": 72000,
      "other": 108000,
      "source": "美国博士平均费用（含汇率转换）"
    },
    "source": "美国博士平均费用（含汇率转换）"
  },
  {
    "stage": "博士",
    "level": "国内博士",
    "grade": 5,
    "cost": {
      "tuition": 10000,
      "boarding": 6000,
      "meals": 12000,
      "other": 6000,
      "source": "国内博士一般标准"
    },
    "source": "国内博士一般标准"
  },
  {
    "stage": "博士",
    "level": "海外博士",
    "grade": 5,
    "cost": {
      "tuition": 252000,
      "boarding": 86400,
      "meals": 72000,
      "other": 108000,
      "source": "美国博士平均费用（含汇率转换）"
    },
    "source": "美国博士平均费用（含汇率转换）"
  }
];

// 导出到全局变量
window.EDUCATION_GRADE_COST_DATABASE = EDUCATION_GRADE_COST_DATABASE;
