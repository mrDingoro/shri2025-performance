import { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Header } from './Header.jsx';
import { Event } from './Event.jsx';
import { TABS, TABS_KEYS } from './data.js';

export function Main() {
    const ref = useRef();
    const initedRef = useRef(false);
    const [activeTab, setActiveTab] = useState('');
    const [hasRightScroll, setHasRightScroll] = useState(false);

    useEffect(() => {
        if (!activeTab && !initedRef.current) {
            initedRef.current = true;
            setActiveTab(new URLSearchParams(location.search).get('tab') || 'all');
        }
    });

    const onSelectInput = event => {
        setActiveTab(event.target.value);
    };

    const [sizes, setSizes] = useState([]);
    const [visibleItems, setVisibleItems] = useState(50); // Показываем только первые 50 элементов
    const onSize = size => {
        setSizes(prev => [...prev, size]);
    };

    useEffect(() => {
        // Сбрасываем размеры при смене вкладки
        setSizes([]);
        setHasRightScroll(false);
        setVisibleItems(50); // Сбрасываем количество видимых элементов
    }, [activeTab]);

    useEffect(() => {
        if (sizes.length > 0 && ref.current) {
            const sumWidth = sizes.reduce((acc, item) => acc + item.width, 0);
            const newHasRightScroll = sumWidth > ref.current.offsetWidth;
            if (newHasRightScroll !== hasRightScroll) {
                setHasRightScroll(newHasRightScroll);
            }
        }
    }, [sizes, hasRightScroll]);

    const loadMoreItems = () => {
        setVisibleItems(prev => Math.min(prev + 50, TABS[activeTab]?.items.length || 0));
    };

    // Автоматическая подгрузка при прокрутке
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && visibleItems < (TABS[activeTab]?.items.length || 0)) {
                        loadMoreItems();
                    }
                });
            },
            { threshold: 0.1 }
        );

        const loadMoreBtn = document.querySelector('.load-more-btn');
        if (loadMoreBtn) {
            observer.observe(loadMoreBtn);
        }

        return () => {
            if (loadMoreBtn) {
                observer.unobserve(loadMoreBtn);
            }
        };
    }, [visibleItems, activeTab]);

    const onArrowCLick = () => {
        const scroller = ref.current.querySelector('.section__panel:not(.section__panel_hidden)');
        if (scroller) {
            scroller.scrollTo({
                left: scroller.scrollLeft + 400,
                behavior: 'smooth'
            });
        }
    };

    return (
        <>
            <Header />
            <main className="main">
                <section className="section main__general">
                    <h2 className="section__title section__title-header section__main-title">Главное</h2>
                    <div className="hero-dashboard">
                        <div className="hero-dashboard__primary">
                            <h3 className="hero-dashboard__title">Привет, Геннадий!</h3>
                            <p className="hero-dashboard__subtitle">Двери и окна закрыты, сигнализация включена.</p>
                            <ul className="hero-dashboard__info">
                                <li className="hero-dashboard__item">
                                    <div className="hero-dashboard__item-title">Дома</div>
                                    <div className="hero-dashboard__item-details">
                                        +23
                                        <span className="a11y-hidden">°</span>
                                    </div>
                                </li>
                                <li className="hero-dashboard__item">
                                    <div className="hero-dashboard__item-title">За окном</div>
                                    <div className="hero-dashboard__item-details">
                                        +19
                                        <span className="a11y-hidden">°</span>
                                        <div
                                            className="hero-dashboard__icon hero-dashboard__icon_rain"
                                            role="img"
                                            aria-label="Дождь"
                                        ></div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <ul className="hero-dashboard__schedule">
                            <Event
                                icon="temp"
                                iconLabel="Температура"
                                title="Philips Cooler"
                                subtitle="Начнет охлаждать в 16:30"
                            />
                            <Event
                                icon="light"
                                iconLabel="Освещение"
                                title="Xiaomi Yeelight LED Smart Bulb"
                                subtitle="Включится в 17:00"
                            />
                            <Event
                                icon="light"
                                iconLabel="Освещение"
                                title="Xiaomi Yeelight LED Smart Bulb"
                                subtitle="Включится в 17:00"
                            />
                        </ul>
                    </div>
                </section>

                <section className="section main__scripts">
                    <h2 className="section__title section__title-header">Избранные сценарии</h2>
                    <ul className="event-grid">
                        <Event
                            slim={true}
                            icon="light2"
                            iconLabel="Освещение"
                            title="Выключить весь свет в доме и во дворе"
                        />
                        <Event
                            slim={true}
                            icon="schedule"
                            iconLabel="Расписание"
                            title="Я ухожу"
                        />
                        <Event
                            slim={true}
                            icon="light2"
                            iconLabel="Освещение"
                            title="Включить свет в коридоре"
                        />
                        <Event
                            slim={true}
                            icon="temp2"
                            iconLabel="Температура"
                            title="Набрать горячую ванну"
                            subtitle="Начнётся в 18:00"
                        />
                        <Event
                            slim={true}
                            icon="temp2"
                            iconLabel="Температура"
                            title="Сделать пол тёплым во всей квартире"
                        />
                    </ul>
                </section>

                <section className="section main__devices">
                    <div className="section__title">
                        <h2 className="section__title-header">
                            Избранные устройства
                        </h2>

                        <select className="section__select" defaultValue="all" onInput={onSelectInput}>
                            {TABS_KEYS.map(key =>
                                <option key={key} value={key}>
                                    {TABS[key].title}
                                </option>
                            )}
                        </select>

                        <ul role="tablist" className="section__tabs">
                            {TABS_KEYS.map(key =>
                                <li
                                    key={key}
                                    role="tab"
                                    aria-selected={key === activeTab ? 'true' : 'false'}
                                    tabIndex={key === activeTab ? '0' : undefined}
                                    className={'section__tab' + (key === activeTab ? ' section__tab_active' : '')}
                                    id={`tab_${key}`}
                                    aria-controls={`panel_${key}`}
                                    onClick={() => setActiveTab(key)}
                                >
                                    {TABS[key].title}
                                </li>
                            )}
                        </ul>
                    </div>

                    <div className="section__panel-wrapper" ref={ref}>
                        <div role="tabpanel" className="section__panel" aria-hidden="false" id={`panel_${activeTab}`} aria-labelledby={`tab_${activeTab}`}>
                            <ul className="section__panel-list">
                                {TABS[activeTab]?.items.slice(0, visibleItems).map((item, index) =>
                                    <Event
                                        key={index}
                                        {...item}
                                        onSize={onSize}
                                    />
                                )}
                            </ul>
                            {visibleItems < (TABS[activeTab]?.items.length || 0) && (
                                <button
                                    className="load-more-btn"
                                    onClick={loadMoreItems}
                                    style={{
                                        display: 'block',
                                        margin: '20px auto',
                                        padding: '10px 20px',
                                        background: '#007bff',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Показать еще 50 элементов
                                </button>
                            )}
                        </div>
                        {hasRightScroll &&
                            <div className="section__arrow" onClick={onArrowCLick}></div>
                        }
                    </div>
                </section>
            </main>
        </>
    );
}

// Рендеринг React приложения
const container = document.getElementById('app');
const root = createRoot(container);
root.render(<Main />);