// test-supabase.js
// 直接在Node.js或浏览器控制台运行

// 你的配置信息 - 请修改这里！
const SUPABASE_CONFIG = {
    url: 'https://your-project.supabase.co',  // 你的Supabase URL
    anonKey: 'eyJhbGciOiJIUzI1NiIs...',      // 你的anon key
    functionName: 'lookup_members'
};

// 基于你的Google Apps Script代码改造的JavaScript版本
async function supabaseRpcCall(input) {
    const functionName = SUPABASE_CONFIG.functionName;
    const url = `${SUPABASE_CONFIG.url}/rest/v1/rpc/${functionName}`;
    const payload = { info: input }; // matches function param name

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_CONFIG.anonKey,
            'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`
        },
        body: JSON.stringify(payload)
    };

    console.log('🔧 请求配置:');
    console.log('URL:', url);
    console.log('Payload:', payload);
    console.log('Headers:', {
        'Content-Type': options.headers['Content-Type'],
        'apikey': '***' + SUPABASE_CONFIG.anonKey.slice(-10),
        'Authorization': 'Bearer ***' + SUPABASE_CONFIG.anonKey.slice(-10)
    });

    try {
        console.log('🚀 发送请求...');
        const response = await fetch(url, options);
        const status = response.status;
        const body = await response.text();
        
        console.log('📥 响应状态:', status);
        console.log('📥 响应内容:', body);

        if (status >= 200 && status < 300) {
            // 成功的响应
            const data = JSON.parse(body);
            console.log('✅ 调用成功!');
            console.log('📊 返回数据:', data);
            return data;
        } else {
            // 错误处理
            console.error('❌ Supabase RPC错误:', status);
            console.error('错误详情:', body);
            throw new Error(`Supabase RPC错误 ${status}: ${body}`);
        }
    } catch (error) {
        console.error('❌ 请求失败:', error.message);
        if (error.cause) {
            console.error('原因:', error.cause);
        }
        throw error;
    }
}

// 测试函数
async function runTest() {
    console.log('=== 开始Supabase RPC测试 ===');
    
    // 测试不同的输入
    const testInputs = ['test', 'search', 'query', ''];
    
    for (const input of testInputs) {
        console.log(`\n🔍 测试输入: "${input}"`);
        try {
            const result = await supabaseRpcCall(input);
            console.log(`✅ 输入"${input}"测试成功`);
            console.log('结果类型:', Array.isArray(result) ? '数组' : typeof result);
            console.log('结果长度:', Array.isArray(result) ? result.length : 'N/A');
            
            // 如果是数组且有数据，显示第一条
            if (Array.isArray(result) && result.length > 0) {
                console.log('第一条数据:', JSON.stringify(result[0], null, 2));
            }
        } catch (error) {
            console.error(`❌ 输入"${input}"测试失败:`, error.message);
        }
    }
    
    console.log('\n=== 测试完成 ===');
}

// 运行测试（如果在浏览器中）
if (typeof window !== 'undefined') {
    console.log('🌐 在浏览器环境中运行');
    // 在浏览器控制台调用：runTest()
} else {
    console.log('💻 在Node.js环境中运行');
    // 需要安装node-fetch
}

// 导出函数供使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { supabaseRpcCall, runTest };
}
