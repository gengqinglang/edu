/**
 * 个性化内容生成服务 (前端版本)
 * 负责根据用户条件生成个性化的战略路线描述和内容
 */
class PersonalizedContentService {
    
    /**
     * 生成个性化描述
     * @param {string} template 描述模板
     * @param {Object} userInfo 用户信息
     * @returns {string} 个性化描述
     */
    generatePersonalizedDescription(template, userInfo) {
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
     * @param {string} description 描述文本
     * @param {Object} userInfo 用户信息
     * @returns {string} 替换后的描述
     */
    replaceKeyNodes(description, userInfo) {
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
     * @param {Object} userInfo 用户信息
     * @returns {Object} 关键节点映射
     */
    getKeyNodes(userInfo) {
        const nodes = {};
        
        // 根据当前阶段确定关键节点
        if (userInfo.currentStage === '小学' || userInfo.currentStage === '初中') {
            nodes['中考'] = '中考';
        }
        
        if (userInfo.currentStage === '小学' || userInfo.currentStage === '初中' || userInfo.currentStage === '高中') {
            nodes['高考'] = '高考';
        }
        
        // 根据目标阶段确定关键节点（使用targetStageRaw）
        const targetStage = userInfo.targetStageRaw || userInfo.targetStage;
        if (targetStage === '研究生' || targetStage === '博士') {
            nodes['考研'] = '考研';
        }
        
        if (targetStage === '博士') {
            nodes['考博'] = '考博';
        }
        
        return nodes;
    }
    
    /**
     * 生成数据来源说明
     * @param {string} routeId 战略路线ID
     * @returns {string} 数据来源说明
     */
    generateDataSourceDescription(routeId) {
        const dataSourceMap = {
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
     * @param {number} minCost 最低费用
     * @param {number} maxCost 最高费用
     * @param {string} routeId 战略路线ID
     * @returns {string} 费用范围描述
     */
    generateCostRangeDescription(minCost, maxCost, routeId) {
        const dataSource = this.generateDataSourceDescription(routeId);
        return `￥${(minCost / 10000).toFixed(0)}万 - ￥${(maxCost / 10000).toFixed(0)}万 (${dataSource})`;
    }

    /**
     * 生成费用范围数值（不含说明）
     * @param {number} minCost 最低费用
     * @param {number} maxCost 最高费用
     * @returns {string} 费用范围数值
     */
    generateCostRangeValue(minCost, maxCost) {
        return `￥${(minCost / 10000).toFixed(0)}万 - ￥${(maxCost / 10000).toFixed(0)}万`;
    }
}
