import { EducationPath, StrategicRoute, RankedPath } from '../types';

/**
 * 提示生成器
 * 为路径和战略路线生成友好的解释文案
 */
export class HintGeneratorService {
  
  /**
   * 为战略路线生成提示
   */
  generateStrategicRouteHint(route: StrategicRoute): string {
    const hints: string[] = [];
    
    // 基于常见度生成提示
    if (route.prevalence > 0.7) {
      hints.push(`🔥 这是最热门的教育战略，超过${Math.round(route.prevalence * 100)}%的家庭选择此路线`);
    } else if (route.prevalence > 0.4) {
      hints.push(`⭐ 这是相对常见的教育战略，约${Math.round(route.prevalence * 100)}%的家庭选择此路线`);
    } else if (route.prevalence > 0.2) {
      hints.push(`💡 这是较为小众的教育战略，约${Math.round(route.prevalence * 100)}%的家庭选择此路线`);
    } else {
      hints.push(`🎯 这是非常小众的教育战略，仅${Math.round(route.prevalence * 100)}%的家庭选择此路线`);
    }
    
    // 基于费用生成提示
    if (route.costRange.max > 0) {
      const avgCost = (route.costRange.min + route.costRange.max) / 2;
      if (avgCost < 500000) {
        hints.push(`💰 费用相对较低，总投入约${this.formatCost(avgCost)}，适合经济条件一般的家庭`);
      } else if (avgCost < 1500000) {
        hints.push(`💰 费用适中，总投入约${this.formatCost(avgCost)}，适合有一定经济基础的家庭`);
      } else if (avgCost < 3000000) {
        hints.push(`💰 费用较高，总投入约${this.formatCost(avgCost)}，适合经济条件较好的家庭`);
      } else {
        hints.push(`💰 费用很高，总投入约${this.formatCost(avgCost)}，适合经济条件优越的家庭`);
      }
    }
    
    // 基于特征生成提示
    if (route.features.includes('traditional')) {
      hints.push(`📚 传统教育路径，注重基础知识培养，适合希望孩子在国内发展的家庭`);
    }
    
    if (route.features.includes('international')) {
      hints.push(`🌍 国际化教育路径，注重创新能力和国际视野，适合希望孩子海外发展的家庭`);
    }
    
    if (route.features.includes('hybrid')) {
      hints.push(`🔄 混合教育路径，兼顾国内外教育优势，适合希望孩子有更多选择的家庭`);
    }
    
    if (route.features.includes('early_transition')) {
      hints.push(`⏰ 早期转轨路径，需要尽早规划，适合有明确海外教育目标的家庭`);
    }
    
    if (route.features.includes('late_transition')) {
      hints.push(`⏰ 中期转轨路径，转轨时机相对灵活，适合希望兼顾基础教育和国际化的家庭`);
    }
    
    return hints.join(' ');
  }

  /**
   * 为路径生成排名解释
   */
  generatePathRankingHint(path: RankedPath, rank: number, totalPaths: number): string {
    const hints: string[] = [];
    
    // 排名提示
    if (rank === 1) {
      hints.push(`🏆 这是该战略路线下的最佳推荐路径`);
    } else if (rank <= 3) {
      hints.push(`🥇 这是该战略路线下的优质推荐路径（排名第${rank}）`);
    } else if (rank <= totalPaths * 0.3) {
      hints.push(`👍 这是该战略路线下的良好选择（排名第${rank}）`);
    } else {
      hints.push(`📋 这是该战略路线下的备选方案（排名第${rank}）`);
    }
    
    // 基于排序原因生成提示
    if (path.rankingReasons.length > 0) {
      hints.push(`💡 ${path.rankingReasons[0]}`);
    }
    
    // 基于特征生成提示
    if (path.features.includes('cost_low')) {
      hints.push(`💰 费用优势：总费用较低，经济压力小`);
    } else if (path.features.includes('cost_high')) {
      hints.push(`💰 费用提醒：总费用较高，需要充足的经济准备`);
    }
    
    if (path.features.includes('traditional')) {
      hints.push(`📚 教育特色：传统教育体系，基础扎实`);
    }
    
    if (path.features.includes('international')) {
      hints.push(`🌍 教育特色：国际化教育，视野开阔`);
    }
    
    if (path.features.includes('hybrid')) {
      hints.push(`🔄 教育特色：混合教育模式，选择灵活`);
    }
    
    return hints.join(' ');
  }

