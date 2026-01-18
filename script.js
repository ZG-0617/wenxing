// 全局变量
let popupWindows = []; // 存储所有弹窗元素
let isCreating = false;
let createdCount = 0;
let heartCanvas = null;
let heartAnimationId = null;

// 爱心效果参数
const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 480;
const CANVAS_CENTER_X = CANVAS_WIDTH / 2;
const CANVAS_CENTER_Y = CANVAS_HEIGHT / 2;
const IMAGE_ENLARGE = 11;
const HEART_COLOR = "#FF99CC";

// 配置参数
const config = {
    minDelay: 100,    // 最小延迟时间（毫秒）
    maxDelay: 500,    // 最大延迟时间（毫秒）
    useRandomDelay: true, // 是否使用随机延迟
    windowCount: 88  // 要创建的窗口总数
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
    
    // 第88个弹窗后显示爱心效果
    if (createdCount === 88) {
        showParticleHeart();
    }
    
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
    
    // 关闭爱心效果
    if (heartAnimationId) {
        cancelAnimationFrame(heartAnimationId);
        heartAnimationId = null;
    }
    if (heartCanvas && heartCanvas.parentNode) {
        heartCanvas.parentNode.removeChild(heartCanvas);
        heartCanvas = null;
    }
}

// 爱心曲线函数
function heartFunction(t, shrinkRatio = IMAGE_ENLARGE) {
    // 爱心曲线公式
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    // 放大
    const scaledX = x * shrinkRatio;
    const scaledY = y * shrinkRatio;
    // 移到画布中央
    return {
        x: Math.round(scaledX + CANVAS_CENTER_X),
        y: Math.round(scaledY + CANVAS_CENTER_Y)
    };
}

// 内部散射
function scatterInside(x, y, beta = 0.15) {
    const ratioX = -beta * Math.log(Math.random());
    const ratioY = -beta * Math.log(Math.random());
    const dx = ratioX * (x - CANVAS_CENTER_X);
    const dy = ratioY * (y - CANVAS_CENTER_Y);
    return {
        x: x - dx,
        y: y - dy
    };
}

// 收缩函数
function shrink(x, y, ratio) {
    const force = -1 / Math.pow(Math.pow(x - CANVAS_CENTER_X, 2) + Math.pow(y - CANVAS_CENTER_Y, 2), 0.6);
    const dx = ratio * force * (x - CANVAS_CENTER_X);
    const dy = ratio * force * (y - CANVAS_CENTER_Y);
    return {
        x: x - dx,
        y: y - dy
    };
}

// 曲线函数
function curve(p) {
    return 2 * (2 * Math.sin(4 * p)) / (2 * Math.PI);
}

// Heart类
class Heart {
    constructor(generateFrame = 20) {
        this._points = new Set(); // 原始爱心坐标集合
        this._edgeDiffusionPoints = new Set(); // 边缘扩散效果点坐标集合
        this._centerDiffusionPoints = new Set(); // 中心扩散效果点坐标集合
        this.allPoints = {}; // 每帧动态点坐标
        this.generateFrame = generateFrame;
        this.build(2000);
        this.calcAllFrames();
    }

    // 构建爱心点集合
    build(number) {
        // 生成原始爱心点
        for (let i = 0; i < number; i++) {
            const t = Math.random() * 2 * Math.PI;
            const { x, y } = heartFunction(t);
            this._points.add(`${x},${y}`);
        }

        // 爱心内扩散 - 边缘
        for (const point of this._points) {
            const [_x, _y] = point.split(',').map(Number);
            for (let i = 0; i < 3; i++) {
                const { x, y } = scatterInside(_x, _y, 0.05);
                this._edgeDiffusionPoints.add(`${Math.round(x)},${Math.round(y)}`);
            }
        }

        // 爱心内再次扩散 - 中心
        const pointArray = Array.from(this._points);
        for (let i = 0; i < 4000; i++) {
            const randomPoint = pointArray[Math.floor(Math.random() * pointArray.length)];
            const [x, y] = randomPoint.split(',').map(Number);
            const { x: newX, y: newY } = scatterInside(x, y, 0.17);
            this._centerDiffusionPoints.add(`${Math.round(newX)},${Math.round(newY)}`);
        }
    }

