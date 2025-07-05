(function() {
    'use strict';

    // Данные устройств
    const DEVICES_DATA = {
        all: [
            {icon: 'light2', iconLabel: 'Освещение', title: 'Xiaomi Yeelight LED Smart Bulb', subtitle: 'Включено'},
            {icon: 'light', iconLabel: 'Освещение', title: 'D-Link Omna 180 Cam', subtitle: 'Включится в 17:00'},
            {icon: 'temp', iconLabel: 'Температура', title: 'Elgato Eve Degree Connected', subtitle: 'Выключено до 17:00'},
            {icon: 'light', iconLabel: 'Освещение', title: 'LIFX Mini Day & Dusk A60 E27', subtitle: 'Включится в 17:00'},
            {icon: 'light2', iconLabel: 'Освещение', title: 'Xiaomi Mi Air Purifier 2S', subtitle: 'Включено'},
            {icon: 'light', iconLabel: 'Освещение', title: 'Philips Zhirui', subtitle: 'Включено'},
            {icon: 'light', iconLabel: 'Освещение', title: 'Philips Zhirui', subtitle: 'Включено'},
            {icon: 'light2', iconLabel: 'Освещение', title: 'Xiaomi Mi Air Purifier 2S', subtitle: 'Включено'}
        ],
        kitchen: [
            {icon: 'light2', iconLabel: 'Освещение', title: 'Xiaomi Yeelight LED Smart Bulb', subtitle: 'Включено'},
            {icon: 'temp', iconLabel: 'Температура', title: 'Elgato Eve Degree Connected', subtitle: 'Выключено до 17:00'}
        ],
        hall: [
            {icon: 'light', iconLabel: 'Освещение', title: 'Philips Zhirui', subtitle: 'Выключено'},
            {icon: 'light2', iconLabel: 'Освещение', title: 'Xiaomi Mi Air Purifier 2S', subtitle: 'Выключено'}
        ],
        lights: [
            {icon: 'light', iconLabel: 'Освещение', title: 'D-Link Omna 180 Cam', subtitle: 'Включится в 17:00'},
            {icon: 'light', iconLabel: 'Освещение', title: 'LIFX Mini Day & Dusk A60 E27', subtitle: 'Включится в 17:00'},
            {icon: 'light2', iconLabel: 'Освещение', title: 'Xiaomi Mi Air Purifier 2S', subtitle: 'Включено'},
            {icon: 'light', iconLabel: 'Освещение', title: 'Philips Zhirui', subtitle: 'Включено'}
        ],
        cameras: [
            {icon: 'light2', iconLabel: 'Освещение', title: 'Xiaomi Mi Air Purifier 2S', subtitle: 'Включено'}
        ]
    };

    // Увеличиваем количество элементов для тестирования производительности
    for (let i = 0; i < 6; ++i) {
        DEVICES_DATA.all = [...DEVICES_DATA.all, ...DEVICES_DATA.all];
    }

    // Создание элемента устройства
    function createDeviceElement(device) {
        const li = document.createElement('li');
        li.className = 'event';

        const button = document.createElement('button');
        button.className = 'event__button';

        const icon = document.createElement('span');
        icon.className = `event__icon event__icon_${device.icon}`;
        icon.setAttribute('role', 'img');
        icon.setAttribute('aria-label', device.iconLabel);

        const title = document.createElement('h4');
        title.className = 'event__title';
        title.textContent = device.title;

        button.appendChild(icon);
        button.appendChild(title);

        if (device.subtitle) {
            const subtitle = document.createElement('span');
            subtitle.className = 'event__subtitle';
            subtitle.textContent = device.subtitle;
            button.appendChild(subtitle);
        }

        li.appendChild(button);
        return li;
    }

    // Заполнение панелей устройствами
    function populateDevices() {
        Object.keys(DEVICES_DATA).forEach(category => {
            const container = document.getElementById(`${category}Devices`);
            if (container) {
                container.innerHTML = '';
                DEVICES_DATA[category].forEach(device => {
                    container.appendChild(createDeviceElement(device));
                });
            }
        });
    }

    // Переключение вкладок
    function switchTab(tabName) {
        // Обновляем атрибуты вкладок
        document.querySelectorAll('.section__tab').forEach(tab => {
            const isActive = tab.dataset.tab === tabName;
            tab.setAttribute('aria-selected', isActive);
            tab.classList.toggle('section__tab_active', isActive);
            tab.tabIndex = isActive ? '0' : -1;
        });

        // Обновляем панели
        document.querySelectorAll('.section__panel').forEach(panel => {
            const isActive = panel.id === `panel_${tabName}`;
            panel.classList.toggle('section__panel_hidden', !isActive);
            panel.setAttribute('aria-hidden', !isActive);
        });

        // Обновляем селект
        const select = document.getElementById('deviceSelect');
        if (select) {
            select.value = tabName;
        }
    }

    // Обработчик клика по вкладкам
    function handleTabClick(event) {
        const tab = event.target.closest('.section__tab');
        if (tab) {
            switchTab(tab.dataset.tab);
        }
    }

    // Обработчик изменения селекта
    function handleSelectChange(event) {
        switchTab(event.target.value);
    }

    // Обработчик мобильного меню
    function handleMobileMenu() {
        const menuButton = document.querySelector('.header__menu');
        const menuLinks = document.querySelector('.header__links');

        if (menuButton && menuLinks) {
            menuButton.addEventListener('click', function() {
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                this.setAttribute('aria-expanded', !isExpanded);

                const menuText = this.querySelector('.header__menu-text');
                if (menuText) {
                    menuText.textContent = isExpanded ? 'Открыть меню' : 'Закрыть меню';
                }

                menuLinks.classList.toggle('header__links_opened');
                if (!menuLinks.classList.contains('header__links-toggled')) {
                    menuLinks.classList.add('header__links-toggled');
                }
            });
        }
    }

    // Инициализация
    function init() {
        // Заполняем устройства
        populateDevices();

        // Устанавливаем активную вкладку из URL или по умолчанию
        const urlParams = new URLSearchParams(location.search);
        const activeTab = urlParams.get('tab') || 'all';
        switchTab(activeTab);

        // Добавляем обработчики событий
        document.querySelector('.section__tabs').addEventListener('click', handleTabClick);
        document.getElementById('deviceSelect').addEventListener('change', handleSelectChange);
        handleMobileMenu();

        // Добавляем обработчик клавиатуры для вкладок
        document.querySelector('.section__tabs').addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                const tab = event.target.closest('.section__tab');
                if (tab) {
                    switchTab(tab.dataset.tab);
                }
            }
        });
    }

    // Запускаем после загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();