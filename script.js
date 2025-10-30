// 全局变量
let popupWindows = []; // 存储所有弹窗元素
let isCreating = false;
let createdCount = 0;

// 配置参数
const config = {
    minDelay: 100,    // 最小延迟时间（毫秒）
    maxDelay: 500,    // 最大延迟时间（毫秒）
    useRandomDelay: true, // 是否使用随机延迟
    windowCount: 200  // 要创建的窗口总数
};

// 多条消息（从原Python代码复制）
const tips = [
    '多喝点水', '保持微笑', '每天都要元气满满', '记得吃水果', '保持好心情', '好好爱自己', 
    '梦想成真', '期待下一次遇见', '金榜题名', '顺利利', '早点休息', '愿所有烦恼都消失哦',
    '别熬夜', '今天过得开心嘛', '天冷了，多穿衣服', '每天都有温暖', '烦恼烟消云散', '期待下次见面',
    '所求皆如愿', '收获满满幸福', '下次一起去吃', '被世界温柔待', '活力满满好运', '发现生活美好',
    '美好如期而至', '不开心找我聊', '你已经很棒啦', '今天也在发光', '难题慢慢来', '今天辛苦啦',
    '享受当下快乐', 'emo 会过去的', '多笑笑呀', '保持积极心态', '你比想象优秀'
];

// 背景颜色（从原Python代码复制）
const bgColors = [
    'lightpink', 'skyblue', 'lightgreen', 'yellow', 'plum', 'coral',
    'lavender', 'olive', 'bisque', 'aquamarine', 'orchid'
];

// DOM元素引用
const startBtn = document.getElementById('startBtn');
let backgroundMusic;

// 初始化事件监听
function initEventListeners() {
    // 开始按钮事件
    startBtn.addEventListener('click', () => {
        // 尝试播放音乐
        playMusic();
        // 开始创建弹窗
        startCreatingPopups();
    });
    
    // 空格键关闭所有弹窗
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            event.preventDefault();
            closeAllPopups();
            // 重置开始按钮状态
            if (isCreating) {
                isCreating = false;
                startBtn.disabled = false;
            }
        }
    });
}

// 开始创建弹窗
function startCreatingPopups() {
    if (isCreating) return;
    
    isCreating = true;
    startBtn.disabled = true;
    createdCount = 0;
    
    console.log(`开始创建 ${config.windowCount} 个弹窗...`);
    createNextPopup();
}

// 创建下一个弹窗
function createNextPopup() {
    if (!isCreating || createdCount >= config.windowCount) {
        if (isCreating) {
            console.log('所有弹窗创建完成！');
            // 创建完成后启用开始按钮
            startBtn.disabled = false;
        }
        isCreating = false;
        return;
    }
    
    // 创建弹窗
    createPopup();
    createdCount++;
    console.log(`弹窗 ${createdCount}/${config.windowCount} 已创建`);
    
    // 计算延迟时间
    let delay;
    if (config.useRandomDelay) {
        delay = Math.floor(Math.random() * (config.maxDelay - config.minDelay + 1)) + config.minDelay;
    } else {
        delay = config.minDelay;
    }
    
    // 安排下一个弹窗的创建
    setTimeout(createNextPopup, delay);
}

// 创建单个弹窗
function createPopup() {
    // 创建弹窗元素
    const popup = document.createElement('div');
    popup.classList.add('popup');
    
    // 随机位置
    const popupWidth = 250;
    const popupHeight = 80;
    const x = Math.floor(Math.random() * (window.innerWidth - popupWidth));
    const y = Math.floor(Math.random() * (window.innerHeight - popupHeight));
    
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;
    
    // 随机消息和背景色
    const tipText = tips[Math.floor(Math.random() * tips.length)];
    const bgColor = bgColors[Math.floor(Math.random() * bgColors.length)];
    
    popup.textContent = tipText;
    popup.style.backgroundColor = bgColor;
    
    // 点击弹窗移除
    popup.addEventListener('click', () => {
        removePopup(popup);
    });
    
    // 添加到文档和列表
    document.body.appendChild(popup);
    popupWindows.push(popup);
}

// 移除单个弹窗
function removePopup(popup) {
    // 添加淡出动画
    popup.style.transition = 'opacity 0.3s, transform 0.3s';
    popup.style.opacity = '0';
    popup.style.transform = 'scale(0.8)';
    
    // 动画结束后移除元素
    setTimeout(() => {
        if (popup.parentNode) {
            popup.parentNode.removeChild(popup);
        }
        // 从数组中移除
        const index = popupWindows.indexOf(popup);
        if (index > -1) {
            popupWindows.splice(index, 1);
        }
    }, 300);
}

// 关闭所有弹窗
function closeAllPopups() {
    popupWindows.forEach(popup => {
        removePopup(popup);
    });
    popupWindows = [];
    console.log('所有弹窗已关闭');
}

// 简单直接的音乐播放函数
function playMusic() {
    try {
        // 首先尝试从DOM获取现有的音频元素
        let audio = document.getElementById('backgroundMusic');
        
        // 如果DOM中没有音频元素，动态创建一个
        if (!audio) {
            console.log('DOM中没有音频元素，创建新的音频元素...');
            audio = document.createElement('audio');
            audio.id = 'backgroundMusic';
            audio.src = '1.mp3';
            audio.loop = true;
            audio.style.display = 'none'; // 隐藏音频元素
            document.body.appendChild(audio);
        }
        
        // 重置播放状态
        audio.pause();
        audio.currentTime = 0;
        audio.volume = 0.5;
        audio.muted = false;
        
        // 保存引用
        backgroundMusic = audio;
        
        // 尝试播放
        audio.play()
            .then(() => {
                console.log('音乐播放成功！');
            })
            .catch(error => {
                console.error('音乐播放失败:', error);
                console.log('尝试直接通过用户交互播放...');
                
                // 直接在用户交互事件中再次尝试
                setTimeout(() => {
                    try {
                        audio.play().then(() => {
                            console.log('延迟播放尝试成功！');
                        }).catch(err => {
                            console.error('延迟播放也失败:', err);
                            console.log('请检查文件路径是否正确，以及浏览器权限设置。');
                        });
                    } catch (innerErr) {
                        console.error('延迟播放出错:', innerErr);
                    }
                }, 10);
            });
    } catch (e) {
        console.error('播放音乐时出错:', e);
    }
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    // 提示用户点击开始按钮以播放音乐和显示弹窗
    console.log('请点击开始按钮以播放音乐和显示弹窗');
    // 预加载音频文件以提高播放响应速度
    const audio = new Audio();
    audio.src = '1.mp3';
    audio.preload = 'auto';
    audio.addEventListener('canplaythrough', () => {
        console.log('音频预加载完成，可以开始播放');
    });
    audio.addEventListener('error', (e) => {
        console.error('音频预加载失败:', e.target.error);
        console.log('请检查音频文件是否存在且可访问');
    });
});