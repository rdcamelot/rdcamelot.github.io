// 鼠标点击文字特效
(function() {
    // 定义点击后可能显示的文字
    const texts = [
        "苍之彼方的四重奏", 
        "苍之彼方的四重奏 EXTRA2", 
        "缘之空", 
        "悠之空",
        "Fate/stay night",
        "女神异闻录5", 
        "CLANNAD",
        "千恋万花",
        "魔女的夜宴",
        "Summer Pockets",
        "AIR",
        "魔法使之夜",
        "妹相随~妹がいる~",
        "星光咖啡馆与死神之蝶",
        "ATRI",
        "ISLAND",
        "初雪樱",
        "沙耶之歌",
        "月姬"
    ];
    
    // 定义更柔和的颜色
    const colors = [
        "rgba(74, 108, 247, 0.8)",  // 淡蓝色
        "rgba(244, 67, 54, 0.7)",   // 淡红色
        "rgba(233, 30, 99, 0.7)",   // 淡粉色
        "rgba(156, 39, 176, 0.7)",  // 淡紫色
        "rgba(63, 81, 181, 0.7)",   // 淡靛蓝
        "rgba(33, 150, 243, 0.7)",  // 淡蓝色
        "rgba(3, 169, 244, 0.7)",   // 淡天蓝色
        "rgba(0, 188, 212, 0.7)",   // 淡青色
        "rgba(0, 150, 136, 0.7)",   // 淡绿松色
        "rgba(76, 175, 80, 0.7)",   // 淡绿色
        "rgba(139, 195, 74, 0.7)",  // 淡浅绿色
        "rgba(255, 193, 7, 0.7)"    // 淡琥珀色
    ];
    
    // 定义花哨的字体系列
    const fonts = [
        "'Comic Sans MS', cursive, sans-serif",
        "'Brush Script MT', cursive",
        "'Dancing Script', cursive",
        "'Pacifico', cursive",
        "'Indie Flower', cursive",
        "'Great Vibes', cursive",
        "'Satisfy', cursive",
        "'Kaushan Script', cursive",
        "'Sacramento', cursive",
        "'Tangerine', cursive",
        "'Caveat', cursive"
    ];
    
    // 监听鼠标点击事件
    document.addEventListener('click', function(e) {
        // 创建一个文字元素
        const span = document.createElement('span');
        
        // 随机选择文本、颜色和字体
        const randomText = texts[Math.floor(Math.random() * texts.length)];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
        
        // 计算一个随机偏移量，使文字不总是出现在相同位置
        const offsetX = Math.random() * 40 - 20; // -20到20之间的随机数
        
        // 设置文字样式
        span.textContent = randomText;
        span.style.position = 'fixed';
        span.style.left = (e.clientX - 40 + offsetX) + 'px'; // 点击位置的左侧，添加随机偏移
        span.style.top = e.clientY + 'px';
        span.style.color = randomColor;
        span.style.fontFamily = randomFont;
        span.style.fontWeight = '400'; // 字重稍微减轻
        span.style.fontSize = '0.85rem'; // 减小字体大小
        span.style.letterSpacing = '0.5px'; // 字母间距增加
        span.style.textShadow = '1px 1px 2px rgba(0,0,0,0.2)'; // 添加轻微阴影
        span.style.pointerEvents = 'none'; // 防止文字本身触发点击事件
        span.style.userSelect = 'none'; // 防止文字被选中
        span.style.opacity = '0.9'; // 初始透明度稍微降低
        span.style.transition = 'all 1.8s ease'; // 延长动画时间
        span.style.zIndex = '9999';
        span.style.transform = 'scale(0.9)'; // 初始尺寸稍小
        
        // 将元素添加到页面
        document.body.appendChild(span);
        
        // 添加动画效果
        setTimeout(() => {
            span.style.top = (e.clientY - 120) + 'px'; // 向上移动更远
            span.style.opacity = '0';
            span.style.transform = 'scale(1.2) rotate(' + (Math.random() * 20 - 10) + 'deg)'; // 放大并添加随机旋转
        }, 10);
        
        // 动画结束后移除元素
        setTimeout(() => {
            if (document.body.contains(span)) { // 检查元素是否仍在文档中
                document.body.removeChild(span);
            }
        }, 1800); // 延长时间以匹配transition
    });
    
    // 添加Google Fonts以支持更多花哨字体（可选）
    function loadGoogleFonts() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Dancing+Script&family=Great+Vibes&family=Indie+Flower&family=Kaushan+Script&family=Pacifico&family=Sacramento&family=Satisfy&family=Tangerine&family=Caveat&display=swap';
        document.head.appendChild(link);
    }
    
    // 加载Google字体
    loadGoogleFonts();
})();