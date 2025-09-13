// 主应用程序
class EducationPathApp {
    constructor() {
        this.form = document.getElementById('educationForm');
        this.currentStageInput = document.getElementById('currentStage');
        this.currentGradeInput = document.getElementById('currentGrade');
        this.currentLevelInput = document.getElementById('currentLevel');
        this.targetStageInput = document.getElementById('targetStage');
        this.submitButton = document.querySelector('.btn-primary');
        this.resultsSection = document.getElementById('resultsSection');
        this.statsContainer = document.getElementById('statsContainer');
        this.pathsContainer = document.getElementById('pathsContainer');

        // 选项按钮容器
        this.currentStageOptions = document.getElementById('currentStageOptions');
        this.currentGradeOptions = document.getElementById('currentGradeOptions');
        this.currentLevelOptions = document.getElementById('currentLevelOptions');
        this.targetStageOptions = document.getElementById('targetStageOptions');

        // 筛选状态管理
        this.currentFilter = 'all'; // 'all', 'feasible', 'infeasible'
        this.allPaths = []; // 存储所有路径数据

        // 服务实例
        this.costCalculator = new CostCalculatorService();
        this.pathClusterer = new PathClustererService();
        this.pathRanker = new PathRankerService();
        this.pathFilter = new PathFilterService();
        this.hintGenerator = new HintGeneratorService();
        this.educationLevelFeatures = new EducationLevelFeaturesService();
        this.personalizedContent = new PersonalizedContentService();

        // 新的UI元素
        this.strategicRoutesContainer = document.getElementById('strategicRoutesContainer');
        this.pathDetailsContainer = document.getElementById('pathDetailsContainer');
        this.backToRoutesBtn = document.getElementById('backToRoutesBtn');
        this.pathDetailsTitle = document.getElementById('pathDetailsTitle');
        this.showRarePathsCheckbox = document.getElementById('showRarePaths');
        this.showInfeasiblePathsCheckbox = document.getElementById('showInfeasiblePaths');

        // 状态管理
        this.currentStrategicRoute = null;
        this.strategicRoutes = [];
        this.rankedPaths = [];
        this.filteredPaths = [];
        this.mostCommonPath = null;

        // 教育阶段与年级的映射关系
        this.stageGradeMapping = {
            '幼儿园': [1, 2, 3],
            '小学': [1, 2, 3, 4, 5, 6],
            '初中': [1, 2, 3],
            '高中': [1, 2, 3],
            '大学': [1, 2, 3, 4],
            '研究生': [1, 2, 3],
            '博士': [1, 2, 3, 4, 5]
        };

        // 教育阶段与水平的映射关系
        this.stageLevelMapping = {
            '幼儿园': ['公立', '普通私立', '民办双语', '外籍人员子女学校'],
            '小学': ['公立', '普通私立', '民办双语', '外籍人员子女学校'],
            '初中': ['公立', '普通私立', '民办双语', '外籍人员子女学校'],
            '高中': ['公立', '民办普通高中', '公立国际部', '民办国际化学校', '外籍人员子女学校', '海外高中'],
            '大学': ['国内公办', '国内民办', '中外合作办学', '海外大学'],
            '研究生': ['国内硕士', '海外硕士'],
            '博士': ['国内博士', '海外博士']
        };

        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeDefaultValues();
        this.initializeOptions();
        this.updateFormState();
    }

    bindEvents() {
        // 教育阶段选项按钮事件
        this.currentStageOptions.addEventListener('click', (e) => {
            if (e.target.classList.contains('option-btn')) {
                this.selectOption('currentStage', e.target);
                this.updateCurrentGradeOptions();
                this.updateCurrentLevelOptions();
                this.updateTargetStageOptions();
                this.updateFormState();
            }
        });

        // 当前年级选项按钮事件
        this.currentGradeOptions.addEventListener('click', (e) => {
            if (e.target.classList.contains('option-btn')) {
                this.selectOption('currentGrade', e.target);
                this.updateFormState();
            }
        });

        // 当前教育水平选项按钮事件
        this.currentLevelOptions.addEventListener('click', (e) => {
            if (e.target.classList.contains('option-btn')) {
                this.selectOption('currentLevel', e.target);
                this.updateFormState();
            }
        });

        // 目标阶段选项按钮事件
        this.targetStageOptions.addEventListener('click', (e) => {
            if (e.target.classList.contains('option-btn')) {
                this.selectOption('targetStage', e.target);
                this.updateFormState();
            }
        });

        // 表单提交
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // 返回教育方向按钮
        if (this.backToRoutesBtn) {
            this.backToRoutesBtn.addEventListener('click', () => {
                this.showStrategicRoutes();
            });
        }

        // 路径筛选选项
        if (this.showRarePathsCheckbox) {
            this.showRarePathsCheckbox.addEventListener('change', () => {
                this.updatePathDisplay();
            });
        }

        if (this.showInfeasiblePathsCheckbox) {
            this.showInfeasiblePathsCheckbox.addEventListener('change', () => {
                this.updatePathDisplay();
            });
        }
    }

    /**
     * 初始化选项按钮
     */
    initializeOptions() {
        // 初始化当前年级选项（默认禁用）
        this.updateCurrentGradeOptions();
        
        // 初始化当前教育水平选项（默认禁用）
        this.updateCurrentLevelOptions();
        
        // 初始化目标阶段选项（默认禁用）
        this.updateTargetStageOptions();
    }

    /**
     * 选择选项
     */
    selectOption(field, button) {
        const value = button.dataset.value;
        const input = document.getElementById(field);
        
        // 更新隐藏输入框的值
        input.value = value;
        
        // 更新按钮选中状态
        const container = button.parentElement;
        container.querySelectorAll('.option-btn').forEach(btn => {
            btn.classList.remove('active', 'selected');
        });
        button.classList.add('active');
    }

