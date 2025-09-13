/**
 * 前端费用计算服务
 */
class CostCalculatorService {
  constructor() {
    this.costDatabase = window.EDUCATION_COST_DATABASE || [];
    this.gradeCostDatabase = window.EDUCATION_GRADE_COST_DATABASE || [];
  }

  /**
   * 根据阶段和水平，从数据库中查找对应的费用数据
   */
  findCostForStageLevel(stage, level) {
    return this.costDatabase.find(
      (item) => item.stage === stage && item.level === level
    );
  }

  /**
   * 根据阶段、水平和年级，从年级费用数据库中查找对应的费用数据
   */
  findCostForGrade(stage, level, grade) {
    return this.gradeCostDatabase.find(
      (item) => item.stage === stage && item.level === level && item.grade === grade
    );
  }

  /**
   * 计算当前阶段剩余年数的费用
   */
  calculateCurrentStageRemainingCost(stage, level, currentGrade) {
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
    let foundYears = 0;

    for (let year = currentGrade; year <= totalYears; year++) {
      const gradeCost = this.findCostForGrade(stage, level, year);
      if (gradeCost) {
        const yearTotal = this.calculateCostItemTotal(gradeCost.cost);
        totalCost += yearTotal;
        yearlyCost = yearTotal; // 使用最后一年的费用作为年均费用
        source = gradeCost.source;
        foundYears++;
      }
    }

    // 如果没有找到任何年级费用数据，尝试使用阶段费用数据
    if (foundYears === 0) {
      const stageCost = this.findCostForStageLevel(stage, level);
      if (stageCost) {
        yearlyCost = this.calculateCostItemTotal(stageCost.cost);
        totalCost = yearlyCost * remainingYears;
        source = stageCost.cost.source;
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
  calculateCostItemTotal(costItem) {
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
  calculatePathCost(path, currentStage, currentLevel, currentGrade) {
    const stageBreakdowns = [];

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

      const costData = this.findCostForStageLevel(node.stage, node.level);

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
          stage: node.stage,
          level: node.level,
          duration: 0,
          costPerYear: { tuition: 0, source: '数据缺失' },
          costTotal: 0,
        });
      }
    }

    // 3. 计算整个路径的总费用
    const totalCost = stageBreakdowns.reduce((sum, stage) => sum + stage.costTotal, 0);

    // 4. 返回完整的费用分析结果
    return {
      total: totalCost,
      stages: stageBreakdowns,
    };
  }

  /**
   * 格式化费用显示（添加千分位分隔符）
   */
  formatCost(cost) {
    return cost.toLocaleString('zh-CN');
  }

  /**
   * 获取费用数据来源说明
   */
  getCostSource(stage, level) {
    const costData = this.findCostForStageLevel(stage, level);
    return costData ? costData.cost.source : '数据缺失';
  }

  /**
   * 获取单个阶段的费用信息
   */
  getStageCost(stage, level) {
    const costData = this.findCostForStageLevel(stage, level);
    if (!costData) {
      return null;
    }

    const yearlyTotal = this.calculateCostItemTotal(costData.cost);
    const stageTotal = yearlyTotal * costData.duration;

    return {
      stage: costData.stage,
      level: costData.level,
      duration: costData.duration,
      costPerYear: costData.cost,
      costTotal: stageTotal,
      yearlyTotal: yearlyTotal
    };
  }
}

// 导出费用计算服务
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CostCalculatorService };
} else {
  window.CostCalculatorService = CostCalculatorService;
}
