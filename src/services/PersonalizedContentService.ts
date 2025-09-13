import { EducationLevel, EducationStage } from '../types';

/**
 * 个性化内容生成服务
 * 负责根据用户条件生成个性化的战略路线描述和内容
 */
export class PersonalizedContentService {
    
    /**
     * 生成个性化描述
     * @param template 描述模板
     * @param userInfo 用户信息
     * @returns 个性化描述
     */
    generatePersonalizedDescription(
        template: string, 
        userInfo: {
            currentStage: EducationStage;
            currentGrade: string;
            currentLevel: EducationLevel;
            targetStage: EducationStage;
        }
    ): string {
        let description = template;
        
        // 替换用户当前状态
        description = description.replace(/【当前阶段】/g, userInfo.currentStage);
        description = description.replace(/【当前年级】/g, userInfo.currentGrade);
        description = description.replace(/【当前水平】/g, userInfo.currentLevel);
        description = description.replace(/【目标阶段】/g, userInfo.targetStage);
        
        // 替换关键节点
        description = this.replaceKeyNodes(description, userInfo);
        
        return description;
    }
    
    /**
     * 替换关键节点
     * @param description 描述文本
     * @param userInfo 用户信息
     * @returns 替换后的描述
     */
    private replaceKeyNodes(description: string, userInfo: any): string {
        // 根据用户当前状态和目标阶段，确定关键节点
        const keyNodes = this.getKeyNodes(userInfo);
        
        // 替换关键节点占位符
        Object.entries(keyNodes).forEach(([placeholder, value]) => {
            description = description.replace(new RegExp(`【${placeholder}】`, 'g'), value);
        });
        
        return description;
    }
    
    /**
     * 获取关键节点
     * @param userInfo 用户信息
     * @returns 关键节点映射
     */
    private getKeyNodes(userInfo: any): Record<string, string> {
        const nodes: Record<string, string> = {};
        
        // 根据当前阶段确定关键节点
        if (userInfo.currentStage === '小学' || userInfo.currentStage === '初中') {
            nodes['中考'] = '中考';
        }
        
        if (userInfo.currentStage === '小学' || userInfo.currentStage === '初中' || userInfo.currentStage === '高中') {
            nodes['高考'] = '高考';
        }
        
        // 根据目标阶段确定关键节点
        if (userInfo.targetStage === '研究生' || userInfo.targetStage === '博士') {
            nodes['考研'] = '考研';
        }
        
        if (userInfo.targetStage === '博士') {
            nodes['考博'] = '考博';
        }
        
        return nodes;
    }
    
    /**
     * 生成数据来源说明
     * @param routeId 战略路线ID
     * @returns 数据来源说明
     */
    generateDataSourceDescription(routeId: string): string {
        const dataSourceMap: Record<string, string> = {
            'domestic_direct': '基于2025年公办院校收费标准估算',
            'international_direct': '基于2025年国际学校及海外院校收费标准估算',
            'hybrid_path': '基于2025年中外合作办学及国际课程收费标准估算',
            'early_transition': '基于2025年国际学校及海外院校收费标准估算',
            'late_transition': '基于2025年国际学校及海外院校收费标准估算',
            'other_paths': '基于2025年各类教育机构收费标准综合估算',
            'infeasible_paths': '基于2025年各类教育机构收费标准综合估算'
        };
        
        return dataSourceMap[routeId] || '基于2025年教育机构收费标准综合估算';
    }
    
    /**
     * 生成个性化费用范围描述
     * @param minCost 最低费用
     * @param maxCost 最高费用
     * @param routeId 战略路线ID
     * @returns 费用范围描述
     */
    generateCostRangeDescription(minCost: number, maxCost: number, routeId: string): string {
        const dataSource = this.generateDataSourceDescription(routeId);
        return `￥${(minCost / 10000).toFixed(0)}万 - ￥${(maxCost / 10000).toFixed(0)}万 (${dataSource})`;
    }
}
