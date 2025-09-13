import { EducationPath, EducationLevel } from '../types';

/**
 * 匹配度计算服务
 * 计算战略路线与用户当前教育状态的匹配度
 */
export class MatchScoreCalculatorService {
  // 国际体系水平集合
  private readonly internationalLevels: Set<EducationLevel> = new Set([
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
  private readonly domesticLevels: Set<EducationLevel> = new Set([
    '公立',
    '普通私立',
    '民办普通高中',
    '国内公办',
    '国内民办',
    '中外合作办学',
    '国内硕士',
    '国内博士'
  ]);

  /**
   * 计算单条路径的匹配得分
   * @param path 教育路径
   * @param currentLevel 当前教育水平
   * @returns 匹配得分 (0-1)
   */
  calculatePathMatchScore(path: EducationPath, currentLevel: EducationLevel): number {
    if (path.nodes.length === 0) {
      return 0;
    }

    let totalSim = 0;
    
    // 计算路径中每个阶段水平与当前水平的相似度
    for (const node of path.nodes) {
      const level = node.level as EducationLevel;
      const sim = this.calculateLevelSimilarity(level, currentLevel);
      totalSim += sim;
    }
    
    return totalSim / path.nodes.length;
  }

  /**
   * 计算战略路线的平均匹配得分
   * @param paths 路径列表
   * @param currentLevel 当前教育水平
   * @returns 平均匹配得分 (0-1)
   */
  calculateRouteAverageMatchScore(paths: EducationPath[], currentLevel: EducationLevel): number {
    if (paths.length === 0) {
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
   * @param level1 教育水平1
   * @param level2 教育水平2
   * @returns 相似度 (0-1)
   */
  private calculateLevelSimilarity(level1: EducationLevel, level2: EducationLevel): number {
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
   * @param level 教育水平
   * @returns 是否为国际体系
   */
  private isInternationalLevel(level: EducationLevel): boolean {
    return this.internationalLevels.has(level);
  }

  /**
   * 判断是否为国内体系水平
   * @param level 教育水平
   * @returns 是否为国内体系
   */
  private isDomesticLevel(level: EducationLevel): boolean {
    return this.domesticLevels.has(level);
  }

  /**
   * 获取国际体系水平列表
   * @returns 国际体系水平数组
   */
  getInternationalLevels(): EducationLevel[] {
    return Array.from(this.internationalLevels);
  }

  /**
   * 获取国内体系水平列表
   * @returns 国内体系水平数组
   */
  getDomesticLevels(): EducationLevel[] {
    return Array.from(this.domesticLevels);
  }
}