    /**
     * 更新当前年级选项
     */
    updateCurrentGradeOptions() {
        const currentStage = this.currentStageInput.value;
        const grades = this.stageGradeMapping[currentStage] || [];
        
        this.currentGradeOptions.innerHTML = '';
        this.currentGradeOptions.className = 'option-grid grade-options';
        
        if (grades.length > 0) {
            grades.forEach(grade => {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'option-btn';
                button.dataset.value = grade;
                button.textContent = `${grade}年级`;
                this.currentGradeOptions.appendChild(button);
            });
            
            // 设置默认选中第一个年级
            const firstButton = this.currentGradeOptions.querySelector('.option-btn');
            if (firstButton) {
                firstButton.classList.add('active');
                this.currentGradeInput.value = firstButton.dataset.value;
            }
        } else {
            this.currentGradeOptions.innerHTML = '<p class="text-muted">请先选择教育阶段</p>';
            this.currentGradeInput.value = '';
        }
    }

    /**
     * 更新当前教育水平选项
     */
    updateCurrentLevelOptions() {
        const currentStage = this.currentStageInput.value;
        const levels = this.stageLevelMapping[currentStage] || [];
        
        this.currentLevelOptions.innerHTML = '';
        
        if (levels.length > 0) {
            levels.forEach(level => {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'option-btn';
                button.dataset.value = level;
                button.textContent = level;
                this.currentLevelOptions.appendChild(button);
            });
            
            // 设置默认选中第一个教育水平
            const firstButton = this.currentLevelOptions.querySelector('.option-btn');
            if (firstButton) {
                firstButton.classList.add('active');
                this.currentLevelInput.value = firstButton.dataset.value;
            }
        } else {
            this.currentLevelOptions.innerHTML = '<p class="text-muted">请先选择教育阶段</p>';
            this.currentLevelInput.value = '';
        }
    }

    /**
     * 更新目标阶段选项
     */
    updateTargetStageOptions() {
        const currentStage = this.currentStageInput.value;
        const targetStages = this.getTargetStages(currentStage);
        
        this.targetStageOptions.innerHTML = '';
        
        if (targetStages.length > 0) {
            targetStages.forEach(stage => {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'option-btn';
                button.dataset.value = stage;
                button.textContent = stage;
                this.targetStageOptions.appendChild(button);
            });
            
            // 设置默认选中目标阶段（优先选择"大学"）
            let defaultButton = this.targetStageOptions.querySelector('[data-value="大学"]');
            if (!defaultButton) {
                defaultButton = this.targetStageOptions.querySelector('.option-btn');
            }
            if (defaultButton) {
                defaultButton.classList.add('active');
                this.targetStageInput.value = defaultButton.dataset.value;
            }
        } else {
            this.targetStageOptions.innerHTML = '<p class="text-muted">请先选择当前教育阶段</p>';
            this.targetStageInput.value = '';
        }
    }

    /**
     * 获取目标阶段选项
     */
    getTargetStages(currentStage) {
        const stages = ['大学', '研究生', '博士'];
        const currentIndex = stages.indexOf(currentStage);
        
        if (currentIndex === -1) {
            return stages; // 如果当前阶段不在目标阶段中，返回所有选项
        }
        
        return stages.slice(currentIndex); // 返回当前阶段及之后的阶段
    }



    /**
     * 更新表单状态
     */
    initializeDefaultValues() {
        // 确保默认值正确设置
        this.currentStageInput.value = '幼儿园';
        this.currentGradeInput.value = '1年级';
        this.currentLevelInput.value = '公立';
        this.targetStageInput.value = '大学';
        
        // 更新按钮状态
        this.updateButtonStates();
    }

