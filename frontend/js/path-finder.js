// 教育路径查找引擎 - JavaScript版本
class EducationPathFinder {
    constructor(rules = EDUCATION_TRANSITION_RULES) {
        this.rules = rules;
        this.visited = new Set();
        this.allPaths = [];
        this.costCalculator = new CostCalculatorService();
        this.pathClusterer = new PathClustererService();
        this.pathRanker = new PathRankerService();
    }

    /**
     * 查找所有从当前状态到目标阶段的教育路径
     * @param {Object} input 用户输入
     * @returns {Object} 所有可能的路径
     */
    findAllPaths(input) {
        // 重置状态
        this.visited.clear();
        this.allPaths = [];

        // 验证输入
        this.validateInput(input);

        // 构建起始节点
        const startNode = {
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
        const infeasiblePaths = pathsWithCost.filter(p => p.feasibility === 'infeasible').length;

        return {
            paths: pathsWithCost,
            totalPaths: pathsWithCost.length,
            feasiblePaths,
            infeasiblePaths
        };
    }

    /**
     * 深度优先搜索查找路径
     * @param {Object} currentNode 当前节点
     * @param {string} targetStage 目标阶段
     * @param {Array} currentPath 当前路径
     * @param {Array} currentSteps 当前步骤信息
     * @param {string} currentFeasibility 当前可行性
     */
    dfsFindPaths(currentNode, targetStage, currentPath, currentSteps, currentFeasibility) {
        // 如果到达目标阶段，记录路径
        if (currentNode.stage === targetStage) {
            const path = {
                nodes: [...currentPath],
                steps: [...currentSteps],
                totalConditions: currentSteps.flatMap(step => step.conditions),
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
            const nextNode = {
                stage: rule.to.stage,
                level: rule.to.level
            };

            // 更新可行性（取最严格的）
            const newFeasibility = this.updateFeasibility(currentFeasibility, rule.feasibility);
            
            // 创建新的步骤信息
            const newStep = {
                from: { ...rule.from },
                to: { ...rule.to },
                feasibility: rule.feasibility,
                conditions: [...rule.conditions],
                description: rule.description
            };
            
            const newSteps = [...currentSteps, newStep];

            // 递归搜索
            this.dfsFindPaths(
                nextNode,
                targetStage,
                [...currentPath, nextNode],
                newSteps,
                newFeasibility
            );
        }

        // 回溯：移除当前节点的访问标记
        this.visited.delete(nodeKey);
    }

    /**
     * 查找从当前节点出发的所有可能转换
     * @param {Object} currentNode 当前节点
     * @returns {Array} 可能的转换规则
     */
    findPossibleTransitions(currentNode) {
        return this.rules.filter(rule => 
            rule.from.stage === currentNode.stage && 
            rule.from.level === currentNode.level
        );
    }

    /**
     * 更新可行性状态（取最严格的）
     * @param {string} current 当前可行性
     * @param {string} rule 规则可行性
     * @returns {string} 更新后的可行性
     */
    updateFeasibility(current, rule) {
        // 优先级：infeasible > feasible
        if (current === 'infeasible' || rule === 'infeasible') {
            return 'infeasible';
        }
        return 'feasible';
    }

    /**
     * 生成路径描述
     * @param {Array} path 路径节点数组
     * @returns {string} 路径描述
     */
    generatePathDescription(path) {
        return path.map(node => `${node.stage}-${node.level}`).join(' → ');
    }

    /**
     * 验证用户输入
     * @param {Object} input 用户输入
     */
    validateInput(input) {
        // 验证目标阶段不能早于当前阶段
        const stageOrder = ['幼儿园', '小学', '初中', '高中', '大学', '研究生', '博士'];
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
     * @param {Object} input 用户输入
     * @returns {Array} 战略路线列表
     */
    getStrategicRoutes(input) {
        const allPaths = this.findAllPaths(input);
        return this.pathClusterer.clusterPaths(allPaths.paths, input);
    }

    /**
     * 获取指定战略路线的排序路径
     * @param {string} routeId 战略路线ID
     * @param {Object} input 用户输入
     * @returns {Array} 排序后的路径列表
     */
    getRankedPathsForRoute(routeId, input) {
        const strategicRoutes = this.getStrategicRoutes(input);
        const route = strategicRoutes.find(r => r.id === routeId);
        
        if (!route) {
            return [];
        }
        
        return this.pathRanker.rankPaths(route.paths);
    }

    /**
     * 获取所有路径的聚类和排序结果
     * @param {Object} input 用户输入
     * @returns {Object} 包含战略路线和排序路径的结果
     */
    getStrategicAnalysis(input) {
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
 * @param {Object} input 用户输入
 * @returns {Object} 路径查找结果
 */
function findAllPaths(input) {
    const finder = new EducationPathFinder();
    return finder.findAllPaths(input);
}
