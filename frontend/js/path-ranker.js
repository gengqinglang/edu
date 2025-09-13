/**
 * 前端路径排序服务
 */
class PathRankerService {
  constructor() {
    this.defaultWeights = {
      feasibility: 0.4,    // 可行性权重
      prevalence: 0.3,     // 常见度权重
      cost: 0.2,          // 费用权重
      transition: 0.1     // 转轨次数权重
    };
    
    this.matchScoreCalculator = new MatchScoreCalculatorService();
  }

  /**
   * 对路径进行排序
   */
  rankPaths(paths, weights = {}) {
    const finalWeights = { ...this.defaultWeights, ...weights };
    
    const rankedPaths = paths.map(path => {
      const rankingScore = this.calculateRankingScore(path, finalWeights);
      const rankingReasons = this.generateRankingReasons(path, finalWeights);
      const features = this.analyzePathFeatures(path);
      
      return {
        ...path,
        rankingScore,
        rankingReasons,
        features,
        coreTags: {} // 临时占位，实际由PathClusterer计算
      };
    });
    
    // 新的排序逻辑：feasible路径优先，然后随机排序feasible路径
    return this.sortPathsByFeasibility(rankedPaths);
  }

  /**
   * 基于当前教育状态对路径进行排序
   * @param {Array} paths 路径列表
   * @param {string} currentLevel 当前教育水平
   * @returns {Array} 排序后的路径列表
   */
  rankPathsByCurrentState(paths, currentLevel) {
    const rankedPaths = paths.map(path => {
      const rankingScore = this.calculateRankingScore(path, this.defaultWeights);
      const rankingReasons = this.generateRankingReasons(path, this.defaultWeights);
      const features = this.analyzePathFeatures(path);
      
      return {
        ...path,
        rankingScore,
        rankingReasons,
        features,
        coreTags: {} // 临时占位，实际由PathClusterer计算
      };
    });
    
    // 基于当前状态的多级排序：匹配度 > 常见度 > 费用
    return rankedPaths.sort((a, b) => {
      // 1. 首先按匹配度排序（降序）
      const matchScoreA = this.matchScoreCalculator.calculatePathMatchScore(a, currentLevel);
      const matchScoreB = this.matchScoreCalculator.calculatePathMatchScore(b, currentLevel);
      
      if (matchScoreA !== matchScoreB) {
        return matchScoreB - matchScoreA; // 降序
      }
      
      // 2. 匹配度相同时，按常见度排序（降序）
      const prevalenceA = this.calculatePrevalenceScore(a);
      const prevalenceB = this.calculatePrevalenceScore(b);
      
      if (prevalenceA !== prevalenceB) {
        return prevalenceB - prevalenceA; // 降序
      }
      
      // 3. 常见度也相同时，按总费用排序（升序，费用低的在前）
      const costA = a.costBreakdown?.total || 0;
      const costB = b.costBreakdown?.total || 0;
      
      return costA - costB; // 升序
    });
  }

  /**
   * 按可行性排序路径
   */
  sortPathsByFeasibility(paths) {
    // 分离feasible和infeasible路径
    const feasiblePaths = paths.filter(path => path.feasibility === 'feasible');
    const infeasiblePaths = paths.filter(path => path.feasibility !== 'feasible');
    
    // 对feasible路径进行随机排序
    const shuffledFeasiblePaths = this.shuffleArray([...feasiblePaths]);
    
    // 对infeasible路径按原有逻辑排序
    const sortedInfeasiblePaths = infeasiblePaths.sort((a, b) => b.rankingScore - a.rankingScore);
    
    // 返回：feasible路径在前，infeasible路径在后
    return [...shuffledFeasiblePaths, ...sortedInfeasiblePaths];
  }

  /**
   * 随机打乱数组
   */
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * 计算路径的排序分数
   */
  calculateRankingScore(path, weights) {
    let score = 0;
    
    // 1. 可行性分数 (0-1)
    const feasibilityScore = this.calculateFeasibilityScore(path);
    score += feasibilityScore * weights.feasibility;
    
    // 2. 常见度分数 (0-1)
    const prevalenceScore = this.calculatePrevalenceScore(path);
    score += prevalenceScore * weights.prevalence;
    
    // 3. 费用分数 (0-1，费用越低分数越高)
    const costScore = this.calculateCostScore(path);
    score += costScore * weights.cost;
    
    // 4. 转轨次数分数 (0-1，转轨次数越少分数越高)
    const transitionScore = this.calculateTransitionScore(path);
    score += transitionScore * weights.transition;
    
    return Math.max(0, Math.min(1, score)); // 确保分数在0-1之间
  }

