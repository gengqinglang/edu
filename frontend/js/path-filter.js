/**
 * 路径筛选服务
 * 处理多维度路径筛选逻辑
 */
class PathFilterService {
    constructor() {
        this.filterState = {
            educationStages: {}, // { stage: [levels] }
            costRange: { min: 0, max: 0 },
            features: [], // ['免高考', '费用最低', '无转轨', '最常见']
            sortBy: 'prevalence' // 'prevalence', 'cost', 'transitions'
        };
        
        this.debounceTimer = null;
        this.debounceDelay = 300; // 防抖延迟
    }

    /**
     * 获取可筛选的教育阶段范围
     * @param {string} currentStage - 用户当前教育阶段
     * @param {string} targetStage - 用户目标教育阶段
     * @returns {Array} 可筛选的阶段列表
     */
    getFilterableStages(currentStage, targetStage) {
        const stageOrder = ['幼儿园', '小学', '初中', '高中', '大学', '研究生', '博士'];
        const currentIndex = stageOrder.indexOf(currentStage);
        const targetIndex = stageOrder.indexOf(targetStage);
        
        if (currentIndex === -1 || targetIndex === -1) {
            console.warn('无效的教育阶段:', { currentStage, targetStage });
            return [];
        }
        
        // 返回从当前阶段的下一个阶段到目标阶段的阶段列表
        return stageOrder.slice(currentIndex + 1, targetIndex + 1);
    }

    /**
     * 获取教育阶段的所有可选水平
     * @param {string} stage - 教育阶段
     * @returns {Array} 该阶段的所有水平选项
     */
    getStageLevels(stage) {
        const stageLevels = {
            '小学': ['公立', '普通私立', '民办双语'],
            '初中': ['公立', '普通私立', '民办双语'],
            '高中': ['公立', '民办普通高中', '公立国际部', '民办国际化学校'],
            '大学': ['国内公办', '国内民办', '中外合作办学', '海外大学'],
            '研究生': ['国内硕士', '海外硕士'],
            '博士': ['国内博士', '海外博士']
        };
        
        return stageLevels[stage] || [];
    }

    /**
     * 计算路径的总费用
     * @param {Object} path - 路径对象
     * @returns {number} 总费用
     */
    getPathTotalCost(path) {
        if (!path || !path.costBreakdown) {
            return 0;
        }
        return path.costBreakdown.total || 0;
    }

    /**
     * 计算路径的转轨次数
     * @param {Object} path - 路径对象
     * @returns {number} 转轨次数
     */
    getPathTransitionCount(path) {
        if (!path || !path.nodes || !Array.isArray(path.nodes)) {
            return 0;
        }
        
        let transitionCount = 0;
        for (let i = 1; i < path.nodes.length; i++) {
            const prevNode = path.nodes[i - 1];
            const currentNode = path.nodes[i];
            
            // 检查是否发生了转轨（从国内体系转到国际体系或反之）
            if (this.isTransition(prevNode, currentNode)) {
                transitionCount++;
            }
        }
        
        return transitionCount;
    }

    /**
     * 判断两个节点之间是否发生转轨
     * @param {Object} prevNode - 前一个节点
     * @param {Object} currentNode - 当前节点
     * @returns {boolean} 是否发生转轨
     */
    isTransition(prevNode, currentNode) {
        if (!prevNode || !currentNode) {
            return false;
        }
        
        const prevIsInternational = this.isInternationalLevel(prevNode.stage, prevNode.level);
        const currentIsInternational = this.isInternationalLevel(currentNode.stage, currentNode.level);
        
        return prevIsInternational !== currentIsInternational;
    }

    /**
     * 判断教育水平是否为国际体系
     * @param {string} stage - 教育阶段
     * @param {string} level - 教育水平
     * @returns {boolean} 是否为国际体系
     */
    isInternationalLevel(stage, level) {
        const internationalLevels = {
            '小学': ['民办双语'],
            '初中': ['民办双语'],
            '高中': ['公立国际部', '民办国际化学校', '海外高中'],
            '大学': ['海外大学', '海外硕士'],
            '博士': ['海外博士']
        };
        
        return internationalLevels[stage] && internationalLevels[stage].includes(level);
    }

    /**
     * 检查路径是否包含免高考特征
     * @param {Object} path - 路径对象
     * @returns {boolean} 是否免高考
     */
    hasNoGaokaoFeature(path) {
        if (!path || !path.nodes || !Array.isArray(path.nodes)) {
            return false;
        }
        
        return path.nodes.some(node => 
            node.stage === '高中' && 
            (node.level === '公立国际部' || node.level === '民办国际化学校')
        );
    }

    /**
     * 应用教育阶段筛选
     * @param {Array} paths - 路径列表
     * @param {Object} stageFilters - 阶段筛选条件
     * @returns {Array} 筛选后的路径列表
     */
    filterByEducationStages(paths, stageFilters) {
        if (!paths || !Array.isArray(paths) || !stageFilters) {
            return paths || [];
        }
        
        return paths.filter(path => {
            if (!path || !path.nodes || !Array.isArray(path.nodes)) {
                return false;
            }
            
            // 检查每个筛选阶段是否匹配
            for (const [stage, selectedLevels] of Object.entries(stageFilters)) {
                if (!selectedLevels || selectedLevels.length === 0) {
                    continue; // 如果没有选择该阶段的任何水平，跳过
                }
                
                // 找到路径中对应阶段的节点
                const stageNode = path.nodes.find(node => node.stage === stage);
                if (!stageNode) {
                    return false; // 路径中没有该阶段，不匹配
                }
                
                // 检查该阶段的水平是否在筛选条件中
                if (!selectedLevels.includes(stageNode.level)) {
                    return false; // 水平不匹配
                }
            }
            
            return true;
        });
    }

