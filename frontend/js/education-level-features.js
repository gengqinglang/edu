/**
 * 前端教育水平特点数据
 * 包含所有教育阶段的核心特点与说明
 */

// 教育水平特点数据
const EDUCATION_LEVEL_FEATURES = [
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
  {
    stage: '幼儿园',
    level: '外籍人员子女学校',
    features: '**纯国际环境**：完全采用国际课程（如IB PYP），全英文教学。目标直指海外大学。**一旦选择，基本无法转回国内体系**。',
    nationalityRequirement: '仅外籍/港澳台',
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
    features: '**强化应试**：同样以国内课程和中考为目标，可能管理更严格、教学进度更快。',
    nationalityRequirement: '无限制',
    studentStatus: '有'
  },
  {
    stage: '小学',
    level: '民办双语',
    features: '**双轨制核心**：**融合课程**（国家课程+国际元素），**高强度双语教学**。**最大优势是保留国内学籍**，为家庭保留未来参加中考高考的可能性，同时为出国做准备。',
    nationalityRequirement: '无限制',
    studentStatus: '通常有'
  },
  {
    stage: '小学',
    level: '外籍人员子女学校',
    features: '**纯国际环境**：完全采用国际课程（如IB PYP/MYP），全英文教学。目标直指海外大学。**一旦选择，基本无法转回国内体系**。',
    nationalityRequirement: '仅外籍/港澳台',
    studentStatus: '无'
  },

  // 初中阶段
  {
    stage: '初中',
    level: '公立',
    features: '**义务教育核心**：免学费，严格按学区入学。课程完全对标**中考**。',
    nationalityRequirement: '无明确限制，但优先录取有户籍/房产者',
    studentStatus: '有'
  },
  {
    stage: '初中',
    level: '普通私立',
    features: '**强化应试**：同样以国内课程和中考为目标，可能管理更严格、教学进度更快。',
    nationalityRequirement: '无限制',
    studentStatus: '有'
  },
  {
    stage: '初中',
    level: '民办双语',
    features: '**双轨制核心**：**融合课程**（国家课程+国际元素），**高强度双语教学**。**最大优势是保留国内学籍**，为家庭保留未来参加中考高考的可能性，同时为出国做准备。',
    nationalityRequirement: '无限制',
    studentStatus: '通常有'
  },
  {
    stage: '初中',
    level: '外籍人员子女学校',
    features: '**纯国际环境**：完全采用国际课程（如IB PYP/MYP），全英文教学。目标直指海外大学。**一旦选择，基本无法转回国内体系**。',
    nationalityRequirement: '仅外籍/港澳台',
    studentStatus: '无'
  },

  // 高中阶段
  {
    stage: '高中',
    level: '公立',
    features: '**高考主力军**：通过中考选拔，核心任务是为**高考**备考。',
    nationalityRequirement: '通常需本地户籍',
    studentStatus: '有'
  },
  {
    stage: '高中',
    level: '民办普通高中',
    features: '**高考另一选择**：同样以高考为目标，录取分数线可能更灵活。',
    nationalityRequirement: '无限制',
    studentStatus: '有'
  },
  {
    stage: '高中',
    level: '公立国际部',
    features: '**优质双轨制**：依附于顶尖公立高中，通过中考+自主招生录取。**最大特点是既保留学籍可参加高考，又提供国际课程申请海外大学**。竞争激烈。',
    nationalityRequirement: '通常需本地户籍',
    studentStatus: '通常有'
  },
  {
    stage: '高中',
    level: '民办国际化学校',
    features: '**出国直通车**：自主招生，提供AP/A-Level/IB等课程。**不参与国内高考，目标就是海外本科**。是中国学生进入国际体系的主流选择。',
    nationalityRequirement: '无限制',
    studentStatus: '通常无'
  },
  {
    stage: '高中',
    level: '外籍人员子女学校',
    features: '**纯海外环境**：与小学初中一脉相承，提供IBDP等课程，学生全部申请海外大学。',
    nationalityRequirement: '仅外籍/港澳台',
    studentStatus: '无'
  },
  {
    stage: '高中',
    level: '海外高中',
    features: '**提前留学**：直接送孩子出国读高中，提前适应海外生活和教育模式。',
    nationalityRequirement: '无限制（但需签证）',
    studentStatus: '无'
  },

  // 大学阶段
  {
    stage: '大学',
    level: '国内公办',
    features: '通过**高考**录取，性价比高，是国内教育体系的主要出口。',
    nationalityRequirement: '无限制（通过高考）',
    studentStatus: '有'
  },
  {
    stage: '大学',
    level: '国内民办',
    features: '通过**高考**录取，学费高于公办。',
    nationalityRequirement: '无限制（通过高考）',
    studentStatus: '有'
  },
  {
    stage: '大学',
    level: '中外合作办学',
    features: '如上海纽约大学、西交利物浦大学。国际化教学，学费高于公办，但低于直接出国。毕业后获中外两个学位。',
    nationalityRequirement: '无限制（通过高考/综评）',
    studentStatus: '有（中外双学籍）'
  },
  {
    stage: '大学',
    level: '海外大学',
    features: '通过申请制（看GPA、语言、文书等）入读国外大学。费用高昂。',
    nationalityRequirement: '无限制（需申请）',
    studentStatus: '无'
  },

  // 研究生阶段
  {
    stage: '研究生',
    level: '国内硕士',
    features: '通过全国统一招生考试或申请-考核制入学。',
    nationalityRequirement: '无限制（通过考研/考博）',
    studentStatus: '有'
  },
  {
    stage: '研究生',
    level: '海外硕士',
    features: '通过申请制入学，看重本科/硕士背景、研究成果、语言成绩等。',
    nationalityRequirement: '无限制（需申请）',
    studentStatus: '无'
  },

  // 博士阶段
  {
    stage: '博士',
    level: '国内博士',
    features: '通过全国统一招生考试或申请-考核制入学。',
    nationalityRequirement: '无限制（通过考研/考博）',
    studentStatus: '有'
  },
  {
    stage: '博士',
    level: '海外博士',
    features: '通过申请制入学，看重本科/硕士背景、研究成果、语言成绩等。',
    nationalityRequirement: '无限制（需申请）',
    studentStatus: '无'
  }
];