  /**
   * 计算可行性分数
   */
  calculateFeasibilityScore(path) {
    if (path.feasibility === 'infeasible') {
      return 0;
    }
    
    if (path.feasibility === 'feasible') {
      return 1;
    }
    
    // conditional 的情况，根据条件难度打分
    if (path.feasibility === 'conditional') {
      const conditions = path.totalConditions || [];
      let difficultyScore = 1;
      
      conditions.forEach(condition => {
        if (condition.includes('外籍') || condition.includes('护照')) {
          difficultyScore *= 0.3; // 外籍身份要求很严格
        } else if (condition.includes('高考') || condition.includes('中考')) {
          difficultyScore *= 0.8; // 考试要求相对容易
        } else if (condition.includes('面试') || condition.includes('推荐')) {
          difficultyScore *= 0.6; // 面试推荐中等难度
        }
      });
      
      return difficultyScore;
    }
    
    return 0.5; // 默认分数
  }

  /**
   * 计算常见度分数
   */
  calculatePrevalenceScore(path) {
    let totalPrevalence = 1;
    
    // 计算路径中每个转换的常见度
    for (let i = 0; i < path.nodes.length - 1; i++) {
      const from = path.nodes[i];
      const to = path.nodes[i + 1];
      
      const rule = window.EDUCATION_TRANSITION_RULES.find(r => 
        r.from.stage === from.stage && 
        r.from.level === from.level &&
        r.to.stage === to.stage && 
        r.to.level === to.level
      );
      
      if (rule && rule.prevalence !== undefined) {
        totalPrevalence *= rule.prevalence;
      } else {
        totalPrevalence *= 0.5; // 默认常见度
      }
    }
    
    return totalPrevalence;
  }

  /**
   * 计算费用分数
   */
  calculateCostScore(path) {
    if (!path.costBreakdown) {
      return 0.5; // 没有费用信息时给中等分数
    }
    
    const totalCost = path.costBreakdown.total;
    
    // 费用分数：费用越低分数越高
    if (totalCost < 500000) { // 50万以下
      return 1.0;
    } else if (totalCost < 1000000) { // 50-100万
      return 0.8;
    } else if (totalCost < 2000000) { // 100-200万
      return 0.6;
    } else if (totalCost < 3000000) { // 200-300万
      return 0.4;
    } else { // 300万以上
      return 0.2;
    }
  }

  /**
   * 计算转轨次数分数
   */
  calculateTransitionScore(path) {
    let transitionCount = 0;
    
    // 计算转轨次数
    for (let i = 0; i < path.nodes.length - 1; i++) {
      const from = path.nodes[i];
      const to = path.nodes[i + 1];
      
      // 判断是否为转轨
      if (this.isTransition(from.level, to.level)) {
        transitionCount++;
      }
    }
    
    // 转轨次数越少分数越高
    if (transitionCount === 0) {
      return 1.0;
    } else if (transitionCount === 1) {
      return 0.8;
    } else if (transitionCount === 2) {
      return 0.6;
    } else {
      return 0.4;
    }
  }

  /**
   * 判断是否为转轨
   */
  isTransition(fromLevel, toLevel) {
    const domesticLevels = ['公立', '普通私立', '民办普通高中', '国内公办', '国内民办'];
    const internationalLevels = ['民办双语', '外籍人员子女学校', '民办国际化学校', '海外高中', '海外大学', '海外硕士', '海外博士'];
    
    const fromIsDomestic = domesticLevels.includes(fromLevel);
    const toIsInternational = internationalLevels.includes(toLevel);
    const fromIsInternational = internationalLevels.includes(fromLevel);
    const toIsDomestic = domesticLevels.includes(toLevel);
    
    return (fromIsDomestic && toIsInternational) || (fromIsInternational && toIsDomestic);
  }

