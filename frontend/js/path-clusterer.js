/**
 * 前端路径聚类服务
 * 与后端PathClusterer保持一致的实现
 */
class PathClustererService {
  constructor() {
    this.matchScoreCalculator = new MatchScoreCalculatorService();
  }
  /**
   * 计算转轨时机标签
   */
  calculateTransTimingTag(path) {
    const internationalStages = [];
    
    // 检查每个节点的国际体系特征
    for (const node of path.nodes) {
      const isInternational = this.isInternationalLevel(node.stage, node.level);
      if (isInternational) {
        internationalStages.push(node.stage);
      }
    }
    
    // 检查是否全程无转轨
    const totalStages = path.nodes.length;
    const internationalCount = internationalStages.length;
    
    // 如果所有阶段都是国际体系，或者所有阶段都是国内体系，则为TRANS_NONE
    if (internationalCount === 0 || internationalCount === totalStages) {
      return 'TRANS_NONE';
    }
    
    // 检查是否有多个转轨时机（非连续的国际体系阶段）
    // 只有当国际体系阶段不连续时才判断为TRANS_MULTIPLE
    const allStages = ['小学', '初中', '高中', '大学', '研究生'];
    const internationalIndices = internationalStages.map(stage => allStages.indexOf(stage));
    const isConsecutive = internationalIndices.every((index, i) => 
      i === 0 || index === internationalIndices[i - 1] + 1
    );
    
    if (!isConsecutive) {
      return 'TRANS_MULTIPLE';
    }
    
    // 根据第一个国际体系出现的阶段确定转轨时机
    const firstInternationalStage = internationalStages[0];
    switch (firstInternationalStage) {
      case '小学':
      case '初中':
        return 'TRANS_EARLY';
      case '高中':
        return 'TRANS_MID';
      case '大学':
      case '研究生':
        return 'TRANS_LATE';
      default:
        return 'TRANS_NONE';
    }
  }

  /**
   * 判断是否为国际体系水平
   */
  isInternationalLevel(stage, level) {
    switch (stage) {
      case '小学':
      case '初中':
        return level === '民办双语' || level === '外籍人员子女学校';
      case '高中':
        return level === '公立国际部' || level === '民办国际化学校' || level === '外籍人员子女学校' || level === '海外高中';
      case '大学':
      case '研究生':
        return level === '海外大学' || level === '海外硕士';
      case '博士':
        return level === '海外博士';
      default:
        return false;
    }
  }

  /**
   * 计算目标学位标签
   */
  calculateTargetDegreeTag(userInput) {
    switch (userInput.targetStage) {
      case '大学':
        return 'TARGET_UG';
      case '研究生':
        return 'TARGET_MASTER';
      case '博士':
        return 'TARGET_PHD';
      default:
        return 'TARGET_UG';
    }
  }

  /**
   * 计算学位类型标签
   */
  calculateDegreeTypeTag(path, userInput) {
    // 找到目标阶段的节点
    const targetNode = path.nodes.find(node => node.stage === userInput.targetStage);
    
    if (!targetNode) {
      return 'DEGREE_DOMESTIC'; // 默认
    }
    
    // 判断目标学位的获取地点
    const isOverseas = targetNode.level === '海外大学' || 
                      targetNode.level === '海外硕士' || 
                      targetNode.level === '海外博士';
    
    return isOverseas ? 'DEGREE_OVERSEAS' : 'DEGREE_DOMESTIC';
  }

  /**
   * 计算可行性标签
   */
  calculateFeasibilityTag(path) {
    // 检查路径中所有节点的可行性
    const allFeasible = path.nodes.every(node => {
      // 这里需要根据实际的转换规则来判断
      // 暂时使用路径的总体可行性
      return path.feasibility === 'feasible';
    });
    
    if (allFeasible) {
      return 'FEASIBLE_HIGH';
    } else if (path.feasibility === 'conditional') {
      return 'FEASIBLE_MEDIUM';
    } else {
      return 'FEASIBLE_LOW';
    }
  }

  /**
   * 计算路径的核心标签
   */
  calculatePathCoreTags(path, userInput) {
    return {
      transTiming: this.calculateTransTimingTag(path),
      targetDegree: this.calculateTargetDegreeTag(userInput),
      degreeType: this.calculateDegreeTypeTag(path, userInput),
      feasibility: this.calculateFeasibilityTag(path)
    };
  }

