import { EducationNode, EducationPath, EducationStage, EducationLevel, StageLevelCost, GradeCost } from '../types';
import { EDUCATION_COST_DATABASE } from '../data/EducationCostDatabase';
import { EDUCATION_GRADE_COST_DATABASE } from '../data/EducationGradeCostDatabase';

export class CostCalculatorService {
  /**
   * 根据阶段和水平，从数据库中查找对应的费用数据
   */
  private findCostForStageLevel(stage: EducationStage, level: EducationLevel): StageLevelCost | undefined {
    return EDUCATION_COST_DATABASE.find(
      (item) => item.stage === stage && item.level === level
    );
  }

  /**
   * 根据阶段、水平和年级，从年级费用数据库中查找对应的费用数据
   */
  private findCostForGrade(stage: EducationStage, level: EducationLevel, grade: number): GradeCost | undefined {
    return EDUCATION_GRADE_COST_DATABASE.find(
      (item) => item.stage === stage && item.level === level && item.grade === grade
    );
  }

  /**
   * 计算当前阶段剩余年数的费用
   */
  public calculateCurrentStageRemainingCost(
    stage: EducationStage, 
    level: EducationLevel, 
    currentGrade: number
  ): { total: number; remainingYears: number; yearlyCost: number; source: string } | null {
    // 获取该阶段的总年数
    const stageCost = this.findCostForStageLevel(stage, level);
    if (!stageCost) {
      return null;
    }

    const totalYears = stageCost.duration;
    const remainingYears = Math.max(0, totalYears - currentGrade + 1);

    if (remainingYears === 0) {
      return {
        total: 0,
        remainingYears: 0,
        yearlyCost: 0,
        source: '已毕业'
      };
    }

    // 计算剩余年数的总费用
    let totalCost = 0;
    let yearlyCost = 0;
    let source = '';

    for (let year = currentGrade; year <= totalYears; year++) {
      const gradeCost = this.findCostForGrade(stage, level, year);
      if (gradeCost) {
        const yearTotal = this.calculateCostItemTotal(gradeCost.cost);
        totalCost += yearTotal;
        yearlyCost = yearTotal; // 使用最后一年的费用作为年均费用
        source = gradeCost.source;
      }
    }

    return {
      total: totalCost,
      remainingYears,
      yearlyCost,
      source
    };
  }

  /**
   * 计算单个费用项的总金额
   */
  private calculateCostItemTotal(costItem: any): number {
    let total = 0;
    for (const [key, value] of Object.entries(costItem)) {
      if (key !== 'source' && typeof value === 'number') {
        total += value;
      }
    }
    return total;
  }

  /**
   * 计算一条路径的总费用和明细（包含当前阶段剩余费用）
   */
  public calculatePathCost(
    path: EducationNode[], 
    currentStage?: EducationStage, 
    currentLevel?: EducationLevel, 
    currentGrade?: number
  ): EducationPath['costBreakdown'] {
    const stageBreakdowns: NonNullable<EducationPath['costBreakdown']>['stages'] = [];

    // 1. 如果提供了当前阶段信息，先计算当前阶段剩余费用
    if (currentStage && currentLevel && currentGrade) {
      const currentStageCost = this.calculateCurrentStageRemainingCost(currentStage, currentLevel, currentGrade);
      if (currentStageCost && currentStageCost.remainingYears > 0) {
        stageBreakdowns.push({
          stage: currentStage,
          level: currentLevel,
          duration: currentStageCost.remainingYears,
          costPerYear: { 
            tuition: 0, 
            source: currentStageCost.source 
          },
          costTotal: currentStageCost.total,
        });
      }
    }

    // 2. 遍历路径中的每个节点，计算每个阶段的费用
    for (const node of path) {
      // 跳过当前阶段（已经在上面计算了）
      if (currentStage && currentLevel && 
          node.stage === currentStage && node.level === currentLevel) {
        continue;
      }

      const costData = this.findCostForStageLevel(node.stage as EducationStage, node.level as EducationLevel);

      if (costData) {
        // 计算该阶段年度总费用
        const yearlyTotal = this.calculateCostItemTotal(costData.cost);
        // 计算该阶段总费用 (年度费用 * 年数)
        const stageTotal = yearlyTotal * costData.duration;

        stageBreakdowns.push({
          stage: costData.stage,
          level: costData.level,
          duration: costData.duration,
          costPerYear: costData.cost,
          costTotal: stageTotal,
        });
      } else {
        // 处理未找到费用数据的情况
        console.warn(`No cost data found for ${node.stage} - ${node.level}`);
        stageBreakdowns.push({
          stage: node.stage as EducationStage,
          level: node.level as EducationLevel,
          duration: 0,
          costPerYear: { tuition: 0, source: '数据缺失' },
          costTotal: 0,
        });
      }
    }

    // 3. 计算整个路径的总费用
    const totalCost = stageBreakdowns.reduce((sum: number, stage) => sum + stage.costTotal, 0);

    // 4. 返回完整的费用分析结果
    return {
      total: totalCost,
      stages: stageBreakdowns,
    };
  }

  /**
   * 格式化费用显示（添加千分位分隔符）
   */
  public formatCost(cost: number): string {
    return cost.toLocaleString('zh-CN');
  }

  /**
   * 获取费用数据来源说明
   */
  public getCostSource(stage: EducationStage, level: EducationLevel): string {
    const costData = this.findCostForStageLevel(stage, level);
    return costData ? costData.cost.source : '数据缺失';
  }
}