  /**
   * 分析路径特征
   */
  analyzePathFeatures(path) {
    const features = [];
    
    // 分析每个节点
    for (const node of path.nodes) {
      // 分析大学阶段
      if (node.stage === '大学') {
        if (node.level === '国内公办' || node.level === '国内民办') {
          features.push('domestic_ug');
        } else if (node.level === '海外大学') {
          features.push('overseas_ug');
        }
      }
      
      // 分析研究生阶段
      if (node.stage === '研究生') {
        if (node.level === '国内硕士') {
          features.push('domestic_pg');
        } else if (node.level === '海外硕士') {
          features.push('overseas_pg');
        }
      }
      
      // 分析转轨特征
      if (node.level === '外籍人员子女学校' || 
          node.level === '民办双语' || 
          node.level === '民办国际化学校' ||
          node.level === '海外高中') {
        if (node.stage === '小学' || node.stage === '初中') {
          features.push('early_transition');
        } else if (node.stage === '高中') {
          features.push('late_transition');
        }
      }
    }
    
    // 分析费用特征
    if (path.costBreakdown) {
      const totalCost = path.costBreakdown.total;
      if (totalCost > 2000000) { // 200万以上
        features.push('cost_high');
      } else if (totalCost < 500000) { // 50万以下
        features.push('cost_low');
      }
    }
    
    // 分析整体特征
    const hasOverseas = features.includes('overseas_ug') || features.includes('overseas_pg');
    const hasDomestic = features.includes('domestic_ug') || features.includes('domestic_pg');
    
    if (hasOverseas && hasDomestic) {
      features.push('hybrid');
    } else if (hasOverseas) {
      features.push('international');
    } else if (hasDomestic) {
      features.push('traditional');
    }
    
    // 检查是否参加高考
    const hasGaokao = path.nodes.some(node => 
      node.stage === '高中' && 
      (node.level === '公立' || node.level === '民办普通高中')
    );
    if (hasGaokao) {
      features.push('gaokao');
    }
    
    return [...new Set(features)]; // 去重
  }

  /**
   * 生成排序原因
   */
  generateRankingReasons(path, weights) {
    const reasons = [];
    
    // 可行性原因
    if (path.feasibility === 'feasible') {
      reasons.push('路径完全可行，无特殊条件要求');
    } else if (path.feasibility === 'conditional') {
      reasons.push('路径有条件要求，需要满足特定条件');
    } else if (path.feasibility === 'infeasible') {
      reasons.push('路径不可行，不建议选择');
    }
    
    // 常见度原因
    const prevalenceScore = this.calculatePrevalenceScore(path);
    if (prevalenceScore > 0.7) {
      reasons.push('这是非常常见的教育路径，选择人数众多');
    } else if (prevalenceScore > 0.4) {
      reasons.push('这是相对常见的教育路径');
    } else if (prevalenceScore > 0.2) {
      reasons.push('这是较为少见的教育路径');
    } else {
      reasons.push('这是非常罕见的教育路径，选择人数很少');
    }
    
    // 费用原因
    if (path.costBreakdown) {
      const totalCost = path.costBreakdown.total;
      if (totalCost < 500000) {
        reasons.push('费用相对较低，经济压力小');
      } else if (totalCost > 2000000) {
        reasons.push('费用较高，需要充足的经济准备');
      } else {
        reasons.push('费用适中，性价比良好');
      }
    }
    
    // 转轨原因
    const transitionCount = this.countTransitions(path);
    if (transitionCount === 0) {
      reasons.push('无需转轨，教育体系连贯');
    } else if (transitionCount === 1) {
      reasons.push('需要一次转轨，适应成本适中');
    } else {
      reasons.push('需要多次转轨，适应成本较高');
    }
    
    return reasons;
  }

  /**
   * 计算转轨次数
   */
  countTransitions(path) {
    let count = 0;
    
    for (let i = 0; i < path.nodes.length - 1; i++) {
      const from = path.nodes[i];
      const to = path.nodes[i + 1];
      
      if (this.isTransition(from.level, to.level)) {
        count++;
      }
    }
    
    return count;
  }
}

// 导出服务
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PathRankerService;
} else {
  window.PathRankerService = PathRankerService;
}
