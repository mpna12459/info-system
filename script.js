// Supabase客户端实例
let supabase = null;

// 初始化Supabase客户端
async function initSupabase() {
    const supabaseUrl = document.getElementById('supabaseUrl').value.trim();
    const anonKey = document.getElementById('anonKey').value.trim();
    const statusDiv = document.getElementById('initStatus');
    
    // 验证输入
    if (!supabaseUrl || !anonKey) {
        showStatus(statusDiv, '请输入Supabase URL和匿名密钥', 'error');
        return;
    }
    
    try {
        // 创建Supabase客户端
        supabase = window.supabase.createClient(supabaseUrl, anonKey);
        
        // 测试连接
        showStatus(statusDiv, '正在测试连接...', 'info');
        
        const { error } = await supabase.from('_dummy').select('*').limit(1);
        
        if (error && error.code !== '42P01') { // 42P01是表不存在的错误，忽略它
            throw error;
        }
        
        showStatus(statusDiv, '✅ Supabase客户端初始化成功！', 'success');
        console.log('Supabase客户端初始化成功');
        
    } catch (error) {
        showStatus(statusDiv, `❌ 初始化失败: ${error.message}`, 'error');
        console.error('初始化失败:', error);
        supabase = null;
    }
}

// 调用RPC函数
async function callRpcFunction() {
    if (!supabase) {
        alert('请先初始化Supabase客户端');
        return;
    }
    
    const functionName = document.getElementById('functionName').value.trim();
    const paramsInput = document.getElementById('functionParams').value.trim();
    const statusText = document.getElementById('statusText');
    const resultOutput = document.getElementById('resultOutput');
    
    if (!functionName) {
        alert('请输入函数名称');
        return;
    }
    
    try {
        // 解析参数（如果有）
        let params = {};
        if (paramsInput) {
            try {
                params = JSON.parse(paramsInput);
            } catch (e) {
                alert('参数格式错误，请使用有效的JSON格式');
                return;
            }
        }
        
        // 更新状态
        statusText.textContent = '调用中...';
        statusText.style.color = '#ff9800';
        resultOutput.textContent = '等待响应...';
        
        console.log(`调用RPC函数: ${functionName}`, params);
        
        // 调用RPC函数
        const { data, error } = await supabase.rpc(functionName, params);
        
        // 处理结果
        if (error) {
            throw error;
        }
        
        // 显示成功结果
        statusText.textContent = '✅ 调用成功';
        statusText.style.color = '#4caf50';
        
        // 格式化并显示结果
        const formattedResult = JSON.stringify(data, null, 2);
        resultOutput.textContent = formattedResult;
        console.log('RPC调用结果:', data);
        
    } catch (error) {
        // 显示错误信息
        statusText.textContent = '❌ 调用失败';
        statusText.style.color = '#f44336';
        
        const errorMessage = error.message || '未知错误';
        resultOutput.textContent = `错误详情:\n${errorMessage}\n\n完整错误对象:\n${JSON.stringify(error, null, 2)}`;
        console.error('RPC调用失败:', error);
    }
}

// 显示状态消息
function showStatus(element, message, type) {
    element.textContent = message;
    element.className = 'status ' + type;
}

// 页面加载时的事件监听
document.addEventListener('DOMContentLoaded', function() {
    // 添加示例数据（可选）
    document.getElementById('functionParams').textContent = '{}';
    
    // 添加键盘快捷键
    document.addEventListener('keydown', function(e) {
        // Ctrl+Enter 调用函数
        if (e.ctrlKey && e.key === 'Enter') {
            callRpcFunction();
        }
    });
    
    console.log('Supabase RPC演示页面已加载');
});
