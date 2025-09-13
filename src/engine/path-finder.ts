import { 
  UserInput, 
  TransitionRule, 
  EducationPath, 
  EducationNode, 
  PathFinderResult,
  EducationStage,
  StrategicRoute,
  RankedPath
} from '../types';
import { EDUCATION_TRANSITION_RULES } from '../../EDUCATION_TRANSITION_RULES';
import { CostCalculatorService } from '../services/CostCalculator';
import { PathClustererService } from '../services/PathClusterer';
import { PathRankerService } from '../services/PathRanker';

/**
 * 教育路径规划引擎
 * 使用深度优先搜索(DFS)算法查找所有可行的教育路径
 */
export class EducationPathFinder {
  private rules: TransitionRule[];
  private visited: Set<string> = new Set();
  private allPaths: EducationPath[] = [];
  private costCalculator: CostCalculatorService;
  private pathClusterer: PathClustererService;
  private pathRanker: PathRankerService;

  constructor(rules: TransitionRule[] = EDUCATION_TRANSITION_RULES) {
    this.rules = rules;
    this.costCalculator = new CostCalculatorService();
    this.pathClusterer = new PathClustererService();
    this.pathRanker = new PathRankerService();
  }

  /**
   * 查找所有从当前状态到目标阶段的教育路径
   * @param input 用户输入
   * @returns 所有可能的路径
   */
  findAllPaths(input: UserInput): PathFinderResult {
    // 重置状态
    this.visited.clear();
    this.allPaths = [];

    // 验证输入
    this.validateInput(input);

    // 构建起始节点
    const startNode: EducationNode = {
      stage: input.currentStage,
      level: input.currentLevel
    };

    // 使用DFS查找所有路径
    this.dfsFindPaths(startNode, input.targetStage, [startNode], [], 'feasible');

    // 为每条路径计算费用（只计算可行路径）
    const pathsWithCost = this.allPaths.map(path => {
      if (path.feasibility === 'feasible') {
        const costBreakdown = this.costCalculator.calculatePathCost(
          path.nodes, 
          input.currentStage, 
          input.currentLevel, 
          input.currentGrade
        );
        return {
          ...path,
          costBreakdown
        };
      }
      return path;
    });

    // 统计结果
    const feasiblePaths = pathsWithCost.filter(p => p.feasibility === 'feasible').length;
    const conditionalPaths = pathsWithCost.filter(p => p.feasibility === 'conditional').length;
    const infeasiblePaths = pathsWithCost.filter(p => p.feasibility === 'infeasible').length;

    return {
      paths: pathsWithCost,
      totalPaths: pathsWithCost.length,
      feasiblePaths,
      conditionalPaths,
      infeasiblePaths
    };
  }

  /**
   * 深度优先搜索查找路径
   * @param currentNode 当前节点
   * @param targetStage 目标阶段
   * @param currentPath 当前路径
   * @param currentConditions 当前条件
   * @param currentFeasibility 当前可行性
   */
  private dfsFindPaths(
    currentNode: EducationNode,
    targetStage: string,
    currentPath: EducationNode[],
    currentConditions: string[],
    currentFeasibility: 'feasible' | 'conditional' | 'infeasible'
  ): void {
    // 如果到达目标阶段，记录路径
    if (currentNode.stage === targetStage) {
      const path: EducationPath = {
        nodes: [...currentPath],
        totalConditions: [...currentConditions],
        feasibility: currentFeasibility,
        description: this.generatePathDescription(currentPath)
      };
      this.allPaths.push(path);
      return;
    }

    // 创建当前节点的唯一标识
    const nodeKey = `${currentNode.stage}-${currentNode.level}`;
    
    // 如果已经访问过这个节点，避免循环
    if (this.visited.has(nodeKey)) {
      return;
    }

    // 标记当前节点为已访问
    this.visited.add(nodeKey);

    // 查找所有可能的下一步转换
    const possibleTransitions = this.findPossibleTransitions(currentNode);

    for (const rule of possibleTransitions) {
      const nextNode: EducationNode = {
        stage: rule.to.stage,
        level: rule.to.level
      };

      // 更新可行性（取最严格的）
      const newFeasibility = this.updateFeasibility(currentFeasibility, rule.feasibility);
      
      // 添加新的条件
      const newConditions = [...currentConditions, ...rule.conditions];

      // 递归搜索
      this.dfsFindPaths(
        nextNode,
        targetStage,
        [...currentPath, nextNode],
        newConditions,
        newFeasibility
      );
    }

    // 回溯：移除当前节点的访问标记
    this.visited.delete(nodeKey);
  }