    /**
     * 应用费用区间筛选
     * @param {Array} paths - 路径列表
     * @param {Object} costRange - 费用区间 {min, max}
     * @returns {Array} 筛选后的路径列表
     */
    filterByCostRange(paths, costRange) {
        if (!paths || !Array.isArray(paths) || !costRange) {
            return paths || [];
        }
        
        const { min, max } = costRange;
        if (min === undefined || max === undefined) {
            return paths;
        }
        
        return paths.filter(path => {
            const totalCost = this.getPathTotalCost(path);
            return totalCost >= min && totalCost <= max;
        });
    }

    /**
     * 应用特征标签筛选
     * @param {Array} paths - 路径列表
     * @param {Array} features - 特征标签列表
     * @returns {Array} 筛选后的路径列表
     */
    filterByFeatures(paths, features) {
        if (!paths || !Array.isArray(paths) || !features || features.length === 0) {
            return paths || [];
        }
        
        let filteredPaths = [...paths];
        
        features.forEach(feature => {
            switch (feature) {
                case '免高考':
                    filteredPaths = filteredPaths.filter(path => this.hasNoGaokaoFeature(path));
                    break;
                case '费用最低':
                    if (filteredPaths.length > 0) {
                        const minCost = Math.min(...filteredPaths.map(path => this.getPathTotalCost(path)));
                        filteredPaths = filteredPaths.filter(path => this.getPathTotalCost(path) === minCost);
                    }
                    break;
                case '无转轨':
                    filteredPaths = filteredPaths.filter(path => this.getPathTransitionCount(path) === 0);
                    break;
                case '最常见':
                    if (filteredPaths.length > 0) {
                        const maxPrevalence = Math.max(...filteredPaths.map(path => path.prevalence || 0));
                        filteredPaths = filteredPaths.filter(path => (path.prevalence || 0) === maxPrevalence);
                    }
                    break;
            }
        });
        
        return filteredPaths;
    }

    /**
     * 对路径进行排序
     * @param {Array} paths - 路径列表
     * @param {string} sortBy - 排序方式
     * @returns {Array} 排序后的路径列表
     */
    sortPaths(paths, sortBy) {
        if (!paths || !Array.isArray(paths)) {
            return [];
        }
        
        const sortedPaths = [...paths];
        
        switch (sortBy) {
            case 'prevalence':
                sortedPaths.sort((a, b) => (b.prevalence || 0) - (a.prevalence || 0));
                break;
            case 'cost':
                sortedPaths.sort((a, b) => this.getPathTotalCost(a) - this.getPathTotalCost(b));
                break;
            case 'transitions':
                sortedPaths.sort((a, b) => this.getPathTransitionCount(a) - this.getPathTransitionCount(b));
                break;
            default:
                // 默认按常见度排序
                sortedPaths.sort((a, b) => (b.prevalence || 0) - (a.prevalence || 0));
        }
        
        return sortedPaths;
    }

    /**
     * 应用所有筛选条件
     * @param {Array} paths - 原始路径列表
     * @param {Object} filterState - 筛选状态
     * @returns {Array} 筛选和排序后的路径列表
     */
    applyFilters(paths, filterState) {
        if (!paths || !Array.isArray(paths)) {
            return [];
        }
        
        let filteredPaths = [...paths];
        
        // 应用教育阶段筛选
        if (filterState.educationStages) {
            filteredPaths = this.filterByEducationStages(filteredPaths, filterState.educationStages);
        }
        
        // 应用费用区间筛选
        if (filterState.costRange) {
            filteredPaths = this.filterByCostRange(filteredPaths, filterState.costRange);
        }
        
        // 应用特征标签筛选
        if (filterState.features && filterState.features.length > 0) {
            filteredPaths = this.filterByFeatures(filteredPaths, filterState.features);
        }
        
        // 应用排序
        if (filterState.sortBy) {
            filteredPaths = this.sortPaths(filteredPaths, filterState.sortBy);
        }
        
        return filteredPaths;
    }

    /**
     * 计算费用范围
     * @param {Array} paths - 路径列表
     * @returns {Object} 费用范围 {min, max}
     */
    calculateCostRange(paths) {
        if (!paths || !Array.isArray(paths) || paths.length === 0) {
            return { min: 0, max: 0 };
        }
        
        const costs = paths.map(path => this.getPathTotalCost(path));
        return {
            min: Math.min(...costs),
            max: Math.max(...costs)
        };
    }

    /**
     * 获取最常见路径（用于差异点高亮）
     * @param {Array} paths - 路径列表
     * @returns {Object|null} 最常见路径
     */
    getMostCommonPath(paths) {
        if (!paths || !Array.isArray(paths) || paths.length === 0) {
            return null;
        }
        
        return paths.reduce((mostCommon, current) => {
            const currentPrevalence = current.prevalence || 0;
            const mostCommonPrevalence = mostCommon.prevalence || 0;
            return currentPrevalence > mostCommonPrevalence ? current : mostCommon;
        });
    }

    /**
     * 防抖处理筛选
     * @param {Function} callback - 回调函数
     * @param {Array} args - 参数
     */
    debouncedFilter(callback, ...args) {
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }
        
        this.debounceTimer = setTimeout(() => {
            callback.apply(this, args);
        }, this.debounceDelay);
    }

    /**
     * 重置筛选状态
     */
    resetFilters() {
        this.filterState = {
            educationStages: {},
            costRange: { min: 0, max: 0 },
            features: [],
            sortBy: 'prevalence'
        };
    }
}