/**
 * 前端教育水平特点服务
 */
class EducationLevelFeaturesService {
  
  /**
   * 根据阶段和水平获取教育特点
   * @param {string} stage 教育阶段
   * @param {string} level 教育水平
   * @returns {Object|null} 教育特点信息，如果未找到返回null
   */
  getFeature(stage, level) {
    return EDUCATION_LEVEL_FEATURES.find(feature => 
      feature.stage === stage && feature.level === level
    ) || null;
  }

  /**
   * 获取教育特点的核心说明文本
   * @param {string} stage 教育阶段
   * @param {string} level 教育水平
   * @returns {string} 核心特点说明文本，如果未找到返回空字符串
   */
  getFeatureDescription(stage, level) {
    const feature = this.getFeature(stage, level);
    return feature ? feature.features : '';
  }

  /**
   * 获取教育特点的国籍要求
   * @param {string} stage 教育阶段
   * @param {string} level 教育水平
   * @returns {string} 国籍要求说明，如果未找到返回空字符串
   */
  getNationalityRequirement(stage, level) {
    const feature = this.getFeature(stage, level);
    return feature ? (feature.nationalityRequirement || '') : '';
  }

  /**
   * 获取教育特点的学籍情况
   * @param {string} stage 教育阶段
   * @param {string} level 教育水平
   * @returns {string} 学籍情况说明，如果未找到返回空字符串
   */
  getStudentStatus(stage, level) {
    const feature = this.getFeature(stage, level);
    return feature ? (feature.studentStatus || '') : '';
  }

  /**
   * 获取所有教育水平特点
   * @returns {Array} 所有教育特点信息
   */
  getAllFeatures() {
    return EDUCATION_LEVEL_FEATURES;
  }

  /**
   * 根据阶段获取该阶段的所有教育水平特点
   * @param {string} stage 教育阶段
   * @returns {Array} 该阶段的所有教育特点信息
   */
  getFeaturesByStage(stage) {
    return EDUCATION_LEVEL_FEATURES.filter(feature => feature.stage === stage);
  }

  /**
   * 检查是否存在指定阶段和水平的特点信息
   * @param {string} stage 教育阶段
   * @param {string} level 教育水平
   * @returns {boolean} 是否存在特点信息
   */
  hasFeature(stage, level) {
    return this.getFeature(stage, level) !== null;
  }

  /**
   * 获取教育特点的完整信息（包含所有字段）
   * @param {string} stage 教育阶段
   * @param {string} level 教育水平
   * @returns {Object} 完整的教育特点信息对象
   */
  getFullFeatureInfo(stage, level) {
    const feature = this.getFeature(stage, level);
    
    if (!feature) {
      return {
        features: '',
        nationalityRequirement: '',
        studentStatus: '',
        hasInfo: false
      };
    }

    return {
      features: feature.features,
      nationalityRequirement: feature.nationalityRequirement || '',
      studentStatus: feature.studentStatus || '',
      hasInfo: true
    };
  }

  /**
   * 格式化特点文本，将Markdown格式转换为HTML
   * @param {string} text 原始文本
   * @returns {string} 格式化后的HTML文本
   */
  formatFeatureText(text) {
    if (!text) return '';
    
    // 将 **文本** 转换为 <strong>文本</strong>
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  }
}

// 导出服务
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EducationLevelFeaturesService;
} else {
  window.EducationLevelFeaturesService = EducationLevelFeaturesService;
}
