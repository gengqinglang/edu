/**
 * 教育水平特点配置文件
 * 包含所有教育阶段的核心特点与说明
 */

export interface EducationLevelFeature {
  stage: string;
  level: string;
  features: string;
  nationalityRequirement?: string;
  studentStatus?: string;
}

export const EDUCATION_LEVEL_FEATURES: EducationLevelFeature[] = [
  // 幼儿园阶段
  {
    stage: '幼儿园',
    level: '公立',
    features: '**性价比高**：费用低，教师稳定。**名额紧张**：需按政策排队，入学难。',
    nationalityRequirement: '无明确限制，但优先录取有户籍/房产者',
    studentStatus: '有'
  },
  {
    stage: '幼儿园',
    level: '普通私立',
    features: '**灵活多样**：入学门槛灵活，硬件和服务较好，可能有特色课程。**目标国内**。',
    nationalityRequirement: '无限制',
    studentStatus: '有'
  },
  {
    stage: '幼儿园',
    level: '民办双语',
    features: '**双轨预备**：融合中西方教育理念，注重英语启蒙。为未来选择国内或国际路径打基础。**费用较高**。',
    nationalityRequirement: '无限制',
    studentStatus: '有'
  },

  // 小学阶段
  {
    stage: '小学',
    level: '公立',
    features: '**义务教育核心**：免学费，严格按学区入学。课程完全对标**中考**。',
    nationalityRequirement: '无明确限制，但优先录取有户籍/房产者',
    studentStatus: '有'
  },
  {
    stage: '小学',
    level: '普通私立',
    features: '**灵活选择**：入学相对容易，教学质量参差不齐。**目标国内中考**。',
    nationalityRequirement: '无限制',
    studentStatus: '有'
  },
  {
    stage: '小学',
    level: '民办双语',
    features: '**双轨培养**：中英文并重，国际化教育理念。为初中阶段的选择（国内/国际）做准备。**费用较高**。',
    nationalityRequirement: '无限制',
    studentStatus: '有'
  },

  // 初中阶段
  {
    stage: '初中',
    level: '公立',
    features: '**中考主战场**：严格按学区入学，课程完全对标中考。**竞争激烈**，但费用低。',
    nationalityRequirement: '无明确限制，但优先录取有户籍/房产者',
    studentStatus: '有'
  },
  {
    stage: '初中',
    level: '普通私立',
    features: '**中考备选**：入学相对容易，同样对标中考。教学质量参差不齐。',
    nationalityRequirement: '无限制',
    studentStatus: '有'
  },
  {
    stage: '初中',
    level: '民办双语',
    features: '**关键分岔点**：既可以参加中考进入国内高中，也可以申请国际高中。**双轨培养，选择灵活**。',
    nationalityRequirement: '无限制',
    studentStatus: '有'
  },

  // 高中阶段
  {
    stage: '高中',
    level: '公立',
    features: '**高考主力军**：严格按中考分数录取，课程完全对标高考。**竞争最激烈，但费用最低**。',
    nationalityRequirement: '无明确限制，但需要中考成绩',
    studentStatus: '有'
  },
  {
    stage: '高中',
    level: '民办普通高中',
    features: '**高考备选**：中考分数要求相对较低，同样对标高考。**费用较高，竞争相对缓和**。',
    nationalityRequirement: '无限制',
    studentStatus: '有'
  },
  {
    stage: '高中',
    level: '公立国际部',
    features: '**精英路径**：需要极高的中考分数+英语能力。提供AP/A-Level/IB课程，**目标海外顶尖大学**。',
    nationalityRequirement: '无明确限制，但需要中考成绩',
    studentStatus: '有'
  },
  {
    stage: '高中',
    level: '民办国际化学校',
    features: '**国际教育主流**：提供多种国际课程（AP/A-Level/IB），**目标海外大学**。入学相对灵活，但费用高。',
    nationalityRequirement: '无限制',
    studentStatus: '有'
  },
  {
    stage: '高中',
    level: '海外高中',
    features: '**纯海外体验**：直接在海外就读高中，完全融入当地教育体系。**申请海外大学优势明显，但适应挑战大**。',
    nationalityRequirement: '无限制，但需要签证',
    studentStatus: '无'
  },

  // 大学阶段
  {
    stage: '大学',
    level: '国内公办',
    features: '**性价比之王**：学费低，教学质量有保障。**需要高考高分，竞争激烈**。',
    nationalityRequirement: '无明确限制，但需要高考成绩',
    studentStatus: '有'
  },
  {
    stage: '大学',
    level: '国内民办',
    features: '**灵活选择**：录取分数相对较低，专业设置灵活。**学费较高，就业竞争力相对较弱**。',
    nationalityRequirement: '无限制',
    studentStatus: '有'
  },
  {
    stage: '大学',
    level: '海外大学',
    features: '**国际视野**：接受国际化教育，提升语言能力和跨文化交流能力。**费用高，但就业前景广阔**。',
    nationalityRequirement: '无限制，但需要签证',
    studentStatus: '无'
  },
  {
    stage: '大学',
    level: '中外合作办学',
    features: '**中西结合**：在国内享受国际化教育，部分时间可能在海外学习。**费用适中，获得双学位**。',
    nationalityRequirement: '无限制',
    studentStatus: '有'
  },

  // 研究生阶段
  {
    stage: '研究生',
    level: '国内硕士',
    features: '**深造首选**：学费相对较低，研究资源丰富。**需要考研高分，竞争激烈**。',
    nationalityRequirement: '无限制',
    studentStatus: '有'
  },
  {
    stage: '研究生',
    level: '海外硕士',
    features: '**国际深造**：接受前沿学术训练，提升国际竞争力。**费用较高，但回国就业优势明显**。',
    nationalityRequirement: '无限制，但需要签证',
    studentStatus: '无'
  },

  // 博士阶段
  {
    stage: '博士',
    level: '国内博士',
    features: '**学术深造**：在国内进行深入学术研究，费用相对较低。**研究周期长，就业面相对较窄**。',
    nationalityRequirement: '无限制',
    studentStatus: '有'
  },
  {
    stage: '博士',
    level: '海外博士',
    features: '**国际学术**：接受国际前沿学术训练，研究资源丰富。**费用高，但学术声誉和就业前景优秀**。',
    nationalityRequirement: '无限制，但需要签证',
    studentStatus: '无'
  }
];