  /**
   * 分析路径辅助特征
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
          node.level === '民办国际化学校') {
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
   * 将路径聚类为战略路线
   */
  clusterPaths(paths, userInput) {
    const routes = [];
    
    // 为每条路径计算核心标签
    const pathsWithTags = paths.map(path => ({
      path,
      coreTags: this.calculatePathCoreTags(path, userInput),
      features: this.analyzePathFeatures(path)
    }));
    
    // 1. 国内教育体系贯通路径
    const domesticPaths = pathsWithTags.filter(({ coreTags }) => 
      coreTags.transTiming === 'TRANS_NONE' && 
      coreTags.degreeType === 'DEGREE_DOMESTIC'
    );
    
    if (domesticPaths.length > 0) {
      const degreeName = this.getDegreeName(userInput.targetStage);
      routes.push({
        id: 'domestic_direct',
        name: `国内教育体系贯通路径`,
        description: `全程国内体系，获得国内${degreeName}。经济压力小，竞争激烈。`,
        coreTags: domesticPaths[0].coreTags,
        features: domesticPaths[0].features,
        costRange: this.calculateCostRange(domesticPaths.map(p => p.path)),
        advantages: [
          '经济压力最小',
          '教育体系连贯',
          '竞争环境熟悉',
          '社会认可度高'
        ],
        disadvantages: [
          '高考竞争激烈',
          '国际化程度有限',
          '创新能力培养相对不足'
        ],
        paths: domesticPaths.map(p => p.path),
        prevalence: this.calculateRoutePrevalence(domesticPaths.map(p => p.path)),
        pathCount: domesticPaths.length,
        feasibilityScore: this.calculateFeasibilityScore(domesticPaths.map(p => p.path))
      });
    }
    
    // 2. 早期国际转轨路径
    const earlyOverseasPaths = pathsWithTags.filter(({ coreTags }) => 
      coreTags.transTiming === 'TRANS_EARLY' && 
      coreTags.degreeType === 'DEGREE_OVERSEAS'
    );
    
    if (earlyOverseasPaths.length > 0) {
      const degreeName = this.getDegreeName(userInput.targetStage);
      routes.push({
        id: 'early_overseas_transition',
        name: `早期国际转轨路径`,
        description: `小学或初中阶段转入国际体系，获得海外${degreeName}。转轨时机早，适应性强。`,
        coreTags: earlyOverseasPaths[0].coreTags,
        features: earlyOverseasPaths[0].features,
        costRange: this.calculateCostRange(earlyOverseasPaths.map(p => p.path)),
        advantages: [
          '转轨时机早，适应性强',
          '国际化视野开阔',
          '语言能力培养充分',
          '海外名校机会多'
        ],
        disadvantages: [
          '费用投入较高',
          '文化适应挑战',
          '回国发展需重新适应'
        ],
        paths: earlyOverseasPaths.map(p => p.path),
        prevalence: this.calculateRoutePrevalence(earlyOverseasPaths.map(p => p.path)),
        pathCount: earlyOverseasPaths.length,
        feasibilityScore: this.calculateFeasibilityScore(earlyOverseasPaths.map(p => p.path))
      });
    }
    
    // 3. 海外教育体系直通路径（仅包含全程国际体系）
    const overseasPaths = pathsWithTags.filter(({ coreTags }) => 
      coreTags.transTiming === 'TRANS_NONE' && 
      coreTags.degreeType === 'DEGREE_OVERSEAS'
    );
    
    if (overseasPaths.length > 0) {
      const degreeName = this.getDegreeName(userInput.targetStage);
      routes.push({
        id: 'overseas_direct',
        name: `海外教育体系直通路径`,
        description: `全程国际体系，获得海外${degreeName}。准备充分，费用高。`,
        coreTags: overseasPaths[0].coreTags,
        features: overseasPaths[0].features,
        costRange: this.calculateCostRange(overseasPaths.map(p => p.path)),
        advantages: [
          '国际化视野开阔',
          '创新能力培养强',
          '海外名校机会多',
          '语言能力突出'
        ],
        disadvantages: [
          '经济压力最大',
          '文化适应挑战',
          '回国就业可能受限'
        ],
        paths: overseasPaths.map(p => p.path),
        prevalence: this.calculateRoutePrevalence(overseasPaths.map(p => p.path)),
        pathCount: overseasPaths.length,
        feasibilityScore: this.calculateFeasibilityScore(overseasPaths.map(p => p.path))
      });
    }
    
    // 4. 中期国际转轨路径
    const midTransitionPaths = pathsWithTags.filter(({ coreTags }) => 
      coreTags.transTiming === 'TRANS_MID' && 
      coreTags.degreeType === 'DEGREE_OVERSEAS'
    );
    
    if (midTransitionPaths.length > 0) {
      const degreeName = this.getDegreeName(userInput.targetStage);
      routes.push({
        id: 'mid_transition',
        name: `中期国际转轨路径`,
        description: `高中阶段转入国际体系，获得海外${degreeName}。平衡基础教育和留学准备，费用中高。`,
        coreTags: midTransitionPaths[0].coreTags,
        features: midTransitionPaths[0].features,
        costRange: this.calculateCostRange(midTransitionPaths.map(p => p.path)),
        advantages: [
          '基础教育扎实',
          '转轨时机合适',
          '选择灵活性高',
          '风险相对可控'
        ],
        disadvantages: [
          '转轨适应期',
          '费用中等偏高',
          '时间成本较高'
        ],
        paths: midTransitionPaths.map(p => p.path),
        prevalence: this.calculateRoutePrevalence(midTransitionPaths.map(p => p.path)),
        pathCount: midTransitionPaths.length,
        feasibilityScore: this.calculateFeasibilityScore(midTransitionPaths.map(p => p.path))
      });
    }
    
    // 5. 后期国际转轨路径
    const lateTransitionPaths = pathsWithTags.filter(({ coreTags }) => 
      coreTags.transTiming === 'TRANS_LATE' && 
      coreTags.degreeType === 'DEGREE_OVERSEAS'
    );
    
    if (lateTransitionPaths.length > 0) {
      const degreeName = this.getDegreeName(userInput.targetStage);
      routes.push({
        id: 'late_transition',
        name: `后期国际转轨路径`,
        description: `本科或研究生阶段转入海外体系，获得海外${degreeName}。性价比高，但需适应海外教育。`,
        coreTags: lateTransitionPaths[0].coreTags,
        features: lateTransitionPaths[0].features,
        costRange: this.calculateCostRange(lateTransitionPaths.map(p => p.path)),
        advantages: [
          '性价比高',
          '基础扎实',
          '海外经验丰富',
          '适应性强'
        ],
        disadvantages: [
          '转轨适应期',
          '语言要求高',
          '申请竞争激烈'
        ],
        paths: lateTransitionPaths.map(p => p.path),
        prevalence: this.calculateRoutePrevalence(lateTransitionPaths.map(p => p.path)),
        pathCount: lateTransitionPaths.length,
        feasibilityScore: this.calculateFeasibilityScore(lateTransitionPaths.map(p => p.path))
      });
    }
    
    // 6. 回国发展路径
    const returnPaths = pathsWithTags.filter(({ coreTags }) => 
      coreTags.transTiming === 'TRANS_LATE' && 
      coreTags.degreeType === 'DEGREE_DOMESTIC'
    );
    
    if (returnPaths.length > 0) {
      const degreeName = this.getDegreeName(userInput.targetStage);
      routes.push({
        id: 'return_development',
        name: `回国发展路径`,
        description: `海外经历后回国获得${degreeName}。常见于海外本科后回国读研或读博。`,
        coreTags: returnPaths[0].coreTags,
        features: returnPaths[0].features,
        costRange: this.calculateCostRange(returnPaths.map(p => p.path)),
        advantages: [
          '海外经验丰富',
          '国内认可度高',
          '性价比适中',
          '适应性强'
        ],
        disadvantages: [
          '转轨适应期',
          '申请竞争激烈',
          '时间成本较高'
        ],
        paths: returnPaths.map(p => p.path),
        prevalence: this.calculateRoutePrevalence(returnPaths.map(p => p.path)),
        pathCount: returnPaths.length,
        feasibilityScore: this.calculateFeasibilityScore(returnPaths.map(p => p.path))
      });
    }
    
    // 7. 不可行路线（单独分类）
    const infeasiblePaths = pathsWithTags.filter(({ coreTags }) => 
      coreTags.feasibility === 'FEASIBLE_LOW'
    );
    
    if (infeasiblePaths.length > 0) {
      routes.push({
        id: 'infeasible_paths',
        name: '不可行路线',
        description: '当前条件下不可行的教育路径，需要调整条件或等待时机。',
        coreTags: infeasiblePaths[0].coreTags,
        features: infeasiblePaths[0].features,
        costRange: this.calculateCostRange(infeasiblePaths.map(p => p.path)),
        advantages: [
          '提供参考价值',
          '帮助理解限制条件'
        ],
        disadvantages: [
          '当前不可行',
          '需要条件变化',
          '风险较高'
        ],
        paths: infeasiblePaths.map(p => p.path),
        prevalence: this.calculateRoutePrevalence(infeasiblePaths.map(p => p.path)),
        pathCount: infeasiblePaths.length,
        feasibilityScore: this.calculateFeasibilityScore(infeasiblePaths.map(p => p.path))
      });
    }
    
    // 8. 其他个性化路线（兜底）
    const clusteredPaths = routes.flatMap(route => route.paths);
    const otherPaths = pathsWithTags.filter(({ path }) => 
      !clusteredPaths.includes(path)
    );
    
    if (otherPaths.length > 0) {
      routes.push({
        id: 'other_paths',
        name: '其他个性化路线',
        description: '非常见路径组合，需要个性化规划。',
        coreTags: otherPaths[0].coreTags,
        features: otherPaths[0].features,
        costRange: this.calculateCostRange(otherPaths.map(p => p.path)),
        advantages: [
          '路径独特',
          '个性化强'
        ],
        disadvantages: [
          '风险较高',
          '参考案例少'
        ],
        paths: otherPaths.map(p => p.path),
        prevalence: this.calculateRoutePrevalence(otherPaths.map(p => p.path)),
        pathCount: otherPaths.length,
        feasibilityScore: this.calculateFeasibilityScore(otherPaths.map(p => p.path))
      });
    }
    
    // 分离特殊路线和普通路线
    const specialRoutes = routes.filter(route => 
      route.id === 'other_paths' || route.id === 'infeasible_paths'
    );
    const normalRoutes = routes.filter(route => 
      route.id !== 'other_paths' && route.id !== 'infeasible_paths'
    );

    // 为普通路线计算平均匹配得分
    const normalRoutesWithMatchScore = normalRoutes.map(route => ({
      ...route,
      averageMatchScore: this.matchScoreCalculator.calculateRouteAverageMatchScore(
        route.paths, 
        userInput.currentLevel
      )
    }));

    // 按匹配度、可行性评分和路径数量排序普通路线
    const sortedNormalRoutes = normalRoutesWithMatchScore.sort((a, b) => {
      // 优先按平均匹配得分排序（匹配度高的在前）
      if (a.averageMatchScore !== b.averageMatchScore) {
        return b.averageMatchScore - a.averageMatchScore;
      }
      // 其次按可行性评分排序
      if (a.feasibilityScore !== b.feasibilityScore) {
        return b.feasibilityScore - a.feasibilityScore;
      }
      // 最后按路径数量排序
      return b.pathCount - a.pathCount;
    });

    // 特殊路线不参与匹配度排序，按固定顺序排列
    const otherPathsRoute = specialRoutes.find(route => route.id === 'other_paths');
    const infeasiblePathsRoute = specialRoutes.find(route => route.id === 'infeasible_paths');

    // 最终排序：普通路线 + 其他个性化路线 + 不可行路线
    const finalRoutes = [...sortedNormalRoutes];
    
    if (otherPathsRoute) {
      finalRoutes.push(otherPathsRoute);
    }
    
    if (infeasiblePathsRoute) {
      finalRoutes.push(infeasiblePathsRoute);
    }

    // 调试信息
    console.log('前端排序结果:', finalRoutes.map(r => ({ id: r.id, name: r.name })));

    return finalRoutes;
  }