    // 计算所有帧
    calcAllFrames() {
        for (let frame = 0; frame < this.generateFrame; frame++) {
            this.calc(frame);
        }
    }

    // 计算单帧
    calc(generateFrame) {
        const ratio = 10 * curve(generateFrame / 10 * Math.PI);
        // halo_radius 光环半径 [4, 16]
        const haloRadius = Math.round(4 + 6 * (1 + curve(generateFrame / 10 * Math.PI)));
        // halo_number 光环数量 [3000, 11000]
        const haloNumber = Math.round(3000 + 4000 * Math.pow(Math.abs(curve(generateFrame / 10 * Math.PI)), 2));
        const allPoints = [];

        // 光环
        const heartHaloPoint = new Set();
        for (let i = 0; i < haloNumber; i++) {
            const t = Math.random() * 2 * Math.PI;
            let { x, y } = heartFunction(t, 11.6);
            const shrunk = shrink(x, y, haloRadius);
            x = Math.round(shrunk.x);
            y = Math.round(shrunk.y);
            const pointKey = `${x},${y}`;
            if (!heartHaloPoint.has(pointKey)) {
                heartHaloPoint.add(pointKey);
                x += Math.floor(Math.random() * 29) - 14; // -14 到 14
                y += Math.floor(Math.random() * 29) - 14;
                const size = [1, 2, 2][Math.floor(Math.random() * 3)];
                allPoints.push({ x, y, size });
            }
        }

        // 轮廓
        for (const point of this._points) {
            const [x, y] = point.split(',').map(Number);
            const { x: newX, y: newY } = this.calcPosition(x, y, ratio);
            const size = Math.floor(Math.random() * 3) + 1; // 1-3
            allPoints.push({ x: Math.round(newX), y: Math.round(newY), size });
        }

        // 内容 - 边缘扩散
        for (const point of this._edgeDiffusionPoints) {
            const [x, y] = point.split(',').map(Number);
            const { x: newX, y: newY } = this.calcPosition(x, y, ratio);
            const size = Math.floor(Math.random() * 2) + 1; // 1-2
            allPoints.push({ x: Math.round(newX), y: Math.round(newY), size });
        }

        // 中心扩散
        for (const point of this._centerDiffusionPoints) {
            const [x, y] = point.split(',').map(Number);
            const { x: newX, y: newY } = this.calcPosition(x, y, ratio);
            const size = Math.floor(Math.random() * 2) + 1; // 1-2
            allPoints.push({ x: Math.round(newX), y: Math.round(newY), size });
        }

        this.allPoints[generateFrame] = allPoints;
    }

    // 计算位置
    calcPosition(x, y, ratio) {
        const force = 1 / Math.pow(Math.pow(x - CANVAS_CENTER_X, 2) + Math.pow(y - CANVAS_CENTER_Y, 2), 0.520);
        const dx = ratio * force * (x - CANVAS_CENTER_X) + (Math.random() > 0.5 ? 1 : -1);
        const dy = ratio * force * (y - CANVAS_CENTER_Y) + (Math.random() > 0.5 ? 1 : -1);
        return {
            x: x - dx,
            y: y - dy
        };
    }

    // 渲染
    render(ctx, frame) {
        const points = this.allPoints[frame % this.generateFrame];
        ctx.fillStyle = HEART_COLOR;
        points.forEach(point => {
            ctx.fillRect(point.x, point.y, point.size, point.size);
        });
    }
}

// 爱心绘制函数
function drawHeart(heart, canvas, ctx, frame = 0) {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    heart.render(ctx, frame);
    heartAnimationId = requestAnimationFrame(() => drawHeart(heart, canvas, ctx, frame + 1));
}

