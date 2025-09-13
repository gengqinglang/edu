import { EducationLevelFeature, getEducationLevelFeature, getAllEducationLevelFeatures } from '../config/education-level-features';

/**
 * 教育水平特点服务
 * 提供教育水平核心特点与说明的查询功能
 */
export class EducationLevelFeaturesService {
  
  /**
   * 根据阶段和水平获取教育特点
   * @param stage 教育阶段
   * @param level 教育水平
   * @returns 教育特点信息，如果未找到返回null
   */
  getFeature(stage: string, level: string): EducationLevelFeature | null {
    return getEducationLevelFeature(stage, level);
  }

  /**
   * 获取教育特点的核心说明文本
   * @param stage 教育阶段
   * @param level 教育水平
   * @returns 核心特点说明文本，如果未找到返回空字符串
   */
  getFeatureDescription(stage: string, level: string): string {
    const feature = this.getFeature(stage, level);
    return feature ? feature.features : '';
  }

  /**
   * 获取教育特点的国籍要求
   * @param stage 教育阶段
   * @param level 教育水平
   * @returns 国籍要求说明，如果未找到返回空字符串
   */
  getNationalityRequirement(stage: string, level: string): string {
    const feature = this.getFeature(stage, level);
    return feature ? (feature.nationalityRequirement || '') : '';
  }

  /**
   * 获取教育特点的学籍情况
   * @param stage 教育阶段
   * @param level 教育水平
   * @returns 学籍情况说明，如果未找到返回空字符串
   */
  getStudentStatus(stage: string, level: string): string {
    const feature = this.getFeature(stage, level);
    return feature ? (feature.studentStatus || '') : '';
  }

  /**
   * 获取所有教育水平特点
   * @returns 所有教育特点信息
   */
  getAllFeatures(): EducationLevelFeature[] {
    return getAllEducationLevelFeatures();
  }

  /**
   * 根据阶段获取该阶段的所有教育水平特点
   * @param stage 教育阶段
   * @returns 该阶段的所有教育特点信息
   */
  getFeaturesByStage(stage: string): EducationLevelFeature[] {
    return getAllEducationLevelFeatures().filter(feature => feature.stage === stage);
  }

  /**
   * 检查是否存在指定阶段和水平的特点信息
   * @param stage 教育阶段
   * @param level 教育水平
   * @returns 是否存在特点信息
   */
  hasFeature(stage: string, level: string): boolean {
    return this.getFeature(stage, level) !== null;
  }

  /**
   * 获取教育特点的完整信息（包含所有字段）
   * @param stage 教育阶段
   * @param level 教育水平
   * @returns 完整的教育特点信息对象
   */
  getFullFeatureInfo(stage: string, level: string): {
    features: string;
    nationalityRequirement: string;
    studentStatus: string;
    hasInfo: boolean;
  } {
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
}