  /**
   * 查找从当前节点出发的所有可能转换
   * @param currentNode 当前节点
   * @returns 可能的转换规则
   */
  private findPossibleTransitions(currentNode: EducationNode): TransitionRule[] {
    return this.rules.filter(rule => 
      rule.from.stage === currentNode.stage && 
      rule.from.level === currentNode.level
    );
  }

  /**
   * 更新可行性状态（取最严格的）
   * @param current 当前可行性
   * @param rule 规则可行性
   * @returns 更新后的可行性
   */
  private updateFeasibility(
    current: 'feasible' | 'conditional' | 'infeasible',
    rule: 'feasible' | 'conditional' | 'infeasible'
  ): 'feasible' | 'conditional' | 'infeasible' {
    // 优先级：infeasible > conditional > feasible
    if (current === 'infeasible' || rule === 'infeasible') {
      return 'infeasible';
    }
    if (current === 'conditional' || rule === 'conditional') {
      return 'conditional';
    }
    return 'feasible';
  }

  /**
   * 生成路径描述
   * @param path 路径节点数组
   * @returns 路径描述
   */
  private generatePathDescription(path: EducationNode[]): string {
    return path.map(node => `${node.stage}-${node.level}`).join(' → ');
  }

  /**
   * 验证用户输入
   * @param input 用户输入
   */
  private validateInput(input: UserInput): void {
    // 验证目标阶段不能早于当前阶段
    const stageOrder: EducationStage[] = ['幼儿园', '小学', '初中', '高中', '大学', '研究生', '博士'];
    const currentIndex = stageOrder.indexOf(input.currentStage);
    const targetIndex = stageOrder.indexOf(input.targetStage);

    if (targetIndex <= currentIndex) {
      throw new Error(`目标阶段 ${input.targetStage} 不能早于或等于当前阶段 ${input.currentStage}`);
    }

    // 验证年级范围
    if (input.currentGrade < 1 || input.currentGrade > 12) {
      throw new Error('年级必须在1-12之间');
    }
  }

  /**
   * 获取战略路线（聚类后的路径）
   * @param input 用户输入
   * @returns 战略路线列表
   */
  getStrategicRoutes(input: UserInput): StrategicRoute[] {
    const allPaths = this.findAllPaths(input);
    return this.pathClusterer.clusterPaths(allPaths.paths, input);
  }

  /**
   * 获取指定战略路线的排序路径
   * @param routeId 战略路线ID
   * @param input 用户输入
   * @returns 排序后的路径列表
   */
  getRankedPathsForRoute(routeId: string, input: UserInput): RankedPath[] {
    const strategicRoutes = this.getStrategicRoutes(input);
    const route = strategicRoutes.find(r => r.id === routeId);
    
    if (!route) {
      return [];
    }
    
    return this.pathRanker.rankPaths(route.paths);
  }

  /**
   * 获取所有路径的聚类和排序结果
   * @param input 用户输入
   * @returns 包含战略路线和排序路径的结果
   */
  getStrategicAnalysis(input: UserInput): {
    strategicRoutes: StrategicRoute[];
    allRankedPaths: RankedPath[];
  } {
    const allPaths = this.findAllPaths(input);
    const strategicRoutes = this.pathClusterer.clusterPaths(allPaths.paths, input);
    const allRankedPaths = this.pathRanker.rankPaths(allPaths.paths);
    
    return {
      strategicRoutes,
      allRankedPaths
    };
  }
}

/**
 * 便捷函数：查找所有教育路径
 * @param input 用户输入
 * @returns 路径查找结果
 */
export function findAllPaths(input: UserInput): PathFinderResult {
  const finder = new EducationPathFinder();
  return finder.findAllPaths(input);
}

