/**
 * 匹配度计算服务
 * 计算战略路线与用户当前教育状态的匹配度
 */
class MatchScoreCalculatorService {
  constructor() {
    // 国际体系水平集合
    this.internationalLevels = new Set([
      '民办双语',
      '外籍人员子女学校',
      '公立国际部',
      '民办国际化学校',
      '海外高中',
      '海外大学',
      '海外硕士',
      '海外博士'
    ]);

    // 国内体系水平集合
    this.domesticLevels = new Set([
      '公立',
      '普通私立',
      '民办普通高中',
      '职业高中',
      '国内公办',
      '国内民办',
      '中外合作办学',
      '国内硕士',
      '国内博士'
    ]);
  }

  /**
   * 计算单条路径的匹配得分
   * @param {Object} path 教育路径
   * @param {string} currentLevel 当前教育水平
   * @returns {number} 匹配得分 (0-1)
   */
  calculatePathMatchScore(path, currentLevel) {
    if (!path.nodes || path.nodes.length === 0) {
      return 0;
    }

    let totalSim = 0;
    
    // 计算路径中每个阶段水平与当前水平的相似度
    for (const node of path.nodes) {
      const level = node.level;
      const sim = this.calculateLevelSimilarity(level, currentLevel);
      totalSim += sim;
    }
    
    return totalSim / path.nodes.length;
  }

  /**
   * 计算战略路线的平均匹配得分
   * @param {Array} paths 路径列表
   * @param {string} currentLevel 当前教育水平
   * @returns {number} 平均匹配得分 (0-1)
   */
  calculateRouteAverageMatchScore(paths, currentLevel) {
    if (!paths || paths.length === 0) {
      return 0;
    }

    let totalScore = 0;
    for (const path of paths) {
      totalScore += this.calculatePathMatchScore(path, currentLevel);
    }
    
    return totalScore / paths.length;
  }

  /**
   * 计算两个教育水平的相似度
   * @param {string} level1 教育水平1
   * @param {string} level2 教育水平2
   * @returns {number} 相似度 (0-1)
   */
  calculateLevelSimilarity(level1, level2) {
    // 如果两个水平相同，相似度为1.0
    if (level1 === level2) {
      return 1.0;
    }

    // 判断是否为国际体系
    const level1IsInternational = this.isInternationalLevel(level1);
    const level2IsInternational = this.isInternationalLevel(level2);

    // 如果都是国际体系或都是国内体系，相似度为0.5
    if (level1IsInternational === level2IsInternational) {
      return 0.5;
    }

    // 如果一个是国际体系，一个是国内体系，相似度为0.0
    return 0.0;
  }

  /**
   * 判断是否为国际体系水平
   * @param {string} level 教育水平
   * @returns {boolean} 是否为国际体系
   */
  isInternationalLevel(level) {
    return this.internationalLevels.has(level);
  }

  /**
   * 判断是否为国内体系水平
   * @param {string} level 教育水平
   * @returns {boolean} 是否为国内体系
   */
  isDomesticLevel(level) {
    return this.domesticLevels.has(level);
  }

  /**
   * 获取国际体系水平列表
   * @returns {Array} 国际体系水平数组
   */
  getInternationalLevels() {
    return Array.from(this.internationalLevels);
  }

  /**
   * 获取国内体系水平列表
   * @returns {Array} 国内体系水平数组
   */
  getDomesticLevels() {
    return Array.from(this.domesticLevels);
  }
}

// 导出服务
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MatchScoreCalculatorService;
} else {
  window.MatchScoreCalculatorService = MatchScoreCalculatorService;
}