  /**
   * 根据目标阶段获取学位名称
   */
  getDegreeName(targetStage) {
    switch (targetStage) {
      case '大学':
        return '本科';
      case '研究生':
        return '硕士';
      case '博士':
        return '博士';
      default:
        return '学位';
    }
  }

  /**
   * 计算可行性评分
   */
  calculateFeasibilityScore(paths) {
    if (paths.length === 0) return 0;
    
    const feasibleCount = paths.filter(path => path.feasibility === 'feasible').length;
    return feasibleCount / paths.length;
  }

  /**
   * 计算费用区间
   */
  calculateCostRange(paths) {
    const costs = paths
      .map(path => path.costBreakdown?.total || 0)
      .filter(cost => cost > 0);
    
    if (costs.length === 0) {
      return { min: 0, max: 0 };
    }
    
    return {
      min: Math.min(...costs),
      max: Math.max(...costs)
    };
  }

  /**
   * 计算战略路线的常见度
   */
  calculateRoutePrevalence(paths) {
    if (paths.length === 0) return 0;
    
    const totalPrevalence = paths.reduce((sum, path) => {
      return sum + this.calculatePathPrevalence(path);
    }, 0);
    
    return totalPrevalence / paths.length;
  }

  /**
   * 计算路径的常见度
   */
  calculatePathPrevalence(path) {
    // 基于特征组合计算常见度
    const features = this.analyzePathFeatures(path);
    let prevalence = 1.0;
    
    // 传统路径常见度较高
    if (features.includes('traditional') && features.includes('gaokao')) {
      prevalence *= 0.9;
    }
    
    // 国际化路径常见度较低
    if (features.includes('international')) {
      prevalence *= 0.3;
    }
    
    // 混合路径常见度中等
    if (features.includes('hybrid')) {
      prevalence *= 0.6;
    }
    
    // 早期转轨常见度较低
    if (features.includes('early_transition')) {
      prevalence *= 0.4;
    }
    
    // 晚期转轨常见度中等
    if (features.includes('late_transition')) {
      prevalence *= 0.7;
    }
    
    // 高费用路径常见度较低
    if (features.includes('cost_high')) {
      prevalence *= 0.3;
    }
    
    return Math.max(0.1, prevalence); // 最低0.1
  }
}

// 导出服务类
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PathClustererService;
}