// 显示爱心效果函数
function showParticleHeart() {
    console.log('显示爱心效果');
    
    // 关闭之前的爱心效果
    if (heartAnimationId) {
        cancelAnimationFrame(heartAnimationId);
        heartAnimationId = null;
    }
    if (heartCanvas && heartCanvas.parentNode) {
        heartCanvas.parentNode.removeChild(heartCanvas);
        heartCanvas = null;
    }
    
    // 创建画布
    heartCanvas = document.createElement('canvas');
    heartCanvas.width = CANVAS_WIDTH;
    heartCanvas.height = CANVAS_HEIGHT;
    heartCanvas.style.position = 'fixed';
    heartCanvas.style.top = '50%';
    heartCanvas.style.left = '50%';
    heartCanvas.style.transform = 'translate(-50%, -50%)';
    heartCanvas.style.backgroundColor = 'black';
    heartCanvas.style.zIndex = '9999';
    heartCanvas.style.borderRadius = '8px';
    heartCanvas.style.boxShadow = '0 0 20px rgba(255, 153, 204, 0.5)';
    
    // 添加到文档
    document.body.appendChild(heartCanvas);
    
    // 获取上下文
    const ctx = heartCanvas.getContext('2d');
    
    // 创建爱心实例
    const heart = new Heart();
    
    // 开始绘制
    drawHeart(heart, heartCanvas, ctx);
}

// 改进的音乐播放函数，适合GitHub Pages环境
function playMusic() {
    try {
        // 首先尝试从DOM获取现有的音频元素
        let audio = document.getElementById('backgroundMusic');
        
        // 如果DOM中没有音频元素，动态创建一个
        if (!audio) {
            console.log('DOM中没有音频元素，创建新的音频元素...');
            audio = document.createElement('audio');
            audio.id = 'backgroundMusic';
            
            // 使用相对路径但考虑GitHub Pages环境
            audio.src = './1.mp3';
            audio.crossOrigin = 'anonymous'; // 解决潜在的CORS问题
            audio.loop = true;
            audio.style.display = 'none'; // 隐藏音频元素
            document.body.appendChild(audio);
            
            // 添加错误事件监听以获取详细信息
            audio.addEventListener('error', function(e) {
                console.error('音频元素错误:', e);
                console.error('错误代码:', e.target.error.code);
                
                // 错误代码含义
                const errorCodes = {
                    1: '用户中止',
                    2: '网络错误',
                    3: '解码错误',
                    4: 'URL无效'
                };
                console.error('错误描述:', errorCodes[e.target.error.code] || '未知错误');
            });
        }
        
        // 重置播放状态
        audio.pause();
        audio.currentTime = 0;
        audio.volume = 0.5;
        audio.muted = false;
        
        // 保存引用
        backgroundMusic = audio;
        
        // 直接在用户交互事件中播放（不使用延迟）
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('音乐播放成功！');
            }).catch(error => {
                console.error('音乐播放失败:', error);
                console.log('请检查：');
                console.log('1. 音频文件路径是否正确 (当前: ./1.mp3)');
                console.log('2. 浏览器是否允许自动播放');
                console.log('3. GitHub Pages是否正确部署了所有文件');
                console.log('4. 尝试在不同浏览器中打开');
            });
        }
    } catch (e) {
        console.error('播放音乐时出错:', e);
    }
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    // 提示用户点击开始按钮以播放音乐和显示弹窗
    console.log('请点击开始按钮以播放音乐和显示弹窗');
    
    // 修改预加载策略，使用相对路径并添加CORS设置
    const audio = new Audio();
    audio.src = './1.mp3';
    audio.crossOrigin = 'anonymous';
    audio.preload = 'auto';
    
    audio.addEventListener('canplaythrough', () => {
        console.log('音频预加载完成，可以开始播放');
    });
    
    audio.addEventListener('error', (e) => {
        console.error('音频预加载失败:', e.target.error);
        console.log('错误代码:', e.target.error.code);
        console.log('请检查音频文件是否存在且可访问');
        console.log('当前路径:', audio.src);
        
        // 尝试添加额外的检查
        checkAudioFileExistence('./1.mp3').then(exists => {
            console.log('音频文件存在性检查:', exists ? '存在' : '不存在');
        });
    });
    
    // 添加音频文件存在性检查函数
    function checkAudioFileExistence(url) {
        return fetch(url, {
            method: 'HEAD',
            mode: 'cors',
            credentials: 'omit'
        })
        .then(response => response.ok)
        .catch(() => false);
    }
});