// ==================== 测试代码 ====================

/**
 * 测试函数
 */
function runTests(): void {
  console.log('=== 教育路径规划系统测试 ===\n');

  // 测试用例1：小学4年级普通私立 -> 研究生
  const testInput1: UserInput = {
    currentStage: '小学',
    currentGrade: 4,
    currentLevel: '普通私立',
    targetStage: '研究生'
  };

  console.log('测试用例1：小学4年级普通私立 -> 研究生');
  console.log('输入:', JSON.stringify(testInput1, null, 2));
  
  try {
    const result1 = findAllPaths(testInput1);
    console.log(`\n找到 ${result1.totalPaths} 条路径:`);
    console.log(`- 可行路径: ${result1.feasiblePaths} 条`);
    console.log(`- 有条件路径: ${result1.conditionalPaths} 条`);
    console.log(`- 不可行路径: ${result1.infeasiblePaths} 条\n`);

    // 显示前5条路径的详细信息
    result1.paths.slice(0, 5).forEach((path, index) => {
      console.log(`路径 ${index + 1} (${path.feasibility}):`);
      console.log(`  路径: ${path.description}`);
      if (path.totalConditions.length > 0) {
        console.log(`  条件: ${path.totalConditions.join('; ')}`);
      }
      if (path.costBreakdown) {
        console.log(`  总费用: ¥${path.costBreakdown.total.toLocaleString('zh-CN')}`);
        console.log(`  费用明细:`);
        path.costBreakdown.stages.forEach(stage => {
          console.log(`    ${stage.stage}-${stage.level}: ¥${stage.costTotal.toLocaleString('zh-CN')} (${stage.duration}年)`);
        });
      }
      console.log('');
    });

    if (result1.paths.length > 5) {
      console.log(`... 还有 ${result1.paths.length - 5} 条路径\n`);
    }

  } catch (error) {
    console.error('测试用例1失败:', error);
  }

  // 测试用例2：高中民办国际化学校 -> 博士
  const testInput2: UserInput = {
    currentStage: '高中',
    currentGrade: 2,
    currentLevel: '民办国际化学校',
    targetStage: '博士'
  };

  console.log('测试用例2：高中民办国际化学校 -> 博士');
  console.log('输入:', JSON.stringify(testInput2, null, 2));
  
  try {
    const result2 = findAllPaths(testInput2);
    console.log(`\n找到 ${result2.totalPaths} 条路径:`);
    console.log(`- 可行路径: ${result2.feasiblePaths} 条`);
    console.log(`- 有条件路径: ${result2.conditionalPaths} 条`);
    console.log(`- 不可行路径: ${result2.infeasiblePaths} 条\n`);

    // 显示所有路径
    result2.paths.forEach((path, index) => {
      console.log(`路径 ${index + 1} (${path.feasibility}):`);
      console.log(`  路径: ${path.description}`);
      if (path.totalConditions.length > 0) {
        console.log(`  条件: ${path.totalConditions.join('; ')}`);
      }
      if (path.costBreakdown) {
        console.log(`  总费用: ¥${path.costBreakdown.total.toLocaleString('zh-CN')}`);
        console.log(`  费用明细:`);
        path.costBreakdown.stages.forEach(stage => {
          console.log(`    ${stage.stage}-${stage.level}: ¥${stage.costTotal.toLocaleString('zh-CN')} (${stage.duration}年)`);
        });
      }
      console.log('');
    });

  } catch (error) {
    console.error('测试用例2失败:', error);
  }

  // 测试用例3：错误输入测试
  console.log('测试用例3：错误输入测试');
  const testInput3: UserInput = {
    currentStage: '大学',
    currentGrade: 2,
    currentLevel: '国内公办',
    targetStage: '大学' // 错误：目标阶段等于当前阶段
  };

  try {
    const result3 = findAllPaths(testInput3);
    console.log('错误：应该抛出异常但没有');
  } catch (error) {
    console.log('正确捕获错误:', (error as Error).message);
  }

  console.log('\n=== 测试完成 ===');
}

// 如果直接运行此文件，执行测试
if (require.main === module) {
  runTests();
}
