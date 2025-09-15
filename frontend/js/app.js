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
            '幼儿园': ['公立', '普通私立', '民办双语'],
            '小学': ['公立', '普通私立', '民办双语'],
            '初中': ['公立', '普通私立', '民办双语'],
            '高中': ['公立', '民办普通高中', '公立国际部', '民办国际化学校', '海外高中'],
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

        // 重新规划按钮
        const resetPlanBtn = document.getElementById('resetPlanBtn');
        if (resetPlanBtn) {
            resetPlanBtn.addEventListener('click', () => {
                this.showFormSection();
            });
        }

        // 教育水平帮助按钮
        const educationLevelHelpBtn = document.getElementById('educationLevelHelpBtn');
        if (educationLevelHelpBtn) {
            educationLevelHelpBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showEducationLevelModal();
            });
        }

        // 模态框关闭按钮
        const closeModalBtn = document.getElementById('closeModalBtn');
        const modalConfirmBtn = document.getElementById('modalConfirmBtn');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                this.hideEducationLevelModal();
            });
        }
        if (modalConfirmBtn) {
            modalConfirmBtn.addEventListener('click', () => {
                this.hideEducationLevelModal();
            });
        }

        // 模态框背景点击关闭
        const educationLevelModal = document.getElementById('educationLevelModal');
        if (educationLevelModal) {
            educationLevelModal.addEventListener('click', (e) => {
                if (e.target === educationLevelModal) {
                    this.hideEducationLevelModal();
                }
            });
        }

        // 模态框内教育阶段选择器
        const stageTabsModal = document.getElementById('stageTabsModal');
        if (stageTabsModal) {
            stageTabsModal.addEventListener('click', (e) => {
                if (e.target.classList.contains('stage-tab')) {
                    // 移除所有active状态
                    stageTabsModal.querySelectorAll('.stage-tab').forEach(tab => {
                        tab.classList.remove('active');
                    });
                    // 添加当前选中的active状态
                    e.target.classList.add('active');
                    // 更新模态框内容
                    const selectedStage = e.target.dataset.stage;
                    this.updateModalLevelsComparison(selectedStage);
                }
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
        
        // 显示计算进度提示
        this.showCalculationProgress();
        
        // 显示统计信息
        this.displayStats(result);
        
        // 显示路径列表（默认显示可行路径）
        const feasiblePaths = this.getFilteredPaths();
        this.displayPaths(feasiblePaths);
        
        // 开始倒计时，确保内容完全渲染后滚动
        this.startCalculationCountdown();
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
                <div class="stat-label">不可行路线</div>
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
        
        // 设置基准路径为第一个路径，用于差异对比
        this.baselinePath = paths.length > 0 ? paths[0] : null;
        
        const pathsHTML = paths.map((path, index) => {
            return this.generatePathCard(path, index);
        }).join('');
        
        container.innerHTML = pathsHTML;
        
        // 绑定路径卡片展开收起事件
        this.bindPathToggleEvents();
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
            
            // 获取目标节点的费用信息（仅用于右上角显示）
            const targetCost = this.costCalculator.getStageCost(step.to.stage, step.to.level);
            
            return `
                <div class="path-step ${stepClass}">
                    <div class="step-header">
                        <span class="step-stage-level">${step.to.stage}-${step.to.level}</span>
                        <span class="step-total-cost">${targetCost ? `¥${this.costCalculator.formatCost(targetCost.costTotal)}` : '费用待定'}</span>
                    </div>
                    <div class="step-content">
                        ${targetCost ? `
                            <div class="step-duration-cost">
                                <span class="step-duration">持续${targetCost.duration}年</span>
                                <span class="step-yearly-cost">年均：¥${this.costCalculator.formatCost(targetCost.yearlyTotal)}</span>
                            </div>
                        ` : ''}
                        ${this.generateEducationLevelFeatures(step.to.stage, step.to.level)}
                    </div>
                    ${step.conditions ? `<div class="step-conditions">请注意约束条件："${step.conditions}"</div>` : ''}
                </div>
            `;
        }).join('');
        
        // 计算关键数据
        const totalCost = pathCost ? pathCost.total : 0;
        const prevalence = path.prevalence || 0;
        
        // 判断是否默认展开（所有路径默认收起）
        const isExpanded = false;
        const expandedClass = isExpanded ? 'expanded' : 'collapsed';
        
        return `
            <div class="path-card ${expandedClass}" data-path-index="${index}">
                <div class="path-header clickable" data-toggle-path="${index}">
                    <div class="path-info">
                        <div class="path-first-row">
                            <span class="path-title">路径 ${index + 1}</span>
                            <span class="path-cost">
                                <span class="cost-label">总费用</span>
                                <span class="cost-value">¥${this.costCalculator.formatCost(totalCost)}</span>
                            </span>
                        </div>
                        <div class="path-second-row">
                            <span class="path-description">${this.generatePathDescriptionWithDifferences(path, index)}</span>
                            <div class="path-toggle-icon">
                                <span class="toggle-arrow">▼</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="path-content">
                    <div class="path-steps">
                        ${currentStageCost && currentStageCost.remainingYears > 0 ? `
                            <!-- 当前阶段步骤卡片 -->
                            <div class="path-step current-stage-step">
                                <div class="step-header">
                                    <span class="step-stage-level">${currentStage}-${currentLevel}</span>
                                    <span class="step-total-cost">¥${this.costCalculator.formatCost(currentStageCost.total)}</span>
                                </div>
                                <div class="step-content">
                                    <div class="step-duration-cost">
                                        <span class="step-duration">持续${currentStageCost.remainingYears}年</span>
                                        <span class="step-yearly-cost">年均：¥${this.costCalculator.formatCost(currentStageCost.yearlyCost)}</span>
                                    </div>
                                    ${this.generateEducationLevelFeatures(currentStage, currentLevel)}
                                </div>
                            </div>
                        ` : ''}
                        ${steps}
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
        // 使用rankedPaths而不是allPaths，确保数据一致性
        const paths = this.rankedPaths.length > 0 ? this.rankedPaths : this.allPaths;
        
        if (this.currentFilter === 'all') {
            return paths;
        }
        
        return paths.filter(path => path.feasibility === this.currentFilter);
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
        // 保持基本信息录入区域显示，不隐藏
        const inputSection = document.querySelector('.input-section');
        // inputSection 保持显示状态
        
        // 移除已存在的重新规划按钮（因为不再需要）
        const existingBtn = document.getElementById('backToFormBtn');
        if (existingBtn) {
            existingBtn.remove();
        }
        
        // 显示结果区域
        this.resultsSection.style.display = 'block';
        this.strategicRoutesContainer.style.display = 'block';
        this.pathDetailsContainer.style.display = 'none';
        
        // 显示重新规划按钮
        const resetPlanBtn = document.getElementById('resetPlanBtn');
        if (resetPlanBtn) {
            resetPlanBtn.style.display = 'inline-block';
        }
        
        // 滚动到结果区域顶部
        this.resultsSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
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
                    <h3 class="section-subtitle infeasible-subtitle">不可行路线参考</h3>
                    <p class="infeasible-notice">以下路线在当前条件下不可行，仅供参考了解限制条件</p>
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
        const costRangeValue = this.personalizedContent.generateCostRangeValue(
            route.costRange.min,
            route.costRange.max
        );
        const costRangeSource = this.personalizedContent.generateDataSourceDescription(route.id);
        
        // 生成行动按钮文案
        const actionButtonText = `探索 ${route.pathCount || route.paths.length} 条具体路径 →`;
        
        // 确定卡片样式类
        const cardClass = isInfeasible ? 'strategic-route-card infeasible-route' : 'strategic-route-card';
        
        return `
            <div class="${cardClass}" data-route-id="${route.id}">
                <div class="route-header">
                    ${!isInfeasible ? `<h3 class="route-title">方向${directionNumber}：${template.name}</h3>` : ''}
                </div>
                
                <p class="route-description">"${personalizedDescription}"</p>
                
                <div class="route-cost-range">
                    <div class="cost-range-label">预估总费用</div>
                    <div class="cost-range-source">${costRangeSource}</div>
                    <div class="cost-range-value">${costRangeValue}</div>
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
     * 绑定路径卡片展开收起事件
     */
    bindPathToggleEvents() {
        const pathHeaders = document.querySelectorAll('.path-header[data-toggle-path]');
        pathHeaders.forEach(header => {
            header.addEventListener('click', (e) => {
                e.preventDefault();
                const pathIndex = header.dataset.togglePath;
                this.togglePathCard(pathIndex);
            });
        });
    }

    /**
     * 切换路径卡片的展开收起状态
     * @param {string|number} pathIndex 路径索引
     */
    togglePathCard(pathIndex) {
        const pathCard = document.querySelector(`.path-card[data-path-index="${pathIndex}"]`);
        if (!pathCard) return;
        
        const isExpanded = pathCard.classList.contains('expanded');
        
        if (isExpanded) {
            // 收起卡片
            pathCard.classList.remove('expanded');
            pathCard.classList.add('collapsed');
        } else {
            // 展开卡片
            pathCard.classList.remove('collapsed');
            pathCard.classList.add('expanded');
        }
    }

    /**
     * 显示路径详情
     */
    showPathDetails(routeId) {
        const route = this.strategicRoutes.find(r => r.id === routeId);
        if (!route) return;
        
        this.currentStrategicRoute = route;
        
        // 获取方向编号（排除不可行路线）
        const feasibleRoutes = this.strategicRoutes.filter(r => r.id !== 'infeasible_paths');
        const directionNumber = feasibleRoutes.findIndex(r => r.id === routeId) + 1;
        
        // 更新UI
        this.strategicRoutesContainer.style.display = 'none';
        this.pathDetailsContainer.style.display = 'block';
        this.pathDetailsTitle.textContent = `方向${directionNumber}：${route.name} - 具体路径`;
        
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
        console.log('About to call displayFilteredPaths, filteredPaths length:', this.filteredPaths.length);
        this.displayFilteredPaths();
        
        // 临时调试：强制显示路径数据
        console.log('sortedRoutePaths:', sortedRoutePaths);
        console.log('rankedPaths:', this.rankedPaths);
        console.log('filteredPaths:', this.filteredPaths);
        
        // 强制修复：如果filteredPaths为空，直接显示所有路径
        if (this.filteredPaths.length === 0 && sortedRoutePaths.length > 0) {
            console.log('Force fix: directly displaying all paths');
            this.filteredPaths = [...sortedRoutePaths];
            this.displayPaths(this.filteredPaths);
        }
        
        // 滚动到路径详情区域
        this.scrollToPathDetailsContainer();
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
     * 显示表单区域（重新规划）
     */
    showFormSection() {
        console.log('showFormSection 被调用');
        
        // 基本信息区域保持显示，不需要操作
        
        // 移除重新规划按钮（如果存在）
        const backToFormBtn = document.getElementById('backToFormBtn');
        if (backToFormBtn) {
            console.log('找到并移除重新规划按钮');
            backToFormBtn.remove();
        }
        
        // 隐藏结果区域
        this.resultsSection.style.display = 'none';
        
        // 隐藏重新规划按钮
        const resetPlanBtn = document.getElementById('resetPlanBtn');
        if (resetPlanBtn) {
            resetPlanBtn.style.display = 'none';
        }
        
        // 滚动到基本信息区域
        const inputSection = document.querySelector('.input-section');
        if (inputSection) {
            inputSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
        
        // 重置加载状态
        this.setLoadingState(false);
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
                    <li><strong>国内教育体系贯通路径</strong>：从幼儿园→小学→初中→高中→大学，全程在国内教育体系内完成</li>
                    <li><strong>海外教育体系直通路径</strong>：从国内教育转向国际教育，最终申请海外大学</li>
                    <li><strong>中期国际转轨路径</strong>：在初中或高中阶段从国内教育转向国际教育</li>
                    <li><strong>回国发展路径</strong>：先在国内完成基础教育，再出国深造，最后回国发展</li>
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
                </ul>
                
                <p>早期国际转轨路径的特点是在小学或初中阶段就转入国际教育体系，让孩子尽早适应国际化学习环境。每条路径都会详细显示：</p>
                <ul>
                    <li>每个教育阶段的具体安排</li>
                    <li>预估的总费用</li>
                    <li>各阶段的教育特点和要求</li>
                    <li>转换的可行性和条件</li>
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
            'late_transition': '中期国际转轨路径',
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
        const totalFeasibleRoutes = feasibleRoutes.length; // 只计算可行路线
        const totalPaths = this.strategicRoutes.reduce((sum, route) => sum + (route.paths ? route.paths.length : 0), 0);
        
        return `
            <div class="results-header">
                <h1 class="report-title">您的教育规划方案</h1>
                <p class="report-subtitle">基于您的现状和目标，我们为您推荐以下教育方向，每个方向都经过可行性验证。</p>
                

                <div class="key-metrics">
                    <div class="metric">
                        <span class="metric-label">可行的教育方向</span>
                        <strong class="metric-value">${totalFeasibleRoutes}</strong>
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
        try {
            console.log('generateEducationLevelFeatures called for:', stage, level);
            const featureInfo = this.educationLevelFeatures.getFullFeatureInfo(stage, level);
            console.log('featureInfo:', featureInfo);
            
            if (!featureInfo.hasInfo) {
                return '';
            }

            const formattedFeatures = this.educationLevelFeatures.formatFeatureText(featureInfo.features);
        const uniqueId = `features-${stage}-${level}-${Math.random().toString(36).substr(2, 9)}`;
        
        return `
            <div class="education-level-features">
                <div class="features-header">
                    <div class="features-title">
                        <span class="features-label">核心特点</span>
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
        } catch (error) {
            console.error('Error in generateEducationLevelFeatures:', error);
            return '';
        }
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
        
        // 初始化展开收起功能
        this.initializeFiltersToggle();
        
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

        // 阶段选择变化时更新水平选择器并触发筛选
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
            
            // 触发筛选更新
            this.debouncedApplyFilters();
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
        // 教育水平筛选器（阶段筛选器已在initializeEducationStageFilters中处理）
        const levelSelect = document.getElementById('levelSelect');
        
        if (levelSelect) {
            levelSelect.addEventListener('change', () => {
                this.debouncedApplyFilters();
            });
        }
        
        // 费用区间筛选器
        const costInputs = document.querySelectorAll('.cost-range-input');
        costInputs.forEach(input => {
            input.addEventListener('input', () => {
                this.updateCostRangeDisplay();
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
        console.log('displayFilteredPaths called with filteredPaths length:', this.filteredPaths.length);
        const countElement = document.getElementById('filteredPathsCount');
        if (countElement) {
            countElement.textContent = this.filteredPaths.length;
        }
        
        if (this.filteredPaths.length === 0) {
            console.log('No filtered paths, displaying no results');
            this.displayNoResults();
        } else {
            console.log('Calling displayPaths with', this.filteredPaths.length, 'filtered paths');
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

    /**
     * 生成带差异标记的路径描述
     * @param {Object} path - 当前路径对象
     * @param {number} pathIndex - 路径索引
     * @returns {string} - 带HTML标记的路径描述
     */
    generatePathDescriptionWithDifferences(path, pathIndex) {
        // 第一个路径作为基准，不显示差异
        if (pathIndex === 0 || !this.baselinePath) {
            return path.description || '教育路径';
        }
        
        // 获取基准路径和当前路径的节点
        const baselineNodes = this.baselinePath.nodes || [];
        const currentNodes = path.nodes || [];
        
        // 生成路径描述数组
        const pathSegments = [];
        
        // 遍历当前路径的每个节点
        currentNodes.forEach((node, index) => {
            const nodeDescription = `${node.stage}-${node.level}`;
            
            // 检查是否与基准路径的对应节点不同
            const isDifferent = this.isNodeDifferent(node, index, baselineNodes);
            
            if (isDifferent) {
                pathSegments.push(`<span class="path-difference">${nodeDescription}</span>`);
            } else {
                pathSegments.push(nodeDescription);
            }
        });
        
        return pathSegments.join(' → ');
    }

    /**
     * 检查节点是否与基准路径不同
     * @param {Object} node - 当前节点
     * @param {number} nodeIndex - 节点索引
     * @param {Array} baselineNodes - 基准路径节点数组
     * @returns {boolean} - 是否不同
     */
    isNodeDifferent(node, nodeIndex, baselineNodes) {
        // 如果基准路径不存在对应位置的节点，认为不同
        if (!baselineNodes || nodeIndex >= baselineNodes.length) {
            return true;
        }
        
        const baselineNode = baselineNodes[nodeIndex];
        
        // 比较节点的 stage 和 level
        return node.stage !== baselineNode.stage || node.level !== baselineNode.level;
    }

    /**
     * 初始化筛选器展开收起功能
     */
    initializeFiltersToggle() {
        const toggleBtn = document.getElementById('toggleFiltersBtn');
        const filtersHeader = document.getElementById('filtersHeader');
        const filtersContent = document.getElementById('filtersContent');
        
        if (!toggleBtn || !filtersHeader || !filtersContent) return;
        
        // 设置默认收起状态
        filtersContent.classList.add('collapsed');
        filtersContent.style.display = 'none';
        filtersHeader.classList.remove('expanded');
        
        // 移除旧的事件监听器（如果存在）
        filtersHeader.removeEventListener('click', this.filtersToggleHandler);
        
        // 创建事件处理函数并保存引用
        this.filtersToggleHandler = () => {
            const isExpanded = filtersHeader.classList.contains('expanded');
            
            if (isExpanded) {
                // 收起
                filtersContent.classList.remove('expanded');
                filtersContent.classList.add('collapsed');
                filtersHeader.classList.remove('expanded');
                toggleBtn.textContent = '▶';
                
                // 使用动画收起
                setTimeout(() => {
                    filtersContent.style.display = 'none';
                }, 300);
            } else {
                // 展开
                filtersContent.style.display = 'block';
                filtersContent.classList.remove('collapsed');
                filtersContent.classList.add('expanded');
                filtersHeader.classList.add('expanded');
                toggleBtn.textContent = '▼';
            }
        };
        
        // 绑定到标题区域和图标
        filtersHeader.addEventListener('click', this.filtersToggleHandler);
    }

    /**
     * 滚动到路径详情容器
     */
    scrollToPathDetailsContainer() {
        // 等待DOM更新完成
        setTimeout(() => {
            const pathDetailsContainer = document.getElementById('pathDetailsContainer');
            if (pathDetailsContainer) {
                // 使用平滑滚动到路径详情容器顶部，包含返回按钮、标题等完整区域
                pathDetailsContainer.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'nearest'
                });
            }
        }, 100); // 短暂延迟确保内容已渲染
    }

    /**
     * 显示计算进度提示
     */
    showCalculationProgress() {
        // 创建计算进度遮罩
        const progressOverlay = document.createElement('div');
        progressOverlay.id = 'calculationProgress';
        progressOverlay.innerHTML = `
            <div class="calculation-overlay">
                <div class="calculation-content">
                    <div class="calculation-spinner"></div>
                    <div class="calculation-text">正在计算教育路径方案...</div>
                    <div class="calculation-countdown">
                        <span id="countdownNumber">3</span>秒后展示结果
                    </div>
                </div>
            </div>
        `;
        
        // 添加样式
        progressOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            backdrop-filter: blur(5px);
        `;
        
        document.body.appendChild(progressOverlay);
        
        // 添加CSS动画样式
        const style = document.createElement('style');
        style.textContent = `
            .calculation-overlay {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
            }
            .calculation-content {
                text-align: center;
                background: white;
                padding: 2rem;
                border-radius: 16px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
                border: 1px solid #e5e7eb;
            }
            .calculation-spinner {
                width: 40px;
                height: 40px;
                border: 3px solid #f3f4f6;
                border-top: 3px solid #01BCD6;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 1rem;
            }
            .calculation-text {
                font-size: 1.1rem;
                color: #374151;
                margin-bottom: 0.5rem;
                font-weight: 500;
            }
            .calculation-countdown {
                font-size: 0.9rem;
                color: #6b7280;
            }
            #countdownNumber {
                font-weight: bold;
                color: #01BCD6;
                font-size: 1.2rem;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * 开始计算倒计时
     */
    startCalculationCountdown() {
        let countdown = 3;
        const countdownElement = document.getElementById('countdownNumber');
        
        const countdownInterval = setInterval(() => {
            countdown--;
            if (countdownElement) {
                countdownElement.textContent = countdown;
            }
            
            if (countdown <= 0) {
                clearInterval(countdownInterval);
                // 移除进度提示
                this.hideCalculationProgress();
                // 执行滚动
                this.scrollToResultsSection();
            }
        }, 1000);
    }

    /**
     * 隐藏计算进度提示
     */
    hideCalculationProgress() {
        const progressOverlay = document.getElementById('calculationProgress');
        if (progressOverlay) {
            progressOverlay.style.opacity = '0';
            progressOverlay.style.transform = 'scale(0.95)';
            progressOverlay.style.transition = 'all 0.3s ease-out';
            
            setTimeout(() => {
                progressOverlay.remove();
            }, 300);
        }
    }

    /**
     * 滚动到结果区域
     */
    scrollToResultsSection() {
        // 使用多重检查确保滚动到正确位置
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                this.resultsSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'nearest'
                });
            });
        });
    }

    /**
     * 显示教育水平特点模态框
     */
    showEducationLevelModal() {
        try {
            console.log('显示教育水平模态框');
            const modal = document.getElementById('educationLevelModal');
            console.log('模态框元素:', modal);
            
            if (modal) {
                modal.style.display = 'flex';
                // 初始化显示幼儿园阶段的数据
                this.updateModalLevelsComparison('幼儿园');
                
                // 阻止页面滚动
                document.body.style.overflow = 'hidden';
                
                // 添加ESC键关闭功能
                this.modalEscHandler = (e) => {
                    if (e.key === 'Escape') {
                        this.hideEducationLevelModal();
                    }
                };
                document.addEventListener('keydown', this.modalEscHandler);
                console.log('模态框显示成功');
            } else {
                console.error('找不到模态框元素');
            }
        } catch (error) {
            console.error('显示模态框时出错:', error);
        }
    }

    /**
     * 隐藏教育水平特点模态框
     */
    hideEducationLevelModal() {
        const modal = document.getElementById('educationLevelModal');
        if (modal) {
            modal.style.display = 'none';
            
            // 恢复页面滚动
            document.body.style.overflow = '';
            
            // 移除ESC键监听器
            if (this.modalEscHandler) {
                document.removeEventListener('keydown', this.modalEscHandler);
                this.modalEscHandler = null;
            }
        }
    }

    /**
     * 更新模态框中的教育水平对比内容
     */
    updateModalLevelsComparison(stage) {
        let levels;
        try {
            console.log('更新模态框内容，阶段:', stage);
            const levelsComparison = document.getElementById('levelsComparison');
            console.log('levelsComparison元素:', levelsComparison);
            
            if (!levelsComparison) {
                console.error('找不到levelsComparison元素');
                return;
            }

            // 获取该阶段的所有教育水平
            levels = this.stageLevelMapping[stage] || [];
            console.log('该阶段的教育水平:', levels);
            
            if (levels.length === 0) {
                levelsComparison.innerHTML = '<p class="text-muted">该阶段暂无详细特点信息</p>';
                return;
            }

            // 生成每个教育水平的卡片
            const levelCards = levels.map(level => {
                console.log(`获取 ${stage}-${level} 的特点信息`);
                const featureInfo = this.educationLevelFeatures.getFullFeatureInfo(stage, level);
                console.log(`${stage}-${level} 特点信息:`, featureInfo);
                
                if (!featureInfo || !featureInfo.hasInfo) {
                    return `
                        <div class="level-card">
                            <div class="level-header">
                                <h4 class="level-name">${level}</h4>
                            </div>
                            <div class="level-features">
                                暂无详细特点信息
                            </div>
                        </div>
                    `;
                }

                // 处理特点文本，转换Markdown样式的粗体为HTML
                const formattedFeatures = featureInfo.features ? featureInfo.features.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') : '暂无特点信息';

                return `
                    <div class="level-card">
                        <div class="level-header">
                            <h4 class="level-name">${level}</h4>
                            <span class="level-badge">${stage}</span>
                        </div>
                        <div class="level-features">
                            ${formattedFeatures}
                        </div>
                        <div class="level-meta">
                            <div class="meta-item">
                                <span class="meta-label">国籍要求：</span>
                                <span class="meta-value">${featureInfo.nationalityRequirement || '无特殊要求'}</span>
                            </div>
                            <div class="meta-item">
                                <span class="meta-label">学籍情况：</span>
                                <span class="meta-value">${featureInfo.studentStatus === '有' ? '有国内学籍' : featureInfo.studentStatus === '无' ? '无国内学籍' : featureInfo.studentStatus}</span>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            console.log('生成的HTML内容长度:', levelCards.length);
            console.log('生成的HTML内容预览:', levelCards.substring(0, 200));
            const levelsComparison = document.getElementById('levelsComparison');
            levelsComparison.innerHTML = levelCards;
            console.log('模态框内容更新完成');
        } catch (error) {
            console.error('更新模态框内容时出错:', error);
        }
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