    updateButtonStates() {
        // 更新当前教育阶段按钮状态
        document.querySelectorAll('#currentStageOptions .option-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.value === '幼儿园') {
                btn.classList.add('active');
            }
        });
        
        // 更新当前年级按钮状态
        document.querySelectorAll('#currentGradeOptions .option-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.value === '1年级') {
                btn.classList.add('active');
            }
        });
        
        // 更新当前教育水平按钮状态
        document.querySelectorAll('#currentLevelOptions .option-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.value === '公立') {
                btn.classList.add('active');
            }
        });
        
        // 更新目标教育阶段按钮状态
        document.querySelectorAll('#targetStageOptions .option-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.value === '大学') {
                btn.classList.add('active');
            }
        });
    }

    updateFormState() {
        const isFormValid = this.isFormValid();
        this.submitButton.disabled = !isFormValid;
    }

    /**
     * 检查表单是否有效
     */
    isFormValid() {
        return this.currentStageInput.value &&
               this.currentGradeInput.value &&
               this.currentLevelInput.value &&
               this.targetStageInput.value;
    }

    /**
     * 处理表单提交
     */
    async handleFormSubmit() {
        try {
            // 显示加载状态
            this.setLoadingState(true);
            
            // 收集表单数据
            const formData = this.collectFormData();
            
            // 查找路径
            const result = findAllPaths(formData);
            
            // 聚类为教育方向
            this.strategicRoutes = this.pathClusterer.clusterPaths(result.paths, formData);
            this.rankedPaths = this.pathRanker.rankPaths(result.paths);
            
            // 显示教育方向
            this.displayStrategicRoutes();
            
        } catch (error) {
            this.showError(error.message);
        } finally {
            // 隐藏加载状态
            this.setLoadingState(false);
        }
    }

    /**
     * 收集表单数据
     */
    collectFormData() {
        return {
            currentStage: this.currentStageInput.value,
            currentGrade: parseInt(this.currentGradeInput.value),
            currentLevel: this.currentLevelInput.value,
            targetStage: this.targetStageInput.value
        };
    }

    /**
     * 设置加载状态
     */
    setLoadingState(loading) {
        const btnText = this.submitButton.querySelector('.btn-text');
        const btnLoading = this.submitButton.querySelector('.btn-loading');
        
        if (loading) {
            this.submitButton.classList.add('loading');
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';
            this.submitButton.disabled = true;
        } else {
            this.submitButton.classList.remove('loading');
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            this.updateFormState();
        }
    }

    /**
     * 显示结果
     */
    displayResults(result) {
        // 保存所有路径数据
        this.allPaths = result.paths;
        this.currentFilter = 'feasible'; // 默认选中可行路径
        
        // 显示结果区域
        this.resultsSection.style.display = 'block';
        
        // 滚动到结果区域
        this.resultsSection.scrollIntoView({ behavior: 'smooth' });
        
        // 显示统计信息
        this.displayStats(result);
        
        // 显示路径列表（默认显示可行路径）
        const feasiblePaths = this.getFilteredPaths();
        this.displayPaths(feasiblePaths);
    }

    /**
     * 显示统计信息
     */
    displayStats(result) {
        this.statsContainer.innerHTML = `
            <div class="stat-card clickable ${this.currentFilter === 'feasible' ? 'active' : ''}" data-filter="feasible">
                <div class="stat-number">${result.feasiblePaths}</div>
                <div class="stat-label">可行路径</div>
            </div>
            <div class="stat-card clickable ${this.currentFilter === 'infeasible' ? 'active' : ''}" data-filter="infeasible">
                <div class="stat-number">${result.infeasiblePaths}</div>
                <div class="stat-label">不可行路径</div>
            </div>
        `;
        
        // 绑定点击事件
        this.bindStatsClickEvents();
    }

    /**
     * 显示路径列表（优化版本，包含差异点高亮和关键数据）
     */
    displayPaths(paths) {
        const container = document.getElementById('pathsContainer');
        if (!container) return;
        
        if (!paths || paths.length === 0) {
            this.displayNoResults();
            return;
        }
        
        const pathsHTML = paths.map((path, index) => {
            return this.generatePathCard(path, index);
        }).join('');
        
        container.innerHTML = pathsHTML;
    }

    /**
     * 生成路径卡片（优化版本）
     */
    generatePathCard(path, index) {
        if (!path || !path.nodes || !Array.isArray(path.nodes)) {
            return '';
        }
        
        // 获取用户输入值，如果为空则提供默认值
        const currentStage = this.getCurrentStage() || '小学';
        const currentLevel = this.getCurrentLevel() || '公立';
        const currentGrade = this.getCurrentGrade() || 1;
        
        // 计算路径总费用
        const pathCost = this.costCalculator.calculatePathCost(
            path.nodes, 
            currentStage, 
            currentLevel, 
            currentGrade
        );
        
        // 计算当前阶段剩余费用
        const currentStageCost = this.costCalculator.calculateCurrentStageRemainingCost(
            currentStage, 
            currentLevel, 
            currentGrade
        );
        
        // 生成步骤HTML
        const steps = (path.steps || []).map((step, stepIndex) => {
            const isDifferent = this.isStepDifferent(step, stepIndex);
            const stepClass = isDifferent ? 'path-step-different' : '';
            
            // 获取目标节点的费用信息
            const targetCost = this.costCalculator.getStageCost(step.to.stage, step.to.level);
            const costInfo = targetCost ? `
                <div class="step-cost">
                    <div class="step-cost-header">
                        <span class="step-cost-label">目标阶段费用：</span>
                        <span class="step-cost-amount">¥${this.costCalculator.formatCost(targetCost.costTotal)}</span>
                    </div>
                    <div class="step-cost-details">
                        <div class="step-cost-breakdown">
                            <span class="step-cost-duration">${targetCost.duration}年</span>
                            <span class="step-cost-yearly">年均：¥${this.costCalculator.formatCost(targetCost.costTotal / targetCost.duration)}</span>
                        </div>
                        <div class="step-cost-source">数据来源：${targetCost.source}</div>
                    </div>
                </div>
            ` : '';
            
            return `
                <div class="path-step ${stepClass}">
                    <div class="step-header">
                        <span class="step-number">步骤${stepIndex + 1}</span>
                        <span class="step-stage">${step.to.stage}</span>
                    </div>
                    <div class="step-content">
                        <div class="step-level">${step.to.level}</div>
                        ${this.generateEducationLevelFeatures(step.to.stage, step.to.level)}
                        ${costInfo}
                        ${step.conditions ? `<div class="step-conditions">条件：${step.conditions}</div>` : ''}
                    </div>
                </div>
            `;
        }).join('');
        
        // 计算关键数据
        const totalCost = pathCost ? pathCost.total : 0;
        const transitionCount = this.pathFilter.getPathTransitionCount(path);
        const prevalence = path.prevalence || 0;
        
        return `
            <div class="path-card">
                <div class="path-header">
                    <h4>路径 ${index + 1}</h4>
                    <div class="path-description">${path.description || '教育路径'}</div>
                </div>
                <div class="path-steps">
                    ${currentStageCost && currentStageCost.remainingYears > 0 ? `
                        <!-- 当前阶段剩余费用卡片 -->
                        <div class="path-step current-stage-step">
                            <div class="step-header">
                                <div class="step-title">
                                    当前阶段剩余费用
                                    <span class="step-description-inline">${currentStage}-${currentLevel}</span>
                                </div>
                                <div class="step-feasibility feasible">
                                    可行
                                </div>
                            </div>
                            <div class="step-transition">
                                <span class="step-from">当前：${currentStage}-${currentLevel}</span>
                                <span class="step-arrow">→</span>
                                <span class="step-to">完成：${currentStage}-${currentLevel}</span>
                            </div>
                            <div class="step-cost">
                                <div class="step-cost-header">
                                    <span class="step-cost-label">剩余阶段费用：</span>
                                    <span class="step-cost-amount">¥${this.costCalculator.formatCost(currentStageCost.total)}</span>
                                </div>
                                <div class="step-cost-details">
                                    <div class="step-cost-breakdown">
                                        <span class="step-cost-duration">剩余${currentStageCost.remainingYears}年</span>
                                        <span class="step-cost-yearly">年均：¥${this.costCalculator.formatCost(currentStageCost.yearlyCost)}</span>
                                    </div>
                                    <div class="step-cost-source">数据来源：${currentStageCost.source}</div>
                                </div>
                            </div>
                            ${this.generateEducationLevelFeatures(currentStage, currentLevel)}
                        </div>
                    ` : ''}
                    ${steps}
                </div>
                <div class="path-key-data">
                    <div class="path-key-data-item">
                        <span>总费用：</span>
                        <span class="path-key-data-value">¥${this.costCalculator.formatCost(totalCost)}</span>
                    </div>
                    <div class="path-key-data-item">
                        <span>转轨次数：</span>
                        <span class="path-key-data-value">${transitionCount}次</span>
                    </div>
                    <div class="path-key-data-item">
                        <span>常见度：</span>
                        <span class="path-key-data-value">${prevalence}%</span>
                    </div>
                </div>
            </div>
        `;
    }


    /**
     * 绑定统计卡片点击事件
     */
    bindStatsClickEvents() {
        const statCards = this.statsContainer.querySelectorAll('.stat-card.clickable');
        statCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const filter = e.currentTarget.dataset.filter;
                this.setFilter(filter);
            });
        });
    }

    /**
     * 设置筛选条件
     */
    setFilter(filter) {
        this.currentFilter = filter;
        
        // 更新统计卡片的激活状态
        this.updateStatsActiveState();
        
        // 筛选并显示路径
        const filteredPaths = this.getFilteredPaths();
        this.displayPaths(filteredPaths);
    }

    /**
     * 更新统计卡片的激活状态
     */
    updateStatsActiveState() {
        const statCards = this.statsContainer.querySelectorAll('.stat-card.clickable');
        statCards.forEach(card => {
            const filter = card.dataset.filter;
            if (filter === this.currentFilter) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
    }

    /**
     * 根据当前筛选条件获取路径
     */
    getFilteredPaths() {
        return this.allPaths.filter(path => path.feasibility === this.currentFilter);
    }

    /**
     * 获取可行性标签
     */
    getFeasibilityLabel(feasibility) {
        const labels = {
            'feasible': '可行',
            'infeasible': '不可行'
        };
        return labels[feasibility] || feasibility;
    }

    /**
     * 获取当前教育阶段
     */
    getCurrentStage() {
        return this.currentStageInput.value;
    }

    /**
     * 获取当前教育水平
     */
    getCurrentLevel() {
        return this.currentLevelInput.value;
    }

    /**
     * 获取当前年级
     */
    getCurrentGrade() {
        return parseInt(this.currentGradeInput.value) || 1;
    }

    /**
     * 获取目标教育阶段
     */
    getTargetStage() {
        return this.targetStageInput.value;
    }

    /**
     * 显示错误信息
     */
    showError(message) {
        // 创建错误提示
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #EF4444;
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            max-width: 400px;
            animation: slideInRight 0.3s ease-out;
        `;
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        // 3秒后自动移除
        setTimeout(() => {
            errorDiv.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.parentNode.removeChild(errorDiv);
                }
            }, 300);
        }, 3000);
    }

    /**
     * 显示教育方向
     */
    displayStrategicRoutes() {
        this.resultsSection.style.display = 'block';
        this.strategicRoutesContainer.style.display = 'block';
        this.pathDetailsContainer.style.display = 'none';
        
        // 调试信息
        console.log('显示教育方向:', this.strategicRoutes.map(r => ({ id: r.id, name: r.name })));
        
        // 分离路线：第一个分区包含所有可行路线（包括其他个性化路线），第二个分区只包含不可行路线
        const feasibleRoutes = this.strategicRoutes.filter(route => route.id !== 'infeasible_paths');
        const infeasibleRoutes = this.strategicRoutes.filter(route => route.id === 'infeasible_paths');
        
        // 生成报告式HEADER区域
        const reportHeader = this.generateReportHeader(feasibleRoutes, infeasibleRoutes);
        
        console.log('可行路线:', feasibleRoutes.map(r => ({ id: r.id, name: r.name })));
        console.log('不可行路线:', infeasibleRoutes.map(r => ({ id: r.id, name: r.name })));
        
        // 生成可行路线HTML
        const feasibleRoutesHTML = feasibleRoutes.map((route, index) => {
            return this.generateStrategicRouteCard(route, false, index + 1);
        }).join('');
        
        // 生成不可行路线HTML
        const infeasibleRoutesHTML = infeasibleRoutes.map((route, index) => {
            return this.generateStrategicRouteCard(route, true, feasibleRoutes.length + index + 1);
        }).join('');
        
        // 组合HTML内容
        let finalHTML = reportHeader;
        
        if (feasibleRoutes.length > 0) {
            finalHTML += `
                <div class="feasible-routes-section">

                    ${feasibleRoutesHTML}
                </div>
            `;
        }
        
        if (infeasibleRoutes.length > 0) {
            finalHTML += `
                <div class="infeasible-routes-section">
                    <h3 class="section-subtitle infeasible-subtitle">不可行路径参考</h3>
                    <p class="infeasible-notice">以下路径在当前条件下不可行，仅供参考了解限制条件</p>
                    ${infeasibleRoutesHTML}
                </div>
            `;
        }
        
        this.strategicRoutesContainer.innerHTML = finalHTML;
        
        // 绑定点击事件
        this.bindStrategicRouteEvents();
        
        // 绑定帮助图标事件
        this.bindHelpIconEvents();
    }

    /**
     * 生成教育方向卡片HTML
     * @param {Object} route 教育方向对象
     * @param {boolean} isInfeasible 是否为不可行方向
     * @param {number} directionNumber 方向序号
     * @returns {string} 卡片HTML
     */
    generateStrategicRouteCard(route, isInfeasible = false, directionNumber = 1) {
        // 获取用户信息
        const userInfo = this.getUserInfo();
        
        // 获取模板
        const template = STRATEGIC_ROUTE_TEMPLATES[route.id];
        if (!template) {
            console.warn(`未找到教育方向模板: ${route.id}`);
            return '';
        }
        
        // 生成个性化描述
        const personalizedDescription = this.personalizedContent.generatePersonalizedDescription(
            template.descriptionTemplate, 
            userInfo
        );
        
        // 生成个性化费用范围描述
        const costRangeDescription = this.personalizedContent.generateCostRangeDescription(
            route.costRange.min,
            route.costRange.max,
            route.id
        );
        
        // 生成行动按钮文案
        const actionButtonText = `探索 ${route.pathCount || route.paths.length} 条具体路径 →`;
        
        // 确定卡片样式类
        const cardClass = isInfeasible ? 'strategic-route-card infeasible-route' : 'strategic-route-card';
        
        return `
            <div class="${cardClass}" data-route-id="${route.id}">
                <div class="route-header">
                    <h3 class="route-title">方向${directionNumber}：${template.name}</h3>
                </div>
                
                <p class="route-description">"${personalizedDescription}"</p>
                
                <div class="route-cost-range">
                    <div class="cost-range-label">预估总费用</div>
                    <div class="cost-range-value">${costRangeDescription}</div>
                </div>
                
                <div class="route-suitable-for">
                    <div class="suitable-for-title">非常适合这样的家庭：</div>
                    <ul class="suitable-for-list">
                        ${template.suitableFor.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="route-need-to-know">
                    <div class="need-to-know-title">您需要提前了解：</div>
                    <ul class="need-to-know-list">
                        ${template.needToKnow.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="route-action">
                    <button class="btn btn-primary route-action-btn" data-route-id="${route.id}">
                        ${actionButtonText}
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * 绑定教育方向点击事件
     */
    bindStrategicRouteEvents() {
        const actionButtons = this.strategicRoutesContainer.querySelectorAll('.route-action-btn');
        actionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const routeId = button.dataset.routeId;
                this.showPathDetails(routeId);
            });
        });
    }

    /**
     * 显示路径详情
     */
    showPathDetails(routeId) {
        const route = this.strategicRoutes.find(r => r.id === routeId);
        if (!route) return;
        
        this.currentStrategicRoute = route;
        
        // 更新UI
        this.strategicRoutesContainer.style.display = 'none';
        this.pathDetailsContainer.style.display = 'block';
        this.pathDetailsTitle.textContent = `${route.name} - 具体路径`;
        
        // 直接使用教育方向中的路径，不进行匹配
        const routePaths = route.paths;
        
        // 基于当前教育状态对路径进行重新排序
        const currentLevel = this.getCurrentLevel();
        const sortedRoutePaths = this.pathRanker.rankPathsByCurrentState(routePaths, currentLevel);
        
        // 存储原始路径数据
        this.rankedPaths = sortedRoutePaths;
        this.filteredPaths = [...sortedRoutePaths];
        
        // 计算最常见路径（用于差异点高亮）
        this.mostCommonPath = this.pathFilter.getMostCommonPath(sortedRoutePaths);
        
        // 初始化筛选器
        this.initializeFilters(sortedRoutePaths);
        
        // 显示路径
        this.displayFilteredPaths();
    }

    /**
     * 显示教育方向（返回按钮）
     */
    showStrategicRoutes() {
        this.strategicRoutesContainer.style.display = 'block';
        this.pathDetailsContainer.style.display = 'none';
        this.currentStrategicRoute = null;
    }

    /**
     * 绑定帮助问题事件
     */
    bindHelpIconEvents() {
        const helpQuestions = document.querySelectorAll('.help-question');
        helpQuestions.forEach(question => {
            question.addEventListener('click', (e) => {
                e.stopPropagation();
                const tooltip = question.getAttribute('data-tooltip');
                this.showHelpModal(tooltip);
            });
        });
    }

    /**
     * 显示帮助弹窗
     * @param {string} type 帮助类型
     */
    showHelpModal(type) {
        let title, content;
        
        if (type === '教育方向说明') {
            title = '什么是教育方向？';
            content = `
                <p>教育方向是指从您当前教育状态到目标教育阶段的整体规划思路。</p>
                
                <h4>举例说明：</h4>
                <ul>
                    <li><strong>国内直达路线</strong>：从幼儿园→小学→初中→高中→大学，全程在国内教育体系内完成</li>
                    <li><strong>海外直通路线</strong>：从国内教育转向国际教育，最终申请海外大学</li>
                    <li><strong>中期转轨路线</strong>：在初中或高中阶段从国内教育转向国际教育</li>
                    <li><strong>回国发展路线</strong>：先在国内完成基础教育，再出国深造，最后回国发展</li>
                </ul>
                
                <p>每个教育方向都包含多条具体的教育路径，您可以根据家庭情况和孩子特点选择最适合的方向。</p>
            `;
        } else if (type === '教育路径说明') {
            title = '什么是教育路径？';
            content = `
                <p>教育路径是指在某个教育方向下，从当前状态到目标阶段的具体教育安排。</p>
                
                <h4>举例说明：</h4>
                <p>假设您选择"早期国际转轨路径"，可能的具体路径包括：</p>
                <ul>
                    <li><strong>路径1</strong>：幼儿园(公立) → 小学(民办双语) → 初中(民办双语) → 高中(民办国际化学校) → 大学(海外大学)</li>
                    <li><strong>路径2</strong>：幼儿园(公立) → 小学(公立) → 初中(民办双语) → 高中(民办国际化学校) → 大学(海外大学)</li>
                    <li><strong>路径3</strong>：幼儿园(公立) → 小学(公立) → 初中(外籍人员子女学校) → 高中(外籍人员子女学校) → 大学(海外大学)</li>
                </ul>
                
                <p>早期国际转轨路径的特点是在小学或初中阶段就转入国际教育体系，让孩子尽早适应国际化学习环境。每条路径都会详细显示：</p>
                <ul>
                    <li>每个教育阶段的具体安排</li>
                    <li>预估的总费用</li>
                    <li>转轨次数和时机</li>
                    <li>该路径的常见程度</li>
                </ul>
            `;
        }
        
        this.createModal(title, content);
    }

    /**
     * 创建弹窗
     * @param {string} title 标题
     * @param {string} content 内容
     */
    createModal(title, content) {
        // 移除已存在的弹窗
        const existingModal = document.querySelector('.modal-overlay');
        if (existingModal) {
            existingModal.remove();
        }
        
        const modalHTML = `
            <div class="modal-overlay" id="helpModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">${title}</h3>
                        <button class="modal-close" id="modalClose">&times;</button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        const modal = document.getElementById('helpModal');
        const closeBtn = document.getElementById('modalClose');
        
        // 显示弹窗
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
        // 关闭弹窗事件
        const closeModal = () => {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        };
        
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // ESC键关闭
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);
    }

    /**
     * 更新路径显示（根据筛选选项）
     */
    updatePathDisplay() {
        if (!this.currentStrategicRoute) return;
        
        const showRare = this.showRarePathsCheckbox.checked;
        const showInfeasible = this.showInfeasiblePathsCheckbox.checked;
        
        // 使用路径描述作为唯一标识符来匹配路径
        const routePathDescriptions = this.currentStrategicRoute.paths.map(p => p.description);
        let filteredPaths = this.rankedPaths.filter(path => 
            routePathDescriptions.includes(path.description)
        );
        
        if (!showRare) {
            filteredPaths = filteredPaths.filter(path => 
                path.rankingScore > 0.2 // 过滤掉低分路径
            );
        }
        
        if (!showInfeasible) {
            filteredPaths = filteredPaths.filter(path => 
                path.feasibility !== 'infeasible'
            );
        }
        
        this.displayPaths(filteredPaths);
    }

    /**
     * 获取特征标签
     */
    getFeatureLabel(feature) {
        const labels = {
            'traditional': '传统教育',
            'international': '国际化',
            'hybrid': '混合模式',
            'gaokao': '参加高考',
            'domestic_ug': '国内本科',
            'overseas_ug': '海外本科',
            'domestic_pg': '国内研究生',
            'overseas_pg': '海外研究生',
            'early_transition': '早期转轨',
            'late_transition': '中期转轨',
            'cost_high': '高费用',
            'cost_low': '低费用'
        };
        return labels[feature] || feature;
    }

    /**
     * 生成报告式HEADER区域
     * @param {Array} feasibleRoutes 可行路线
     * @param {Array} infeasibleRoutes 不可行路线
     * @returns {string} 报告HEADER HTML
     */
    generateReportHeader(feasibleRoutes, infeasibleRoutes) {
        // 获取用户信息
        const userInfo = this.getUserInfo();
        
        // 计算统计数据
        const totalRoutes = feasibleRoutes.length + infeasibleRoutes.length;
        const totalPaths = this.strategicRoutes.reduce((sum, route) => sum + (route.paths ? route.paths.length : 0), 0);
        
        return `
            <div class="results-header">
                <h1 class="report-title">您的教育规划方案</h1>
                <p class="report-subtitle">基于您的现状和目标，我们为您推荐以下教育方向，每个方向都经过可行性验证。</p>
                

                <div class="key-metrics">
                    <div class="metric">
                        <span class="metric-label">可行的教育方向</span>
                        <strong class="metric-value">${totalRoutes}</strong>
                        <span class="metric-unit">个</span>
                        <div class="help-question" data-tooltip="教育方向说明">什么是教育方向？</div>
                    </div>
                    <div class="metric">
                        <span class="metric-label">覆盖的教育路径</span>
                        <strong class="metric-value">${totalPaths}</strong>
                        <span class="metric-unit">条</span>
                        <div class="help-question" data-tooltip="教育路径说明">什么是教育路径？</div>
                    </div>
                </div>


            </div>
        `;
    }

    /**
     * 获取用户信息
     * @returns {Object} 用户信息对象
     */
    getUserInfo() {
        const currentStage = this.getCurrentStage();
        const currentGrade = this.getCurrentGrade();
        const currentLevel = this.getCurrentLevel();
        const targetStage = this.getTargetStage();
        
        // 根据教育水平确定国籍
        const nationality = this.determineNationality(currentStage, currentLevel);
        
        // 格式化当前状态
        const currentStatus = `${currentStage}${currentGrade ? currentGrade : ''} - ${currentLevel}`;
        
        // 格式化目标阶段
        const targetStageFormatted = `完成${targetStage}`;
        
        return {
            // 用于报告头部的格式化信息
            nationality,
            currentStatus,
            targetStage: targetStageFormatted,
            // 用于个性化内容生成的原始信息
            currentStage,
            currentGrade: currentGrade ? currentGrade.toString() : '',
            currentLevel,
            targetStageRaw: targetStage
        };
    }

    /**
     * 根据教育水平确定国籍
     * @param {string} stage 教育阶段
     * @param {string} level 教育水平
     * @returns {string} 国籍信息
     */
    determineNationality(stage, level) {
        // 外籍人员子女学校的情况
        if (level === '外籍人员子女学校') {
            return '外籍';
        }
        
        // 海外高中的情况
        if (stage === '高中' && level === '海外高中') {
            return '外籍';
        }
        
        // 其他情况默认为中国籍
        return '中国籍';
    }

    /**
     * 生成教育水平特点HTML
     * @param {string} stage 教育阶段
     * @param {string} level 教育水平
     * @returns {string} 教育水平特点HTML
     */
    generateEducationLevelFeatures(stage, level) {
        const featureInfo = this.educationLevelFeatures.getFullFeatureInfo(stage, level);
        
        if (!featureInfo.hasInfo) {
            return '';
        }

        const formattedFeatures = this.educationLevelFeatures.formatFeatureText(featureInfo.features);
        const uniqueId = `features-${stage}-${level}-${Math.random().toString(36).substr(2, 9)}`;
        
        return `
            <div class="education-level-features">
                <div class="features-header">
                    <div class="features-title">
                        <span class="features-icon">📚</span>
                        <span class="features-label">${stage}-${level} 核心特点</span>
                    </div>
                    <button type="button" class="features-toggle" onclick="toggleFeatures('${uniqueId}')">
                        <span class="toggle-icon">▼</span>
                    </button>
                </div>
                <div class="features-content" id="${uniqueId}">
                    <div class="features-description">
                        ${formattedFeatures}
                    </div>
                    ${featureInfo.nationalityRequirement ? `
                        <div class="features-detail">
                            <span class="detail-label">国籍要求：</span>
                            <span class="detail-value">${featureInfo.nationalityRequirement}</span>
                        </div>
                    ` : ''}
                    ${featureInfo.studentStatus ? `
                        <div class="features-detail">
                            <span class="detail-label">学籍情况：</span>
                            <span class="detail-value">${featureInfo.studentStatus}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    /**
     * 初始化筛选器
     */
    initializeFilters(paths) {
        if (!paths || paths.length === 0) return;
        
        // 获取用户输入信息
        const currentStage = this.getCurrentStage();
        const targetStage = this.getTargetStage();
        
        // 初始化教育阶段筛选器
        this.initializeEducationStageFilters(currentStage, targetStage);
        
        // 初始化费用区间筛选器
        this.initializeCostRangeFilter(paths);
        
        // 绑定筛选器事件
        this.bindFilterEvents();
        
        // 设置默认排序按钮状态
        const defaultSortBtn = document.querySelector('.sort-btn[data-sort="prevalence"]');
        if (defaultSortBtn) {
            defaultSortBtn.classList.add('active');
        }
        
        // 重置筛选状态
        this.pathFilter.resetFilters();
    }

    /**
     * 初始化教育阶段筛选器
     */
    initializeEducationStageFilters(currentStage, targetStage) {
        const stageSelect = document.getElementById('stageSelect');
        const levelSelect = document.getElementById('levelSelect');
        
        if (!stageSelect || !levelSelect) return;

        // 获取可筛选的阶段
        const filterableStages = this.pathFilter.getFilterableStages(currentStage, targetStage);
        
        // 清空并重新填充阶段选择器
        stageSelect.innerHTML = '<option value="">选择教育阶段</option>';
        filterableStages.forEach(stage => {
            const option = document.createElement('option');
            option.value = stage;
            option.textContent = stage;
            stageSelect.appendChild(option);
        });

        // 阶段选择变化时更新水平选择器
        stageSelect.addEventListener('change', (e) => {
            const selectedStage = e.target.value;
            
            if (selectedStage) {
                // 获取该阶段的所有教育水平
                const levels = this.pathFilter.getStageLevels(selectedStage);
                
                levelSelect.innerHTML = '<option value="">选择教育水平</option>';
                levels.forEach(level => {
                    const option = document.createElement('option');
                    option.value = level;
                    option.textContent = level;
                    levelSelect.appendChild(option);
                });
                
                levelSelect.disabled = false;
            } else {
                levelSelect.innerHTML = '<option value="">选择教育水平</option>';
                levelSelect.disabled = true;
            }
        });
    }

    /**
     * 初始化费用区间筛选器
     */
    initializeCostRangeFilter(paths) {
        const minInput = document.getElementById('costRangeMin');
        const maxInput = document.getElementById('costRangeMax');
        const minDisplay = document.getElementById('costRangeMinDisplay');
        const maxDisplay = document.getElementById('costRangeMaxDisplay');
        
        if (!minInput || !maxInput || !minDisplay || !maxDisplay) return;
        
        // 计算费用范围
        const costRange = this.pathFilter.calculateCostRange(paths);
        
        // 设置输入范围
        minInput.min = costRange.min;
        minInput.max = costRange.max;
        minInput.value = costRange.min;
        
        maxInput.min = costRange.min;
        maxInput.max = costRange.max;
        maxInput.value = costRange.max;
        
        // 更新显示
        this.updateCostRangeDisplay();
    }

    /**
     * 绑定筛选器事件
     */
    bindFilterEvents() {
        // 教育阶段筛选器
        const stageSelects = document.querySelectorAll('.stage-level-select');
        stageSelects.forEach(select => {
            select.addEventListener('change', () => {
                this.debouncedApplyFilters();
            });
        });
        
        // 费用区间筛选器
        const costInputs = document.querySelectorAll('.cost-range-input');
        costInputs.forEach(input => {
            input.addEventListener('input', () => {
                this.updateCostRangeDisplay();
                this.debouncedApplyFilters();
            });
        });
        
        // 特征标签筛选器
        const featureTags = document.querySelectorAll('.feature-tag');
        featureTags.forEach(tag => {
            tag.addEventListener('change', () => {
                this.debouncedApplyFilters();
            });
        });
        
        // 排序选择器
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', () => {
                this.debouncedApplyFilters();
            });
        }
        
        // 重置按钮
        const resetBtn = document.getElementById('resetFiltersBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetFilters();
            });
        }
        
        // 绑定排序按钮事件
        const sortBtns = document.querySelectorAll('.sort-btn');
        sortBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // 移除所有按钮的active状态
                sortBtns.forEach(b => b.classList.remove('active'));
                // 添加当前按钮的active状态
                btn.classList.add('active');
                // 应用筛选
                this.debouncedApplyFilters();
            });
        });
    }

    /**
     * 更新费用区间显示
     */
    updateCostRangeDisplay() {
        const minInput = document.getElementById('costRangeMin');
        const maxInput = document.getElementById('costRangeMax');
        const minDisplay = document.getElementById('costRangeMinDisplay');
        const maxDisplay = document.getElementById('costRangeMaxDisplay');
        
        if (!minInput || !maxInput || !minDisplay || !maxDisplay) return;
        
        minDisplay.textContent = this.formatCost(parseInt(minInput.value));
        maxDisplay.textContent = this.formatCost(parseInt(maxInput.value));
    }

    /**
     * 格式化费用显示
     */
    formatCost(cost) {
        if (cost >= 10000) {
            return `${(cost / 10000).toFixed(1)}万`;
        }
        return `${cost.toLocaleString()}`;
    }

    /**
     * 防抖应用筛选器
     */
    debouncedApplyFilters() {
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }
        
        this.debounceTimer = setTimeout(() => {
            this.applyFilters();
        }, 300);
    }

    /**
     * 应用筛选器
     */
    applyFilters() {
        const filterState = this.collectFilterState();
        const filteredPaths = this.pathFilter.applyFilters(this.rankedPaths, filterState);
        
        this.filteredPaths = filteredPaths;
        this.displayFilteredPaths();
    }

    /**
     * 收集筛选状态
     */
    collectFilterState() {
        const filterState = {
            educationStages: {},
            costRange: { min: 0, max: 0 },
            features: [],
            sortBy: 'prevalence'
        };
        
        // 收集教育阶段筛选
        const stageSelect = document.getElementById('stageSelect');
        const levelSelect = document.getElementById('levelSelect');
        
        if (stageSelect && levelSelect && stageSelect.value && levelSelect.value) {
            const stage = stageSelect.value;
            const level = levelSelect.value;
            filterState.educationStages[stage] = [level];
        }
        
        // 收集费用区间筛选
        const minInput = document.getElementById('costRangeMin');
        const maxInput = document.getElementById('costRangeMax');
        if (minInput && maxInput) {
            filterState.costRange.min = parseInt(minInput.value);
            filterState.costRange.max = parseInt(maxInput.value);
        }
        
        // 收集特征筛选
        const featureTags = document.querySelectorAll('.feature-tag:checked');
        featureTags.forEach(tag => {
            filterState.features.push(tag.dataset.feature);
        });
        
        // 收集排序方式
        const activeSortBtn = document.querySelector('.sort-btn.active');
        if (activeSortBtn) {
            filterState.sortBy = activeSortBtn.dataset.sort;
        } else {
            filterState.sortBy = 'prevalence'; // 默认排序
        }
        
        return filterState;
    }

    /**
     * 重置筛选器
     */
    resetFilters() {
        // 重置教育阶段筛选器
        const stageSelect = document.getElementById('stageSelect');
        const levelSelect = document.getElementById('levelSelect');
        
        if (stageSelect) {
            stageSelect.value = '';
        }
        if (levelSelect) {
            levelSelect.value = '';
            levelSelect.disabled = true;
        }
        
        // 重置费用区间筛选器
        const minInput = document.getElementById('costRangeMin');
        const maxInput = document.getElementById('costRangeMax');
        if (minInput && maxInput) {
            minInput.value = minInput.min;
            maxInput.value = maxInput.max;
            this.updateCostRangeDisplay();
        }
        
        // 重置特征筛选器
        const featureTags = document.querySelectorAll('.feature-tag');
        featureTags.forEach(tag => {
            tag.checked = false;
        });
        
        // 重置排序按钮
        const sortBtns = document.querySelectorAll('.sort-btn');
        sortBtns.forEach(btn => {
            btn.classList.remove('active');
        });
        // 设置默认排序为常见度
        const defaultSortBtn = document.querySelector('.sort-btn[data-sort="prevalence"]');
        if (defaultSortBtn) {
            defaultSortBtn.classList.add('active');
        }
        
        // 应用重置后的筛选器
        this.applyFilters();
    }

    /**
     * 显示筛选后的路径
     */
    displayFilteredPaths() {
        const countElement = document.getElementById('filteredPathsCount');
        if (countElement) {
            countElement.textContent = this.filteredPaths.length;
        }
        
        if (this.filteredPaths.length === 0) {
            this.displayNoResults();
        } else {
            this.displayPaths(this.filteredPaths);
        }
    }

    /**
     * 显示无结果提示
     */
    displayNoResults() {
        const container = document.getElementById('pathsContainer');
        if (!container) return;
        
        container.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">🔍</div>
                <div class="no-results-title">当前筛选条件下暂无匹配路径</div>
                <div class="no-results-message">建议您尝试放宽筛选范围</div>
            </div>
        `;
    }

    /**
     * 判断步骤是否与最常见路径不同
     */
    isStepDifferent(step, stepIndex) {
        if (!this.mostCommonPath || !this.mostCommonPath.nodes || !Array.isArray(this.mostCommonPath.nodes)) {
            return false;
        }
        
        const commonStep = this.mostCommonPath.nodes[stepIndex];
        if (!commonStep) {
            return false;
        }
        
        return step.level !== commonStep.level;
    }
}

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 全局函数：切换教育水平特点的展开/折叠状态
function toggleFeatures(featuresId) {
    const featuresContent = document.getElementById(featuresId);
    const toggleIcon = featuresContent.previousElementSibling.querySelector('.toggle-icon');
    
    if (featuresContent.style.display === 'none' || featuresContent.style.display === '') {
        featuresContent.style.display = 'block';
        toggleIcon.textContent = '▲';
        featuresContent.parentElement.classList.add('expanded');
    } else {
        featuresContent.style.display = 'none';
        toggleIcon.textContent = '▼';
        featuresContent.parentElement.classList.remove('expanded');
    }
}

// 初始化应用程序
document.addEventListener('DOMContentLoaded', () => {
    new EducationPathApp();
});
