document.addEventListener('DOMContentLoaded', () => {
    const uiElements = {
        balanceDisplay: document.getElementById('balanceAmount'),
        diamondBalanceDisplay: document.getElementById('diamondBalance'),
        energyBar: document.getElementById('energyBar'),
        energyInfo: document.getElementById('energyInfo'),
        languageBtn: document.getElementById('languageSwitchBtn'),
        boostLevelDisplay: document.getElementById('boostLevel'),
        multiplierDisplay: document.getElementById('clickMultiplier'),
        coinBoostLevelDisplay: document.getElementById('coinBoostLevel'),
        purchaseNotification: document.getElementById('purchaseNotification'),
        copyInviteNotification: document.getElementById('copyInviteNotification'),
        clickableImg: document.getElementById('clickableImg'),
        navButtons: document.querySelectorAll('.menu button'),
        contentScreens: document.querySelectorAll('.screen-content'),
        splashScreen: document.querySelector('.splash-screen'),
        mainContainer: document.querySelector('.container'),
        levelFloatingBtn: document.getElementById('levelFloatingBtn'),
        confirmUpgradeBtn: document.getElementById('confirmUpgradeBtn'),
        cancelUpgradeBtn: document.getElementById('cancelUpgradeBtn'),
        upgradeModal: document.getElementById('upgradeConfirmation'),
        fillEnergyBtn: document.getElementById('fillEnergyBtn'),
        withdrawBtn: document.getElementById('withdrawBtn'),
        withdrawalForm: document.getElementById('withdrawalForm'),
        confirmWithdrawalBtn: document.getElementById('confirmWithdrawalBtn'),
        maxWithdrawBtn: document.getElementById('maxWithdrawBtn'),
        withdrawAmountInput: document.getElementById('withdrawAmount'),
        userTelegramNameDisplay: document.getElementById('userTelegramName'),
        userTelegramIdDisplay: document.getElementById('userTelegramId'),
        taskTwoBtn: document.getElementById('taskTwoBtn'),
        taskThreeBtn: document.getElementById('taskThreeBtn'),
        taskTwoProgress: document.getElementById('taskTwoProgress'),
        taskThreeProgress: document.getElementById('taskThreeProgress'),
        levelInfoDisplay: document.getElementById('currentLevelInfo') || { innerText: '' },
        friendsListDisplay: document.getElementById('friendsList') || { innerHTML: '' },
        displayedLevel: document.getElementById('displayedLevel'),
        currentLevelName: document.getElementById('currentLevelName'),
        levelOneProgress: document.getElementById('levelOneProgress'),
        levelTwoProgress: document.getElementById('levelTwoProgress'),
        levelThreeProgress: document.getElementById('levelThreeProgress'),
        levelFourProgress: document.getElementById('levelFourProgress'),
        levelFiveProgress: document.getElementById('levelFiveProgress'),
        levelSixProgress: document.getElementById('levelSixProgress'),
        levelSevenProgress: document.getElementById('levelSevenProgress'),
        levelEightProgress: document.getElementById('levelEightProgress'),
        levelNineProgress: document.getElementById('levelNineProgress'),
        levelTenProgress: document.getElementById('levelTenProgress'),
        boostUpgradeBtn: document.getElementById('boostUpgradeBtn'),
        coinUpgradeBtn: document.getElementById('coinUpgradeBtn'),
        fillEnergyUpgradeBtn: document.getElementById('fillEnergyBtn'),
        inviteFriendsBtn: document.getElementById('inviteFriendsBtn'),
        copyInviteLinkBtn: document.getElementById('copyInviteLinkBtn'),
    };

    let gameState = {
        balance: parseInt(localStorage.getItem('balance')) || 0,
        diamonds: parseInt(localStorage.getItem('diamonds')) || 0,
        energy: parseInt(localStorage.getItem('energy')) || 10000,
        maxEnergy: parseInt(localStorage.getItem('maxEnergy')) || 10000,
        clickMultiplier: parseInt(localStorage.getItem('clickMultiplier')) || 1,
        boostLevel: parseInt(localStorage.getItem('boostLevel')) || 1,
        coinBoostLevel: parseInt(localStorage.getItem('coinBoostLevel')) || 1,
        energyBoostLevel: parseInt(localStorage.getItem('energyBoostLevel')) || 1,
        currentLevel: parseInt(localStorage.getItem('currentLevel')) || 1,
        friends: JSON.parse(localStorage.getItem('friends')) || [],
        fillEnergyCount: parseInt(localStorage.getItem('fillEnergyCount')) || 0,
        lastFillTime: parseInt(localStorage.getItem('lastFillTime')) || Date.now(),
        lastLoginTime: parseInt(localStorage.getItem('lastLoginTime')) || Date.now(),
        lastEnergyRecovery: parseInt(localStorage.getItem('lastEnergyRecovery')) || Date.now()
    };

    const levelThresholds = [
        { level: 1, threshold: 100000, name: 'Starter' },
        { level: 2, threshold: 300000, name: 'Novice' },
        { level: 3, threshold: 700000, name: 'Intermediate' },
        { level: 4, threshold: 1000000, name: 'Advanced' },
        { level: 5, threshold: 2000000, name: 'Bronze' },
        { level: 6, threshold: 4000000, name: 'Silver' },
        { level: 7, threshold: 7000000, name: 'Gold' },
        { level: 8, threshold: 10000000, name: 'Platinum' },
        { level: 9, threshold: 15000000, name: 'Diamond' },
        { level: 10, threshold: 20000000, name: 'Elite' },
    ];

    function initializeApp() {
        setTimeout(() => {
            if (uiElements.splashScreen) uiElements.splashScreen.style.display = 'none';
            if (uiElements.mainContainer) uiElements.mainContainer.style.display = 'flex';
        }, 2000);

        updateEnergyBasedOnElapsedTime();
        checkEnergyFill();
        updateUI();
        loadFriendsList();
        registerEventHandlers();
        startEnergyRecovery();
        initializeTelegramIntegration();
    }

    function updateUI() {
        if (uiElements.balanceDisplay) {
            uiElements.balanceDisplay.innerText = formatNumber(gameState.balance);
        }

        if (uiElements.diamondBalanceDisplay) {
            uiElements.diamondBalanceDisplay.innerText = formatNumber(gameState.diamonds);
        }

        const energyPercent = (gameState.energy / gameState.maxEnergy) * 100;
        if (uiElements.energyBar) {
            uiElements.energyBar.style.width = `${energyPercent}%`;
        }

        if (uiElements.energyInfo) {
            uiElements.energyInfo.innerText = `${formatNumber(gameState.energy)}/${formatNumber(gameState.maxEnergy)}⚡`;
        }

        if (uiElements.currentLevelName) {
            uiElements.currentLevelName.innerText = levelThresholds[gameState.currentLevel - 1].name;
        }

        localStorage.setItem('balance', gameState.balance);
        localStorage.setItem('diamonds', gameState.diamonds);
        localStorage.setItem('energy', gameState.energy);
        localStorage.setItem('maxEnergy', gameState.maxEnergy);
        localStorage.setItem('clickMultiplier', gameState.clickMultiplier);
        localStorage.setItem('boostLevel', gameState.boostLevel);
        localStorage.setItem('coinBoostLevel', gameState.coinBoostLevel);
        localStorage.setItem('energyBoostLevel', gameState.energyBoostLevel);
        localStorage.setItem('currentLevel', gameState.currentLevel);
        localStorage.setItem('fillEnergyCount', gameState.fillEnergyCount);
        localStorage.setItem('lastFillTime', gameState.lastFillTime);
        localStorage.setItem('lastLoginTime', Date.now());

        updateBoostsDisplay();
        updateTasksProgress();
        updateLevelDisplay();
    }

    function formatNumber(value) {
        if (value >= 1_000_000_000) {
            return `${(value / 1_000_000_000).toFixed(2)}B`;
        } else if (value >= 1_000_000) {
            return `${(value / 1_000_000).toFixed(2)}M`;
        } else if (value >= 1_000) {
            return `${(value / 1_000).toFixed(1)}K`;
        } else {
            return value.toLocaleString();
        }
    }

    function registerEventHandlers() {
        if (uiElements.clickableImg) {
            uiElements.clickableImg.addEventListener('click', handleClick);
            uiElements.clickableImg.addEventListener('touchstart', handleClick);
        }

        if (uiElements.navButtons) {
            uiElements.navButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const targetScreen = button.getAttribute('data-target');
                    navigateToScreen(targetScreen);
                });
            });
        }

        if (uiElements.levelFloatingBtn) {
            uiElements.levelFloatingBtn.addEventListener('click', () => {
                navigateToScreen('levelPage');
                if (uiElements.levelInfoDisplay) {
                    uiElements.levelInfoDisplay.innerText = `You are currently on level ${gameState.currentLevel}`;
                }
                if (uiElements.displayedLevel) {
                    uiElements.displayedLevel.innerText = gameState.currentLevel;
                }
            });
        }

        if (uiElements.confirmUpgradeBtn) {
            uiElements.confirmUpgradeBtn.addEventListener('click', confirmUpgradeAction);
        }

        if (uiElements.cancelUpgradeBtn) {
            uiElements.cancelUpgradeBtn.addEventListener('click', () => {
                if (uiElements.upgradeModal) uiElements.upgradeModal.style.display = 'none';
            });
        }

        if (uiElements.fillEnergyBtn) {
            uiElements.fillEnergyBtn.addEventListener('click', fillEnergyAction);
        }

        if (uiElements.boostUpgradeBtn) {
            uiElements.boostUpgradeBtn.addEventListener('click', () => {
                showUpgradeModal('boost');
            });
        }

        if (uiElements.coinUpgradeBtn) {
            uiElements.coinUpgradeBtn.addEventListener('click', () => {
                showUpgradeModal('coin');
            });
        }

        if (uiElements.fillEnergyUpgradeBtn) {
            uiElements.fillEnergyUpgradeBtn.addEventListener('click', () => {
                showUpgradeModal('energy');
            });
        }

        if (uiElements.taskTwoBtn) {
            uiElements.taskTwoBtn.addEventListener('click', () => claimTaskReward(3));
        }

        if (uiElements.taskThreeBtn) {
            uiElements.taskThreeBtn.addEventListener('click', () => claimTaskReward(10));
        }

        if (uiElements.withdrawBtn) {
            uiElements.withdrawBtn.addEventListener('click', () => {
                if (uiElements.withdrawalForm) {
                    uiElements.withdrawalForm.style.display = uiElements.withdrawalForm.style.display === 'none' ? 'block' : 'none';
                }
            });
        }

        if (uiElements.confirmWithdrawalBtn) {
            uiElements.confirmWithdrawalBtn.addEventListener('click', () => {
                showNotification(uiElements.purchaseNotification, 'Coming soon');
            });
        }

        if (uiElements.languageBtn) {
            uiElements.languageBtn.addEventListener('click', () => {
                showNotification(uiElements.purchaseNotification, 'Language switch coming soon!');
            });
        }

        if (uiElements.inviteFriendsBtn) {
            uiElements.inviteFriendsBtn.addEventListener('click', shareInTelegram);
        }

        if (uiElements.copyInviteLinkBtn) {
            uiElements.copyInviteLinkBtn.addEventListener('click', copyInviteLink);
        }

        if (uiElements.maxWithdrawBtn) {
            uiElements.maxWithdrawBtn.addEventListener('click', () => {
                if (uiElements.withdrawAmountInput) {
                    uiElements.withdrawAmountInput.value = gameState.balance;
                }
            });
        }
    }

    function showNotification(notificationElement, message) {
        if (!notificationElement) return;
        notificationElement.innerText = message;
        notificationElement.classList.add('show');
        setTimeout(() => {
            notificationElement.classList.remove('show');
        }, 3000);
    }

    function confirmUpgradeAction() {
        let cost;
        let upgradeType = uiElements.upgradeModal.getAttribute('data-upgrade-type');

        if (upgradeType === 'boost') {
            cost = gameState.boostLevel * 2000 + 500;
        } else if (upgradeType === 'coin') {
            cost = gameState.coinBoostLevel * 2000 + 500;
        } else if (upgradeType === 'energy') {
            cost = gameState.fillEnergyCount * 2000 + 500;
        }

        if (gameState.balance >= cost) {
            gameState.balance -= cost;

            if (upgradeType === 'boost') {
                gameState.boostLevel += 1;
                gameState.clickMultiplier += 1;
            } else if (upgradeType === 'coin') {
                gameState.coinBoostLevel += 1;
                gameState.maxEnergy += 5000;
            } else if (upgradeType === 'energy') {
                gameState.fillEnergyCount += 1;
            }

            updateUI();
            showNotification(uiElements.purchaseNotification, `Successfully upgraded!`);
        } else {
            showNotification(uiElements.purchaseNotification, `Not enough coins!`);
        }
        if (uiElements.upgradeModal) uiElements.upgradeModal.style.display = 'none';
    }

    function showUpgradeModal(upgradeType) {
        if (uiElements.upgradeModal) {
            uiElements.upgradeModal.style.display = 'block';
            uiElements.upgradeModal.setAttribute('data-upgrade-type', upgradeType);

            let cost;
            if (upgradeType === 'boost') {
                cost = gameState.boostLevel * 2000 + 500;
                if (uiElements.upgradeText) uiElements.upgradeText.innerText = `Are you sure you want to upgrade your click multiplier? It will cost ${cost} coins.`;
            } else if (upgradeType === 'coin') {
                cost = gameState.coinBoostLevel * 2000 + 500;
                if (uiElements.upgradeText) uiElements.upgradeText.innerText = `Are you sure you want to upgrade your max coins? It will cost ${cost} coins.`;
            } else if (upgradeType === 'energy') {
                cost = gameState.fillEnergyCount * 2000 + 500;
                if (uiElements.upgradeText) uiElements.upgradeText.innerText = `Are you sure you want to upgrade your energy fill? It will cost ${cost} coins.`;
            }
        }
    }

    function fillEnergyAction() {
        if (gameState.fillEnergyCount < 3) {
            gameState.energy = gameState.maxEnergy;
            gameState.fillEnergyCount += 1;
            updateUI();
            showNotification(uiElements.purchaseNotification, 'Energy filled!');
        } else {
            showNotification(uiElements.purchaseNotification, 'No more fills available for now!');
        }
    }

    function handleClick(event) {
        const touchPoints = event.touches || [event];
        for (let i = 0; i < touchPoints.length; i++) {
            const touch = touchPoints[i];
            createDiamondCoinEffect(touch.pageX, touch.pageY);
        }

        if (gameState.energy >= gameState.clickMultiplier * touchPoints.length) {
            gameState.balance += gameState.clickMultiplier * touchPoints.length;
            gameState.energy -= gameState.clickMultiplier * touchPoints.length;
            updateUI();
        } else {
            showNotification(uiElements.purchaseNotification, 'Not enough energy!');
        }
    }

    function createDiamondCoinEffect(x, y) {
        const diamond = document.createElement('div');
        diamond.classList.add('diamond-coin');
        const multiplierText = document.createElement('span');
        multiplierText.textContent = `+${gameState.clickMultiplier}`;
        diamond.appendChild(multiplierText);
        document.body.appendChild(diamond);

        diamond.style.left = `${x - 15}px`; // Adjust for the diamond size
        diamond.style.top = `${y - 15}px`;

        const balanceRect = uiElements.balanceDisplay.getBoundingClientRect();

        setTimeout(() => {
            diamond.style.transform = `translate(${balanceRect.left - x}px, ${balanceRect.top - y}px) scale(1)`;
            setTimeout(() => {
                diamond.remove();
            }, 1000);
        }, 50);
    }

    function navigateToScreen(screenId) {
        if (uiElements.contentScreens) {
            uiElements.contentScreens.forEach(screen => {
                screen.classList.remove('active');
            });
        }
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) targetScreen.classList.add('active');

        if (screenId === 'boostsPage') {
            if (uiElements.boostUpgradeBtn) uiElements.boostUpgradeBtn.style.display = 'block';
            if (uiElements.coinUpgradeBtn) uiElements.coinUpgradeBtn.style.display = 'block';
            if (uiElements.fillEnergyUpgradeBtn) uiElements.fillEnergyUpgradeBtn.style.display = 'block';
        } else {
            if (uiElements.boostUpgradeBtn) uiElements.boostUpgradeBtn.style.display = 'none';
            if (uiElements.coinUpgradeBtn) uiElements.coinUpgradeBtn.style.display = 'none';
            if (uiElements.fillEnergyUpgradeBtn) uiElements.fillEnergyUpgradeBtn.style.display = 'none';
        }
    }

    function startEnergyRecovery() {
        const energyRecoveryInterval = setInterval(() => {
            const currentTime = Date.now();
            const elapsedTime = currentTime - gameState.lastEnergyRecovery;

            const energyToAdd = Math.floor(elapsedTime / (2 * 60 * 60 * 1000) * gameState.maxEnergy);
            if (energyToAdd > 0) {
                gameState.energy = Math.min(gameState.energy + energyToAdd, gameState.maxEnergy);
                gameState.lastEnergyRecovery = currentTime;
                updateUI();
            }
        }, 1000);

        window.addEventListener('beforeunload', () => {
            clearInterval(energyRecoveryInterval);
        });
    }

    function updateEnergyBasedOnElapsedTime() {
        const currentTime = Date.now();
        const elapsedTime = currentTime - gameState.lastEnergyRecovery;

        const energyToAdd = Math.floor(elapsedTime / (2 * 60 * 60 * 1000) * gameState.maxEnergy);
        if (energyToAdd > 0) {
            gameState.energy = Math.min(gameState.energy + energyToAdd, gameState.maxEnergy);
            gameState.lastEnergyRecovery = currentTime;
            updateUI();
        }
    }

    function checkEnergyFill() {
        const currentTime = Date.now();
        const eightHours = 8 * 60 * 60 * 1000;
        if (currentTime - gameState.lastFillTime >= eightHours) {
            gameState.fillEnergyCount = 0;
            updateUI();
        }
    }

    function updateLevelDisplay() {
        checkForLevelUp();
        if (uiElements.levelInfoDisplay) {
            uiElements.levelInfoDisplay.innerText = `You are currently on level ${gameState.currentLevel}`;
        }
        document.querySelectorAll('.level-item').forEach(item => {
            item.classList.remove('current-level');
        });
        const currentLevelElement = document.getElementById(`level${gameState.currentLevel}`);
        if (currentLevelElement) currentLevelElement.classList.add('current-level'); // إضافة حواف فضية للمستوى الحالي

        if (uiElements.levelOneProgress) uiElements.levelOneProgress.style.width = `${(gameState.balance / levelThresholds[0].threshold) * 100}%`;
        if (uiElements.levelTwoProgress) uiElements.levelTwoProgress.style.width = `${(gameState.balance / levelThresholds[1].threshold) * 100}%`;
        if (uiElements.levelThreeProgress) uiElements.levelThreeProgress.style.width = `${(gameState.balance / levelThresholds[2].threshold) * 100}%`;
        if (uiElements.levelFourProgress) uiElements.levelFourProgress.style.width = `${(gameState.balance / levelThresholds[3].threshold) * 100}%`;
        if (uiElements.levelFiveProgress) uiElements.levelFiveProgress.style.width = `${(gameState.balance / levelThresholds[4].threshold) * 100}%`;
        if (uiElements.levelSixProgress) uiElements.levelSixProgress.style.width = `${(gameState.balance / levelThresholds[5].threshold) * 100}%`;
        if (uiElements.levelSevenProgress) uiElements.levelSevenProgress.style.width = `${(gameState.balance / levelThresholds[6].threshold) * 100}%`;
        if (uiElements.levelEightProgress) uiElements.levelEightProgress.style.width = `${(gameState.balance / levelThresholds[7].threshold) * 100}%`;
        if (uiElements.levelNineProgress) uiElements.levelNineProgress.style.width = `${(gameState.balance / levelThresholds[8].threshold) * 100}%`;
        if (uiElements.levelTenProgress) uiElements.levelTenProgress.style.width = `${(gameState.balance / levelThresholds[9].threshold) * 100}%`;
    }

    function checkForLevelUp() {
        for (let i = 0; i < levelThresholds.length; i++) {
            if (gameState.balance >= levelThresholds[i].threshold && gameState.currentLevel < levelThresholds[i].level) {
                gameState.currentLevel = levelThresholds[i].level;
                gameState.balance += levelThresholds[i].threshold;
                showNotification(uiElements.purchaseNotification, `Upgraded to level ${gameState.currentLevel}! ${formatNumber(levelThresholds[i].threshold)} coins added to your balance.`);
            }
        }
    }

    function updateBoostsDisplay() {
        if (uiElements.boostLevelDisplay) {
            uiElements.boostLevelDisplay.innerText = gameState.boostLevel;
        }
        if (uiElements.multiplierDisplay) {
            uiElements.multiplierDisplay.innerText = gameState.clickMultiplier;
        }
        if (uiElements.coinBoostLevelDisplay) {
            uiElements.coinBoostLevelDisplay.innerText = gameState.coinBoostLevel;
        }
    }

    function loadFriendsList() {
        if (uiElements.friendsListDisplay) {
            uiElements.friendsListDisplay.innerHTML = '';
            if (gameState.friends.length === 0) {
                uiElements.friendsListDisplay.innerHTML = '<li>No friends yet.</li>';
            } else {
                gameState.friends.forEach(friend => {
                    const li = document.createElement('li');
                    li.innerText = `${friend.name} - ${formatNumber(friend.coins)}`;
                    uiElements.friendsListDisplay.appendChild(li);
                });
            }
        }
    }

    function updateTasksProgress() {
        if (uiElements.taskTwoProgress) {
            uiElements.taskTwoProgress.innerText = `${gameState.friends.length}/3`;
        }
        if (uiElements.taskThreeProgress) {
            uiElements.taskThreeProgress.innerText = `${gameState.friends.length}/10`;
        }

        updateTaskBtnState(uiElements.taskTwoBtn, gameState.friends.length >= 3);
        updateTaskBtnState(uiElements.taskThreeBtn, gameState.friends.length >= 10);
    }

    function updateTaskBtnState(button, isActive) {
        if (button) {
            if (isActive) {
                button.classList.remove('inactive');
            } else {
                button.classList.add('inactive');
            }
        }
    }

    function claimTaskReward(friendsRequired) {
        const friendsCount = gameState.friends.length;

        if (friendsCount >= friendsRequired) {
            let reward = 0;
            if (friendsRequired === 3) {
                reward = 100000;
            } else if (friendsRequired === 10) {
                reward = 1000000;
            }

            gameState.balance += reward;
            updateUI();
            showNotification(uiElements.purchaseNotification, `Successfully claimed ${formatNumber(reward)} reward!`);
        } else {
            showNotification(uiElements.purchaseNotification, `Invite ${friendsRequired - friendsCount} more friends to claim the reward.`);
        }
    }

    function copyInviteLink() {
        const inviteLink = `https://t.me/Xocoin_Bot/Xocoin?start=${uiElements.userTelegramIdDisplay?.innerText || ''}`;
        navigator.clipboard.writeText(inviteLink).then(() => {
            showNotification(uiElements.copyInviteNotification, 'Invite link copied!');
        }).catch(err => {
            showNotification(uiElements.purchaseNotification, 'Failed to copy invite link.');
        });
    }

    function shareInTelegram() {
        const inviteLink = `https://t.me/Xocoin_Bot/Xocoin?start=${uiElements.userTelegramIdDisplay?.innerText || ''}`;
        const message = `Join the game and earn rewards! Click the link to start: ${inviteLink}`;

        window.Telegram.WebApp.sendData(JSON.stringify({
            type: 'share',
            message: message
        }));
    }

    function initializeTelegramIntegration() {
        const telegramApp = window.Telegram.WebApp;

        telegramApp.ready();
        if (uiElements.userTelegramNameDisplay) {
            uiElements.userTelegramNameDisplay.innerText = telegramApp.initDataUnsafe.user?.username || '';
        }
        if (uiElements.userTelegramIdDisplay) {
            uiElements.userTelegramIdDisplay.innerText = telegramApp.initDataUnsafe.user?.id || '';
        }

        if (telegramApp.colorScheme === 'dark') {
            document.documentElement.style.setProperty('--background-color-dark', '#000000');
            document.documentElement.style.setProperty('--text-color-dark', '#ffffff');
        }

        telegramApp.onEvent('share', () => {
            gameState.balance += 20000;
            gameState.diamonds += 10000;

            // تحديث حالة الأصدقاء
            const newFriend = {
                id: telegramApp.initDataUnsafe.user?.id,
                name: telegramApp.initDataUnsafe.user?.username,
                coins: 20000,
                diamonds: 10000
            };
            gameState.friends.push(newFriend);

            updateUI();
            loadFriendsList();

            showNotification(uiElements.purchaseNotification, 'You received 20,000 coins and 10,000 diamonds for inviting a friend!');
            localStorage.setItem('balance', gameState.balance);
            localStorage.setItem('diamonds', gameState.diamonds);
            localStorage.setItem('friends', JSON.stringify(gameState.friends));
        });
    }

    initializeApp();
});