  /**
   * 为不可行路径生成建设性建议
   */
  generateInfeasiblePathHint(path: EducationPath): string {
    const hints: string[] = [];
    
    hints.push(`❌ 当前条件下此路径不可行`);
    
    // 分析不可行的原因
    if (path.feasibility === 'infeasible') {
      if (path.totalConditions && path.totalConditions.length > 0) {
        hints.push(`🔍 主要原因：${path.totalConditions.join('；')}`);
      }
      
      // 提供建设性建议
      hints.push(`💡 建议：`);
      
      // 检查是否有外籍要求
      const hasForeignRequirement = path.totalConditions?.some(condition => 
        condition.includes('外籍') || condition.includes('护照')
      );
      
      if (hasForeignRequirement) {
        hints.push(`   • 如考虑海外教育，可提前规划身份问题`);
        hints.push(`   • 或选择其他无需外籍身份的国际化路径`);
      }
      
      // 检查是否有考试要求
      const hasExamRequirement = path.totalConditions?.some(condition => 
        condition.includes('高考') || condition.includes('中考')
      );
      
      if (hasExamRequirement) {
        hints.push(`   • 可考虑选择无需参加相关考试的路径`);
        hints.push(`   • 或提前准备相关考试要求`);
      }
      
      // 检查是否有其他条件
      const hasOtherRequirement = path.totalConditions?.some(condition => 
        !condition.includes('外籍') && !condition.includes('护照') && 
        !condition.includes('高考') && !condition.includes('中考')
      );
      
      if (hasOtherRequirement) {
        hints.push(`   • 可详细了解具体条件要求，看是否能够满足`);
        hints.push(`   • 或选择其他条件要求较低的路径`);
      }
    }
    
    return hints.join(' ');
  }

  /**
   * 为罕见路径生成提示
   */
  generateRarePathHint(path: RankedPath): string {
    const hints: string[] = [];
    
    hints.push(`🔍 这是较为罕见的教育路径`);
    
    // 分析罕见的原因
    if (path.features.includes('cost_high')) {
      hints.push(`💰 费用较高，限制了选择人数`);
    }
    
    if (path.features.includes('early_transition')) {
      hints.push(`⏰ 需要早期转轨，规划难度较大`);
    }
    
    if (path.features.includes('international')) {
      hints.push(`🌍 国际化程度高，适合特定需求家庭`);
    }
    
    // 提供价值说明
    hints.push(`💡 价值说明：`);
    
    if (path.features.includes('international')) {
      hints.push(`   • 国际化视野开阔，创新能力强`);
      hints.push(`   • 适合希望孩子海外发展的家庭`);
    }
    
    if (path.features.includes('hybrid')) {
      hints.push(`   • 兼顾国内外教育优势`);
      hints.push(`   • 选择灵活，适应性强`);
    }
    
    hints.push(`   • 虽然选择人数少，但可能更适合您的具体需求`);
    
    return hints.join(' ');
  }

  /**
   * 为路径生成个性化建议
   */
  generatePersonalizedHint(path: RankedPath, userInput: any): string {
    const hints: string[] = [];
    
    // 基于用户当前阶段生成建议
    if (userInput.currentStage === '小学' && path.features.includes('early_transition')) {
      hints.push(`🎯 您当前处于小学阶段，这是转轨的最佳时机`);
    }
    
    if (userInput.currentStage === '初中' && path.features.includes('late_transition')) {
      hints.push(`🎯 您当前处于初中阶段，可以考虑高中阶段转轨`);
    }
    
    if (userInput.currentStage === '高中' && path.features.includes('overseas_ug')) {
      hints.push(`🎯 您当前处于高中阶段，可以开始准备海外本科申请`);
    }
    
    // 基于目标阶段生成建议
    if (userInput.targetStage === '大学' && path.features.includes('domestic_ug')) {
      hints.push(`🎯 目标明确，此路径直接通向国内本科`);
    }
    
    if (userInput.targetStage === '研究生' && path.features.includes('overseas_pg')) {
      hints.push(`🎯 目标明确，此路径通向海外研究生`);
    }
    
    return hints.join(' ');
  }

  /**
   * 格式化费用显示
   */
  private formatCost(cost: number): string {
    if (cost >= 10000) {
      return `${(cost / 10000).toFixed(1)}万元`;
    } else {
      return `${cost.toLocaleString()}元`;
    }
  }
}
